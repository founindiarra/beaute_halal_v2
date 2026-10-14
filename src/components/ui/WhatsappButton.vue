<script setup>
import { computed } from 'vue'

import AppIcon from './AppIcon.vue'
import BaseButton from './BaseButton.vue'
import { useWhatsapp } from '@/composables/useWhatsapp'

/**
 * Bouton WhatsApp. Le numéro vient de l'API : tant qu'il n'est pas renseigné
 * côté salon, le bouton reste visible mais désactivé (aucun lien cassé).
 */
const props = defineProps({
  message: { type: String, default: '' },
  label: { type: String, default: 'WhatsApp' },
  variant: { type: String, default: 'secondary' },
  size: { type: String, default: 'md' },
  block: { type: Boolean, default: false },
})

const { buildWhatsappLink, isAvailable } = useWhatsapp()

const link = computed(() => buildWhatsappLink(props.message))
</script>

<template>
  <div class="flex flex-col gap-1.5" :class="block ? 'w-full' : 'items-start'">
    <BaseButton
      :href="link || undefined"
      :variant="variant"
      :size="size"
      :block="block"
      :disabled="!link"
      :title="link ? 'Ouvrir la conversation WhatsApp' : 'Numéro bientôt disponible'"
    >
      <AppIcon name="whatsapp" class="h-[1.05rem] w-[1.05rem]" />
      <span>{{ label }}</span>
    </BaseButton>

    <p v-if="!isAvailable" class="text-xs text-muted">Numéro bientôt disponible</p>
  </div>
</template>
