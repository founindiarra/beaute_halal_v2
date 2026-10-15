<script setup>
import { watch } from 'vue'

import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import CursorFollower from '@/components/layout/CursorFollower.vue'
import IntroCurtain from '@/components/layout/IntroCurtain.vue'
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
  <div class="flex min-h-dvh flex-col overflow-x-clip bg-cream">
    <IntroCurtain />
    <CursorFollower />

    <a
      href="#contenu"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[210] focus:rounded-full focus:bg-cocoa-dark focus:px-5 focus:py-3 focus:text-sm focus:text-cream"
    >
      Aller au contenu
    </a>

    <AppHeader />

    <main id="contenu" class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />
  </div>
</template>
