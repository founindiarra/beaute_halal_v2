<script setup>
/**
 * Marque de Beauté Halal : trois locks qui pendent sous une courbe, le plus
 * long au centre. Peinte en `currentColor` : la couleur se règle depuis le
 * parent par une simple classe de texte. Avec `draw`, le tracé s'écrit à
 * l'écran (rideau d'ouverture).
 */
defineProps({
  /** Texte alternatif ; vide, le logo est traité comme décoratif. */
  title: { type: String, default: '' },
  draw: { type: Boolean, default: false },
})
</script>

<template>
  <svg
    viewBox="0 0 32 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="draw ? 'logo-draw' : ''"
    :role="title ? 'img' : 'presentation'"
    :aria-hidden="title ? undefined : 'true'"
    :aria-label="title || undefined"
  >
    <path d="M5 11.5C8.5 4.5 23.5 4.5 27 11.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" pathLength="1" />
    <path d="M9 13.5c-1 4 1 7 0 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.6" pathLength="1" />
    <path d="M16 11c-1.4 6 1.4 11 0 22" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" pathLength="1" />
    <path d="M23 13.5c-1 4 1 7 0 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.6" pathLength="1" />
  </svg>
</template>

<style scoped>
.logo-draw path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 1.3s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}
.logo-draw path:nth-child(1) {
  animation-delay: 0.15s;
}
.logo-draw path:nth-child(2) {
  animation-delay: 0.55s;
}
.logo-draw path:nth-child(3) {
  animation-delay: 0.4s;
}
.logo-draw path:nth-child(4) {
  animation-delay: 0.7s;
}
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
