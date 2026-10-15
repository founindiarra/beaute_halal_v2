<script setup>
import { useRouter } from 'vue-router'

import AppIcon from '@/components/ui/AppIcon.vue'
import AppImage from '@/components/ui/AppImage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { preselectService } from '@/composables/useBooking'
import { formatDuration, formatPrice } from '@/utils/format'

const props = defineProps({
  service: { type: Object, required: true },
  ratio: { type: String, default: '3/4' },
  /** Numéro d'ordre affiché en filigrane (facultatif). */
  index: { type: Number, default: null },
})

const router = useRouter()

/**
 * Le repère de la prestation voyage dans l'adresse, comme l'identifiant de
 * coiffure du parcours « Nos coiffures » : la page Réservation le relit pour
 * réafficher la prestation choisie, et la sélection survit à un
 * rafraîchissement ou au partage du lien.
 */
const book = () => {
  preselectService(props.service)
  router.push({ name: 'booking', query: { prestation: props.service.slug } })
}
</script>

<template>
  <!--
    Toute la carte mène à la réservation. Le bouton reste le seul élément
    focalisable : son clic remonte jusqu'ici, donc il n'a pas de gestionnaire
    propre et la carte n'a pas besoin d'être atteignable au clavier — elle ne
    fait que dupliquer une action déjà accessible.

    Carte « affiche » : la photo occupe toute la carte, le texte se pose sur
    un voile brun en bas ; au survol la photo respire et un filet doré se trace.
  -->
  <article
    v-tilt="3.5"
    data-cursor="view"
    data-cursor-label="Réserver"
    class="group relative isolate h-full cursor-pointer overflow-hidden rounded-xl bg-espresso shadow-[var(--shadow-soft)] transition-shadow duration-700 hover:shadow-[var(--shadow-lift)]"
    @click="book"
  >
    <AppImage
      :src="service.imageUrl"
      :alt="`${service.name} — Beauté Halal`"
      :ratio="ratio"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      class="transition-transform duration-[1600ms] ease-[var(--ease-expo)] group-hover:scale-[1.07]"
    />

    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso from-6% via-espresso/65 via-44% to-transparent to-75%"
      aria-hidden="true"
    />

    <!-- Numéro en filigrane -->
    <span
      v-if="index !== null"
      class="pointer-events-none absolute right-5 top-3 font-display text-6xl font-light italic text-cream/25 transition-colors duration-700 group-hover:text-gold-soft/70"
      aria-hidden="true"
    >
      {{ String(index + 1).padStart(2, '0') }}
    </span>

    <span
      class="glass-dark absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.7rem] tracking-[0.12em] text-cream"
    >
      <AppIcon name="clock" class="h-3.5 w-3.5 text-gold-soft" />
      {{ formatDuration(service.durationMinutes) }}
    </span>

    <div class="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 text-cream sm:p-7">
      <div class="flex flex-col gap-2">
        <h3 class="text-[1.7rem] leading-[1.05] text-cream sm:text-[1.9rem]">{{ service.name }}</h3>
        <p class="font-display text-xl italic text-gold-soft">
          À partir de {{ formatPrice(service.price, service.currency) }}
        </p>
        <p class="line-clamp-2 text-sm leading-relaxed text-cream/70">{{ service.description }}</p>
      </div>

      <BaseButton size="sm" variant="outline-light" class="self-start">
        Réserver
        <AppIcon name="arrow-right" class="h-4 w-4" />
      </BaseButton>
    </div>

    <span
      class="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold via-gold-soft to-gold transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover:scale-x-100"
      aria-hidden="true"
    />
  </article>
</template>
