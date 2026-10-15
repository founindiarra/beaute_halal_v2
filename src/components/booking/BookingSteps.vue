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
    <p class="mb-4 text-[0.8rem] tracking-[0.06em] text-muted sm:hidden">
      Étape {{ current }} sur {{ steps.length }} ·
      <span class="font-display text-lg italic text-cocoa-dark">
        {{ steps.find((step) => step.id === current)?.label }}
      </span>
    </p>

    <ol
      class="grid gap-1 sm:gap-2"
      :style="{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }"
    >
      <li v-for="step in steps" :key="step.id">
        <button
          type="button"
          class="group flex w-full flex-col gap-3 text-left disabled:cursor-not-allowed"
          :disabled="step.id > maxReached"
          :aria-current="step.id === current ? 'step' : undefined"
          @click="$emit('select', step.id)"
        >
          <!-- Pastille + fil : le fil se remplit à mesure qu'on avance -->
          <span class="flex items-center gap-2 sm:gap-3">
            <span
              class="grid h-9 w-9 shrink-0 place-items-center rounded-full border font-display text-base transition-all duration-700 ease-[var(--ease-expo)]"
              :class="
                step.id === current
                  ? 'scale-110 border-espresso bg-espresso text-gold-soft shadow-[var(--shadow-soft)]'
                  : step.id < current
                    ? 'border-gold bg-gold text-ink'
                    : step.id <= maxReached
                      ? 'border-gold-soft text-cocoa group-hover:border-gold'
                      : 'border-sand-dark text-muted/60'
              "
            >
              <AppIcon v-if="step.id < current" name="check" class="h-4 w-4" />
              <template v-else>{{ String(step.id).padStart(2, '0') }}</template>
            </span>

            <span
              v-if="step.id < steps.length"
              class="relative block h-px flex-1 overflow-hidden bg-sand-dark/80"
              aria-hidden="true"
            >
              <span
                class="absolute inset-0 origin-left bg-gold transition-transform duration-[1100ms] ease-[var(--ease-expo)]"
                :class="step.id < current ? 'scale-x-100' : 'scale-x-0'"
              />
            </span>
          </span>

          <span
            class="hidden truncate text-[0.68rem] uppercase tracking-[0.2em] transition-colors duration-500 sm:block"
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
        </button>
      </li>
    </ol>
  </nav>
</template>
