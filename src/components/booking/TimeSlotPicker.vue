<script setup>
import { computed, watch } from 'vue'

import DataState from '@/components/ui/DataState.vue'
import { useApiData } from '@/composables/useApiData'
import { fetchAvailabilitySlots } from '@/services/api'
import { toDateKey } from '@/utils/date'

const props = defineProps({
  date: { type: Date, default: null },
  modelValue: { type: String, default: null },
  /** Incrémenter cette valeur force un rechargement (créneau pris entre-temps). */
  refreshKey: { type: Number, default: 0 },
  /**
   * Prestation choisie. Sa durée décide du dernier créneau possible : une
   * prestation de deux heures ne peut pas commencer une heure avant la
   * fermeture, et le serveur le refuserait de toute façon à la réservation.
   */
  serviceId: { type: [Number, String], default: null },
})

defineEmits(['update:modelValue'])

/** Les créneaux et leur disponibilité viennent entièrement du serveur. */
const { data, loading, error, reload } = useApiData(
  (dateKey) => fetchAvailabilitySlots(dateKey, props.serviceId ?? null),
  { slots: [], bookable: false },
  { immediate: false },
)

const load = () => {
  if (props.date) reload(toDateKey(props.date))
}

watch(
  () => [props.date?.getTime(), props.refreshKey, props.serviceId],
  load,
  { immediate: true },
)

const slots = computed(() => data.value?.slots ?? [])
const hasAvailability = computed(() => slots.value.some((slot) => slot.available))
</script>

<template>
  <div class="flex flex-col gap-4">
    <p v-if="!date" class="text-sm text-muted">Choisissez d’abord une date.</p>

    <DataState
      v-else
      :loading="loading"
      :error="error"
      loading-label="Chargement des créneaux…"
      @retry="load"
    >
      <p v-if="!hasAvailability" class="text-sm text-muted">
        Aucun créneau disponible ce jour-là. Merci de sélectionner une autre date.
      </p>

      <div v-else class="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
        <button
          v-for="slot in slots"
          :key="slot.time"
          type="button"
          class="min-h-[48px] rounded-full border px-3 py-2.5 text-base transition-all duration-200"
          :class="
            modelValue === slot.time
              ? 'border-cocoa-dark bg-cocoa-dark font-medium text-cream'
              : slot.available
                ? 'border-transparent bg-ivory text-cocoa-dark hover:border-cocoa-dark'
                : 'cursor-not-allowed border-transparent bg-ivory/60 text-muted/40 line-through'
          "
          :disabled="!slot.available"
          :aria-pressed="modelValue === slot.time"
          @click="$emit('update:modelValue', slot.time)"
        >
          {{ slot.time }}
        </button>
      </div>
    </DataState>
  </div>
</template>
