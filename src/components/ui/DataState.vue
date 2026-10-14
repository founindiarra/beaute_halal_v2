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
  tone: { type: String, default: 'dark' }, // dark sur fond clair, light sur fond chocolat
})

defineEmits(['retry'])
</script>

<template>
  <div v-if="loading" class="flex flex-col items-center gap-4 py-14 text-center">
    <span
      class="h-8 w-8 animate-spin rounded-full border-2 border-transparent"
      :class="tone === 'light' ? 'border-t-gold-soft border-r-gold-soft/40' : 'border-t-gold border-r-gold/30'"
      aria-hidden="true"
    />
    <p class="text-sm" :class="tone === 'light' ? 'text-cream/70' : 'text-muted'">
      {{ loadingLabel }}
    </p>
  </div>

  <div v-else-if="error" class="flex flex-col items-center gap-4 py-14 text-center">
    <span
      class="grid h-12 w-12 place-items-center rounded-full"
      :class="tone === 'light' ? 'bg-cream/10 text-gold-soft' : 'bg-ivory text-gold'"
    >
      <AppIcon name="shield" class="h-5 w-5" />
    </span>
    <p
      class="max-w-md text-sm leading-relaxed"
      :class="tone === 'light' ? 'text-cream/75' : 'text-muted'"
    >
      {{ error }}
    </p>
    <BaseButton size="sm" :variant="tone === 'light' ? 'outline-light' : 'secondary'" @click="$emit('retry')">
      Réessayer
    </BaseButton>
  </div>

  <p
    v-else-if="empty"
    class="py-14 text-center text-sm"
    :class="tone === 'light' ? 'text-cream/70' : 'text-muted'"
  >
    {{ emptyLabel }}
  </p>

  <slot v-else />
</template>
