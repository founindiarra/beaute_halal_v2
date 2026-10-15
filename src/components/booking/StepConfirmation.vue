<script setup>
import { computed } from 'vue'

import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import WhatsappButton from '@/components/ui/WhatsappButton.vue'
import { capitalize, formatDateLong, formatDuration, formatPrice } from '@/utils/format'

/**
 * Toutes les valeurs affichées ici viennent de la réponse du serveur
 * (POST /appointments) : référence, prestation, date, heure, durée et prix.
 */
const props = defineProps({
  confirmation: { type: Object, required: true },
})

defineEmits(['restart'])

const whatsappMessage = computed(
  () =>
    `Bonjour Beauté Halal, je viens de demander le service « ${props.confirmation.serviceName} » le ${formatDateLong(props.confirmation.date)} à ${props.confirmation.time}. Référence : ${props.confirmation.reference}.`,
)
</script>

<template>
  <div class="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 text-center">
    <span
      class="pop grid h-20 w-20 place-items-center rounded-full bg-espresso text-gold-soft ring-8 ring-gold/15"
    >
      <AppIcon name="check" class="h-9 w-9" />
    </span>

    <div class="flex flex-col gap-3">
      <h2 class="text-[2.2rem] sm:text-5xl">Votre demande est bien enregistrée.</h2>
      <p class="text-muted">
        Merci {{ confirmation.firstName }}. Le salon examine votre demande et vous envoie un e-mail
        dès qu’elle est confirmée. Le créneau n’est pas encore réservé.
      </p>
    </div>

    <div class="card-surface w-full p-5 text-left sm:p-7">
      <dl class="flex flex-col gap-3 text-sm">
        <div class="flex items-baseline justify-between gap-4 border-b border-dashed border-sand-dark pb-3">
          <dt class="text-muted">Service</dt>
          <dd class="text-right font-medium text-cocoa-dark">{{ confirmation.serviceName }}</dd>
        </div>
        <div class="flex items-baseline justify-between gap-4 border-b border-dashed border-sand-dark pb-3">
          <dt class="text-muted">Date</dt>
          <dd class="text-right text-cocoa-dark">
            {{ capitalize(formatDateLong(confirmation.date)) }}
          </dd>
        </div>
        <div class="flex items-baseline justify-between gap-4 border-b border-dashed border-sand-dark pb-3">
          <dt class="text-muted">Heure</dt>
          <dd class="text-right text-cocoa-dark">
            {{ confirmation.time }} · {{ formatDuration(confirmation.durationMinutes) }}
          </dd>
        </div>
        <div class="flex items-baseline justify-between gap-4 border-b border-dashed border-sand-dark pb-3">
          <dt class="text-muted">Prix indicatif</dt>
          <dd class="text-right text-cocoa-dark">
            {{ formatPrice(confirmation.price, confirmation.currency) }}
          </dd>
        </div>
        <div class="flex items-baseline justify-between gap-4">
          <dt class="text-muted">Numéro de réservation</dt>
          <dd class="text-right font-display text-xl tracking-[0.12em] text-gold">
            {{ confirmation.reference }}
          </dd>
        </div>
      </dl>
    </div>

    <div class="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <WhatsappButton
        label="Contacter le salon sur WhatsApp"
        variant="primary"
        :message="whatsappMessage"
      />
      <BaseButton variant="secondary" @click="$emit('restart')">
        Prendre un autre rendez-vous
      </BaseButton>
    </div>

    <p class="text-xs text-muted">
      Conservez votre référence : elle permet de retrouver votre rendez-vous.
    </p>
  </div>
</template>
