<script setup>
import StarRating from '@/components/ui/StarRating.vue'
import { formatDateShort } from '@/utils/format'

defineProps({
  testimonial: { type: Object, required: true },
})
</script>

<template>
  <article
    class="group relative flex h-full flex-col gap-6 overflow-hidden rounded-xl border border-sand-dark/60 bg-white p-7 shadow-[var(--shadow-soft)] transition-all duration-700 ease-[var(--ease-expo)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)] sm:p-9"
  >
    <span
      class="pointer-events-none absolute -right-1 -top-8 select-none font-display text-[9rem] leading-none text-gold/15 transition-colors duration-700 group-hover:text-gold/30"
      aria-hidden="true"
    >
      ”
    </span>

    <StarRating :rating="testimonial.rating" class="relative" />

    <p class="relative flex-1 font-display text-[1.35rem] italic leading-snug text-cocoa-dark">
      « {{ testimonial.comment }} »
    </p>

    <div class="relative flex items-center gap-3.5 border-t border-sand-dark/70 pt-5">
      <span
        class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-espresso font-display text-xl text-gold-soft"
        aria-hidden="true"
      >
        {{ testimonial.firstName?.charAt(0) }}
      </span>
      <div class="min-w-0 flex-1">
        <p class="font-display text-lg leading-tight text-cocoa-dark">{{ testimonial.firstName }}</p>
        <p v-if="testimonial.serviceName" class="truncate text-xs text-muted">
          {{ testimonial.serviceName }}
        </p>
      </div>
      <span v-if="testimonial.reviewedOn" class="shrink-0 text-[0.72rem] text-muted">
        {{ formatDateShort(testimonial.reviewedOn) }}
      </span>
    </div>
  </article>
</template>
