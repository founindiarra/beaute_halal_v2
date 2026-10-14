<script setup>
import CtaSection from '@/components/sections/CtaSection.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppImage from '@/components/ui/AppImage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import PageHero from '@/components/ui/PageHero.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { images } from '@/data/images'
import { values } from '@/data/salon'

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
  <div>
    <PageHero
      :image="images.heroAPropos"
      cadrage="object-[62%_22%]"
      eyebrow="À propos"
      title="L’histoire de Beauté Halal"
      description="Un salon né d’une conviction : les locks méritent un savoir-faire à part entière, patient et respectueux du cheveu."
    />

    <!-- Histoire -->
    <section class="section bg-cream">
      <div class="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div v-reveal class="order-2 flex flex-col gap-6 lg:order-1">
          <SectionHeading
            align="left"
            eyebrow="Notre histoire"
            title="D’une passion à un salon entièrement dédié aux locks"
          />

          <div class="flex flex-col gap-4 text-[1.02rem] leading-relaxed text-muted">
            <p>
              Beauté Halal est né d’un constat simple : beaucoup de femmes aiment leurs locks mais
              peinent à trouver un lieu qui les comprenne vraiment. Trop de tension, des racines
              irrégulières, des longueurs fragilisées — souvent faute de temps accordé au cheveu.
            </p>
            <p>
              Le salon s’est construit autour de l’idée inverse : faire moins de prestations, mais
              les faire bien. Un rendez-vous, une cliente, un temps suffisant pour observer, conseiller
              et travailler proprement.
            </p>
            <p>
              Aujourd’hui, l’équipe accompagne aussi bien les premières créations que les
              reconstructions délicates, avec la même exigence de régularité et de soin.
            </p>
          </div>

          <div class="flex flex-wrap gap-3 pt-2">
            <BaseButton :to="{ name: 'services' }" variant="secondary" size="md">
              Découvrir nos services
              <AppIcon name="arrow-right" class="h-4 w-4" />
            </BaseButton>
            <BaseButton :to="{ name: 'booking' }" variant="primary" size="md">
              Prendre rendez-vous
            </BaseButton>
          </div>
        </div>

        <div v-reveal="120" class="order-1 grid grid-cols-2 gap-4 lg:order-2">
          <div class="overflow-hidden rounded-xl">
            <AppImage :src="images.salon3" alt="Espace d’accueil du salon" ratio="3/4" />
          </div>
          <div class="mt-8 overflow-hidden rounded-xl">
            <AppImage :src="images.gesture1" alt="Entretien de locks" ratio="3/4" />
          </div>
          <div class="overflow-hidden rounded-xl">
            <AppImage :src="images.locks9" alt="Locks colorées" ratio="1/1" />
          </div>
          <div class="-mt-4 overflow-hidden rounded-xl">
            <AppImage :src="images.salon4" alt="Poste de coiffage du salon" ratio="1/1" />
          </div>
        </div>
      </div>
    </section>

    <!-- Valeurs -->
    <section class="section bg-ivory">
      <div class="container-page flex flex-col gap-12">
        <SectionHeading
          eyebrow="Nos valeurs"
          title="Ce qui guide chaque rendez-vous"
          subtitle="Quatre principes simples, appliqués de la première prise de contact au dernier conseil d’entretien."
        />

        <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <li
            v-for="(value, index) in values"
            :key="value.title"
            v-reveal="index * 60"
            class="card-surface flex h-full flex-col gap-3 p-6"
          >
            <span class="grid h-11 w-11 place-items-center rounded-full bg-ivory text-gold">
              <AppIcon name="sparkle" class="h-5 w-5" />
            </span>
            <h3 class="text-xl">{{ value.title }}</h3>
            <p class="text-sm leading-relaxed text-muted">{{ value.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Approche -->
    <section class="section bg-cream">
      <div class="container-page flex flex-col gap-12">
        <SectionHeading
          eyebrow="Notre approche"
          title="Le déroulé d’un rendez-vous"
          subtitle="Un cadre clair, du premier regard sur vos locks jusqu’aux conseils que vous emportez."
        />

        <ol class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <li
            v-for="(step, index) in steps"
            :key="step.title"
            v-reveal="index * 60"
            class="flex flex-col gap-3 border-t border-sand-dark pt-5"
          >
            <span class="font-display text-3xl text-gold">0{{ index + 1 }}</span>
            <h3 class="text-xl">{{ step.title }}</h3>
            <p class="text-sm leading-relaxed text-muted">{{ step.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <CtaSection />
  </div>
</template>
