<script setup>
import { computed } from 'vue'

import AppIcon from '@/components/ui/AppIcon.vue'
import DataState from '@/components/ui/DataState.vue'
import { useApiData } from '@/composables/useApiData'
import { fetchServiceCategories, fetchServices } from '@/services/api'
import { formatDuration, formatPrice } from '@/utils/format'

const props = defineProps({
  /** Slug de la prestation actuellement sélectionnée. */
  selectedSlug: { type: String, default: null },
})

const emit = defineEmits(['select'])

const loadCatalogue = async () => {
  const [categories, services] = await Promise.all([fetchServiceCategories(), fetchServices()])
  return { categories, services }
}

const { data, loading, error, reload } = useApiData(loadCatalogue, {
  categories: [],
  services: [],
})

const byCategory = computed(() =>
  (data.value?.categories ?? [])
    .map((category) => ({
      ...category,
      items: (data.value?.services ?? []).filter(
        (service) => service.category.slug === category.slug,
      ),
    }))
    .filter((category) => category.items.length > 0),
)

const isSelected = (service) => props.selectedSlug === service.slug

const pad = (n) => String(n).padStart(2, '0')
</script>

<template>
  <DataState
    :loading="loading"
    :error="error"
    :empty="!byCategory.length"
    loading-label="Chargement des prestations…"
    empty-label="Aucune prestation n’est réservable pour le moment."
    @retry="reload"
  >
    <div class="flex flex-col gap-9">
      <section v-for="(category, index) in byCategory" :key="category.id" class="flex flex-col gap-3">
        <h3 class="flex items-baseline gap-3 font-display text-2xl text-cocoa-dark">
          <span class="font-sans text-[0.72rem] tracking-[0.22em] text-gold">{{ pad(index + 1) }}</span>
          {{ category.name }}
        </h3>

        <ul class="divide-y divide-sand overflow-hidden rounded-xl border border-sand-dark/70 bg-white shadow-[var(--shadow-soft)]">
          <li v-for="service in category.items" :key="service.id">
            <button
              type="button"
              class="relative flex w-full items-center gap-4 px-4 py-5 text-left transition-colors duration-500 sm:px-6"
              :class="isSelected(service) ? 'bg-ivory' : 'hover:bg-ivory/70'"
              :aria-pressed="isSelected(service)"
              @click="emit('select', service)"
            >
              <span
                v-if="isSelected(service)"
                class="absolute inset-y-0 left-0 w-[3px] bg-gold"
                aria-hidden="true"
              />
              <span
                class="grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors"
                :class="isSelected(service) ? 'border-espresso bg-espresso text-gold-soft' : 'border-sand-dark'"
              >
                <AppIcon v-if="isSelected(service)" name="check" class="h-3 w-3" />
              </span>

              <span class="flex min-w-0 flex-1 flex-col gap-1">
                <span class="font-display text-[1.2rem] leading-snug text-cocoa-dark">
                  {{ service.name }}
                </span>
                <span class="inline-flex items-center gap-1.5 text-xs text-muted">
                  <AppIcon name="clock" class="h-3.5 w-3.5 text-gold" />
                  {{ formatDuration(service.durationMinutes) }}
                </span>
              </span>

              <span class="shrink-0 font-display text-lg text-cocoa-dark">
                {{ formatPrice(service.price, service.currency) }}
              </span>
            </button>
          </li>
        </ul>
      </section>
    </div>
  </DataState>
</template>
