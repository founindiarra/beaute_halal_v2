<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BrandMark from '@/components/ui/BrandMark.vue'
import WhatsappButton from '@/components/ui/WhatsappButton.vue'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useScrollLock } from '@/composables/useScrollLock'
import { useSalon } from '@/composables/useSalon'
import { useWhatsapp } from '@/composables/useWhatsapp'

const navLinks = [
  { name: 'home', label: 'Accueil' },
  { name: 'services', label: 'Nos services' },
  { name: 'gallery', label: 'Nos coiffures' },
  { name: 'about', label: 'À propos' },
  { name: 'booking', label: 'Rendez-vous' },
  { name: 'contact', label: 'Contact' },
]

const route = useRoute()
const { salon } = useSalon()
const { lock, unlock } = useScrollLock()
// Le lien WhatsApp passe par le composable : une seule règle pour tout le site.
const { buildWhatsappLink } = useWhatsapp()

const scrolled = ref(false)
const menuOpen = ref(false)
const menuPanel = ref(null)

/** Menu plein écran : focus piégé à l'intérieur, Échap ferme, focus rendu au bouton. */
useFocusTrap(menuPanel, menuOpen, () => (menuOpen.value = false))

const onScroll = () => {
  scrolled.value = window.scrollY > 40
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

const onResize = () => {
  if (window.innerWidth >= 1024) menuOpen.value = false
}

onMounted(() => window.addEventListener('resize', onResize, { passive: true }))
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
})

watch(menuOpen, (open) => (open ? lock() : unlock()))
watch(
  () => route.fullPath,
  () => (menuOpen.value = false),
)

/**
 * L'en-tête est clair dès le chargement de la page.
 * `scrolled` ne sert plus qu'à resserrer la barre et à faire apparaître l'ombre.
 */
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b border-sand-dark/50 bg-cream/95 backdrop-blur transition-all duration-300"
    :class="
      scrolled
        ? 'py-2 shadow-[0_10px_30px_-24px_rgba(74,53,40,0.8)] sm:py-2'
        : 'py-2.5 sm:py-3'
    "
  >
    <div class="container-page flex items-center justify-between gap-4">
      <RouterLink :to="{ name: 'home' }" class="shrink-0" aria-label="Beauté Halal — accueil">
        <BrandMark tone="dark" tight />
      </RouterLink>

      <!-- Navigation desktop -->
      <nav class="hidden min-w-0 shrink-0 items-center gap-0.5 lg:flex xl:gap-1" aria-label="Navigation principale">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="{ name: link.name }"
          class="relative px-2.5 py-2 text-[0.82rem] text-cocoa transition-colors duration-200 hover:text-cocoa-dark xl:px-3.5 xl:text-[0.92rem]"
          :class="route.name === link.name ? '!text-cocoa-dark' : ''"
        >
          {{ link.label }}
          <span
            v-if="route.name === link.name"
            class="absolute inset-x-2.5 -bottom-0.5 h-px rounded-full bg-gold xl:inset-x-3.5"
          />
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3">
        <a
          v-if="buildWhatsappLink()"
          :href="buildWhatsappLink()"
          target="_blank"
          rel="noopener noreferrer"
          class="hidden h-11 w-11 place-items-center rounded-lg border border-sand-dark text-cocoa transition-colors hover:border-cocoa-dark hover:text-cocoa-dark xl:grid"
          aria-label="Contacter le salon sur WhatsApp"
        >
          <AppIcon name="whatsapp" class="h-5 w-5" />
        </a>

        <span class="hidden sm:block">
          <BaseButton :to="{ name: 'booking' }" variant="primary" size="sm">
            <span class="lg:hidden xl:inline">Prendre rendez-vous</span>
            <span class="hidden lg:inline xl:hidden">Rendez-vous</span>
          </BaseButton>
        </span>

        <!-- Raccourci réservation sur petits écrans -->
        <RouterLink
          :to="{ name: 'booking' }"
          class="grid h-11 w-11 place-items-center rounded-lg bg-cocoa-dark text-cream transition-colors sm:hidden"
          aria-label="Prendre rendez-vous"
        >
          <AppIcon name="calendar" class="h-5 w-5" />
        </RouterLink>

        <button
          type="button"
          class="grid h-11 w-11 place-items-center rounded-lg border border-sand-dark text-cocoa-dark transition-colors hover:border-cocoa-dark lg:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
          @click="menuOpen = !menuOpen"
        >
          <AppIcon :name="menuOpen ? 'close' : 'menu'" class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Menu mobile / tablette -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-3"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0 -translate-y-3"
    >
      <div
        v-if="menuOpen"
        id="mobile-menu"
        ref="menuPanel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        class="fixed inset-0 z-[60] h-[100dvh] overflow-y-auto overscroll-contain bg-cream lg:hidden"
      >
        <div class="container-page flex min-h-full flex-col gap-8 py-4 pb-8">
          <div class="flex items-center justify-between gap-4 py-1">
            <RouterLink :to="{ name: 'home' }" aria-label="Beauté Halal — accueil">
              <BrandMark tone="dark" />
            </RouterLink>
            <button
              type="button"
              class="grid h-11 w-11 place-items-center rounded-lg border border-sand-dark text-cocoa-dark"
              aria-label="Fermer le menu"
              @click="menuOpen = false"
            >
              <AppIcon name="close" class="h-5 w-5" />
            </button>
          </div>

          <nav class="flex flex-col" aria-label="Navigation mobile">
            <RouterLink
              v-for="link in navLinks"
              :key="link.name"
              :to="{ name: link.name }"
              class="flex items-center justify-between border-b border-sand py-4 font-display text-2xl transition-colors"
              :class="route.name === link.name ? 'text-gold' : 'text-cocoa-dark hover:text-gold'"
            >
              {{ link.label }}
              <AppIcon name="arrow-right" class="h-5 w-5 text-sand-dark" />
            </RouterLink>
          </nav>

          <div class="flex flex-col gap-3">
            <BaseButton :to="{ name: 'booking' }" variant="primary" size="lg" block>
              Prendre rendez-vous
            </BaseButton>
            <WhatsappButton
              label="Écrire sur WhatsApp"
              variant="secondary"
              size="lg"
              block
              :message="salon.whatsapp.defaultMessage || ''"
            />
          </div>

          <!-- Coordonnées affichées seulement une fois chargées : jamais de lien vide. -->
          <div class="mt-auto flex flex-col gap-2 pb-6 text-sm text-muted">
            <a
              v-if="salon.phone.href"
              :href="salon.phone.href"
              class="inline-flex min-h-[40px] items-center gap-2 hover:text-gold"
            >
              <AppIcon name="phone" class="h-4 w-4 text-gold" />
              {{ salon.phone.display }}
            </a>
            <a
              v-if="salon.email"
              :href="`mailto:${salon.email}`"
              class="inline-flex min-h-[40px] items-center gap-2 hover:text-gold"
            >
              <AppIcon name="mail" class="h-4 w-4 text-gold" />
              {{ salon.email }}
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
