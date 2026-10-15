<script setup>
import { useRouter } from 'vue-router'

import AppIcon from '@/components/ui/AppIcon.vue'
import AppImage from '@/components/ui/AppImage.vue'
import { preselectFromGallery } from '@/composables/useBooking'
import { formatPrice } from '@/utils/format'

defineProps({
  items: { type: Array, required: true },
  /** 'light' sur fond clair, 'dark' sur fond brun. */
  tone: { type: String, default: 'light' },
})

defineEmits(['open'])

const router = useRouter()

/** Proportions alternées : la grille respire comme une planche contact. */
const RATIOS = ['4/5', '1/1', '3/4', '4/5', '5/6', '1/1']

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
  <ul class="columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-8">
    <li
      v-for="(item, index) in items"
      :key="item.id"
      v-reveal="(index % 3) * 100"
      class="mb-8 break-inside-avoid lg:mb-10"
    >
      <figure class="group flex flex-col">
        <button
          type="button"
          data-cursor="view"
          class="relative block w-full overflow-hidden rounded-lg bg-sand text-left"
          :aria-label="`Agrandir la photo « ${item.title} »`"
          @click="$emit('open', index)"
        >
          <AppImage
            :src="item.imageUrl"
            :alt="item.title"
            :ratio="RATIOS[index % RATIOS.length]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            class="transition-transform duration-[1600ms] ease-[var(--ease-expo)] group-hover:scale-[1.06]"
          />

          <span
            class="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-espresso/85 via-espresso/10 to-transparent p-5 opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <span class="font-display text-xl italic text-gold-soft">{{ item.category.name }}</span>
          </span>

          <span
            class="pointer-events-none absolute right-4 top-4 grid h-11 w-11 scale-75 place-items-center rounded-full bg-cream/90 text-cocoa-dark opacity-0 transition-all duration-500 ease-[var(--ease-expo)] group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100"
          >
            <AppIcon name="expand" class="h-4 w-4" />
          </span>
        </button>

        <!-- La réservation reste toujours visible : jamais cachée derrière un survol. -->
        <figcaption class="flex flex-col gap-3 pt-5">
          <div class="flex flex-col gap-1">
            <h3
              class="font-display text-[1.45rem] leading-snug"
              :class="tone === 'dark' ? 'text-cream' : 'text-cocoa-dark'"
            >
              {{ item.title }}
            </h3>
            <p v-if="item.service" class="text-xs" :class="tone === 'dark' ? 'text-cream/60' : 'text-muted'">
              {{ item.service.name }} ·
              <span :class="tone === 'dark' ? 'text-gold-soft' : 'text-cocoa'">
                {{ formatPrice(item.service.price, item.service.currency) }}
              </span>
            </p>
            <p v-else class="text-xs" :class="tone === 'dark' ? 'text-cream/60' : 'text-muted'">
              {{ item.category.name }}
            </p>
          </div>

          <button
            type="button"
            class="group/btn inline-flex min-h-[44px] items-center gap-3 self-start text-[0.7rem] font-medium uppercase tracking-[0.22em] transition-colors"
            :class="
              tone === 'dark'
                ? 'text-gold-soft hover:text-cream'
                : 'text-cocoa-dark hover:text-gold'
            "
            @click="book(item)"
          >
            <span class="link-line">Réserver cette coiffure</span>
            <AppIcon
              name="arrow-right"
              class="h-3.5 w-3.5 transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:translate-x-1.5"
            />
          </button>
        </figcaption>
      </figure>
    </li>
  </ul>
</template>
