import { computed, reactive } from 'vue'

import { fetchSalon } from '@/services/api'
import { brand } from '@/data/salon'

/**
 * Informations du salon (coordonnées, horaires, réseaux, WhatsApp).
 * Elles sont utilisées par l'en-tête, le pied de page, la page Contact et
 * les boutons WhatsApp : on les charge donc une seule fois, puis on partage
 * le résultat entre tous les composants.
 *
 * Avant la réponse de l'API, seuls le nom et la spécialité sont connus
 * (constantes de marque) : l'en-tête reste ainsi lisible dès le premier rendu,
 * sans afficher de fausses coordonnées.
 */
const emptySalon = () => ({
  name: brand.name,
  specialty: brand.specialty,
  tagline: '',
  shortDescription: '',
  phone: { display: '', href: '' },
  whatsapp: { number: '', defaultMessage: '', available: false },
  email: '',
  address: { line1: '', line2: '', city: '', country: '', note: '', mapEmbedUrl: '' },
  socials: [],
  hours: [],
  currency: 'FCFA',
  bookingWindowDays: 60,
})

const state = reactive({
  salon: emptySalon(),
  loading: false,
  error: null,
  loaded: false,
})

let inflight = null
let lastFailureAt = 0

/**
 * Délai minimal entre deux tentatives après un échec.
 * `useSalon()` est appelé par l'en-tête, le pied de page, la marque, le hero,
 * Contact et Rendez-vous : sans ce garde-fou, une API injoignable déclencherait
 * une rafale de requêtes à chaque navigation. Le bouton « Réessayer » passe
 * `force: true` et n'est jamais bloqué.
 */
const RETRY_DELAY = 15000

export async function loadSalon({ force = false } = {}) {
  if (state.loaded && !force) return state.salon
  if (inflight) return inflight
  if (!force && lastFailureAt && Date.now() - lastFailureAt < RETRY_DELAY) return state.salon

  state.loading = true
  state.error = null

  inflight = fetchSalon()
    .then((data) => {
      state.salon = { ...emptySalon(), ...data }
      state.loaded = true
      lastFailureAt = 0
      return state.salon
    })
    .catch((error) => {
      state.error = error?.message || 'Impossible de charger les informations du salon.'
      lastFailureAt = Date.now()
      return state.salon
    })
    .finally(() => {
      state.loading = false
      inflight = null
    })

  return inflight
}

export function useSalon({ immediate = true } = {}) {
  if (immediate) loadSalon()

  return {
    salon: computed(() => state.salon),
    hours: computed(() => state.salon.hours ?? []),
    loading: computed(() => state.loading),
    error: computed(() => state.error),
    loaded: computed(() => state.loaded),
    reload: () => loadSalon({ force: true }),
  }
}

export default useSalon
