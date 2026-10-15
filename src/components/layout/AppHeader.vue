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
const hidden = ref(false)
const progress = ref(0)
const menuOpen = ref(false)
const menuPanel = ref(null)

/** Menu plein écran : focus piégé à l'intérieur, Échap ferme, focus rendu au bouton. */
useFocusTrap(menuPanel, menuOpen, () => (menuOpen.value = false))

let lastY = 0
let queued = false

const update = () => {
  queued = false
  const y = window.scrollY
  scrolled.value = y > 40

  // La barre se range en descendant et revient dès qu'on remonte.
  if (y > lastY + 6 && y > 260) hidden.value = true
  else if (y < lastY - 6 || y < 120) hidden.value = false
  lastY = y

  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(1, y / max) : 0
}

const onScroll = () => {
  if (queued) return
  queued = true
  requestAnimationFrame(update)
}

const onResize = () => {
  if (window.innerWidth >= 1024) menuOpen.value = false
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
})

watch(menuOpen, (open) => (open ? lock() : unlock()))
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
    hidden.value = false
  },
)
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-[transform,background-color,padding,box-shadow] duration-700 ease-[var(--ease-expo)]"
    :class="[
      hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0',
      scrolled
        ? 'bg-espresso/90 py-2.5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.7)] backdrop-blur-xl'
        : 'py-4 sm:py-5 lg:py-6',
    ]"
  >
    <div class="container-page flex items-center justify-between gap-4">
      <RouterLink
        :to="{ name: 'home' }"
        class="rise relative z-[70] shrink-0"
        aria-label="Beauté Halal — accueil"
      >
        <BrandMark tone="light" tight />
      </RouterLink>

      <!-- Navigation desktop -->
      <nav
        class="rise hidden min-w-0 shrink-0 items-center gap-1 [--d:250ms] lg:flex xl:gap-2"
        aria-label="Navigation principale"
      >
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="{ name: link.name }"
          class="relative px-2.5 py-2 text-[0.72rem] uppercase tracking-[0.2em] text-cream/75 transition-colors duration-300 hover:text-cream xl:px-3.5"
          :class="route.name === link.name ? '!text-cream' : ''"
        >
          <span class="link-line" :class="route.name === link.name ? 'is-active' : ''">
            {{ link.label }}
          </span>
        </RouterLink>
      </nav>

      <div class="rise relative z-[70] flex items-center gap-2 [--d:380ms] sm:gap-3">
        <a
          v-if="buildWhatsappLink()"
          :href="buildWhatsappLink()"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-round hidden h-11 w-11 text-cream hover:bg-cream hover:text-cocoa-dark 2xl:grid"
          aria-label="Contacter le salon sur WhatsApp"
        >
          <AppIcon name="whatsapp" class="h-[1.15rem] w-[1.15rem]" />
        </a>

        <span class="hidden sm:block">
          <BaseButton :to="{ name: 'booking' }" variant="gold" size="sm" magnetic>
            <span class="lg:hidden 2xl:inline">Prendre rendez-vous</span>
            <span class="hidden lg:inline 2xl:hidden">Rendez-vous</span>
          </BaseButton>
        </span>

        <!-- Raccourci réservation sur petits écrans -->
        <RouterLink
          :to="{ name: 'booking' }"
          class="btn-round h-11 w-11 bg-gold-soft text-ink sm:hidden"
          aria-label="Prendre rendez-vous"
        >
          <AppIcon name="calendar" class="h-5 w-5" />
        </RouterLink>

        <button
          type="button"
          class="btn-round group h-11 w-11 text-cream lg:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
          @click="menuOpen = !menuOpen"
        >
          <span class="relative block h-3 w-5" aria-hidden="true">
            <span
              class="absolute left-0 block h-px w-full bg-current transition-all duration-500 ease-[var(--ease-expo)]"
              :class="menuOpen ? 'top-1/2 rotate-45' : 'top-0'"
            />
            <span
              class="absolute right-0 top-1/2 block h-px bg-current transition-all duration-500 ease-[var(--ease-expo)]"
              :class="menuOpen ? 'w-0 opacity-0' : 'w-3/5'"
            />
            <span
              class="absolute left-0 block h-px w-full bg-current transition-all duration-500 ease-[var(--ease-expo)]"
              :class="menuOpen ? 'top-1/2 -rotate-45' : 'bottom-0'"
            />
          </span>
        </button>
      </div>
    </div>

    <!-- Progression de lecture -->
    <span
      class="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-gold via-gold-soft to-gold transition-opacity duration-500"
      :class="scrolled ? 'opacity-100' : 'opacity-0'"
      :style="{ transform: `scaleX(${progress})` }"
      aria-hidden="true"
    />
  </header>

  <!--
    Menu mobile / tablette. Volontairement hors de <header> : un en-tête flouté
    ou translaté devient le référentiel des éléments « fixed » qu'il contient,
    et le menu se retrouverait coincé dans la barre.
  -->
  <Transition name="menu">
    <div
      v-if="menuOpen"
      id="mobile-menu"
      ref="menuPanel"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navigation"
      class="bg-espresso-deep grain fixed inset-0 z-[60] h-[100dvh] overflow-y-auto overscroll-contain lg:hidden"
    >
      <div class="container-page relative z-10 flex min-h-full flex-col gap-8 pb-8 pt-28">
        <nav class="flex flex-col" aria-label="Navigation mobile">
          <RouterLink
            v-for="(link, index) in navLinks"
            :key="link.name"
            :to="{ name: link.name }"
            class="menu-link group flex items-baseline gap-4 border-b border-cream/10 py-3.5 font-display text-[2.1rem] leading-none transition-colors sm:text-5xl"
            :class="route.name === link.name ? 'text-gold-soft' : 'text-cream hover:text-gold-soft'"
            :style="{ '--i': index }"
          >
            <span class="w-6 font-sans text-[0.62rem] tracking-[0.2em] text-gold-soft/70">
              0{{ index + 1 }}
            </span>
            <span class="flex-1 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2">
              {{ link.label }}
            </span>
            <AppIcon name="arrow-right" class="h-5 w-5 text-gold-soft/60" />
          </RouterLink>
        </nav>

        <div class="menu-link flex flex-col gap-3" :style="{ '--i': 7 }">
          <BaseButton :to="{ name: 'booking' }" variant="gold" size="lg" block>
            Prendre rendez-vous
          </BaseButton>
          <WhatsappButton
            label="Écrire sur WhatsApp"
            variant="outline-light"
            size="lg"
            block
            :message="salon.whatsapp.defaultMessage || ''"
          />
        </div>

        <!-- Coordonnées affichées seulement une fois chargées : jamais de lien vide. -->
        <div
          class="menu-link mt-auto flex flex-col gap-2 pb-6 text-sm text-cream/70"
          :style="{ '--i': 8 }"
        >
          <a
            v-if="salon.phone.href"
            :href="salon.phone.href"
            class="inline-flex min-h-[40px] items-center gap-2 hover:text-gold-soft"
          >
            <AppIcon name="phone" class="h-4 w-4 text-gold-soft" />
            {{ salon.phone.display }}
          </a>
          <a
            v-if="salon.email"
            :href="`mailto:${salon.email}`"
            class="inline-flex min-h-[40px] items-center gap-2 hover:text-gold-soft"
          >
            <AppIcon name="mail" class="h-4 w-4 text-gold-soft" />
            {{ salon.email }}
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.menu-enter-active {
  transition: clip-path 0.9s cubic-bezier(0.76, 0, 0.24, 1);
}
.menu-leave-active {
  transition: clip-path 0.6s cubic-bezier(0.76, 0, 0.24, 1);
}
.menu-enter-from,
.menu-leave-to {
  clip-path: circle(0% at calc(100% - 2.6rem) 2.6rem);
}
.menu-enter-to,
.menu-leave-from {
  clip-path: circle(150% at calc(100% - 2.6rem) 2.6rem);
}
.menu-enter-active .menu-link {
  animation: menu-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(0.35s + var(--i, 0) * 70ms);
}
@keyframes menu-rise {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .menu-enter-active,
  .menu-leave-active {
    transition: none;
  }
  .menu-enter-active .menu-link {
    animation: none;
  }
}
</style>
