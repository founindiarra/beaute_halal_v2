<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'
import AppImage from '@/components/ui/AppImage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { images } from '@/data/images'

const highlights = [
  {
    icon: 'sparkle',
    title: 'Spécialistes des locks',
    text: 'Une seule spécialité, travaillée en profondeur : du premier départ à l’entretien régulier.',
  },
  {
    icon: 'shield',
    title: 'Un savoir-faire éprouvé',
    text: 'Des techniques maîtrisées et un geste régulier, pour des locks qui tiennent dans le temps.',
  },
  {
    icon: 'leaf',
    title: 'La qualité des soins',
    text: 'Produits adaptés, diagnostic préalable et protocoles pensés pour préserver la fibre.',
  },
  {
    icon: 'heart',
    title: 'Une attention sincère',
    text: 'On prend le temps de vous écouter, de conseiller et d’expliquer chaque étape.',
  },
]
</script>

<template>
  <section class="section bg-cream">
    <div class="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <!-- Visuels -->
      <div v-reveal class="relative">
        <div class="overflow-hidden rounded-xl">
          <AppImage
            :src="images.salon1"
            alt="Intérieur du salon Beauté Halal"
            ratio="4/5"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div
          class="absolute -bottom-6 -right-2 hidden w-44 overflow-hidden rounded-xl border-4 border-cream shadow-[var(--shadow-lift)] sm:block lg:w-56"
        >
          <AppImage :src="images.gesture2" alt="Entretien de locks au salon" ratio="1/1" />
        </div>
      </div>

      <!-- Texte -->
      <div v-reveal="120" class="flex flex-col gap-8">
        <SectionHeading
          align="left"
          eyebrow="Le salon"
          title="Un lieu entièrement dédié aux locks"
          subtitle="Beauté Halal accompagne vos locks à chaque étape : les créer avec méthode, les entretenir avec régularité, les réparer avec patience et les sublimer avec goût. Chaque rendez-vous commence par un diagnostic et se termine par des conseils clairs."
        />

        <ul class="grid gap-5 sm:grid-cols-2">
          <li v-for="item in highlights" :key="item.title" class="flex gap-4">
            <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ivory text-gold">
              <AppIcon :name="item.icon" class="h-5 w-5" />
            </span>
            <div class="min-w-0">
              <h3 class="text-lg">{{ item.title }}</h3>
              <p class="mt-1 text-sm leading-relaxed text-muted">{{ item.text }}</p>
            </div>
          </li>
        </ul>

        <div>
          <BaseButton :to="{ name: 'about' }" variant="secondary" size="md">
            En savoir plus
            <AppIcon name="arrow-right" class="h-4 w-4" />
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
