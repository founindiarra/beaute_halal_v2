<script setup>
import { watch } from 'vue'

import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { useSalon } from '@/composables/useSalon'
import { applySalonJsonLd } from '@/utils/seo'

/**
 * Données structurées du salon (horaires, adresse, téléphone) écrites dès que
 * l'API a répondu : elles restent alignées sur la base, sans duplication de
 * contenu dans le code.
 */
const { salon, loaded } = useSalon()

watch(
  loaded,
  (isLoaded) => {
    if (isLoaded) applySalonJsonLd(salon.value)
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex min-h-dvh flex-col overflow-x-hidden bg-cream">
    <a
      href="#contenu"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-cocoa-dark focus:px-5 focus:py-3 focus:text-sm focus:text-cream"
    >
      Aller au contenu
    </a>

    <AppHeader />

    <main id="contenu" class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition
          mode="out-in"
          enter-active-class="transition-opacity duration-300 ease-out"
          enter-from-class="opacity-0"
          leave-active-class="transition-opacity duration-150 ease-in"
          leave-to-class="opacity-0"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />
  </div>
</template>
