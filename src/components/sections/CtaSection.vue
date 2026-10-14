<script setup>
import AppImage from '@/components/ui/AppImage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import WhatsappButton from '@/components/ui/WhatsappButton.vue'
import { useIsWide } from '@/composables/useBreakpoint'
import { images } from '@/data/images'

/** Deux cadrages, un seul chargé : le large met la coiffure à droite du texte,
 *  le portrait la place au-dessus, puisque le texte y prend toute la largeur. */
const isLarge = useIsWide()

defineProps({
  title: {
    type: String,
    default: 'Prenez rendez-vous et offrez à vos locks le soin qu’elles méritent.',
  },
  text: {
    type: String,
    default:
      'Réservez en quelques minutes : choisissez votre prestation, votre date et votre créneau. Nous vous recontactons pour confirmer.',
  },
})
</script>

<template>
  <!--
    Le bloc se détache de la page : marges sur les côtés, respiration avant le
    pied de page, angles adoucis. Il ne barre plus l'écran d'un bord à l'autre.
  -->
  <section
    class="relative isolate mx-4 mt-6 mb-8 overflow-hidden rounded-xl bg-cocoa-dark sm:mx-6 sm:mt-8 sm:mb-10 lg:mx-10 lg:mb-14"
  >
    <div class="absolute inset-0 -z-10">
      <AppImage
        v-if="isLarge"
        :src="images.cta"
        alt=""
        ratio="13/5"
        decorative
        class="h-full w-full"
        img-class="object-[50%_45%]"
      />
      <AppImage
        v-else
        :src="images.ctaMobile"
        alt=""
        ratio="3/5"
        decorative
        class="h-full w-full"
        img-class="object-[50%_2%]"
      />
      <!--
        Voile réduit : on doit voir la coiffure. Il reste plus marqué sur
        téléphone, où le texte passe devant la photo au lieu d'être à côté.
      -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-cocoa-dark from-38% via-cocoa-dark/55 via-58% to-transparent to-80% sm:bg-gradient-to-l sm:from-cocoa-dark/35 sm:from-14% sm:via-cocoa-dark/60 sm:via-42% sm:to-cocoa-dark/72"
      />
    </div>

    <div class="pointer-events-none absolute inset-3 border border-gold-soft/45 sm:inset-4" aria-hidden="true" />

    <div class="container-page pt-[13.5rem] pb-8 sm:pt-12 sm:pb-12 lg:pt-14 lg:pb-14">
      <div
        v-reveal
        class="texte-sur-photo mx-auto flex max-w-3xl flex-col items-center gap-3.5 text-center sm:gap-4"
      >
        <span class="eyebrow text-gold-soft">Rendez-vous</span>

        <h2 class="text-[1.9rem] leading-tight text-cream sm:text-4xl lg:text-[2.85rem]">
          {{ title }}
        </h2>

        <p class="max-w-xl text-[1.02rem] leading-relaxed text-cream/75">{{ text }}</p>

        <div class="mt-1 flex w-full flex-col items-center gap-2.5 sm:w-auto sm:flex-row">
          <BaseButton :to="{ name: 'booking' }" variant="light" size="lg" class="w-full sm:w-auto">
            Prendre rendez-vous
          </BaseButton>
          <WhatsappButton label="Nous écrire" variant="outline-light" size="lg" />
        </div>
      </div>
    </div>
  </section>
</template>
