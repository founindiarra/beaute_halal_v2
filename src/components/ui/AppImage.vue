<script setup>
import { ref, watch } from 'vue'

import AppLogo from '@/components/ui/AppLogo.vue'

/**
 * Image avec état de chargement et repli élégant si la photo est indisponible.
 * `ratio` accepte toute valeur CSS aspect-ratio ('4/5', '16/9'…).
 */
const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  ratio: { type: String, default: '4/5' },
  sizes: { type: String, default: null },
  eager: { type: Boolean, default: false },
  /** Image d'ambiance : le repli reste un simple dégradé, sans texte. */
  decorative: { type: Boolean, default: false },
  /**
   * Classes appliquées à la balise image elle-même, et non au cadre. Sert à
   * choisir la partie de la photo à préserver quand le cadre est plus étroit
   * ou plus large qu'elle (« object-[70%_45%] »), au besoin par palier
   * d'écran. Vide, le navigateur centre comme avant.
   */
  imgClass: { type: String, default: '' },
})

const loaded = ref(false)
const failed = ref(false)

watch(
  () => props.src,
  () => {
    loaded.value = false
    failed.value = false
  },
)
</script>

<template>
  <div class="relative w-full overflow-hidden bg-sand" :style="{ aspectRatio: ratio }">
    <div
      v-if="!loaded && !failed"
      class="absolute inset-0 animate-pulse bg-gradient-to-br from-sand via-ivory to-sand-dark"
    />

    <div
      v-if="failed"
      class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-cocoa/70"
      :class="
        decorative
          ? 'bg-gradient-to-br from-cocoa via-cocoa-dark to-ink'
          : 'bg-gradient-to-br from-sand via-ivory to-sand-dark'
      "
    >
      <template v-if="!decorative">
        <AppLogo class="h-8 w-auto text-gold" />
        <span class="px-4 text-center text-[0.7rem] uppercase tracking-[0.18em]">Photo à venir</span>
      </template>
    </div>

    <img
      v-show="!failed"
      :src="src"
      :alt="alt"
      :sizes="sizes"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      decoding="async"
      class="photo-rich h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out"
      :class="[loaded ? 'opacity-100' : 'opacity-0', imgClass]"
      @load="loaded = true"
      @error="failed = true"
    />
  </div>
</template>
