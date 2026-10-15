<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'
import BrandMark from '@/components/ui/BrandMark.vue'
import { useSalon } from '@/composables/useSalon'
import { useWhatsapp } from '@/composables/useWhatsapp'

const { salon } = useSalon()
// Le lien WhatsApp passe par le composable : une seule règle pour tout le site.
const { buildWhatsappLink } = useWhatsapp()

const navLinks = [
  { name: 'home', label: 'Accueil' },
  { name: 'services', label: 'Services' },
  { name: 'gallery', label: 'Nos coiffures' },
  { name: 'about', label: 'À propos' },
  { name: 'booking', label: 'Rendez-vous' },
  { name: 'contact', label: 'Contact' },
]

const year = new Date().getFullYear()

const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<template>
  <footer class="bg-espresso-deep grain relative overflow-hidden text-cream/75">
    <div class="container-page relative z-10 pt-20 lg:pt-28">
      <!-- Accroche -->
      <div
        class="flex flex-col gap-8 border-b border-cream/10 pb-14 lg:flex-row lg:items-end lg:justify-between lg:pb-20"
      >
        <h2
          v-split
          class="max-w-3xl font-display text-[2.4rem] leading-[1.02] text-cream sm:text-6xl lg:text-7xl"
        >
          L’art des locks, avec soin et élégance.
        </h2>

        <button
          type="button"
          class="btn-round group h-20 w-20 shrink-0 self-start text-gold-soft hover:bg-gold-soft hover:text-ink lg:self-auto"
          aria-label="Retour en haut de la page"
          @click="toTop"
        >
          <AppIcon name="arrow-right" class="h-6 w-6 -rotate-90 transition-transform duration-500 group-hover:-translate-y-1" />
        </button>
      </div>

      <div class="grid gap-10 py-14 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-12 lg:gap-x-8 lg:py-16">
        <!-- Présentation -->
        <div class="flex flex-col gap-5 sm:col-span-2 lg:col-span-4 lg:row-start-1">
          <BrandMark tone="light" />
          <p class="max-w-sm text-sm leading-relaxed text-cream/65">
            {{ salon.shortDescription }}
          </p>

          <div v-if="salon.socials?.length" class="flex flex-wrap items-center gap-3 pt-1">
            <a
              v-for="social in salon.socials"
              :key="social.id"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-round h-11 w-11 text-cream/80 hover:border-gold-soft hover:bg-gold-soft hover:text-ink"
              :aria-label="social.label"
            >
              <AppIcon :name="social.id" class="h-[1.1rem] w-[1.1rem]" />
            </a>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex flex-col gap-4 lg:col-span-2 lg:col-start-5 lg:row-start-1" aria-label="Navigation de pied de page">
          <h3 class="eyebrow !text-gold-soft">Navigation</h3>
          <ul class="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-1">
            <li v-for="link in navLinks" :key="link.name">
              <RouterLink
                :to="{ name: link.name }"
                class="inline-flex min-h-[30px] items-center text-sm transition-colors hover:text-gold-soft"
              >
                <span class="link-line">{{ link.label }}</span>
              </RouterLink>
            </li>
          </ul>
        </nav>

        <!-- Contact -->
        <div class="flex flex-col gap-4 lg:col-span-3 lg:col-start-7 lg:row-start-1">
          <h3 class="eyebrow !text-gold-soft">Contact</h3>
          <ul class="flex flex-col gap-3 text-sm">
            <li v-if="salon.phone.display">
              <a
                :href="salon.phone.href"
                class="inline-flex items-start gap-3 transition-colors hover:text-gold-soft"
              >
                <AppIcon name="phone" class="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
                {{ salon.phone.display }}
              </a>
            </li>
            <li>
              <a
                v-if="buildWhatsappLink()"
                :href="buildWhatsappLink()"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-start gap-3 transition-colors hover:text-gold-soft"
              >
                <AppIcon name="whatsapp" class="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
                WhatsApp
              </a>
              <span v-else class="inline-flex items-start gap-3 text-cream/50">
                <AppIcon name="whatsapp" class="mt-0.5 h-4 w-4 shrink-0 text-gold-soft/60" />
                WhatsApp — numéro bientôt disponible
              </span>
            </li>
            <li v-if="salon.email">
              <a
                :href="`mailto:${salon.email}`"
                class="inline-flex items-start gap-3 break-all transition-colors hover:text-gold-soft"
              >
                <AppIcon name="mail" class="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
                {{ salon.email }}
              </a>
            </li>
            <li v-if="salon.address.city" class="inline-flex items-start gap-3">
              <AppIcon name="map-pin" class="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
              <span>
                {{ salon.address.line1 }}<br />
                {{ salon.address.line2 }}<br />
                {{ salon.address.city }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Horaires -->
        <div class="flex flex-col gap-4 lg:col-span-3 lg:col-start-10 lg:row-start-1">
          <h3 class="eyebrow !text-gold-soft">Horaires</h3>
          <ul class="flex flex-col gap-1.5 text-[0.82rem]">
            <li
              v-for="slot in salon.hours"
              :key="slot.day"
              class="flex items-baseline justify-between gap-3 border-b border-dashed border-cream/10 pb-1.5"
              :class="slot.isClosed ? 'text-cream/40' : ''"
            >
              <span>{{ slot.day }}</span>
              <span class="text-right text-xs">{{ slot.value }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Signature géante -->
    <p
      class="outline-text pointer-events-none relative z-0 -mb-[0.18em] select-none whitespace-nowrap text-center font-display text-[clamp(2.6rem,11.2vw,13rem)] font-light uppercase leading-[0.9] tracking-[0.04em]"
      aria-hidden="true"
    >
      {{ salon.name }}
    </p>

    <div class="relative z-10 border-t border-cream/10 bg-espresso/60 backdrop-blur">
      <div
        class="container-page flex flex-col items-center justify-between gap-1.5 py-4 text-center text-xs text-cream/55 sm:flex-row sm:text-left"
      >
        <p>© {{ year }} {{ salon.name }} — Tous droits réservés.</p>
        <p>
          <RouterLink :to="{ name: 'contact' }" class="transition-colors hover:text-gold-soft">
            Mentions légales et contact
          </RouterLink>
        </p>
      </div>
    </div>
  </footer>
</template>
