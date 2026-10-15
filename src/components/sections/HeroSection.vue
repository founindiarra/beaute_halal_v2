<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'
import AppImage from '@/components/ui/AppImage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useIsWide } from '@/composables/useBreakpoint'
import { useSalon } from '@/composables/useSalon'
import { images } from '@/data/images'

const { salon } = useSalon()

/** Deux cadrages de la même photo : on ne charge que celui qui s'affiche. */
const isLarge = useIsWide()
</script>

<template>
  <!--
    Plein écran, sombre, cinématographique. La photo — déjà fondue dans le brun
    de la marque — occupe tout le cadre et glisse lentement au défilement ; le
    texte se pose à gauche, sur le brun.
  -->
  <section
    class="bg-espresso-deep grain relative isolate flex min-h-[100svh] flex-col overflow-hidden"
  >
    <!-- Photo -->
    <div class="fade-in absolute inset-0 -z-10 [--d:200ms]">
      <div
        v-parallax="0.16"
        class="absolute inset-x-0 -inset-y-[4%] [mask-image:linear-gradient(to_bottom,transparent_0,#000_14%,#000_86%,transparent_100%)] max-lg:bottom-auto max-lg:top-0 max-lg:h-[62svh] max-lg:[mask-image:linear-gradient(to_bottom,#000_55%,transparent_100%)] lg:top-[8%] lg:bottom-[6%]"
      >
        <AppImage
          v-if="isLarge"
          :src="images.hero"
          alt="Cliente aux locks, vêtue d’une chemise à carreaux, au salon Beauté Halal"
          ratio="fill"
          eager
          class="kenburns h-full w-full"
          img-class="object-[80%_center]"
        />
        <AppImage
          v-else
          :src="images.heroMobile"
          alt="Cliente aux locks, vêtue d’une chemise à carreaux, au salon Beauté Halal"
          ratio="fill"
          eager
          class="kenburns h-full w-full"
          img-class="object-[72%_0%]"
        />
      </div>

      <!-- Voiles : le brun reprend le dessus à gauche (texte) et en bas (transition) -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-espresso/90 from-5% via-espresso/45 via-40% to-transparent to-75% max-lg:hidden"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-espresso from-4% via-espresso/65 via-38% to-transparent to-62% lg:from-espresso/80 lg:via-transparent lg:to-espresso/35"
      />
    </div>

    <!-- Halo de lumière derrière le sujet -->
    <span
      class="halo float -z-10 hidden h-[44rem] w-[44rem] opacity-60 lg:block"
      style="right: -4rem; top: 4rem"
      aria-hidden="true"
    />

    <div
      class="container-page flex flex-1 items-end pb-24 pt-[46svh] sm:pb-32 sm:pt-32 lg:items-center lg:pb-24 lg:pt-36"
    >
      <div class="flex max-w-2xl flex-col gap-6 sm:gap-7">
        <span
          class="rise eyebrow !text-gold-soft [--d:200ms]"
        >
          L’art des locks
        </span>

        <h1
          v-split="250"
          class="text-[3.1rem] leading-[0.95] tracking-[-0.025em] text-cream sm:text-7xl lg:text-[5.8rem] xl:text-[6.6rem]"
        >
          Vos locks, <em class="font-normal italic text-gold-soft">notre signature.</em>
        </h1>

        <p
          class="rise max-w-md text-[1.02rem] leading-relaxed text-cream/75 [--d:700ms] sm:max-w-lg sm:text-[1.12rem]"
        >
          Création, entretien et mise en beauté des locks : un savoir-faire attentif, pensé pour
          révéler votre style et prendre soin de vos cheveux.
        </p>

        <div class="rise mt-2 flex flex-col gap-3.5 [--d:850ms] sm:flex-row sm:items-center">
          <BaseButton :to="{ name: 'booking' }" variant="gold" size="lg" magnetic>
            Prendre rendez-vous
            <AppIcon name="arrow-right" class="h-4 w-4" />
          </BaseButton>
          <BaseButton :to="{ name: 'services' }" variant="outline-light" size="lg">
            Découvrir nos services
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Médaillon rotatif (grand écran) -->
    <RouterLink
      :to="{ name: 'booking' }"
      class="rise group absolute bottom-24 right-[7%] z-10 hidden h-36 w-36 place-items-center rounded-full [--d:1100ms] lg:grid"
      aria-label="Prendre rendez-vous"
    >
      <svg viewBox="0 0 120 120" class="spin-slow absolute inset-0 h-full w-full text-gold-soft" aria-hidden="true">
        <defs>
          <path id="ring" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text fill="currentColor" font-size="9" font-family="Jost, sans-serif">
          <textPath href="#ring" textLength="282" lengthAdjust="spacing">CRÉATION · ENTRETIEN · SOINS · COLORATION ·</textPath>
        </text>
      </svg>
      <span
        class="grid h-16 w-16 place-items-center rounded-full bg-gold-soft text-ink transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-110"
      >
        <AppIcon name="arrow-right" class="h-5 w-5 -rotate-45 transition-transform duration-500 group-hover:rotate-0" />
      </span>
    </RouterLink>

    <!-- Pied du hero : indication de défilement + adresse -->
    <div class="container-page relative z-10 pb-7">
      <div class="flex items-end justify-between gap-6 text-[0.64rem] uppercase tracking-[0.3em] text-cream/60">
        <a href="#salon" class="rise group flex items-center gap-4 [--d:1300ms]" aria-label="Faire défiler vers le salon">
          <span class="relative block h-14 w-px overflow-hidden bg-cream/20 scroll-cue" aria-hidden="true" />
          <span class="transition-colors group-hover:text-gold-soft">Défiler</span>
        </a>

        <p v-if="salon.address.city" class="rise hidden text-right [--d:1300ms] sm:block">
          {{ salon.name }} <span class="mx-2 text-gold-soft">·</span> {{ salon.address.city }}
        </p>
      </div>
    </div>
  </section>
</template>
