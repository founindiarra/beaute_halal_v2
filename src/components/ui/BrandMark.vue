<script setup>
import AppLogo from '@/components/ui/AppLogo.vue'
import { useSalon } from '@/composables/useSalon'

const { salon } = useSalon()

defineProps({
  /** 'dark' sur fond clair, 'light' sur fond chocolat */
  tone: { type: String, default: 'dark' },
  compact: { type: Boolean, default: false },
  /** Barre d'en-tête serrée : la baseline disparaît entre 1024 et 1280 px. */
  tight: { type: Boolean, default: false },
})
</script>

<template>
  <span class="flex items-center gap-2.5 sm:gap-3">
    <span
      class="grid shrink-0 place-items-center rounded-full border transition-colors"
      :class="[
        compact ? 'h-9 w-9' : 'h-10 w-10 sm:h-11 sm:w-11',
        tone === 'light'
          ? 'border-gold-soft/70 bg-cream text-cocoa-dark'
          : 'border-cocoa-dark bg-cocoa-dark text-gold-soft',
      ]"
    >
      <AppLogo :class="compact ? 'h-5 w-auto' : 'h-5 w-auto sm:h-6'" />
    </span>

    <span class="flex min-w-0 flex-col leading-none">
      <span
        class="truncate font-display text-[1.1rem] font-semibold tracking-[0.04em] sm:text-[1.3rem]"
        :class="tone === 'light' ? 'text-cream' : 'text-cocoa-dark'"
      >
        {{ salon.name }}
      </span>
      <span
        v-if="!compact"
        class="mt-1 hidden text-[0.58rem] uppercase tracking-[0.3em] sm:block sm:text-[0.62rem]"
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
