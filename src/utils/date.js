/**
 * Utilitaires de date en heure locale.
 * On n'utilise jamais toISOString() : cela décalerait les dates d'un jour
 * selon le fuseau horaire de la visiteuse.
 */

/** Date → « AAAA-MM-JJ » */
export function toDateKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date)
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

/** « AAAA-MM-JJ » → objet Date à minuit, heure locale */
export function fromDateKey(key) {
  const [year, month, day] = String(key).split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function startOfDay(date = new Date()) {
  const d = date instanceof Date ? new Date(date) : new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Décale une clé de date de `days` jours (positif ou négatif). */
export function addDays(dateKey, days) {
  const date = fromDateKey(dateKey)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}
