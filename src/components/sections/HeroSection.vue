<script setup>
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
    Composition éditoriale : le texte posé sur l'ivoire, la photographie dans
    une arche à droite. Le haut de la page reste calme, c'est la photo qui
    porte la marque. « pt » doit rester supérieur à la hauteur de l'en-tête
    fixe (≈ 68 px sur mobile, 86 px à partir de « lg »).
  -->
  <section class="relative overflow-hidden border-b border-sand-dark/50 bg-ivory">
    <div
      class="container-page grid items-end gap-10 pt-[5.5rem] sm:pt-24 lg:min-h-[min(35rem,calc(100svh-1px))] lg:grid-cols-[1.12fr_0.88fr] lg:gap-14 lg:pt-28 xl:gap-24"
    >
      <div class="flex max-w-xl flex-col gap-5 pb-2 lg:self-center lg:pb-12">
        <span class="hero-rise flex items-center gap-4 text-[0.72rem] font-medium uppercase tracking-[0.3em] text-cocoa">
          <span class="h-px w-10 bg-gold" aria-hidden="true" />
          L’art des locks
        </span>

        <h1
          class="hero-rise text-[2.6rem] leading-[0.98] tracking-[-0.015em] text-cocoa-dark [animation-delay:90ms] sm:text-5xl lg:text-[3.9rem] xl:text-[4.3rem]"
        >
          Vos locks, notre signature.
        </h1>

        <p class="hero-rise max-w-md text-[1.05rem] leading-relaxed text-muted [animation-delay:180ms] sm:text-lg">
          Création, entretien et mise en beauté des locks : un savoir-faire attentif, pensé pour
          révéler votre style et prendre soin de vos cheveux.
        </p>

        <div class="hero-rise mt-2 hidden w-full max-w-sm flex-col gap-3.5 [animation-delay:270ms] lg:flex">
          <BaseButton :to="{ name: 'booking' }" variant="primary" size="lg" block class="font-semibold">
            Prendre rendez-vous
          </BaseButton>
          <BaseButton :to="{ name: 'services' }" variant="secondary" size="lg" block>
            Découvrir nos services
          </BaseButton>
        </div>
      </div>

      <div class="hero-fade arch-frame mx-auto w-full max-w-[19rem] sm:max-w-[22rem] lg:mb-0 lg:max-w-[23rem] lg:justify-self-end">
        <div class="arch">
          <AppImage
            v-if="isLarge"
            :src="images.hero"
            alt="Cliente aux locks, vêtue d’une chemise à carreaux, au salon Beauté Halal"
            ratio="4/4.4"
            eager
            class="h-full w-full"
            img-class="object-[76%_30%]"
          />
          <AppImage
            v-else
            :src="images.heroMobile"
            alt="Cliente aux locks, vêtue d’une chemise à carreaux, au salon Beauté Halal"
            ratio="1/1"
            eager
            class="h-full w-full"
            img-class="object-[70%_6%]"
          />
          <p
            v-if="salon.address.city"
            class="absolute inset-x-0 bottom-0 bg-ivory/95 px-5 py-3 font-display text-[1.05rem] italic text-cocoa-dark"
          >
            {{ salon.name }} · {{ salon.address.city }}
          </p>
        </div>
      </div>

      <!-- Mobile et tablette : les boutons passent sous l'arche -->
      <div class="hero-rise mx-auto -mt-4 mb-10 flex w-full max-w-[19rem] sm:max-w-[22rem] flex-col gap-3.5 [animation-delay:270ms] lg:hidden">
        <BaseButton :to="{ name: 'booking' }" variant="primary" size="lg" block class="font-semibold">
          Prendre rendez-vous
        </BaseButton>
        <BaseButton :to="{ name: 'services' }" variant="secondary" size="lg" block>
          Découvrir nos services
        </BaseButton>
      </div>
    </div>
  </section>
</template>
