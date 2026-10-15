<script setup>
import ContactForm from '@/components/forms/ContactForm.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import DataState from '@/components/ui/DataState.vue'
import PageHero from '@/components/ui/PageHero.vue'
import WhatsappButton from '@/components/ui/WhatsappButton.vue'
import { useSalon } from '@/composables/useSalon'
import { images } from '@/data/images'

const { salon, loading, error, reload } = useSalon()
</script>

<template>
  <div>
    <PageHero
      :image="images.heroContact"
      :image-mobile="images.heroContactMobile"
      eyebrow="Contact"
      title="Parlons de vos locks"
      description="Par téléphone, par WhatsApp, par e-mail ou directement au salon : choisissez ce qui vous convient le mieux."
    />

    <section class="section bg-cream">
      <div class="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
        <!-- Coordonnées -->
        <div class="flex flex-col gap-10 lg:col-span-5">
          <div class="flex flex-col gap-4">
            <span v-reveal:fade class="eyebrow">Nous joindre</span>
            <h2 v-split class="text-[2.2rem] sm:text-5xl">Informations pratiques</h2>
          </div>

          <DataState
            :loading="loading"
            :error="error"
            loading-label="Chargement des informations…"
            @retry="reload"
          >
            <ul class="flex flex-col">
              <li
                v-if="salon.phone.display"
                v-reveal
                class="group flex gap-5 border-t border-sand-dark/70 py-6"
              >
                <span
                  class="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-all duration-500 group-hover:bg-espresso group-hover:text-gold-soft"
                >
                  <AppIcon name="phone" class="h-5 w-5" />
                </span>
                <div class="min-w-0">
                  <h3 class="font-sans text-[0.68rem] font-medium uppercase tracking-[0.24em] text-gold">
                    Téléphone
                  </h3>
                  <a
                    :href="salon.phone.href"
                    class="mt-1 inline-flex min-h-[32px] items-center font-display text-2xl text-cocoa-dark transition-colors hover:text-gold"
                  >
                    {{ salon.phone.display }}
                  </a>
                </div>
              </li>

              <li v-if="salon.email" v-reveal="80" class="group flex gap-5 border-t border-sand-dark/70 py-6">
                <span
                  class="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-all duration-500 group-hover:bg-espresso group-hover:text-gold-soft"
                >
                  <AppIcon name="mail" class="h-5 w-5" />
                </span>
                <div class="min-w-0">
                  <h3 class="font-sans text-[0.68rem] font-medium uppercase tracking-[0.24em] text-gold">
                    E-mail
                  </h3>
                  <a
                    :href="`mailto:${salon.email}`"
                    class="mt-1 inline-flex min-h-[32px] items-center break-all font-display text-xl text-cocoa-dark transition-colors hover:text-gold sm:text-2xl"
                  >
                    {{ salon.email }}
                  </a>
                </div>
              </li>

              <li v-if="salon.address.city" v-reveal="160" class="group flex gap-5 border-t border-sand-dark/70 py-6">
                <span
                  class="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-all duration-500 group-hover:bg-espresso group-hover:text-gold-soft"
                >
                  <AppIcon name="map-pin" class="h-5 w-5" />
                </span>
                <div class="min-w-0">
                  <h3 class="font-sans text-[0.68rem] font-medium uppercase tracking-[0.24em] text-gold">
                    Adresse
                  </h3>
                  <p class="mt-1 text-[1.02rem] leading-relaxed text-cocoa-dark">
                    {{ salon.address.line1 }}<br />
                    {{ salon.address.line2 }}<br />
                    {{ salon.address.city }}, {{ salon.address.country }}
                  </p>
                </div>
              </li>

              <li
                v-if="salon.hours.length"
                v-reveal="240"
                class="group flex gap-5 border-y border-sand-dark/70 py-6"
              >
                <span
                  class="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-all duration-500 group-hover:bg-espresso group-hover:text-gold-soft"
                >
                  <AppIcon name="clock" class="h-5 w-5" />
                </span>
                <div class="min-w-0 flex-1">
                  <h3 class="mb-3 font-sans text-[0.68rem] font-medium uppercase tracking-[0.24em] text-gold">
                    Horaires
                  </h3>
                  <ul class="flex flex-col gap-2 text-sm">
                    <li
                      v-for="slot in salon.hours"
                      :key="slot.day"
                      class="flex items-baseline justify-between gap-4 border-b border-dashed border-sand-dark/60 pb-2 last:border-0 last:pb-0"
                      :class="slot.isClosed ? 'text-muted/60' : 'text-cocoa-dark'"
                    >
                      <span>{{ slot.day }}</span>
                      <span>{{ slot.value }}</span>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </DataState>

          <!-- Actions rapides -->
          <div v-reveal class="flex flex-col gap-3">
            <WhatsappButton
              label="Écrire sur WhatsApp"
              variant="primary"
              size="md"
              block
              :message="salon.whatsapp.defaultMessage || ''"
            />
            <BaseButton :to="{ name: 'booking' }" variant="secondary" size="md" block>
              Prendre rendez-vous
            </BaseButton>
          </div>

          <!-- Réseaux sociaux -->
          <div v-if="salon.socials.length" v-reveal class="flex flex-col gap-4">
            <h3 class="font-sans text-[0.68rem] font-medium uppercase tracking-[0.24em] text-gold">
              Nous suivre
            </h3>
            <div class="flex flex-wrap gap-3">
              <a
                v-for="social in salon.socials"
                :key="social.id"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-round h-12 gap-2.5 px-5 text-sm text-cocoa hover:border-espresso hover:bg-espresso hover:text-gold-soft"
                style="display: inline-flex; align-items: center"
              >
                <AppIcon :name="social.id" class="h-4 w-4" />
                {{ social.label }}
              </a>
            </div>
          </div>
        </div>

        <!-- Formulaire -->
        <div v-reveal="120" class="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>

    <!-- Carte -->
    <section v-if="salon.address.mapEmbedUrl" class="bg-ivory pb-20 pt-4 sm:pb-28">
      <div class="container-page flex flex-col gap-8 pt-16">
        <div class="flex flex-col gap-4">
          <span v-reveal:fade class="eyebrow">Nous trouver</span>
          <h2 v-split class="text-[2.2rem] sm:text-5xl">Localisation</h2>
        </div>

        <div
          v-reveal:mask
          class="overflow-hidden rounded-xl border border-gold/40 p-2 shadow-[var(--shadow-lift)]"
        >
          <iframe
            :src="salon.address.mapEmbedUrl"
            title="Carte de localisation du salon"
            class="h-[320px] w-full rounded-lg border-0 sepia-[0.25] sm:h-[460px]"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>

        <p v-if="salon.address.note" class="text-xs text-muted">{{ salon.address.note }}</p>
      </div>
    </section>
  </div>
</template>
