<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const suggestions = [
  { name: 'services', label: 'Nos services' },
  { name: 'gallery', label: 'Nos coiffures' },
  { name: 'booking', label: 'Prendre rendez-vous' },
  { name: 'contact', label: 'Contact' },
]
</script>

<template>
  <section class="bg-espresso-deep grain relative flex min-h-[100svh] items-center overflow-hidden">
    <span
      class="outline-text float pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[22rem] font-light italic leading-none opacity-60 sm:text-[34rem]"
      aria-hidden="true"
    >
      404
    </span>

    <div class="container-page relative z-10 flex flex-col items-center gap-9 py-32 text-center">
      <div class="flex max-w-xl flex-col items-center gap-5">
        <span class="rise eyebrow eyebrow--center !text-gold-soft">Erreur 404</span>
        <h1 v-split="150" class="text-[2.6rem] leading-[1] text-cream sm:text-6xl">
          Cette page n’existe pas
        </h1>
        <span class="rule-gold rule-gold-light rise w-20 [--d:500ms]" />
        <p class="rise text-cream/70 [--d:600ms]">
          Le lien est peut-être erroné ou la page a été déplacée. Voici par où continuer.
        </p>
      </div>

      <ul class="rise flex flex-wrap justify-center gap-2.5 [--d:750ms]">
        <li v-for="link in suggestions" :key="link.name">
          <RouterLink
            :to="{ name: link.name }"
            class="inline-flex min-h-[44px] items-center rounded-full border border-cream/30 px-6 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-cream transition-all duration-500 ease-[var(--ease-expo)] hover:-translate-y-0.5 hover:border-gold-soft hover:bg-gold-soft hover:text-ink"
          >
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>

      <div class="rise [--d:900ms]">
        <BaseButton :to="{ name: 'home' }" variant="gold" size="lg" magnetic>
          <AppIcon name="arrow-left" class="h-4 w-4" />
          Retour à l’accueil
        </BaseButton>
      </div>
    </div>
  </section>
</template>
