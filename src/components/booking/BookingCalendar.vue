<script setup>
import { computed, ref, watch } from 'vue'

import AppIcon from '@/components/ui/AppIcon.vue'
import DataState from '@/components/ui/DataState.vue'
import { useApiData } from '@/composables/useApiData'
import { fetchAvailabilityDays } from '@/services/api'
import { fromDateKey, startOfDay, toDateKey } from '@/utils/date'
import { capitalize } from '@/utils/format'

const props = defineProps({
  modelValue: { type: Date, default: null },
  /** Incrémenter cette valeur force un rechargement des disponibilités. */
  refreshKey: { type: Number, default: 0 },
  /**
   * Prestation choisie à l'étape précédente. Sa durée décide des dates
   * réellement tenables : une coiffure longue ferme des journées qu'une
   * coiffure courte laisse ouvertes. Sans elle, le serveur répond pour la
   * prestation la plus courte du catalogue.
   */
  serviceId: { type: [Number, String], default: null },
})

const emit = defineEmits(['update:modelValue'])

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const today = startOfDay(new Date())
const cursor = ref(new Date(props.modelValue || today).getTime())
const cursorDate = computed(() => new Date(cursor.value))

/** Le calendrier est entièrement piloté par l'API : aucun calcul local d'ouverture. */
const { data, loading, error, reload } = useApiData(
  () => fetchAvailabilityDays({ serviceId: props.serviceId ?? undefined }),
  { days: [], windowDays: 60 },
)

watch(
  () => [props.refreshKey, props.serviceId],
  () => reload(),
)

/** Index rapide « AAAA-MM-JJ » → état renvoyé par le serveur. */
const daysByKey = computed(() => {
  const map = new Map()
  ;(data.value?.days ?? []).forEach((day) => map.set(day.date, day))
  return map
})

const lastDay = computed(() => {
  const days = data.value?.days ?? []
  return days.length ? fromDateKey(days[days.length - 1].date) : today
})

const monthLabel = computed(() =>
  capitalize(
    new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(cursorDate.value),
  ),
)

/** Grille du mois affiché, semaine commençant le lundi. */
const cells = computed(() => {
  const ref_ = cursorDate.value
  const firstOfMonth = new Date(ref_.getFullYear(), ref_.getMonth(), 1)
  const daysInMonth = new Date(ref_.getFullYear(), ref_.getMonth() + 1, 0).getDate()
  const offset = (firstOfMonth.getDay() + 6) % 7

  const list = Array.from({ length: offset }, () => null)

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(ref_.getFullYear(), ref_.getMonth(), day)
    const key = toDateKey(date)
    const info = daysByKey.value.get(key)
    list.push({
      date,
      key,
      label: day,
      isToday: date.getTime() === today.getTime(),
      available: Boolean(info?.bookable),
    })
  }

  return list
})

const canGoPrevious = computed(() => {
  const d = cursorDate.value
  return (
    new Date(d.getFullYear(), d.getMonth(), 1) > new Date(today.getFullYear(), today.getMonth(), 1)
  )
})

const canGoNext = computed(() => {
  const d = cursorDate.value
  const limit = lastDay.value
  return (
    new Date(d.getFullYear(), d.getMonth(), 1) < new Date(limit.getFullYear(), limit.getMonth(), 1)
  )
})

const shiftMonth = (step) => {
  const d = cursorDate.value
  cursor.value = new Date(d.getFullYear(), d.getMonth() + step, 1).getTime()
}

const selectedKey = computed(() => (props.modelValue ? toDateKey(props.modelValue) : null))

const select = (day) => {
  if (!day?.available) return
  emit('update:modelValue', day.date)
}
</script>

<template>
  <div class="card-surface p-4 sm:p-7">
    <DataState
      :loading="loading"
      :error="error"
      loading-label="Chargement des disponibilités…"
      @retry="reload"
    >
      <!-- En-tête du mois -->
      <div class="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-sand-dark text-cocoa transition-colors enabled:hover:border-cocoa-dark enabled:hover:text-cocoa-dark disabled:opacity-30"
          :disabled="!canGoPrevious"
          aria-label="Mois précédent"
          @click="shiftMonth(-1)"
        >
          <AppIcon name="chevron-left" class="h-4 w-4" />
        </button>

        <p class="font-display text-lg text-cocoa-dark sm:text-xl">{{ monthLabel }}</p>

        <button
          type="button"
          class="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-sand-dark text-cocoa transition-colors enabled:hover:border-cocoa-dark enabled:hover:text-cocoa-dark disabled:opacity-30"
          :disabled="!canGoNext"
          aria-label="Mois suivant"
          @click="shiftMonth(1)"
        >
          <AppIcon name="chevron-right" class="h-4 w-4" />
        </button>
      </div>

      <!-- Jours de la semaine -->
      <div class="mb-2 grid grid-cols-7 gap-1 sm:gap-1.5">
        <span
          v-for="day in WEEKDAYS"
          :key="day"
          class="py-1 text-center text-[0.62rem] uppercase tracking-[0.1em] text-muted sm:text-[0.7rem]"
        >
          {{ day }}
        </span>
      </div>

      <!-- Grille -->
      <div class="grid grid-cols-7 gap-1 sm:gap-1.5">
        <template v-for="(day, index) in cells" :key="day ? day.key : `empty-${index}`">
          <span v-if="!day" />
          <button
            v-else
            type="button"
            class="flex aspect-square min-h-[40px] w-full items-center justify-center rounded-full border text-sm transition-all duration-200 sm:text-base"
            :class="[
              selectedKey === day.key
                ? 'border-cocoa-dark bg-cocoa-dark font-medium text-cream'
                : day.available
                  ? 'border-transparent bg-ivory text-cocoa-dark hover:border-cocoa-dark'
                  : 'cursor-not-allowed border-transparent bg-ivory/60 text-muted/40 line-through',
              day.isToday && selectedKey !== day.key ? 'ring-1 ring-gold/50' : '',
            ]"
            :disabled="!day.available"
            :aria-pressed="selectedKey === day.key"
            @click="select(day)"
          >
            {{ day.label }}
          </button>
        </template>
      </div>

      <p class="mt-5 flex items-center gap-2 text-xs text-muted">
        <span class="inline-block h-2.5 w-2.5 rounded-full bg-ivory ring-1 ring-sand-dark" />
        Les dates barrées sont indisponibles (salon fermé ou complet).
      </p>
    </DataState>
  </div>
</template>
