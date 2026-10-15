<script setup>
import AppLogo from '@/components/ui/AppLogo.vue'
import { useSalon } from '@/composables/useSalon'

const { salon } = useSalon()

defineProps({
  /** 'light' sur fond sombre (défaut du site), 'dark' sur fond clair */
  tone: { type: String, default: 'light' },
  compact: { type: Boolean, default: false },
  /** Barre d'en-tête serrée : la baseline disparaît entre 1024 et 1280 px. */
  tight: { type: Boolean, default: false },
})
</script>

<template>
  <span class="group flex items-center gap-3 sm:gap-3.5">
    <span
      class="relative grid shrink-0 place-items-center rounded-full border transition-all duration-700 ease-[var(--ease-expo)] group-hover:rotate-[360deg]"
      :class="[
        compact ? 'h-9 w-9' : 'h-10 w-10 sm:h-11 sm:w-11',
        tone === 'light'
          ? 'border-gold-soft/70 text-gold-soft group-hover:bg-gold-soft group-hover:text-espresso'
          : 'border-cocoa-dark/70 text-cocoa-dark group-hover:bg-cocoa-dark group-hover:text-gold-soft',
      ]"
    >
      <AppLogo :class="compact ? 'h-5 w-auto' : 'h-5 w-auto sm:h-[1.4rem]'" />
    </span>

    <span class="flex min-w-0 flex-col leading-none">
      <span
        class="truncate font-display text-[1.15rem] font-medium uppercase tracking-[0.2em] sm:text-[1.3rem]"
        :class="tone === 'light' ? 'text-cream' : 'text-cocoa-dark'"
      >
        {{ salon.name }}
      </span>
      <span
        v-if="!compact"
        class="mt-1.5 hidden text-[0.56rem] uppercase tracking-[0.42em] sm:block"
        :class="[
          tight ? 'sm:block lg:hidden xl:block' : 'sm:block',
          tone === 'light' ? 'text-gold-soft' : 'text-gold',
        ]"
      >
        {{ salon.specialty }}
      </span>
    </span>
  </span>
</template>
