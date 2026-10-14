/**
 * Métadonnées de référencement, mises à jour à chaque changement de page.
 *
 * Le site est une application monopage : le HTML servi est toujours le même.
 * Sans ces mises à jour, les sept pages partageraient une seule description et
 * un seul aperçu de partage (WhatsApp, Facebook, X).
 *
 * L'adresse publique vient de VITE_SITE_URL ; à défaut, on retombe sur
 * l'origine réelle du navigateur, ce qui reste correct en préproduction.
 */

const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/+$/, '')

/** Image d'aperçu par défaut lors d'un partage (1200×630 recommandé). */
const DEFAULT_SHARE_IMAGE = '/og-image.jpg'

export function siteOrigin() {
  if (SITE_URL) return SITE_URL
  return typeof window !== 'undefined' ? window.location.origin : ''
}

export function absoluteUrl(path = '/') {
  return `${siteOrigin()}${path.startsWith('/') ? path : `/${path}`}`
}

/** Crée la balise si elle n'existe pas encore, puis écrit sa valeur. */
function setMeta(selector, attributes, content) {
  if (typeof document === 'undefined') return
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    Object.entries(attributes).forEach(([key, value]) => tag.setAttribute(key, value))
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setLink(rel, href) {
  if (typeof document === 'undefined') return
  let tag = document.head.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

/**
 * Applique le titre, la description, l'URL canonique et les balises de partage.
 *
 *   applyPageMeta({ title: 'Beauté Halal — Nos coiffures', description: '…', path: '/galerie' })
 */
export function applyPageMeta({ title, description, path = '/', image, noindex = false }) {
  if (typeof document === 'undefined') return

  const url = absoluteUrl(path)
  const shareImage = absoluteUrl(image || DEFAULT_SHARE_IMAGE)

  document.title = title

  setMeta('meta[name="description"]', { name: 'description' }, description)
  setMeta(
    'meta[name="robots"]',
    { name: 'robots' },
    noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
  )
  setLink('canonical', url)

  // Open Graph — aperçu sur WhatsApp, Facebook, LinkedIn.
  setMeta('meta[property="og:type"]', { property: 'og:type' }, 'website')
  setMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, 'Beauté Halal')
  setMeta('meta[property="og:locale"]', { property: 'og:locale' }, 'fr_FR')
  setMeta('meta[property="og:title"]', { property: 'og:title' }, title)
  setMeta('meta[property="og:description"]', { property: 'og:description' }, description)
  setMeta('meta[property="og:url"]', { property: 'og:url' }, url)
  setMeta('meta[property="og:image"]', { property: 'og:image' }, shareImage)

  // Twitter / X.
  setMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image')
  setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title)
  setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description)
  setMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, shareImage)
}

const JSONLD_ID = 'jsonld-salon'

/**
 * Données structurées schema.org/HairSalon : c'est ce qui permet à Google
 * d'afficher horaires, adresse, téléphone et note dans une fiche enrichie.
 * Alimentées par `GET /salon`, donc jamais en décalage avec la base.
 */
export function applySalonJsonLd(salon) {
  if (typeof document === 'undefined' || !salon?.name) return

  const hasAddress = Boolean(salon.address?.city)

  const data = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: salon.name,
    description: salon.shortDescription || salon.tagline || undefined,
    url: siteOrigin() || undefined,
    image: absoluteUrl(DEFAULT_SHARE_IMAGE),
    telephone: salon.phone?.display || undefined,
    email: salon.email || undefined,
    priceRange: salon.currency ? `${salon.currency}` : undefined,
    address: hasAddress
      ? {
          '@type': 'PostalAddress',
          streetAddress: [salon.address.line1, salon.address.line2].filter(Boolean).join(', '),
          addressLocality: salon.address.city,
          addressCountry: salon.address.country || undefined,
        }
      : undefined,
    sameAs: (salon.socials ?? []).map((social) => social.url).filter(Boolean),
    openingHours: (salon.hours ?? [])
      .filter((slot) => !slot.isClosed && slot.day && slot.value)
      .map((slot) => `${slot.day} ${slot.value}`),
  }

  // JSON.stringify supprime les clés `undefined` : le bloc reste propre.
  let script = document.getElementById(JSONLD_ID)
  if (!script) {
    script = document.createElement('script')
    script.id = JSONLD_ID
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}
