<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'
import AppImage from '@/components/ui/AppImage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { images } from '@/data/images'

const highlights = [
  {
    title: 'Spécialistes des locks',
    text: 'Une seule spécialité, travaillée en profondeur : du premier départ à l’entretien régulier.',
  },
  {
    title: 'Un savoir-faire éprouvé',
    text: 'Des techniques maîtrisées et un geste régulier, pour des locks qui tiennent dans le temps.',
  },
  {
    title: 'La qualité des soins',
    text: 'Produits adaptés, diagnostic préalable et protocoles pensés pour préserver la fibre.',
  },
  {
    title: 'Une attention sincère',
    text: 'On prend le temps de vous écouter, de conseiller et d’expliquer chaque étape.',
  },
]
</script>

<template>
  <section class="section overflow-hidden bg-cream">
    <!-- Grand chiffre décoratif -->
    <span
      v-parallax="-0.08"
      class="outline-text pointer-events-none absolute -left-6 top-10 select-none font-display text-[16rem] font-light leading-none opacity-40 lg:text-[24rem]"
      aria-hidden="true"
    >
      01
    </span>

    <div class="container-page relative grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
      <!-- Visuels -->
      <div class="relative lg:col-span-5">
        <div class="arch-frame mx-auto max-w-md lg:mx-0">
          <div v-reveal:mask class="arch">
            <div v-parallax="0.06" class="-my-[6%]">
              <AppImage
                :src="images.salon1"
                alt="Intérieur du salon Beauté Halal"
                ratio="3/4.2"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>

        <div
          v-reveal:zoom="500"
          class="absolute -bottom-10 right-0 w-40 [filter:drop-shadow(0_26px_28px_rgba(58,33,19,0.32))] sm:right-[8%] sm:w-52 lg:-right-8 lg:w-56"
        >
          <div class="float overflow-hidden rounded-full border-[7px] border-cream">
            <AppImage :src="images.gesture2" alt="Entretien de locks au salon" ratio="1/1" />
          </div>
        </div>
      </div>

      <!-- Texte -->
      <div class="flex flex-col gap-12 lg:col-span-6 lg:col-start-7">
        <SectionHeading
          align="left"
          eyebrow="Le salon"
          title="Un lieu entièrement dédié aux locks"
          subtitle="Beauté Halal accompagne vos locks à chaque étape : les créer avec méthode, les entretenir avec régularité, les réparer avec patience et les sublimer avec goût. Chaque rendez-vous commence par un diagnostic et se termine par des conseils clairs."
        />

        <ul class="flex flex-col">
          <li
            v-for="(item, index) in highlights"
            :key="item.title"
            v-reveal="index * 90"
            class="group grid grid-cols-[3.2rem_1fr] gap-4 border-t border-sand-dark/70 py-6 transition-colors duration-500 last:border-b hover:border-gold sm:grid-cols-[4rem_1fr]"
          >
            <span
              class="font-display text-3xl italic text-gold transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-1.5 sm:text-4xl"
            >
              0{{ index + 1 }}
            </span>
            <div class="min-w-0">
              <h3 class="text-[1.5rem]">{{ item.title }}</h3>
              <p class="mt-1.5 text-sm leading-relaxed text-muted">{{ item.text }}</p>
            </div>
          </li>
        </ul>

        <div v-reveal>
          <BaseButton :to="{ name: 'about' }" variant="secondary" size="md">
            En savoir plus
            <AppIcon name="arrow-right" class="h-4 w-4" />
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
