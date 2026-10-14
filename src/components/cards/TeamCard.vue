<script setup>
import AppImage from '@/components/ui/AppImage.vue'

defineProps({
  member: { type: Object, required: true },
  detailed: { type: Boolean, default: false },
})
</script>

<template>
  <article class="group flex h-full flex-col">
    <div class="overflow-hidden rounded-2xl bg-sand">
      <AppImage
        :src="member.imageUrl"
        :alt="`${member.name}, ${member.role} chez Beauté Halal`"
        ratio="3/4"
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
        class="transition-transform duration-700 group-hover:scale-[1.04]"
      />
    </div>

    <div class="flex flex-1 flex-col gap-2 px-1 pt-5">
      <h3 class="text-[1.35rem]">{{ member.name }}</h3>
      <p class="text-[0.7rem] uppercase tracking-[0.2em] text-gold">{{ member.role }}</p>
      <p class="text-sm font-medium text-cocoa">{{ member.specialty }}</p>
      <p
        class="text-sm leading-relaxed text-muted"
        :class="detailed ? '' : 'line-clamp-3'"
      >
        {{ member.bio }}
      </p>
    </div>
  </article>
</template>
