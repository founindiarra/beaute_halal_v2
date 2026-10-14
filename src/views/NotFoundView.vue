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
  <section class="flex min-h-[70svh] items-center bg-cream">
    <div class="container-page flex flex-col items-center gap-8 py-20 text-center">
      <span class="font-display text-[5rem] leading-none text-gold sm:text-[7rem]">404</span>

      <div class="flex max-w-xl flex-col gap-4">
        <h1 class="text-[1.9rem] sm:text-4xl">Cette page n’existe pas</h1>
        <span class="mx-auto h-px w-16 rounded-full bg-gold/50" />
        <p class="text-muted">
          Le lien est peut-être erroné ou la page a été déplacée. Voici par où continuer.
        </p>
      </div>

      <ul class="flex flex-wrap justify-center gap-2.5">
        <li v-for="link in suggestions" :key="link.name">
          <RouterLink
            :to="{ name: link.name }"
            class="inline-flex min-h-[44px] items-center rounded-lg border border-sand-dark bg-white px-5 text-[0.9rem] tracking-[0.03em] text-cocoa transition-colors hover:border-cocoa-dark hover:text-cocoa-dark"
          >
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>

      <BaseButton :to="{ name: 'home' }" variant="primary" size="lg">
        <AppIcon name="arrow-left" class="h-4 w-4" />
        Retour à l’accueil
      </BaseButton>
    </div>
  </section>
</template>
