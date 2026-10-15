<script setup>
import CtaSection from '@/components/sections/CtaSection.vue'
import ProcessSection from '@/components/sections/ProcessSection.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppImage from '@/components/ui/AppImage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import PageHero from '@/components/ui/PageHero.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { images } from '@/data/images'
import { values } from '@/data/salon'
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
    <section class="section overflow-hidden bg-cream">
      <div class="container-page grid items-center gap-16 lg:grid-cols-12 lg:gap-14">
        <div class="order-2 flex flex-col gap-8 lg:order-1 lg:col-span-6">
          <SectionHeading
            align="left"
            eyebrow="Notre histoire"
            title="D’une passion à un salon entièrement dédié aux locks"
          />

          <div v-reveal class="flex flex-col gap-5 text-[1.05rem] leading-relaxed text-muted">
            <p class="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-[4.4rem] first-letter:leading-[0.8] first-letter:text-gold">
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

          <div v-reveal="150" class="flex flex-wrap gap-3 pt-2">
            <BaseButton :to="{ name: 'services' }" variant="secondary" size="md">
              Découvrir nos services
              <AppIcon name="arrow-right" class="h-4 w-4" />
            </BaseButton>
            <BaseButton :to="{ name: 'booking' }" variant="primary" size="md">
              Prendre rendez-vous
            </BaseButton>
          </div>
        </div>

        <!-- Collage -->
        <div class="order-1 grid grid-cols-2 items-start gap-4 lg:order-2 lg:col-span-6 lg:gap-6">
          <div v-reveal:mask class="arch">
            <AppImage :src="images.salon3" alt="Espace d’accueil du salon" ratio="3/4" />
          </div>
          <div v-reveal:mask="150" class="mt-12 overflow-hidden rounded-lg">
            <AppImage :src="images.gesture1" alt="Entretien de locks" ratio="3/4" />
          </div>
          <div v-reveal:mask="250" class="overflow-hidden rounded-lg">
            <AppImage :src="images.locks9" alt="Locks colorées" ratio="1/1" />
          </div>
          <div v-reveal:mask="350" class="-mt-6 overflow-hidden rounded-lg">
            <AppImage :src="images.salon4" alt="Poste de coiffage du salon" ratio="1/1" />
          </div>
        </div>
      </div>
    </section>

    <!-- Valeurs -->
    <section class="bg-espresso-deep grain section relative overflow-hidden">
      <div class="container-page relative z-10 flex flex-col gap-16">
        <SectionHeading
          align="center"
          tone="light"
          eyebrow="Nos valeurs"
          title="Ce qui guide chaque rendez-vous"
          subtitle="Quatre principes simples, appliqués de la première prise de contact au dernier conseil d’entretien."
        />

        <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <li
            v-for="(value, index) in values"
            :key="value.title"
            v-reveal="index * 100"
            class="glass-dark group relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-7 transition-all duration-700 ease-[var(--ease-expo)] hover:-translate-y-2 hover:border-gold-soft/60"
          >
            <span
              class="font-display text-6xl font-light italic leading-none text-gold-soft/30 transition-colors duration-700 group-hover:text-gold-soft"
            >
              0{{ index + 1 }}
            </span>
            <h3 class="text-[1.65rem] text-cream">{{ value.title }}</h3>
            <p class="text-sm leading-relaxed text-cream/70">{{ value.text }}</p>
            <span
              class="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gold-soft transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover:scale-x-100"
              aria-hidden="true"
            />
          </li>
        </ul>
      </div>
    </section>

    <!-- Approche -->
    <ProcessSection />

    <CtaSection />
  </div>
</template>
