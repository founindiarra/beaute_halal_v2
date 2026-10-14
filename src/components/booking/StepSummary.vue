<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'
import { capitalize, formatDateLong, formatDuration, formatPrice } from '@/utils/format'

defineProps({
  service: { type: Object, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  customer: { type: Object, required: true },
})
</script>

<template>
  <div class="grid gap-5 lg:grid-cols-2">
    <!-- Prestation -->
    <section class="card-surface flex flex-col gap-4 p-5 sm:p-6">
      <h3 class="font-display text-2xl text-cocoa-dark">Votre prestation</h3>

      <dl class="flex flex-col gap-3 text-sm">
        <div class="flex items-baseline justify-between gap-4 border-b border-dashed border-sand-dark pb-3">
          <dt class="text-muted">Service</dt>
          <dd class="text-right font-medium text-cocoa-dark">{{ service.name }}</dd>
        </div>
        <div class="flex items-baseline justify-between gap-4 border-b border-dashed border-sand-dark pb-3">
          <dt class="text-muted">Date</dt>
          <dd class="text-right text-cocoa-dark">{{ capitalize(formatDateLong(date)) }}</dd>
        </div>
        <div class="flex items-baseline justify-between gap-4 border-b border-dashed border-sand-dark pb-3">
          <dt class="text-muted">Heure</dt>
          <dd class="text-right text-cocoa-dark">{{ time }}</dd>
        </div>
        <div class="flex items-baseline justify-between gap-4 border-b border-dashed border-sand-dark pb-3">
          <dt class="text-muted">Durée estimée</dt>
          <dd class="text-right text-cocoa-dark">{{ formatDuration(service.durationMinutes) }}</dd>
        </div>
        <div class="flex items-baseline justify-between gap-4">
          <dt class="text-muted">Prix indicatif</dt>
          <dd class="text-right font-display text-xl text-cocoa-dark">
            {{ formatPrice(service.price, service.currency) }}
          </dd>
        </div>
      </dl>
    </section>

    <!-- Cliente -->
    <section class="card-surface flex flex-col gap-4 p-5 sm:p-6">
      <h3 class="font-display text-2xl text-cocoa-dark">Vos informations</h3>

      <ul class="flex flex-col gap-3 text-sm">
        <li class="flex items-start gap-3">
          <AppIcon name="user" class="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <span class="text-cocoa-dark">{{ customer.firstName }} {{ customer.lastName }}</span>
        </li>
        <li class="flex items-start gap-3">
          <AppIcon name="phone" class="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <span class="text-cocoa-dark">{{ customer.phone }}</span>
        </li>
        <li class="flex items-start gap-3">
          <AppIcon name="mail" class="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <span class="break-all text-cocoa-dark">{{ customer.email }}</span>
        </li>
        <li v-if="customer.note" class="flex items-start gap-3">
          <AppIcon name="quote" class="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <span class="text-muted">{{ customer.note }}</span>
        </li>
      </ul>

      <p class="mt-auto rounded-xl bg-ivory p-4 text-xs leading-relaxed text-muted">
        Les tarifs et durées sont indicatifs et peuvent varier selon la longueur et l’état de vos
        locks. Le salon vous recontacte pour confirmer définitivement le rendez-vous.
      </p>
    </section>
  </div>
</template>
