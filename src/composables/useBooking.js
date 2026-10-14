import { computed, reactive } from 'vue'

import { createAppointment } from '@/services/api'
import { toDateKey } from '@/utils/date'

export const BOOKING_STEPS = [
  { id: 1, label: 'Service' },
  { id: 2, label: 'Date' },
  { id: 3, label: 'Heure' },
  { id: 4, label: 'Informations' },
  { id: 5, label: 'Récapitulatif' },
]

const emptyCustomer = () => ({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  /* Facultative : recueillie à la première réservation, pour les vœux. */
  birthDate: '',
  note: '',
})

/**
 * État partagé du parcours de réservation.
 *
 * Il vit au niveau du module pour qu'un clic sur « Réserver » depuis une carte
 * de prestation pré-sélectionne le service avant l'arrivée sur /rendez-vous.
 *
 * ⚠️ Durée et prix affichés viennent de l'API (objet `service`), mais ne sont
 * JAMAIS envoyés lors de la confirmation : le serveur les relit lui-même.
 */
const state = reactive({
  step: 1,
  service: null, // objet complet renvoyé par l'API
  date: null, // objet Date
  time: null, // 'HH:MM'
  customer: emptyCustomer(),
  /** Réalisation de « Nos coiffures » dont est partie la cliente, ou null. */
  inspiration: null,
  confirmation: null, // réponse de POST /appointments
  submitting: false,
  submitError: null,
  /** Incrémenté quand les disponibilités doivent être rechargées (conflit de créneau). */
  availabilityVersion: 0,
})

export function useBooking() {
  const service = computed(() => state.service)
  const dateKey = computed(() => (state.date ? toDateKey(state.date) : null))

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return Boolean(state.service)
      case 2:
        return Boolean(state.date)
      case 3:
        return Boolean(state.time)
      case 4:
        return (
          state.customer.firstName.trim().length > 1 &&
          state.customer.lastName.trim().length > 1 &&
          state.customer.phone.trim().length >= 8 &&
          /^\S+@\S+\.\S+$/.test(state.customer.email.trim())
        )
      case 5:
        return true
      default:
        return false
    }
  }

  const canGoNext = computed(() => isStepValid(state.step))

  const maxReachedStep = computed(() => {
    let step = 1
    while (step < BOOKING_STEPS.length && isStepValid(step)) step += 1
    return step
  })

  const selectService = (nextService) => {
    if (state.service?.slug !== nextService?.slug) {
      state.service = nextService
      state.time = null
    }
    state.submitError = null
  }

  const selectDate = (date) => {
    state.date = date
    state.time = null
    state.submitError = null
  }

  const selectTime = (time) => {
    state.time = time
    state.submitError = null
  }

  const goToStep = (step) => {
    if (step < 1 || step > BOOKING_STEPS.length) return
    if (step > state.step && !isStepValid(state.step)) return
    state.step = step
  }

  const next = () => {
    if (canGoNext.value && state.step < BOOKING_STEPS.length) state.step += 1
  }

  const previous = () => {
    if (state.step > 1) state.step -= 1
  }

  /**
   * Envoie la demande au serveur.
   * Retourne { ok: true } ou { ok: false, conflict: bool } — le message
   * affichable est dans state.submitError.
   */
  const confirmBooking = async () => {
    if (!state.service || !state.date || !state.time) {
      state.submitError = 'Votre sélection est incomplète.'
      return { ok: false, conflict: false }
    }

    state.submitting = true
    state.submitError = null

    try {
      state.confirmation = await createAppointment({
        serviceSlug: state.service.slug,
        date: toDateKey(state.date),
        time: state.time,
        firstName: state.customer.firstName,
        lastName: state.customer.lastName,
        phone: state.customer.phone,
        email: state.customer.email,
        birthDate: state.customer.birthDate,
        note: state.customer.note,
      })
      return { ok: true }
    } catch (error) {
      state.submitError = error?.message || 'La réservation n’a pas pu être enregistrée.'

      // Créneau pris entre-temps : on renvoie la cliente au choix de l'horaire
      // avec des disponibilités fraîches, plutôt qu'une erreur technique.
      if (error?.isConflict) {
        state.time = null
        state.step = 3
        state.availabilityVersion += 1
        return { ok: false, conflict: true }
      }

      return { ok: false, conflict: false }
    } finally {
      state.submitting = false
    }
  }

  const reset = () => {
    state.step = 1
    state.service = null
    state.date = null
    state.time = null
    state.customer = emptyCustomer()
    state.inspiration = null
    state.confirmation = null
    state.submitting = false
    state.submitError = null
  }

  return {
    state,
    steps: BOOKING_STEPS,
    service,
    dateKey,
    canGoNext,
    maxReachedStep,
    isStepValid,
    selectService,
    selectDate,
    selectTime,
    goToStep,
    next,
    previous,
    confirmBooking,
    reset,
  }
}

/**
 * Utilisé par les cartes de prestation : pré-remplit l'étape 1 et amène
 * directement au choix de la date.
 */
export function preselectService(service) {
  state.service = service ?? null
  state.time = null
  state.confirmation = null
  state.submitError = null
  state.inspiration = null
  state.step = service ? 2 : 1
}

/**
 * Utilisé depuis « Nos coiffures » : la cliente part d'une réalisation précise.
 *
 * Deux cas, et dans les deux la coiffure choisie suit la demande jusqu'au salon :
 *
 *  – la réalisation est rattachée à une prestation → celle-ci est présélectionnée
 *    et la cliente arrive directement au choix de la date ;
 *  – elle ne l'est pas → la cliente choisit sa prestation normalement.
 *
 * Dans les deux cas le titre de la coiffure est repris dans le commentaire
 * envoyé au salon : c'est ce qui garantit qu'il sait exactement quelle
 * réalisation a été demandée, même sans rattachement en base.
 */
export function preselectFromGallery(item) {
  if (!item) return

  state.service = item.service ?? null
  state.time = null
  state.date = null
  state.confirmation = null
  state.submitError = null
  // On conserve la réalisation telle que l'API l'a renvoyée : la page
  // Réservation affiche son image, son titre, sa catégorie et la durée de la
  // prestation associée sans avoir à refaire un appel.
  state.inspiration = {
    id: item.id,
    title: item.title,
    description: item.description ?? null,
    imageUrl: item.imageUrl,
    category: item.category ?? null,
    service: item.service ?? null,
  }
  state.step = item.service ? 2 : 1

  const mention = `Coiffure souhaitée : « ${item.title} » (vue dans Nos coiffures).`
  const note = state.customer.note.trim()

  // On n'empile pas les mentions si la cliente revient sur une autre coiffure.
  const withoutPreviousMention = note.replace(/Coiffure souhaitée : «[^»]*».*?(\n|$)/g, '').trim()
  state.customer.note = withoutPreviousMention ? `${mention}\n${withoutPreviousMention}` : mention
}

/** Retire l'inspiration choisie et la mention correspondante du commentaire. */
export function clearInspiration() {
  state.inspiration = null
  state.customer.note = state.customer.note
    .replace(/Coiffure souhaitée : «[^»]*».*?(\n|$)/g, '')
    .trim()
}

export default useBooking
