<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

import AppLogo from '@/components/ui/AppLogo.vue'
import { useSalon } from '@/composables/useSalon'

/**
 * Rideau d'ouverture : joué une seule fois par session, jamais pour qui a
 * demandé moins d'animations. Il pose --intro sur la page pour que les
 * animations d'entrée (hero, titres) attendent qu'il soit levé.
 */
const { salon } = useSalon()

const KEY = 'bh_intro_seen'
const LIFT_AT = 1.9 // secondes avant que le rideau ne monte
const TOTAL = 3200 // millisecondes avant de le retirer du DOM

const root = typeof document !== 'undefined' ? document.documentElement : null

const reduced =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

let seen = false
try {
  seen = sessionStorage.getItem(KEY) === '1'
} catch {
  /* stockage bloqué : on rejoue simplement le rideau */
}

const visible = ref(!seen && !reduced && Boolean(root))
// Posé tout de suite, avant que les enfants ne montent : leurs animations en tiennent compte.
if (visible.value) root.style.setProperty('--intro', `${LIFT_AT - 0.25}s`)

let timer = null

onMounted(() => {
  if (!visible.value) return
  root.style.overflow = 'hidden'
  timer = setTimeout(() => {
    visible.value = false
    root.style.overflow = ''
    root.style.setProperty('--intro', '0s')
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* sans importance */
    }
  }, TOTAL)
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  if (root) root.style.overflow = ''
})
</script>

<template>
  <div
    v-if="visible"
    class="curtain bg-espresso-deep grain fixed inset-0 z-[200] grid place-items-center text-gold-soft"
    :style="{ '--lift': `${LIFT_AT}s` }"
    aria-hidden="true"
  >
    <div class="relative z-10 flex flex-col items-center gap-7">
      <AppLogo draw class="h-16 w-auto sm:h-20" />

      <div class="flex flex-col items-center gap-3 overflow-hidden">
        <p class="curtain-name font-display text-2xl uppercase tracking-[0.42em] text-cream sm:text-3xl">
          {{ salon.name }}
        </p>
        <p class="curtain-tag text-[0.62rem] uppercase tracking-[0.5em] text-gold-soft">
          {{ salon.specialty }}
        </p>
      </div>

      <span class="relative block h-px w-40 overflow-hidden bg-cream/15">
        <span class="curtain-bar absolute inset-0 origin-left bg-gold-soft" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.curtain {
  border-radius: 0 0 50% 50% / 0 0 9vw 9vw;
  animation: lift 1.2s cubic-bezier(0.76, 0, 0.24, 1) var(--lift) forwards;
}
.curtain-name {
  animation: name-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}
.curtain-tag {
  animation: name-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both;
}
.curtain-bar {
  animation: bar 1.6s cubic-bezier(0.65, 0, 0.35, 1) 0.2s both;
}
@keyframes lift {
  to {
    transform: translateY(-104%);
  }
}
@keyframes name-in {
  from {
    opacity: 0;
    transform: translateY(100%);
    letter-spacing: 0.7em;
  }
}
@keyframes bar {
  from {
    transform: scaleX(0);
  }
}
</style>
