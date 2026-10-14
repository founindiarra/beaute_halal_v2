<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  rating: { type: Number, required: true },
  max: { type: Number, default: 5 },
})
</script>

<template>
  <div class="flex items-center gap-1" :aria-label="`Note : ${rating} sur ${max}`">
    <AppIcon
      v-for="index in max"
      :key="index"
      name="star-filled"
      class="h-4 w-4"
      :class="index <= Math.round(rating) ? 'text-gold' : 'text-sand-dark'"
    />
  </div>
</template>
