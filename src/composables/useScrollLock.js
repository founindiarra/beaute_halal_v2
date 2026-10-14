import { onBeforeUnmount } from 'vue'

/**
 * Bloque le défilement de la page (menu mobile, lightbox) sans provoquer
 * de saut de mise en page lié à la disparition de la barre de défilement.
 */
export function useScrollLock() {
  let locked = false

  const lock = () => {
    if (locked || typeof document === 'undefined') return
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    // Certains navigateurs mobiles font défiler <html> et non <body> : sans
    // les deux, la page continuait de glisser derrière le menu ouvert.
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    locked = true
  }

  const unlock = () => {
    if (!locked || typeof document === 'undefined') return
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    document.body.style.paddingRight = ''
    locked = false
  }

  onBeforeUnmount(unlock)

  return { lock, unlock }
}

export default useScrollLock
