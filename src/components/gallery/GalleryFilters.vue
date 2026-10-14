<script setup>
defineProps({
  categories: { type: Array, required: true },
  modelValue: { type: String, required: true },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <!-- Défilement horizontal sur mobile, aucun débordement de la page -->
  <div class="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
    <div class="flex w-max min-w-full justify-start gap-2 sm:w-full sm:flex-wrap sm:justify-center">
      <button
        v-for="category in categories"
        :key="category.slug"
        type="button"
        class="min-h-[42px] shrink-0 rounded-lg border px-5 py-2 text-[0.88rem] tracking-[0.03em] transition-all duration-200"
        :class="
          modelValue === category.slug
            ? 'border-cocoa-dark bg-cocoa-dark text-cream'
            : 'border-sand-dark bg-white text-cocoa hover:border-cocoa-dark hover:text-cocoa-dark'
        "
        :aria-pressed="modelValue === category.slug"
        @click="$emit('update:modelValue', category.slug)"
      >
        {{ category.name }}
      </button>
    </div>
  </div>
</template>
