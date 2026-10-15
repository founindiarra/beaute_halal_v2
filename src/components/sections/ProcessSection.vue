<script setup>
import SectionHeading from '@/components/ui/SectionHeading.vue'

/** Le déroulé d'un rendez-vous — partagé entre l'accueil et la page À propos. */
const steps = [
  {
    title: 'Le diagnostic',
    text: 'Nous observons la texture, la densité, l’état des racines et du cuir chevelu avant toute prestation.',
  },
  {
    title: 'Le conseil',
    text: 'Nous expliquons les options possibles, leurs durées et leurs limites, puis nous choisissons ensemble.',
  },
  {
    title: 'La réalisation',
    text: 'Le geste est précis et régulier, avec des pauses et une tension adaptée à votre cuir chevelu.',
  },
  {
    title: 'Le suivi',
    text: 'Vous repartez avec une routine simple et la fréquence d’entretien adaptée à vos locks.',
  },
]
</script>

<template>
  <section class="section bg-cream">
    <div class="container-page flex flex-col gap-16 lg:gap-20">
      <SectionHeading
        eyebrow="Notre approche"
        title="Le déroulé d’un rendez-vous"
        subtitle="Un cadre clair, du premier regard sur vos locks jusqu’aux conseils que vous emportez."
        align="center"
      />

      <ol class="relative grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <!-- Fil doré qui relie les étapes -->
        <span
          v-reveal:line="300"
          class="rule-gold absolute left-0 right-0 top-[2.3rem] hidden lg:block"
          aria-hidden="true"
        />

        <li
          v-for="(step, index) in steps"
          :key="step.title"
          v-reveal="index * 120"
          class="group relative flex flex-col gap-4 lg:pr-6"
        >
          <span
            class="relative z-10 grid h-[4.6rem] w-[4.6rem] place-items-center rounded-full border border-gold/60 bg-cream font-display text-3xl italic text-gold transition-all duration-700 ease-[var(--ease-expo)] group-hover:scale-105 group-hover:border-gold group-hover:bg-espresso group-hover:text-gold-soft"
          >
            0{{ index + 1 }}
          </span>
          <h3 class="mt-2 text-[1.7rem]">{{ step.title }}</h3>
          <p class="text-sm leading-relaxed text-muted">{{ step.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
