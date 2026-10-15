<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BookingCalendar from './BookingCalendar.vue'
import BookingSteps from './BookingSteps.vue'
import SelectedServiceCard from './SelectedServiceCard.vue'
import SelectedStyleCard from './SelectedStyleCard.vue'
import StepConfirmation from './StepConfirmation.vue'
import StepDetails from './StepDetails.vue'
import StepService from './StepService.vue'
import StepSummary from './StepSummary.vue'
import TimeSlotPicker from './TimeSlotPicker.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import {
  clearInspiration,
  preselectFromGallery,
  preselectService,
  useBooking,
} from '@/composables/useBooking'
import { fetchGalleryItem, fetchService } from '@/services/api'
import { capitalize, formatDateLong, formatDuration, formatPrice } from '@/utils/format'

const {
  state,
  steps,
  service,
  canGoNext,
  maxReachedStep,
  selectService,
  selectDate,
  selectTime,
  goToStep,
  next,
  previous,
  confirmBooking,
  reset,
} = useBooking()

const route = useRoute()
const router = useRouter()

const errors = reactive({})
const wizardTop = ref(null)
const stepPanel = ref(null)
const loadingStyle = ref(false)
const loadingService = ref(false)

/* ───────────────────────── Deux parcours, une seule page ─────────────────────

   A. Depuis « Nos coiffures » : l'adresse porte « ?coiffure=<id> ».
      La coiffure est retrouvée par son identifiant, la prestation associée est
      présélectionnée et la cliente arrive directement au choix de la date.

   B. Depuis « Nos services » : l'adresse porte « ?prestation=<slug> ».
      La prestation est retrouvée par son repère, rappelée en tête de page et
      la cliente arrive directement au choix de la date.

   C. Depuis le menu ou un bouton générique : aucun paramètre, le parcours
      normal démarre au choix de la prestation.

   Le repère vit dans l'URL : la sélection survit à un rafraîchissement et
   au partage du lien, sans qu'aucune page de détail n'ait besoin d'exister.
------------------------------------------------------------------------------ */

const styleId = computed(() => {
  const raw = route.query.coiffure
  const value = Number(Array.isArray(raw) ? raw[0] : raw)
  return Number.isInteger(value) && value > 0 ? value : null
})

/** Vrai dès que la cliente arrive avec une coiffure déjà choisie. */
const fromGallery = computed(() => Boolean(state.inspiration))

const resolveStyle = async (id) => {
  // Déjà en mémoire (clic depuis la galerie) : rien à recharger.
  if (!id || state.inspiration?.id === id) return

  loadingStyle.value = true
  try {
    const item = await fetchGalleryItem(id)
    if (item) preselectFromGallery(item)
    // Coiffure introuvable ou dépubliée : on retombe sur le parcours normal
    // plutôt que d'afficher une sélection fantôme.
    else router.replace({ name: 'booking' })
  } catch {
    router.replace({ name: 'booking' })
  } finally {
    loadingStyle.value = false
  }
}

/** Repère de la prestation choisie depuis « Nos services », ou null. */
const serviceSlug = computed(() => {
  const raw = route.query.prestation
  const value = Array.isArray(raw) ? raw[0] : raw
  return typeof value === 'string' && value.trim() ? value.trim() : null
})

/** Vrai quand la cliente arrive avec une prestation déjà choisie (parcours B). */
const fromServices = computed(
  () => Boolean(serviceSlug.value) && Boolean(state.service) && !fromGallery.value,
)

const resolveService = async (slug) => {
  // Déjà en mémoire (clic depuis une carte de prestation) : rien à recharger.
  if (!slug || state.service?.slug === slug) return

  loadingService.value = true
  try {
    const item = await fetchService(slug)
    if (item) preselectService(item)
    // Prestation introuvable ou désactivée : on retombe sur le parcours normal
    // plutôt que d'afficher une sélection fantôme.
    else router.replace({ name: 'booking' })
  } catch {
    router.replace({ name: 'booking' })
  } finally {
    loadingService.value = false
  }
}

onMounted(() => {
  // L'adresse fait foi à l'arrivée : sans paramètre, c'est le parcours normal,
  // même si une sélection traînait en mémoire d'une visite précédente.
  if (styleId.value) resolveStyle(styleId.value)
  else if (serviceSlug.value) resolveService(serviceSlug.value)
  else if (state.inspiration) clearInspiration()
})

watch(styleId, (id) => (id ? resolveStyle(id) : clearInspiration()))
watch(serviceSlug, (slug) => {
  if (slug) resolveService(slug)
})

/**
 * Parcours B : si la cliente change de prestation dans le catalogue, l'adresse
 * suit, sinon le rappel en tête de page contredirait le lien partagé.
 */
watch(
  () => state.service?.slug ?? null,
  (slug) => {
    if (fromGallery.value || !serviceSlug.value || !slug || slug === serviceSlug.value) return
    router.replace({ name: 'booking', query: { prestation: slug } })
  },
)

const STEP_TITLES = {
  1: { title: 'Choisissez votre prestation', hint: 'Une seule prestation par rendez-vous.' },
  2: { title: 'Choisissez une date', hint: 'Les dates indisponibles sont désactivées.' },
  3: { title: 'Choisissez un créneau', hint: 'Tous les horaires d’ouverture sont proposés.' },
  4: { title: 'Vos informations', hint: 'Pour vous confirmer le rendez-vous.' },
  5: { title: 'Récapitulatif', hint: 'Vérifiez avant d’envoyer votre demande.' },
}

const currentTitle = computed(() => {
  // Parcours A : l'étape 1 n'est plus un choix, c'est un rappel de la coiffure.
  if (state.step === 1 && fromGallery.value) {
    return state.service
      ? { title: 'Votre coiffure', hint: 'Elle est déjà sélectionnée.' }
      : {
          title: 'Choisissez la prestation',
          hint: 'Celle qui correspond le mieux à la coiffure choisie.',
        }
  }
  return STEP_TITLES[state.step]
})

/** Le fil d'étapes annonce « Coiffure » quand la sélection vient de la galerie. */
const wizardSteps = computed(() =>
  fromGallery.value
    ? steps.map((step) => (step.id === 1 ? { ...step, label: 'Coiffure' } : step))
    : steps,
)

const inspirationTitle = computed(() => state.inspiration?.title ?? '')

/** Abandon de la coiffure : on nettoie aussi l'adresse. */
const dropInspiration = () => {
  clearInspiration()
  if (styleId.value) router.replace({ name: 'booking' })
}

/** « Changer de prestation » : retour au catalogue, adresse nettoyée. */
const dropService = () => {
  selectService(null)
  goToStep(1)
  if (serviceSlug.value) router.replace({ name: 'booking' })
  scrollToTop()
}

/** Messages d'erreur de l'étape 4, dans l'ordre d'affichage des champs. */
const FIELD_ORDER = ['firstName', 'lastName', 'phone', 'email']
const errorList = computed(() => FIELD_ORDER.map((key) => errors[key]).filter(Boolean))

/** Les champs sont modifiés ici : StepDetails ne mute jamais ses props. */
const updateCustomer = (key, value) => {
  state.customer[key] = value
  if (errors[key]) delete errors[key]
}

const validateDetails = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (state.customer.firstName.trim().length < 2) errors.firstName = 'Merci d’indiquer votre prénom.'
  if (state.customer.lastName.trim().length < 2) errors.lastName = 'Merci d’indiquer votre nom.'
  if (state.customer.phone.trim().length < 8) errors.phone = 'Numéro de téléphone incomplet.'
  if (!/^\S+@\S+\.\S+$/.test(state.customer.email.trim())) errors.email = 'Adresse e-mail invalide.'
  return Object.keys(errors).length === 0
}

/**
 * L'étape 4 est la seule où « Continuer » reste actif même si le formulaire est
 * incomplet : c'est le clic qui déclenche la validation et affiche les messages.
 * Un bouton grisé n'expliquerait pas à la cliente ce qu'il lui manque (WCAG 3.3.1).
 */
const nextDisabled = computed(() => state.step !== 4 && !canGoNext.value)

/** Amène la cliente directement sur le premier champ à corriger. */
const focusFirstInvalidField = async () => {
  await nextTick()
  const field = stepPanel.value?.querySelector('[aria-invalid="true"]')
  if (!field) return
  field.focus({ preventScroll: true })
  field.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const scrollToTop = () => {
  wizardTop.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const handleNext = () => {
  if (state.step === 4 && !validateDetails()) {
    focusFirstInvalidField()
    return
  }
  next()
  scrollToTop()
}

const handlePrevious = () => {
  previous()
  scrollToTop()
}

const handleStepSelect = (step) => {
  goToStep(step)
  scrollToTop()
}

const submit = async () => {
  await confirmBooking()
  scrollToTop()
}

const restart = () => {
  reset()
  if (styleId.value || serviceSlug.value) router.replace({ name: 'booking' })
  scrollToTop()
}

// Changement d'étape : on efface les erreurs de champ de l'étape précédente.
watch(
  () => state.step,
  () => Object.keys(errors).forEach((key) => delete errors[key]),
)
</script>

<template>
  <div ref="wizardTop" class="scroll-mt-28">
    <!-- Confirmation : uniquement à partir de la réponse du serveur -->
    <StepConfirmation
      v-if="state.confirmation"
      :confirmation="state.confirmation"
      @restart="restart"
    />

    <!-- Parcours -->
    <div v-else class="flex flex-col gap-8">
      <!--
        Parcours A — la coiffure choisie dans « Nos coiffures » ouvre la page.
        Elle reste affichée pendant toute la réservation : la cliente garde sous
        les yeux ce qu'elle a choisi et ne se demande jamais si sa sélection
        a été prise en compte.
      -->
      <SelectedStyleCard v-if="fromGallery" :inspiration="state.inspiration" />

      <!--
        Parcours B — la prestation choisie dans « Nos services » ouvre la page.
        Même rappel, même place : la cliente voit ce qu'elle vient de choisir
        au lieu d'atterrir directement sur un calendrier.
      -->
      <SelectedServiceCard
        v-else-if="fromServices"
        :service="state.service"
        @change="dropService"
      />

      <p v-else-if="loadingStyle" class="text-sm text-muted">Chargement de votre coiffure…</p>

      <p v-else-if="loadingService" class="text-sm text-muted">Chargement de votre prestation…</p>

      <BookingSteps
        :steps="wizardSteps"
        :current="state.step"
        :max-reached="maxReachedStep"
        @select="handleStepSelect"
      />

      <!-- Message d'erreur de réservation, formulé pour une cliente -->
      <div
        v-if="state.submitError"
        class="flex items-start gap-3 rounded-xl border border-[#d9a898] bg-[#fdf3f0] p-4 text-sm text-[#8c3d2a]"
        role="alert"
      >
        <AppIcon name="shield" class="mt-0.5 h-4 w-4 shrink-0" />
        <span>{{ state.submitError }}</span>
      </div>

      <div class="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <!--
          Au récapitulatif, la colonne prend toute la largeur : le rappel
          latéral n'a plus lieu d'être, les cartes de l'étape répètent déjà
          la prestation, la date, l'heure et les coordonnées.
        -->
        <div :class="state.step === 5 ? 'lg:col-span-12' : 'lg:col-span-8'">
          <div class="mb-6 flex flex-col gap-1.5">
            <span class="eyebrow">Étape {{ String(state.step).padStart(2, '0') }}</span>
            <h2 class="text-[2rem] sm:text-4xl">{{ currentTitle.title }}</h2>
            <p class="text-sm text-muted">{{ currentTitle.hint }}</p>
          </div>

          <!-- Récapitulatif des champs à corriger, annoncé aux lecteurs d'écran -->
          <div
            v-if="state.step === 4 && errorList.length"
            class="mb-5 flex items-start gap-3 rounded-xl border border-[#d9a898] bg-[#fdf3f0] p-4 text-sm text-[#8c3d2a]"
            role="alert"
          >
            <AppIcon name="shield" class="mt-0.5 h-4 w-4 shrink-0" />
            <div class="flex flex-col gap-1">
              <p class="font-medium">
                Merci de corriger {{ errorList.length > 1 ? 'ces champs' : 'ce champ' }} avant de
                continuer :
              </p>
              <ul class="list-inside list-disc">
                <li v-for="message in errorList" :key="message">{{ message }}</li>
              </ul>
            </div>
          </div>

          <Transition name="step" mode="out-in">
          <div :key="state.step" ref="stepPanel">
            <!--
              Étape 1, parcours A avec prestation rattachée : la cliente n'a
              rien à choisir. On confirme la sélection et on la pousse vers la
              suite plutôt que de lui réafficher tout le catalogue.
            -->
            <div
              v-if="state.step === 1 && fromGallery && service"
              class="card-surface flex flex-col gap-4 p-5 sm:p-6"
            >
              <p class="flex items-start gap-3 text-sm leading-relaxed text-cocoa">
                <AppIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>
                  <strong class="font-medium text-cocoa-dark">{{ inspirationTitle }}</strong> est
                  sélectionnée, avec la prestation « {{ service.name }} ». Il ne vous reste qu'à
                  choisir votre date et votre créneau.
                </span>
              </p>

              <div class="flex flex-wrap gap-2.5">
                <BaseButton variant="primary" size="md" @click="handleNext">
                  Choisir la date
                  <AppIcon name="arrow-right" class="h-4 w-4" />
                </BaseButton>
                <BaseButton variant="ghost" size="md" @click="dropInspiration">
                  Choisir une autre prestation
                </BaseButton>
              </div>
            </div>

            <StepService
              v-else-if="state.step === 1"
              :selected-slug="service?.slug ?? null"
              @select="selectService"
            />

            <BookingCalendar
              v-else-if="state.step === 2"
              :model-value="state.date"
              :refresh-key="state.availabilityVersion"
              :service-id="service?.id ?? null"
              @update:model-value="selectDate"
            />

            <TimeSlotPicker
              v-else-if="state.step === 3"
              :date="state.date"
              :model-value="state.time"
              :refresh-key="state.availabilityVersion"
              :service-id="service?.id ?? null"
              @update:model-value="selectTime"
            />

            <StepDetails
              v-else-if="state.step === 4"
              :customer="state.customer"
              :errors="errors"
              @update="updateCustomer"
            />

            <StepSummary
              v-else-if="state.step === 5 && service && state.date && state.time"
              :service="service"
              :date="state.date"
              :time="state.time"
              :customer="state.customer"
            />
          </div>
          </Transition>

          <!-- Navigation -->
          <div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <BaseButton
              v-if="state.step > 1"
              variant="secondary"
              size="md"
              :block="false"
              class="w-full sm:w-auto"
              @click="handlePrevious"
            >
              <AppIcon name="arrow-left" class="h-4 w-4" />
              Retour
            </BaseButton>
            <span v-else class="hidden sm:block" />

            <BaseButton
              v-if="state.step < 5"
              variant="primary"
              size="md"
              class="w-full sm:w-auto"
              :disabled="nextDisabled"
              @click="handleNext"
            >
              Continuer
              <AppIcon name="arrow-right" class="h-4 w-4" />
            </BaseButton>

            <BaseButton
              v-else
              variant="primary"
              size="lg"
              class="w-full sm:w-auto"
              :disabled="state.submitting"
              @click="submit"
            >
              {{ state.submitting ? 'Envoi…' : 'Envoyer ma demande' }}
              <AppIcon v-if="!state.submitting" name="check" class="h-4 w-4" />
            </BaseButton>
          </div>
        </div>

        <!-- Récapitulatif latéral -->
        <aside v-if="state.step < 5" class="lg:col-span-4">
          <div
            class="bg-espresso-deep grain relative flex flex-col gap-5 overflow-hidden rounded-xl border border-gold-soft/25 p-7 text-cream shadow-[var(--shadow-lift)] lg:sticky lg:top-28"
          >
            <h3 class="font-display text-3xl text-cream">Votre sélection</h3>

            <!-- Coiffure choisie dans « Nos coiffures », rappelée jusqu'au bout. -->
            <div
              v-if="state.inspiration"
              class="flex items-center gap-3 rounded-xl border border-cream/15 bg-cream/5 p-2.5"
            >
              <img
                :src="state.inspiration.imageUrl"
                :alt="state.inspiration.title"
                class="h-14 w-14 shrink-0 rounded-xl object-cover"
              />
              <div class="min-w-0 flex-1">
                <p class="text-[0.62rem] uppercase tracking-[0.18em] text-gold-soft">Coiffure choisie</p>
                <p class="truncate text-sm text-cream">{{ state.inspiration.title }}</p>
              </div>
              <button
                type="button"
                class="grid h-8 w-8 shrink-0 place-items-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
                aria-label="Retirer la coiffure choisie"
                @click="dropInspiration"
              >
                <AppIcon name="close" class="h-3.5 w-3.5" />
              </button>
            </div>

            <ul class="flex flex-col gap-3 text-sm">
              <li class="flex items-start gap-3">
                <AppIcon name="sparkle" class="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
                <span :class="service ? 'text-cream' : 'text-cream/45'">
                  {{ service ? service.name : 'Prestation à choisir' }}
                </span>
              </li>
              <li class="flex items-start gap-3">
                <AppIcon name="calendar" class="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
                <span :class="state.date ? 'text-cream' : 'text-cream/45'">
                  {{ state.date ? capitalize(formatDateLong(state.date)) : 'Date à choisir' }}
                </span>
              </li>
              <li class="flex items-start gap-3">
                <AppIcon name="clock" class="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
                <span :class="state.time ? 'text-cream' : 'text-cream/45'">
                  {{ state.time || 'Heure à choisir' }}
                </span>
              </li>
            </ul>

            <div v-if="service" class="flex items-baseline justify-between border-t border-dashed border-cream/25 pt-4">
              <span class="text-xs uppercase tracking-[0.12em] text-cream/70">
                {{ formatDuration(service.durationMinutes) }}
              </span>
              <span class="font-display text-xl text-gold-soft">
                {{ formatPrice(service.price, service.currency) }}
              </span>
            </div>

            <p class="text-xs leading-relaxed text-cream/60">
              Tarifs et durées indicatifs, confirmés par le salon avant le rendez-vous.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
