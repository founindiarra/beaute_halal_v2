<script setup>
import AppIcon from './AppIcon.vue'
import BaseButton from './BaseButton.vue'

/**
 * Affiche l'état d'un chargement API (chargement / erreur / vide) dans le style du site.
 * Tant qu'un de ces états est actif, le contenu par défaut n'est pas rendu.
 *
 *   <DataState :loading="loading" :error="error" :empty="!items.length" @retry="reload">
 *     … contenu normal …
 *   </DataState>
 */
defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
  empty: { type: Boolean, default: false },
  loadingLabel: { type: String, default: 'Chargement…' },
  emptyLabel: { type: String, default: 'Rien à afficher pour le moment.' },
  tone: { type: String, default: 'dark' }, // dark sur fond clair, light sur fond sombre
})

defineEmits(['retry'])
</script>

<template>
  <div v-if="loading" class="flex flex-col items-center gap-5 py-16 text-center">
    <!-- Trois locks qui se balancent : le chargement à l'image de la marque -->
    <span class="flex h-10 items-start gap-2" aria-hidden="true">
      <span
        v-for="n in 3"
        :key="n"
        class="lock-swing block w-[3px] origin-top rounded-full"
        :class="tone === 'light' ? 'bg-gold-soft' : 'bg-gold'"
        :style="{ height: `${[28, 40, 32][n - 1]}px`, animationDelay: `${n * 0.18}s` }"
      />
    </span>
    <p class="text-sm tracking-wide" :class="tone === 'light' ? 'text-cream/70' : 'text-muted'" role="status">
      {{ loadingLabel }}
    </p>
  </div>

  <div v-else-if="error" class="flex flex-col items-center gap-5 py-16 text-center">
    <span
      class="grid h-14 w-14 place-items-center rounded-full border"
      :class="
        tone === 'light'
          ? 'border-gold-soft/40 text-gold-soft'
          : 'border-gold/40 bg-ivory text-gold'
      "
    >
      <AppIcon name="shield" class="h-5 w-5" />
    </span>
    <p
      class="max-w-md text-sm leading-relaxed"
      :class="tone === 'light' ? 'text-cream/75' : 'text-muted'"
    >
      {{ error }}
    </p>
    <BaseButton
      size="sm"
      :variant="tone === 'light' ? 'outline-light' : 'secondary'"
      @click="$emit('retry')"
    >
      Réessayer
    </BaseButton>
  </div>

  <p
    v-else-if="empty"
    class="py-16 text-center text-sm"
    :class="tone === 'light' ? 'text-cream/70' : 'text-muted'"
  >
    {{ emptyLabel }}
  </p>

  <slot v-else />
</template>

<style scoped>
.lock-swing {
  animation: swing 1.6s ease-in-out infinite;
}
@keyframes swing {
  0%,
  100% {
    transform: rotate(-9deg) scaleY(0.92);
    opacity: 0.55;
  }
  50% {
    transform: rotate(9deg) scaleY(1);
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .lock-swing {
    animation: none;
  }
}
</style>
