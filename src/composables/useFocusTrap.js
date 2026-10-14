import { nextTick, onBeforeUnmount, watch } from 'vue'

/**
 * Rend une couche modale utilisable au clavier (menu plein écran, lightbox) :
 *
 *   – le focus entre dans la couche à l'ouverture,
 *   – Tab et Maj+Tab bouclent à l'intérieur (jamais derrière la couche),
 *   – Échap ferme,
 *   – le focus revient sur l'élément qui a ouvert la couche à la fermeture.
 *
 *   const container = ref(null)
 *   useFocusTrap(container, isOpen, () => (isOpen.value = false))
 *
 * `isOpen` est une ref booléenne, `onClose` est appelée sur Échap.
 */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useFocusTrap(containerRef, isOpen, onClose) {
  let lastFocused = null

  const focusableItems = () => {
    const root = containerRef.value
    if (!root) return []
    return Array.from(root.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    )
  }

  const onKeydown = (event) => {
    if (!isOpen.value) return

    if (event.key === 'Escape') {
      event.preventDefault()
      onClose?.()
      return
    }

    if (event.key !== 'Tab') return

    const items = focusableItems()
    if (!items.length) return

    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement

    // Le focus sort par le bas → on repart du premier élément, et inversement.
    if (event.shiftKey && (active === first || !containerRef.value?.contains(active))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  watch(isOpen, async (open) => {
    if (open) {
      lastFocused = document.activeElement
      await nextTick()
      focusableItems()[0]?.focus()
      document.addEventListener('keydown', onKeydown)
    } else {
      document.removeEventListener('keydown', onKeydown)
      // L'élément déclencheur peut avoir disparu entre-temps.
      if (lastFocused?.isConnected) lastFocused.focus()
      lastFocused = null
    }
  })

  onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
}

export default useFocusTrap
