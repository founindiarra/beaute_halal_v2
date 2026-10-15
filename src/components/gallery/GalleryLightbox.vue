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
/** Sens du dernier changement : l'image sort et entre du bon côté. */
const direction = ref(1)

const isOpen = computed(() => props.index !== null && props.index >= 0)
const current = computed(() => (isOpen.value ? props.items[props.index] : null))

// Focus déplacé dans la vue agrandie, piégé dedans, puis rendu à la vignette.
useFocusTrap(dialog, isOpen, () => emit('close'))

const go = (step) => {
  if (!isOpen.value || !props.items.length) return
  direction.value = step
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
  <!-- Téléporté dans <body> : aucun parent transformé ne peut le coincer. -->
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="isOpen && current"
        ref="dialog"
        class="bg-espresso-deep fixed inset-0 z-[120] flex flex-col"
        role="dialog"
        aria-modal="true"
        :aria-label="current.title"
      >
        <!-- Barre supérieure -->
        <div class="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <p class="font-display text-lg italic text-cream/70">
            <span class="text-gold-soft">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="mx-2 text-cream/30">/</span>
            {{ String(items.length).padStart(2, '0') }}
          </p>
          <button
            type="button"
            class="btn-round h-12 w-12 shrink-0 text-cream hover:bg-cream hover:text-ink"
            aria-label="Fermer"
            @click="emit('close')"
          >
            <AppIcon name="close" class="h-5 w-5" />
          </button>
        </div>

        <!-- Image -->
        <div class="relative flex min-h-0 flex-1 items-center justify-center px-3 sm:px-20">
          <button
            type="button"
            class="btn-round absolute left-3 z-10 hidden h-14 w-14 text-cream hover:bg-cream hover:text-ink sm:grid"
            aria-label="Image précédente"
            @click="go(-1)"
          >
            <AppIcon name="chevron-left" class="h-5 w-5" />
          </button>

          <Transition :name="direction > 0 ? 'slide-next' : 'slide-prev'" mode="out-in">
            <img
              :key="current.id"
              :src="current.imageUrl"
              :alt="current.title"
              class="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            />
          </Transition>

          <button
            type="button"
            class="btn-round absolute right-3 z-10 hidden h-14 w-14 text-cream hover:bg-cream hover:text-ink sm:grid"
            aria-label="Image suivante"
            @click="go(1)"
          >
            <AppIcon name="chevron-right" class="h-5 w-5" />
          </button>
        </div>

        <!-- Légende + navigation -->
        <div class="px-4 py-5 sm:px-8 sm:py-7">
          <div class="mx-auto flex max-w-3xl items-center justify-between gap-4">
            <button
              type="button"
              class="btn-round h-12 w-12 shrink-0 text-cream hover:bg-cream hover:text-ink sm:hidden"
              aria-label="Image précédente"
              @click="go(-1)"
            >
              <AppIcon name="chevron-left" class="h-5 w-5" />
            </button>

            <div class="flex min-w-0 flex-1 flex-col items-center gap-4">
              <div class="min-w-0 text-center">
                <p class="font-display text-2xl text-cream sm:text-3xl">{{ current.title }}</p>
                <p v-if="current.service" class="mt-1 text-xs tracking-wide text-gold-soft sm:text-sm">
                  {{ current.service.name }} ·
                  {{ formatPrice(current.service.price, current.service.currency) }}
                </p>
                <p v-else-if="current.description" class="mt-1 text-xs text-cream/60 sm:text-sm">
                  {{ current.description }}
                </p>
              </div>

              <button type="button" class="btn btn--gold btn--md" @click="book">
                Réserver cette coiffure
                <AppIcon name="arrow-right" class="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              class="btn-round h-12 w-12 shrink-0 text-cream hover:bg-cream hover:text-ink sm:hidden"
              aria-label="Image suivante"
              @click="go(1)"
            >
              <AppIcon name="chevron-right" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.45s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.slide-next-enter-active,
.slide-prev-enter-active {
  transition:
    opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-next-leave-active,
.slide-prev-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}
.slide-next-enter-from {
  opacity: 0;
  transform: translateX(60px) scale(0.97);
}
.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-60px) scale(0.97);
}
.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

@media (prefers-reduced-motion: reduce) {
  .lightbox-enter-active,
  .lightbox-leave-active,
  .slide-next-enter-active,
  .slide-prev-enter-active,
  .slide-next-leave-active,
  .slide-prev-leave-active {
    transition: none;
  }
}
</style>
