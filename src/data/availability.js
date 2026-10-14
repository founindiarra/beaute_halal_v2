/**
 * Disponibilités du salon.
 * ⚠️ DONNÉES FICTIVES — ce module simule un planning en attendant la connexion
 * d'une API. Il suffira de remplacer `isDateBookable` et `getSlotsForDate`
 * par des appels au backend, la signature restant identique.
 */

/** Jours de fermeture hebdomadaire (0 = dimanche … 6 = samedi). */
export const CLOSED_WEEKDAYS = [0, 1]

/** Créneaux proposés chaque jour d'ouverture. */
export const TIME_SLOTS = ['09:00', '10:00', '11:30', '14:00', '15:30', '17:00']

/** Fenêtre de réservation, en jours à partir d'aujourd'hui. */
export const BOOKING_WINDOW_DAYS = 60

/** Fermetures exceptionnelles (format 'AAAA-MM-JJ'). À REMPLACER. */
export const CLOSED_DATES = []

/** Convertit une date en clé locale 'AAAA-MM-JJ' (sans décalage UTC). */
export function toDateKey(date) {
  const d = new Date(date)
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Petit hash stable : le planning simulé reste identique d'un rendu à l'autre. */
function hashString(value) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/** Une date est réservable si elle est dans la fenêtre, ouverte et non complète. */
export function isDateBookable(date) {
  const day = startOfDay(date)
  const today = startOfDay(new Date())
  const limit = startOfDay(new Date())
  limit.setDate(limit.getDate() + BOOKING_WINDOW_DAYS)

  if (day < today || day > limit) return false
  if (CLOSED_WEEKDAYS.includes(day.getDay())) return false
  if (CLOSED_DATES.includes(toDateKey(day))) return false

  return getSlotsForDate(day).some((slot) => slot.available)
}

/** Créneaux d'une journée, avec leur disponibilité simulée. */
export function getSlotsForDate(date) {
  const day = startOfDay(date)
  const today = startOfDay(new Date())
  const key = toDateKey(day)

  if (CLOSED_WEEKDAYS.includes(day.getDay()) || CLOSED_DATES.includes(key)) {
    return TIME_SLOTS.map((time) => ({ time, available: false }))
  }

  const isToday = day.getTime() === today.getTime()
  const now = new Date()

  return TIME_SLOTS.map((time, index) => {
    const taken = hashString(`${key}-${time}`) % 5 === 0
    let available = !taken

    // Les créneaux déjà passés dans la journée ne sont plus proposés.
    if (available && isToday) {
      const [hours, minutes] = time.split(':').map(Number)
      const slotDate = new Date(day)
      slotDate.setHours(hours, minutes, 0, 0)
      available = slotDate.getTime() > now.getTime() + 60 * 60 * 1000
    }

    return { time, available, index }
  })
}

/** Numéro de réservation fictif, ex. « BH-8F42C1 ». */
export function generateBookingReference() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `BH-${code}`
}
