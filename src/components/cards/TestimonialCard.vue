<script setup>
import StarRating from '@/components/ui/StarRating.vue'
import { formatDateShort } from '@/utils/format'

defineProps({
  testimonial: { type: Object, required: true },
})
</script>

<template>
  <article
    class="relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-sand-dark/70 bg-white p-6 sm:p-7"
  >
    <span
      class="pointer-events-none absolute -right-1 -top-6 select-none font-display text-[7rem] leading-none text-sand"
      aria-hidden="true"
    >
      ”
    </span>

    <StarRating :rating="testimonial.rating" class="relative" />

    <p class="relative flex-1 text-[1.02rem] leading-relaxed text-cocoa-dark">
      {{ testimonial.comment }}
    </p>

    <div class="relative flex items-center gap-3 border-t border-dashed border-sand-dark pt-4">
      <span
        class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cocoa-dark font-display text-lg text-gold-soft"
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
      <span v-if="testimonial.reviewedOn" class="shrink-0 text-[0.75rem] text-muted">
        {{ formatDateShort(testimonial.reviewedOn) }}
      </span>
    </div>
  </article>
</template>
