<script setup>
/**
 * Marque de Beauté Halal : trois locks qui pendent sous une courbe, le plus
 * long au centre. Peinte en `currentColor` : la couleur se règle depuis le
 * parent par une simple classe de texte.
 */
defineProps({
  /** Texte alternatif ; vide, le logo est traité comme décoratif. */
  title: { type: String, default: '' },
})
</script>

<template>
  <svg
    viewBox="0 0 32 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :role="title ? 'img' : 'presentation'"
    :aria-hidden="title ? undefined : 'true'"
    :aria-label="title || undefined"
  >
    <path d="M5 11.5C8.5 4.5 23.5 4.5 27 11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    <path d="M9 13.5c-1 4 1 7 0 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.6" />
    <path d="M16 11c-1.4 6 1.4 11 0 22" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" />
    <path d="M23 13.5c-1 4 1 7 0 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.6" />
  </svg>
</template>
