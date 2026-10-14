<script setup>
import { useRouter } from 'vue-router'

import AppIcon from '@/components/ui/AppIcon.vue'
import AppImage from '@/components/ui/AppImage.vue'
import { preselectFromGallery } from '@/composables/useBooking'
import { formatPrice } from '@/utils/format'

defineProps({
  items: { type: Array, required: true },
})

defineEmits(['open'])

const router = useRouter()

/**
 * Réserver la coiffure choisie. Si elle est rattachée à une prestation,
 * celle-ci est présélectionnée ; sinon la cliente choisit la sienne. Dans les
 * deux cas la coiffure demandée accompagne la demande jusqu'au salon.
 */
const book = (item) => {
  // L'identifiant de la coiffure voyage dans l'adresse : la page Réservation
  // le relit pour retrouver la réalisation dans l'API, et la sélection survit
  // à un rafraîchissement ou au partage du lien.
  preselectFromGallery(item)
  router.push({ name: 'booking', query: { coiffure: item.id } })
}
</script>

<template>
  <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
    <li v-for="(item, index) in items" :key="item.id" class="flex flex-col">
      <button
        type="button"
        class="media-veil group relative block w-full overflow-hidden rounded-t-2xl bg-sand text-left"
        :aria-label="`Agrandir la photo « ${item.title} »`"
        @click="$emit('open', index)"
      >
        <AppImage
          :src="item.imageUrl"
          :alt="item.title"
          ratio="4/5"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          class="transition-transform duration-700 group-hover:scale-[1.05]"
        />

        <span
          class="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-cocoa-dark/85 via-cocoa-dark/15 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <span class="font-display text-lg italic text-gold-soft">
            {{ item.category.name }}
          </span>
        </span>

        <span
          class="pointer-events-none absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-cream/90 text-cocoa-dark opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <AppIcon name="expand" class="h-4 w-4" />
        </span>
      </button>

      <!-- La réservation reste toujours visible : jamais cachée derrière un survol. -->
      <div
        class="flex flex-1 flex-col gap-3 rounded-b-2xl border border-t-0 border-sand-dark/60 bg-white p-4"
      >
        <div class="flex flex-col gap-0.5">
          <h3 class="font-display text-lg leading-snug text-cocoa-dark">{{ item.title }}</h3>
          <p v-if="item.service" class="text-xs text-muted">
            {{ item.service.name }} ·
            <span class="text-cocoa">
              {{ formatPrice(item.service.price, item.service.currency) }}
            </span>
          </p>
          <p v-else class="text-xs text-muted">{{ item.category.name }}</p>
        </div>

        <button
          type="button"
          class="mt-auto inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-cocoa-dark/35 px-4 text-[0.84rem] tracking-[0.04em] text-cocoa-dark transition-colors hover:border-cocoa-dark hover:bg-cocoa-dark hover:text-cream"
          @click="book(item)"
        >
          Réserver cette coiffure
          <AppIcon name="arrow-right" class="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  </ul>
</template>
