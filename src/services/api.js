/**
 * Point d'entrée unique vers l'API Beauté Halal.
 * Aucun `fetch` ne doit être écrit ailleurs dans le projet.
 *
 * L'URL est fournie par la variable d'environnement VITE_API_URL
 * (voir .env / .env.example), avec un repli sur le serveur local.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/+$/, '')

/** Au-delà de ce délai, la requête est abandonnée et signalée à l'utilisateur. */
const DEFAULT_TIMEOUT = 12000

export { BASE_URL }

/** Erreur normalisée : le reste de l'application ne manipule que ce type. */
export class ApiError extends Error {
  constructor(message, { status = 0, code = 'NETWORK_ERROR', details = null, cause = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
    this.cause = cause
  }

  /** Le serveur n'a pas pu être joint (hors ligne, API arrêtée, CORS). */
  get isNetworkError() {
    return this.status === 0
  }

  /** Créneau déjà pris, fermeture… : l'utilisateur doit refaire un choix. */
  get isConflict() {
    return this.status === 409
  }

  get isValidationError() {
    return this.status === 422
  }
}

/** Messages lisibles par une cliente, jamais de détail technique. */
function friendlyMessage(status, payload) {
  const fromServer = payload?.error?.message
  if (fromServer && status < 500) return fromServer

  if (status === 0) {
    return 'Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.'
  }
  if (status === 404) return 'Cette ressource est introuvable.'
  if (status === 429) return 'Trop de tentatives. Merci de patienter quelques minutes.'
  if (status >= 500) return 'Le service est momentanément indisponible. Réessayez dans un instant.'
  return 'Une erreur est survenue. Merci de réessayer.'
}

async function request(path, { method = 'GET', body = null, timeout = DEFAULT_TIMEOUT } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
  } catch (error) {
    clearTimeout(timer)
    const aborted = error?.name === 'AbortError'
    throw new ApiError(
      aborted
        ? 'Le serveur met trop de temps à répondre. Réessayez dans un instant.'
        : friendlyMessage(0),
      { status: 0, code: aborted ? 'TIMEOUT' : 'NETWORK_ERROR', cause: error },
    )
  } finally {
    clearTimeout(timer)
  }

  if (response.status === 204) return { data: null, meta: null }

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok || payload?.success === false) {
    throw new ApiError(friendlyMessage(response.status, payload), {
      status: response.status,
      code: payload?.error?.code ?? 'HTTP_ERROR',
      details: payload?.error?.details ?? null,
    })
  }

  return { data: payload?.data ?? null, meta: payload?.meta ?? null }
}

/** Construit une chaîne de requête en ignorant les valeurs vides. */
function toQuery(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    search.append(key, String(value))
  })
  const query = search.toString()
  return query ? `?${query}` : ''
}

export const api = {
  get: (path, params) => request(`${path}${toQuery(params)}`),
  post: (path, body, options) => request(path, { method: 'POST', body, ...options }),
}

/* ────────────────────────── Ressources publiques ────────────────────────── */

/** Coordonnées, horaires, réseaux sociaux et devise du salon. */
export async function fetchSalon() {
  const { data } = await api.get('/salon')
  return data
}

export async function fetchServiceCategories() {
  const { data } = await api.get('/service-categories')
  return data ?? []
}

/** `{ category: 'entretien', featured: true }` — les deux sont facultatifs. */
export async function fetchServices({ category, featured } = {}) {
  const { data } = await api.get('/services', {
    category,
    featured: featured === true ? 'true' : undefined,
  })
  return data ?? []
}

export async function fetchService(slug) {
  const { data } = await api.get(`/services/${encodeURIComponent(slug)}`)
  return data
}

/** La première catégorie renvoyée est toujours « Toutes » (slug « all »). */
export async function fetchGalleryCategories() {
  const { data } = await api.get('/gallery/categories')
  return data ?? []
}

/**
 * Repère de la prestation désignée par une réalisation de galerie.
 *
 * Selon la version de l'API, le rattachement arrive sous trois formes :
 * la prestation imbriquée (`service`), son identifiant seul (`serviceId`)
 * ou la colonne brute (`service_id`). On lit les trois, et uniquement des
 * identifiants : jamais le titre de la coiffure ni le nom de la prestation,
 * qui n'ont aucune raison de se ressembler.
 */
function galleryServiceId(item) {
  const raw = item?.service?.id ?? item?.serviceId ?? item?.service_id
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}

/** Une réalisation est déjà exploitable si l'API a imbriqué la prestation. */
const hasResolvedService = (item) => Boolean(item?.service?.slug)

/**
 * Rattache à chaque réalisation la prestation que désigne son `service_id`.
 *
 * Quand l'API imbrique déjà l'objet `service`, il n'y a rien à faire. Quand
 * elle n'expose que l'identifiant, on le résout contre `GET /services` : un
 * seul appel, mis en commun pour toute la liste, et uniquement s'il y a
 * quelque chose à résoudre.
 *
 * Une prestation introuvable — supprimée, ou désactivée puisque `GET /services`
 * ne renvoie que les prestations actives — redevient `null` : le message de
 * repli reprend alors la main. On préfère l'aveu honnête à une prestation
 * devinée.
 */
async function attachServices(items) {
  const pending = items.filter((item) => !hasResolvedService(item) && galleryServiceId(item))
  if (!pending.length) return items

  let services = []
  try {
    services = await fetchServices()
  } catch {
    // Catalogue momentanément indisponible : la galerie reste affichable et le
    // parcours retombe simplement sur le choix manuel de la prestation.
    return items
  }

  const byId = new Map(services.map((service) => [Number(service.id), service]))

  return items.map((item) => {
    if (hasResolvedService(item)) return item
    const id = galleryServiceId(item)
    if (!id) return item
    return { ...item, service: byId.get(id) ?? null }
  })
}

export async function fetchGalleryItems({ category, featured } = {}) {
  const { data } = await api.get('/gallery', {
    category: category && category !== 'all' ? category : undefined,
    featured: featured === true ? 'true' : undefined,
  })
  return attachServices(data ?? [])
}

/**
 * Retrouve une coiffure par son identifiant.
 *
 * L'API publique n'expose pas de route `GET /gallery/:id` : on lit donc la
 * liste — servie en un seul appel et de taille modeste — puis on filtre sur
 * l'identifiant. La correspondance se fait sur l'`id`, jamais sur le titre.
 *
 * Renvoie `null` si la coiffure n'existe plus ou n'est plus publiée, ce qui
 * laisse l'appelant retomber proprement sur le parcours normal.
 */
export async function fetchGalleryItem(id) {
  const wanted = Number(id)
  if (!Number.isInteger(wanted) || wanted <= 0) return null
  const items = await fetchGalleryItems()
  return items.find((item) => Number(item.id) === wanted) ?? null
}

/** Renvoie les avis et la note moyenne calculée par le serveur. */
export async function fetchTestimonials() {
  const { data, meta } = await api.get('/testimonials')
  return { items: data ?? [], averageRating: meta?.averageRating ?? 0 }
}

/**
 * Calendrier : un objet par jour avec `bookable` et `availableSlots`.
 *
 * `serviceId` est facultatif mais compte : le serveur s'en sert pour savoir
 * combien de temps la prestation occupe une coiffeuse. Une date peut être
 * complète pour une création de locks de cinq heures et rester ouverte pour
 * un retwist de deux heures — sans cette information, la réponse serait la
 * même pour tout le catalogue, donc fausse pour une partie.
 */
export async function fetchAvailabilityDays({ from, to, serviceId } = {}) {
  const { data } = await api.get('/availability/days', { from, to, serviceId })
  return data ?? { days: [], windowDays: 60 }
}

/** Créneaux d'une journée : `{ time, available, reason }`. */
export async function fetchAvailabilitySlots(date, serviceId = null) {
  const { data } = await api.get('/availability/slots', { date, serviceId })
  return data ?? { date, slots: [], bookable: false }
}

/**
 * « Êtes-vous déjà venue ? » — reconnaissance par le numéro de téléphone.
 *
 * Renvoie `{ found: true, customer: { firstName, lastName, email, phone } }`
 * quand le numéro est déjà celui d'une cliente, `{ found: false }` sinon.
 * Rien d'autre ne sort de cette route : ni historique, ni montants.
 *
 * Elle ne fait jamais échouer la réservation — un appel qui tombe en panne
 * rend simplement « inconnue », et la cliente remplit le formulaire à la
 * main comme avant.
 */
export async function lookupCustomer(phone) {
  try {
    const { data } = await api.get('/customers/lookup', { phone })
    return data ?? { found: false }
  } catch {
    return { found: false }
  }
}

/**
 * Crée un rendez-vous.
 * ⚠️ On n'envoie jamais la durée ni le prix : le serveur les relit
 * lui-même depuis la prestation, il reste seul maître de ces valeurs.
 */
export async function createAppointment({
  serviceSlug,
  date,
  time,
  firstName,
  lastName,
  phone,
  email,
  birthDate,
  note,
}) {
  const { data } = await api.post(
    '/appointments',
    {
      serviceSlug,
      date,
      time,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      /*
       * Champ facultatif : on envoie `null` plutôt qu'une chaîne vide, que
       * le serveur refuserait comme date invalide. Une cliente qui préfère
       * ne pas la donner réserve exactement comme avant.
       */
      birthDate: birthDate?.trim() ? birthDate.trim() : null,
      note: note?.trim() ? note.trim() : null,
    },
    { timeout: 20000 },
  )
  return data
}

export async function fetchAppointment(reference) {
  const { data } = await api.get(`/appointments/${encodeURIComponent(reference)}`)
  return data
}

export async function sendContactMessage({ name, email, phone, message }) {
  const { data } = await api.post(
    '/contact',
    {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() ? phone.trim() : null,
      message: message.trim(),
    },
    { timeout: 20000 },
  )
  return data
}

export default api
