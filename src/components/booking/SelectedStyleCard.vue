<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'
import AppImage from '@/components/ui/AppImage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { formatDuration, formatPrice } from '@/utils/format'

/**
 * Coiffure choisie depuis « Nos coiffures », affichée en tête de la page
 * Réservation.
 *
 * L'image est volontairement grande : la cliente doit reconnaître au premier
 * coup d'œil la réalisation qu'elle vient de choisir, et comprendre que la
 * sélection est déjà faite — il ne lui reste qu'à choisir sa date.
 *
 * Toutes les valeurs viennent de l'API (`GET /gallery`). La durée et le tarif
 * n'existent que lorsque la coiffure est rattachée à une prestation : dans le
 * cas contraire on ne les invente pas, on l'explique.
 */
defineProps({
  inspiration: { type: Object, required: true },
})
</script>

<template>
  <section
    class="card-surface overflow-hidden"
    aria-labelledby="coiffure-choisie"
  >
    <div class="flex flex-col sm:flex-row">
      <!-- Visuel : pleine largeur sur mobile, colonne à partir de « sm » -->
      <div class="w-full shrink-0 sm:w-56 lg:w-64">
        <AppImage
          :src="inspiration.imageUrl"
          :alt="`Coiffure « ${inspiration.title} » réalisée par Beauté Halal`"
          ratio="4/3"
          eager
          class="sm:hidden"
        />
        <AppImage
          :src="inspiration.imageUrl"
          :alt="`Coiffure « ${inspiration.title} » réalisée par Beauté Halal`"
          ratio="4/5"
          eager
          class="hidden h-full sm:block"
        />
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:p-6">
        <div class="flex flex-col gap-1.5">
          <span id="coiffure-choisie" class="eyebrow">Votre coiffure</span>
          <h2 class="text-[1.6rem] leading-snug sm:text-[1.8rem]">{{ inspiration.title }}</h2>
          <p v-if="inspiration.category" class="text-sm text-muted">
            {{ inspiration.category.name }}
          </p>
        </div>

        <p v-if="inspiration.description" class="text-sm leading-relaxed text-muted">
          {{ inspiration.description }}
        </p>

        <!-- Prestation associée : durée et tarif, quand ils existent -->
        <dl
          v-if="inspiration.service"
          class="flex flex-wrap gap-x-8 gap-y-3 border-t border-sand pt-4"
        >
          <div class="flex flex-col gap-0.5">
            <dt class="text-[0.68rem] uppercase tracking-[0.14em] text-muted">Prestation</dt>
            <dd class="flex items-center gap-1.5 text-sm text-cocoa-dark">
              <AppIcon name="sparkle" class="h-4 w-4 shrink-0 text-gold" />
              {{ inspiration.service.name }}
            </dd>
          </div>

          <div class="flex flex-col gap-0.5">
            <dt class="text-[0.68rem] uppercase tracking-[0.14em] text-muted">Durée</dt>
            <dd class="flex items-center gap-1.5 text-sm text-cocoa-dark">
              <AppIcon name="clock" class="h-4 w-4 shrink-0 text-gold" />
              {{ formatDuration(inspiration.service.durationMinutes) }}
            </dd>
          </div>

          <div class="flex flex-col gap-0.5">
            <dt class="text-[0.68rem] uppercase tracking-[0.14em] text-muted">Tarif indicatif</dt>
            <dd class="font-display text-lg text-cocoa-dark">
              {{ formatPrice(inspiration.service.price, inspiration.service.currency) }}
            </dd>
          </div>
        </dl>

        <p
          v-else
          class="flex items-start gap-2.5 rounded-xl bg-ivory p-3.5 text-sm leading-relaxed text-cocoa"
        >
          <AppIcon name="sparkle" class="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <span>
            Cette coiffure n’est pas encore rattachée à une prestation : choisissez celle qui s’en
            rapproche ci-dessous. Nous la réaliserons d’après cette photo.
          </span>
        </p>

        <!-- Action secondaire : le parcours principal reste la coiffure choisie. -->
        <div class="mt-auto pt-1">
          <BaseButton :to="{ name: 'gallery' }" variant="secondary" size="sm">
            <AppIcon name="arrow-left" class="h-4 w-4" />
            Changer de coiffure
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
