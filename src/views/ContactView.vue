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
      <div class="container-page grid gap-10 lg:grid-cols-12 lg:gap-12">
        <!-- Coordonnées -->
        <div class="flex flex-col gap-8 lg:col-span-5">
          <div class="flex flex-col gap-1.5">
            <span class="eyebrow">Nous joindre</span>
            <h2 class="text-2xl sm:text-3xl">Informations pratiques</h2>
          </div>

          <DataState
            :loading="loading"
            :error="error"
            loading-label="Chargement des informations…"
            @retry="reload"
          >
            <ul class="flex flex-col gap-5">
              <li v-if="salon.phone.display" class="flex gap-4">
                <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ivory text-gold">
                  <AppIcon name="phone" class="h-5 w-5" />
                </span>
                <div class="min-w-0">
                  <h3 class="text-base font-medium text-cocoa-dark">Téléphone</h3>
                  <a
                    :href="salon.phone.href"
                    class="inline-flex min-h-[32px] items-center text-sm text-muted transition-colors hover:text-gold"
                  >
                    {{ salon.phone.display }}
                  </a>
                </div>
              </li>

              <li v-if="salon.email" class="flex gap-4">
                <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ivory text-gold">
                  <AppIcon name="mail" class="h-5 w-5" />
                </span>
                <div class="min-w-0">
                  <h3 class="text-base font-medium text-cocoa-dark">E-mail</h3>
                  <a
                    :href="`mailto:${salon.email}`"
                    class="inline-flex min-h-[32px] items-center break-all text-sm text-muted transition-colors hover:text-gold"
                  >
                    {{ salon.email }}
                  </a>
                </div>
              </li>

              <li v-if="salon.address.city" class="flex gap-4">
                <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ivory text-gold">
                  <AppIcon name="map-pin" class="h-5 w-5" />
                </span>
                <div class="min-w-0">
                  <h3 class="text-base font-medium text-cocoa-dark">Adresse</h3>
                  <p class="text-sm text-muted">
                    {{ salon.address.line1 }}<br />
                    {{ salon.address.line2 }}<br />
                    {{ salon.address.city }}, {{ salon.address.country }}
                  </p>
                </div>
              </li>

              <li v-if="salon.hours.length" class="flex gap-4">
                <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ivory text-gold">
                  <AppIcon name="clock" class="h-5 w-5" />
                </span>
                <div class="min-w-0 flex-1">
                  <h3 class="mb-2 text-base font-medium text-cocoa-dark">Horaires</h3>
                  <ul class="flex flex-col gap-1.5 text-sm">
                    <li
                      v-for="slot in salon.hours"
                      :key="slot.day"
                      class="flex items-baseline justify-between gap-4"
                      :class="slot.isClosed ? 'text-muted/60' : 'text-muted'"
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
          <div class="flex flex-col gap-3">
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
          <div v-if="salon.socials.length" class="flex flex-col gap-3 border-t border-sand pt-6">
            <h3 class="text-[0.72rem] uppercase tracking-[0.24em] text-gold">Nous suivre</h3>
            <div class="flex flex-wrap gap-3">
              <a
                v-for="social in salon.socials"
                :key="social.id"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex min-h-[44px] items-center gap-2.5 rounded-lg border border-sand-dark px-4 text-sm text-cocoa transition-colors hover:border-cocoa-dark hover:text-cocoa-dark"
              >
                <AppIcon :name="social.id" class="h-4 w-4" />
                {{ social.label }}
              </a>
            </div>
          </div>
        </div>

        <!-- Formulaire -->
        <div class="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>

    <!-- Carte -->
    <section v-if="salon.address.mapEmbedUrl" class="bg-ivory pb-16 sm:pb-20">
      <div class="container-page flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <span class="eyebrow">Nous trouver</span>
          <h2 class="text-2xl sm:text-3xl">Localisation</h2>
        </div>

        <div class="overflow-hidden rounded-xl border border-sand shadow-[var(--shadow-soft)]">
          <iframe
            :src="salon.address.mapEmbedUrl"
            title="Carte de localisation du salon"
            class="h-[300px] w-full border-0 sm:h-[420px]"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>

        <p v-if="salon.address.note" class="text-xs text-muted">{{ salon.address.note }}</p>
      </div>
    </section>
  </div>
</template>
