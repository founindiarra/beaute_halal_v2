<script setup>
import AppImage from '@/components/ui/AppImage.vue'

defineProps({
  member: { type: Object, required: true },
  detailed: { type: Boolean, default: false },
})
</script>

<template>
  <article class="group flex h-full flex-col">
    <!-- Portrait sous l'arche de la marque -->
    <div class="arch-frame">
      <div class="arch">
        <AppImage
          :src="member.imageUrl"
          :alt="`${member.name}, ${member.role} chez Beauté Halal`"
          ratio="3/4"
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
          class="transition-transform duration-[1600ms] ease-[var(--ease-expo)] group-hover:scale-[1.06]"
        />
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-2 px-1 pt-7">
      <h3 class="text-[1.6rem]">{{ member.name }}</h3>
      <p class="text-[0.68rem] uppercase tracking-[0.28em] text-gold">{{ member.role }}</p>
      <p class="text-sm font-medium text-cocoa">{{ member.specialty }}</p>
      <p class="text-sm leading-relaxed text-muted" :class="detailed ? '' : 'line-clamp-3'">
        {{ member.bio }}
      </p>
    </div>
  </article>
</template>
