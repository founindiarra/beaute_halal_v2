/**
 * Directive v-reveal : apparition douce d'un élément lorsqu'il entre dans le viewport.
 * Usage : <div v-reveal> ... </div>  ou  <div v-reveal="150"> (délai en ms)
 */
const reveal = {
  mounted(el, binding) {
    if (typeof IntersectionObserver === 'undefined') return

    el.classList.add('reveal')
    if (binding.value) el.style.transitionDelay = `${binding.value}ms`

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          el.classList.add('reveal-in')
          observer.unobserve(el)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    el._revealObserver = observer
  },
  unmounted(el) {
    el._revealObserver?.disconnect()
    delete el._revealObserver
  },
}

export default reveal
