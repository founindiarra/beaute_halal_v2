<script setup>
import { computed } from 'vue'

import { useIsWide } from '@/composables/useBreakpoint'

import AppImage from './AppImage.vue'

/**
 * Bandeau d'en-tête commun aux pages intérieures.
 *
 * La photo occupe tout le bandeau ; les visuels de page (salle floutée, brun
 * de la marque, cliente détourée à droite) sont déjà composés pour cela. Le
 * texte se pose à gauche, sur le brun. Sur téléphone, le cadrage portrait
 * prend le haut et le texte descend en dessous.
 */
const props = defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: null },
  /** Cadrage portrait pour les écrans étroits. Sans valeur, la photo large sert aux deux. */
  imageMobile: { type: String, default: null },
  /** Conservé pour compatibilité avec les pages existantes. */
  pleinCadre: { type: Boolean, default: false },
  /** Partie de la photo à préserver (classe object-position Tailwind). */
  cadrage: { type: String, default: null },
})

const isLarge = useIsWide()

const source = computed(() =>
  !isLarge.value && props.imageMobile ? props.imageMobile : props.image,
)
const portrait = computed(() => source.value === props.imageMobile && Boolean(props.imageMobile))
</script>

<template>
  <section class="bg-espresso-deep grain relative isolate overflow-hidden">
    <!-- Photo plein cadre -->
    <div v-if="source" class="absolute inset-0 -z-10 fade-in">
      <div v-parallax="0.12" class="absolute -inset-y-[8%] inset-x-0">
        <AppImage
          :src="source"
          ratio="fill"
          alt=""
          eager
          decorative
          class="kenburns h-full w-full"
          :img-class="cadrage || (portrait ? 'object-[70%_6%]' : 'object-[78%_40%]')"
        />
      </div>
      <!-- Le texte reste lisible : le brun reprend le dessus à gauche et en bas -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-espresso from-10% via-espresso/70 via-45% to-transparent to-85%"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-espresso/85 via-transparent to-espresso/40" />
    </div>

    <div
      class="container-page flex flex-col justify-end gap-6 pb-14 pt-[8.5rem] sm:min-h-[26rem] sm:pb-16 sm:pt-40 lg:min-h-[30rem] lg:pb-20 lg:pt-44"
      :class="portrait ? 'min-h-[34rem]' : ''"
    >
      <nav aria-label="Fil d’Ariane" class="rise text-[0.68rem] uppercase tracking-[0.28em] text-cream/55">
        <RouterLink :to="{ name: 'home' }" class="transition-colors hover:text-gold-soft">
          Accueil
        </RouterLink>
        <span class="mx-3 text-gold-soft/60" aria-hidden="true">/</span>
        <span class="text-gold-soft">{{ eyebrow || title }}</span>
      </nav>

      <h1
        v-split="150"
        class="max-w-3xl text-[2.7rem] leading-[1] text-cream sm:text-6xl lg:text-[5.2rem]"
      >
        {{ title }}
      </h1>

      <span class="rule-gold rule-gold-light w-28 rise [--d:500ms]" aria-hidden="true" />

      <p
        v-if="description"
        class="rise max-w-xl text-base leading-relaxed text-cream/75 [--d:600ms] sm:text-[1.1rem]"
      >
        {{ description }}
      </p>

      <div class="rise [--d:700ms]">
        <slot />
      </div>
    </div>
  </section>
</template>
