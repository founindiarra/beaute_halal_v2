<script setup>
import AppLogo from '@/components/ui/AppLogo.vue'

/** Bandeau défilant des savoir-faire — purement décoratif, masqué aux lecteurs d'écran. */
const words = ['Création', 'Entretien', 'Réparation', 'Coloration', 'Coiffure', 'Soins']
const loop = [...words, ...words]
</script>

<template>
  <div
    id="salon"
    class="relative overflow-hidden border-y border-gold-soft/25 bg-espresso py-5 text-cream sm:py-7"
    aria-hidden="true"
  >
    <div class="marquee">
      <div class="marquee__track">
        <div v-for="copy in 2" :key="copy" class="flex shrink-0 items-center">
          <span
            v-for="(word, index) in loop"
            :key="`${copy}-${index}`"
            class="flex items-center gap-8 pr-8 font-display text-4xl italic text-cream/90 sm:gap-12 sm:pr-12 sm:text-6xl"
          >
            <span :class="index % 2 ? 'outline-text not-italic' : ''">{{ word }}</span>
            <AppLogo class="h-6 w-auto text-gold-soft sm:h-8" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
