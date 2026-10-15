<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

/**
 * Bouton unique du site : rendu en <router-link>, <a> ou <button>
 * selon les props fournies. Taille minimale tactile garantie (44 px).
 * Le style (pilule, balayage doré au survol) vit dans style.css (.btn).
 */
const props = defineProps({
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }, // primary | gold | secondary | ghost | light | outline-light
  size: { type: String, default: 'md' }, // sm | md | lg
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  /** Le bouton est légèrement attiré par le pointeur (écrans à souris). */
  magnetic: { type: Boolean, default: false },
})

const tag = computed(() => {
  if (props.disabled) return 'button'
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return 'button'
})

const classes = computed(() => [
  'btn',
  `btn--${['sm', 'md', 'lg'].includes(props.size) ? props.size : 'md'}`,
  `btn--${props.variant}`,
  props.block ? 'w-full' : '',
])

const attrs = computed(() => {
  if (props.disabled) return { type: props.type, disabled: true }
  if (props.to) return { to: props.to }
  if (props.href) {
    const external = props.href.startsWith('http')
    return {
      href: props.href,
      ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
    }
  }
  return { type: props.type }
})
</script>

<template>
  <component :is="tag" v-magnetic="magnetic ? 0.3 : 0" v-bind="attrs" :class="classes">
    <slot />
  </component>
</template>
