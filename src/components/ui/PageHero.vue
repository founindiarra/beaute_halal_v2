<script setup>
import { computed } from 'vue'

import { useIsWide } from '@/composables/useBreakpoint'

import AppImage from './AppImage.vue'

/**
 * Bandeau d'en-tête commun aux pages intérieures.
 *
 * Même parti pris que l'accueil : texte sur l'ivoire, photographie dans une
 * arche. Chaque page fournit sa propre photo (le fond flouté, le marron et la
 * photo nette sont déjà fondus dans le fichier).
 */
const props = defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: null },
  /** Cadrage portrait pour les écrans étroits. Sans valeur, la photo large sert aux deux. */
  imageMobile: { type: String, default: null },
  /** Conservé pour compatibilité : le cadrage en arche est le même pour toutes les photos. */
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
  <section class="relative overflow-hidden border-b border-sand-dark/50 bg-ivory">
    <div
      class="container-page grid items-end gap-8 pt-[6.25rem] sm:pt-28 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16 lg:pt-32"
    >
      <div class="flex max-w-2xl flex-col gap-5 pb-2 lg:pb-16">
        <span
          v-if="eyebrow"
          class="hero-rise flex items-center gap-4 text-[0.72rem] font-medium uppercase tracking-[0.3em] text-cocoa"
        >
          <span class="h-px w-10 bg-gold" aria-hidden="true" />
          {{ eyebrow }}
        </span>
        <h1
          class="hero-rise text-[2.3rem] leading-[1.02] tracking-[-0.01em] text-cocoa-dark [animation-delay:80ms] sm:text-5xl lg:text-[3.6rem]"
        >
          {{ title }}
        </h1>
        <p
          v-if="description"
          class="hero-rise max-w-xl text-base leading-relaxed text-muted [animation-delay:160ms] sm:text-[1.05rem]"
        >
          {{ description }}
        </p>
        <slot />
      </div>

      <div
        v-if="source"
        class="hero-fade arch-frame mx-auto w-full max-w-[17rem] lg:ml-auto lg:mr-0 lg:max-w-[19rem]"
      >
        <div class="arch">
          <AppImage
            :src="source"
            :ratio="portrait ? '1/1' : '4/4.6'"
            alt=""
            eager
            decorative
            class="h-full w-full"
            :img-class="cadrage || (portrait ? 'object-[70%_6%]' : 'object-[76%_40%]')"
          />
        </div>
      </div>
    </div>
  </section>
</template>
