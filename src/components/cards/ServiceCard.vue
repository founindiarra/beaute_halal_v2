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
    un voile chocolat en bas.
  -->
  <article
    class="group relative isolate h-full cursor-pointer overflow-hidden rounded-2xl bg-cocoa-dark shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
    @click="book"
  >
    <AppImage
      :src="service.imageUrl"
      :alt="`${service.name} — Beauté Halal`"
      :ratio="ratio"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      class="transition-transform duration-700 group-hover:scale-[1.05]"
    />

    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-t from-cocoa-dark from-8% via-cocoa-dark/70 via-42% to-transparent to-72%"
      aria-hidden="true"
    />

    <span
      class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-cream/92 px-3 py-1.5 text-xs text-cocoa-dark backdrop-blur"
    >
      <AppIcon name="clock" class="h-3.5 w-3.5 text-gold" />
      {{ formatDuration(service.durationMinutes) }}
    </span>

    <div class="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 text-cream sm:p-6">
      <div class="flex flex-col gap-1.5">
        <h3 class="text-[1.45rem] leading-snug text-cream">{{ service.name }}</h3>
        <p class="font-display text-lg text-gold-soft">
          À partir de {{ formatPrice(service.price, service.currency) }}
        </p>
        <p class="line-clamp-2 text-sm leading-relaxed text-cream/80">{{ service.description }}</p>
      </div>

      <BaseButton size="sm" variant="outline-light" block>
        Réserver
        <AppIcon name="arrow-right" class="h-4 w-4" />
      </BaseButton>
    </div>
  </article>
</template>
