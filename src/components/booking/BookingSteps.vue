<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'

defineProps({
  steps: { type: Array, required: true },
  current: { type: Number, required: true },
  maxReached: { type: Number, required: true },
})

defineEmits(['select'])
</script>

<template>
  <nav aria-label="Étapes de la réservation">
    <p class="mb-3 text-[0.8rem] tracking-[0.06em] text-muted sm:hidden">
      Étape {{ current }} sur {{ steps.length }} ·
      <span class="text-cocoa-dark">{{ steps.find((step) => step.id === current)?.label }}</span>
    </p>

    <ol class="grid gap-1.5 sm:gap-4" :style="{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }">
      <li v-for="step in steps" :key="step.id">
        <button
          type="button"
          class="group flex w-full flex-col gap-2.5 text-left disabled:cursor-not-allowed"
          :disabled="step.id > maxReached"
          :aria-current="step.id === current ? 'step' : undefined"
          @click="$emit('select', step.id)"
        >
          <span
            class="h-[3px] w-full rounded-full transition-colors duration-300"
            :class="
              step.id === current
                ? 'bg-cocoa-dark'
                : step.id < current
                  ? 'bg-gold'
                  : step.id <= maxReached
                    ? 'bg-gold-soft/60'
                    : 'bg-sand-dark/70'
            "
            aria-hidden="true"
          />
          <span class="hidden items-center gap-2 sm:flex">
            <span
              class="grid h-5 w-5 place-items-center font-display text-[1.05rem] leading-none"
              :class="step.id === current ? 'text-cocoa-dark' : step.id < current ? 'text-gold' : 'text-muted/60'"
            >
              <AppIcon v-if="step.id < current" name="check" class="h-4 w-4" />
              <template v-else>{{ String(step.id).padStart(2, '0') }}</template>
            </span>
            <span
              class="truncate text-[0.7rem] uppercase tracking-[0.16em]"
              :class="
                step.id === current
                  ? 'font-medium text-cocoa-dark'
                  : step.id > maxReached
                    ? 'text-muted/60'
                    : 'text-muted group-hover:text-cocoa-dark'
              "
            >
              {{ step.label }}
            </span>
          </span>
        </button>
      </li>
    </ol>
  </nav>
</template>
