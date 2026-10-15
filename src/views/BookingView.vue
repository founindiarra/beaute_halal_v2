<script setup>
import BookingWizard from '@/components/booking/BookingWizard.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import PageHero from '@/components/ui/PageHero.vue'
import { useSalon } from '@/composables/useSalon'
import { images } from '@/data/images'

const { salon } = useSalon()

const reassurance = [
  { icon: 'clock', text: 'Réservation en moins de 2 minutes' },
  { icon: 'calendar', text: 'Créneaux disponibles en temps réel' },
  { icon: 'shield', text: 'Confirmation par le salon avant le rendez-vous' },
]
</script>

<template>
  <div>
    <PageHero
      :image="images.heroRendezVous"
      :image-mobile="images.heroRendezVousMobile"
      eyebrow="Rendez-vous"
      title="Réservez votre rendez-vous"
      description="Choisissez votre prestation, votre date et votre créneau. Nous vous recontactons pour confirmer."
    >
      <ul class="mt-2 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-8">
        <li
          v-for="item in reassurance"
          :key="item.text"
          class="flex items-center gap-2.5 text-sm text-cream/70"
        >
          <AppIcon :name="item.icon" class="h-4 w-4 shrink-0 text-gold-soft" />
          {{ item.text }}
        </li>
      </ul>
    </PageHero>

    <section class="section bg-cream !pt-14 lg:!pt-20">
      <div class="container-page">
        <BookingWizard />
      </div>
    </section>

    <section class="border-t border-sand-dark/50 bg-ivory py-12">
      <div
        class="container-page flex flex-col items-center gap-4 text-center text-sm text-muted sm:flex-row sm:justify-center sm:gap-8 sm:text-left"
      >
        <p class="font-display text-xl italic text-cocoa-dark">Une question avant de réserver ?</p>
        <a
          v-if="salon.phone.display"
          :href="salon.phone.href"
          class="inline-flex min-h-[40px] items-center gap-2 text-cocoa-dark transition-colors hover:text-gold"
        >
          <AppIcon name="phone" class="h-4 w-4 text-gold" />
          <span class="link-line">{{ salon.phone.display }}</span>
        </a>
        <RouterLink
          :to="{ name: 'contact' }"
          class="inline-flex min-h-[40px] items-center gap-2 text-cocoa-dark transition-colors hover:text-gold"
        >
          <AppIcon name="mail" class="h-4 w-4 text-gold" />
          <span class="link-line">Nous contacter</span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
