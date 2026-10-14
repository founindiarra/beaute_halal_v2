<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import AppIcon from '@/components/ui/AppIcon.vue'
import { preselectFromGallery } from '@/composables/useBooking'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useScrollLock } from '@/composables/useScrollLock'
import { formatPrice } from '@/utils/format'

const props = defineProps({
  items: { type: Array, required: true },
  index: { type: Number, default: null },
})

const emit = defineEmits(['close', 'update:index'])

const { lock, unlock } = useScrollLock()
const router = useRouter()

/** Réserver la coiffure agrandie, sans avoir à refermer la vue d'abord. */
const book = () => {
  if (!current.value) return
  preselectFromGallery(current.value)
  emit('close')
  router.push({ name: 'booking', query: { coiffure: current.value.id } })
}

const dialog = ref(null)

const isOpen = computed(() => props.index !== null && props.index >= 0)
const current = computed(() => (isOpen.value ? props.items[props.index] : null))

// Focus déplacé dans la vue agrandie, piégé dedans, puis rendu à la vignette.
useFocusTrap(dialog, isOpen, () => emit('close'))

const go = (step) => {
  if (!isOpen.value || !props.items.length) return
  const next = (props.index + step + props.items.length) % props.items.length
  emit('update:index', next)
}

/** Échap est géré par le piège de focus ; ici seulement les flèches. */
const onKey = (event) => {
  if (!isOpen.value) return
  if (event.key === 'ArrowRight') go(1)
  if (event.key === 'ArrowLeft') go(-1)
}

watch(isOpen, (open) => (open ? lock() : unlock()))

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  unlock()
})
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity duration-200"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen && current"
      ref="dialog"
      class="fixed inset-0 z-[70] flex flex-col bg-cocoa-dark/96 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      :aria-label="current.title"
    >
      <!-- Barre supérieure -->
      <div class="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <p class="min-w-0 text-xs text-cream/60">
          {{ index + 1 }} / {{ items.length }}
        </p>
        <button
          type="button"
          class="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10"
          aria-label="Fermer"
          @click="emit('close')"
        >
          <AppIcon name="close" class="h-5 w-5" />
        </button>
      </div>

      <!-- Image -->
      <div class="flex min-h-0 flex-1 items-center justify-center px-3 sm:px-6">
        <img
          :src="current.imageUrl"
          :alt="current.title"
          class="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
        />
      </div>

      <!-- Légende + navigation -->
      <div class="px-4 py-4 sm:px-6 sm:py-6">
        <div class="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <button
            type="button"
            class="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10"
            aria-label="Image précédente"
            @click="go(-1)"
          >
            <AppIcon name="chevron-left" class="h-5 w-5" />
          </button>

          <div class="flex min-w-0 flex-col items-center gap-3">
            <div class="min-w-0 text-center">
              <p class="font-display text-lg text-cream sm:text-xl">{{ current.title }}</p>
              <p v-if="current.service" class="mt-1 text-xs text-gold-soft sm:text-sm">
                {{ current.service.name }} ·
                {{ formatPrice(current.service.price, current.service.currency) }}
              </p>
              <p v-else-if="current.description" class="mt-1 text-xs text-cream/60 sm:text-sm">
                {{ current.description }}
              </p>
            </div>

            <button
              type="button"
              class="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-cream px-6 text-[0.86rem] tracking-[0.04em] text-cocoa-dark transition-colors hover:bg-ivory"
              @click="book"
            >
              Réserver cette coiffure
              <AppIcon name="arrow-right" class="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            class="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10"
            aria-label="Image suivante"
            @click="go(1)"
          >
            <AppIcon name="chevron-right" class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
