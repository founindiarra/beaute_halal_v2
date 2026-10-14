/** Devise par défaut, utilisée tant que l'API n'en a pas renvoyé une. */
export const CURRENCY = 'FCFA'

/** 60000 → « 60 000 FCFA ». La devise vient de l'API (champ `currency`). */
export function formatPrice(value, currency = CURRENCY) {
  if (value === null || value === undefined || value === '') return 'Sur devis'
  return `${new Intl.NumberFormat('fr-FR').format(Number(value))} ${currency || CURRENCY}`
}

/** 195 → « 3 h 15 » */
export function formatDuration(minutes) {
  if (!minutes) return '—'
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!hours) return `${rest} min`
  if (!rest) return `${hours} h`
  return `${hours} h ${`${rest}`.padStart(2, '0')}`
}

/**
 * Accepte un objet Date ou une chaîne « AAAA-MM-JJ » venant de l'API.
 * Les chaînes sont interprétées en heure locale : `new Date('2026-09-16')`
 * serait lu en UTC et pourrait afficher la veille selon le fuseau.
 */
function toLocalDate(value) {
  if (value instanceof Date) return value
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  return new Date(value)
}

/** Date → « mardi 15 septembre 2026 » */
export function formatDateLong(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(toLocalDate(date))
}

/** Date → « 15 sept. 2026 » */
export function formatDateShort(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(toLocalDate(date))
}

/** Première lettre en majuscule (utile après Intl qui renvoie « mardi »). */
export function capitalize(value = '') {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
