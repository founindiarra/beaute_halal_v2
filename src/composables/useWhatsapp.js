import { computed } from 'vue'

import { useSalon } from './useSalon'

/**
 * Construit un lien WhatsApp à partir du numéro fourni par l'API
 * (`GET /salon` → `whatsapp.number`).
 *
 * Tant que le salon n'a pas renseigné son numéro, la fonction renvoie `null` :
 * les boutons WhatsApp restent visibles mais désactivés, jamais en lien mort.
 */
export function useWhatsapp() {
  const { salon } = useSalon()

  const number = computed(() => (salon.value?.whatsapp?.number || '').replace(/\D/g, ''))
  const isAvailable = computed(() => Boolean(number.value))
  const defaultMessage = computed(() => salon.value?.whatsapp?.defaultMessage || '')

  const buildWhatsappLink = (message) => {
    if (!number.value) return null
    const text = encodeURIComponent(message || defaultMessage.value)
    return text ? `https://wa.me/${number.value}?text=${text}` : `https://wa.me/${number.value}`
  }

  return { number, isAvailable, defaultMessage, buildWhatsappLink }
}

export default useWhatsapp
