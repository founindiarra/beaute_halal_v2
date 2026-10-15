<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Curseur doré qui suit la souris : un point exact et un anneau en retard.
 * L'anneau grossit sur les liens et boutons, et affiche « Voir » sur les
 * éléments marqués data-cursor="view". Inactif au doigt et pour qui a
 * demandé moins d'animations ; le curseur du système n'est jamais masqué.
 */
const enabled = ref(false)
const dot = ref(null)
const ring = ref(null)
const mode = ref('idle') // idle | link | view | hidden
const label = ref('')

let raf = 0
let x = -100
let y = -100
let rx = -100
let ry = -100

const tick = () => {
  rx += (x - rx) * 0.16
  ry += (y - ry) * 0.16
  if (dot.value) dot.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
  if (ring.value) ring.value.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
  raf = requestAnimationFrame(tick)
}

const onMove = (event) => {
  x = event.clientX
  y = event.clientY
  if (mode.value === 'hidden') mode.value = 'idle'
}

const onOver = (event) => {
  const target = event.target instanceof Element ? event.target : null
  if (!target) return
  const view = target.closest('[data-cursor="view"]')
  if (view) {
    mode.value = 'view'
    label.value = view.getAttribute('data-cursor-label') || 'Voir'
    return
  }
  mode.value = target.closest('a, button, [role="button"], input, textarea, select, label')
    ? 'link'
    : 'idle'
}

const onLeave = () => {
  mode.value = 'hidden'
}

onMounted(() => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduced) return
  enabled.value = true
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerover', onOver, { passive: true })
  document.documentElement.addEventListener('mouseleave', onLeave)
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerover', onOver)
  document.documentElement.removeEventListener('mouseleave', onLeave)
})
</script>

<template>
  <div v-if="enabled" class="pointer-events-none fixed left-0 top-0 z-[150]" aria-hidden="true">
    <div ref="ring" class="absolute left-0 top-0 will-change-transform">
      <span
        class="absolute -left-5 -top-5 grid h-10 w-10 place-items-center rounded-full border border-gold text-[0.62rem] uppercase tracking-[0.18em] text-ink transition-[transform,background-color,opacity,border-color] duration-500 ease-[var(--ease-expo)]"
        :class="{
          'scale-100 opacity-70': mode === 'idle',
          'scale-[1.6] bg-gold/15 opacity-100': mode === 'link',
          'scale-[2.4] border-transparent bg-gold-soft opacity-100': mode === 'view',
          'scale-50 opacity-0': mode === 'hidden',
        }"
      >
        <span v-if="mode === 'view'" class="scale-[0.42] whitespace-nowrap font-medium">{{ label }}</span>
      </span>
    </div>
    <div ref="dot" class="absolute left-0 top-0 will-change-transform">
      <span
        class="absolute -left-[3px] -top-[3px] block h-1.5 w-1.5 rounded-full bg-gold transition-opacity duration-300"
        :class="mode === 'view' || mode === 'hidden' ? 'opacity-0' : 'opacity-100'"
      />
    </div>
  </div>
</template>
