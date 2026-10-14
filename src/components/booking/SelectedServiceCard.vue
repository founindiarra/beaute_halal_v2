<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'
import AppImage from '@/components/ui/AppImage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { formatDuration, formatPrice } from '@/utils/format'

/**
 * Prestation choisie depuis « Nos services », affichée en tête de la page
 * Réservation — pendant exact de SelectedStyleCard pour le parcours galerie.
 *
 * La cliente qui vient de cliquer « Réserver » sur une carte doit retrouver
 * immédiatement ce qu'elle a choisi : même image, même nom, même tarif. Sans
 * ce rappel, elle atterrit sur un calendrier sans savoir si son clic a bien
 * été pris en compte.
 *
 * Toutes les valeurs viennent de l'API (`GET /services` ou `GET /services/:slug`).
 * Rien n'est inventé : les champs absents ne sont simplement pas affichés.
 */
defineProps({
  service: { type: Object, required: true },
})

defineEmits(['change'])
</script>

<template>
  <section class="card-surface overflow-hidden" aria-labelledby="prestation-choisie">
    <div class="flex flex-col sm:flex-row">
      <!-- Visuel : pleine largeur sur mobile, colonne à partir de « sm » -->
      <div v-if="service.imageUrl" class="w-full shrink-0 sm:w-56 lg:w-64">
        <AppImage
          :src="service.imageUrl"
          :alt="`${service.name} — Beauté Halal`"
          ratio="4/3"
          eager
          class="sm:hidden"
        />
        <AppImage
          :src="service.imageUrl"
          :alt="`${service.name} — Beauté Halal`"
          ratio="4/5"
          eager
          class="hidden h-full sm:block"
        />
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:p-6">
        <div class="flex flex-col gap-1.5">
          <span id="prestation-choisie" class="eyebrow">Votre prestation</span>
          <h2 class="text-[1.6rem] leading-snug sm:text-[1.8rem]">{{ service.name }}</h2>
          <p v-if="service.category" class="text-sm text-muted">
            {{ service.category.name }}
          </p>
        </div>

        <p v-if="service.description" class="text-sm leading-relaxed text-muted">
          {{ service.description }}
        </p>

        <dl class="flex flex-wrap gap-x-8 gap-y-3 border-t border-sand pt-4">
          <div class="flex flex-col gap-0.5">
            <dt class="text-[0.68rem] uppercase tracking-[0.14em] text-muted">Durée</dt>
            <dd class="flex items-center gap-1.5 text-sm text-cocoa-dark">
              <AppIcon name="clock" class="h-4 w-4 shrink-0 text-gold" />
              {{ formatDuration(service.durationMinutes) }}
            </dd>
          </div>

          <div class="flex flex-col gap-0.5">
            <dt class="text-[0.68rem] uppercase tracking-[0.14em] text-muted">Tarif indicatif</dt>
            <dd class="font-display text-lg text-cocoa-dark">
              {{ formatPrice(service.price, service.currency) }}
            </dd>
          </div>
        </dl>

        <!-- Action secondaire : le parcours principal reste la prestation choisie. -->
        <div class="mt-auto pt-1">
          <BaseButton variant="secondary" size="sm" @click="$emit('change')">
            <AppIcon name="arrow-left" class="h-4 w-4" />
            Changer de prestation
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
