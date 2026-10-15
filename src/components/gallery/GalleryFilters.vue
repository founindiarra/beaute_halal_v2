<script setup>
defineProps({
  categories: { type: Array, required: true },
  modelValue: { type: String, required: true },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <!-- Défilement horizontal sur mobile, aucun débordement de la page -->
  <div class="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0" style="scrollbar-width: none">
    <div class="flex w-max min-w-full justify-start gap-2.5 sm:w-full sm:flex-wrap sm:justify-center">
      <button
        v-for="category in categories"
        :key="category.slug"
        type="button"
        class="min-h-[44px] shrink-0 rounded-full border px-6 py-2 text-[0.72rem] font-medium uppercase tracking-[0.2em] transition-all duration-500 ease-[var(--ease-expo)]"
        :class="
          modelValue === category.slug
            ? 'border-espresso bg-espresso text-gold-soft shadow-[var(--shadow-soft)]'
            : 'border-sand-dark bg-transparent text-cocoa hover:-translate-y-0.5 hover:border-gold hover:text-cocoa-dark'
        "
        :aria-pressed="modelValue === category.slug"
        @click="$emit('update:modelValue', category.slug)"
      >
        {{ category.name }}
      </button>
    </div>
  </div>
</template>
