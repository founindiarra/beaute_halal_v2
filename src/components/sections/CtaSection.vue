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
    Le bloc se détache de la page : marges sur les côtés, angles généreux. La
    photo — déjà fondue dans le brun — glisse doucement derrière le texte.
  -->
  <section class="bg-cream px-4 pb-10 pt-6 sm:px-6 sm:pb-12 sm:pt-10 lg:px-10 lg:pb-16 lg:pt-14">
    <div
      v-reveal:zoom
      class="bg-espresso-deep grain relative isolate mx-auto max-w-[96rem] overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem]"
    >
      <div class="absolute inset-0 -z-10">
        <div v-parallax="0.12" class="absolute -inset-y-[10%] inset-x-0">
          <AppImage
            v-if="isLarge"
            :src="images.cta"
            alt=""
            ratio="fill"
            decorative
            class="h-full w-full"
            img-class="object-[88%_30%]"
          />
          <AppImage
            v-else
            :src="images.ctaMobile"
            alt=""
            ratio="fill"
            decorative
            class="h-full w-full"
            img-class="object-[50%_2%]"
          />
        </div>
        <div
          class="absolute inset-0 bg-gradient-to-t from-espresso from-34% via-espresso/55 via-58% to-transparent to-82% sm:bg-gradient-to-r sm:from-espresso/92 sm:from-8% sm:via-espresso/55 sm:via-48% sm:to-transparent sm:to-80%"
        />
      </div>

      <!-- Filet doré intérieur -->
      <div
        class="pointer-events-none absolute inset-3 rounded-[1.2rem] border border-gold-soft/35 sm:inset-5 sm:rounded-[1.7rem]"
        aria-hidden="true"
      />

      <div class="container-page relative pb-12 pt-[17rem] sm:pb-20 sm:pt-24 lg:pb-28 lg:pt-32">
        <div class="flex max-w-2xl flex-col gap-6">
          <span v-reveal:fade class="eyebrow !text-gold-soft">Rendez-vous</span>

          <h2 v-split class="text-[2.2rem] leading-[1.02] text-cream sm:text-5xl lg:text-[4.2rem]">
            {{ title }}
          </h2>

          <p v-reveal="200" class="max-w-xl text-[1.02rem] leading-relaxed text-cream/75 sm:text-lg">
            {{ text }}
          </p>

          <div v-reveal="350" class="mt-2 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <BaseButton :to="{ name: 'booking' }" variant="gold" size="lg" magnetic class="w-full sm:w-auto">
              Prendre rendez-vous
            </BaseButton>
            <WhatsappButton label="Nous écrire" variant="outline-light" size="lg" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
