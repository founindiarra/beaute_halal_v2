/**
 * Directive v-reveal : apparition d'un élément lorsqu'il entre dans le viewport.
 *
 *   <div v-reveal>                    → monte en fondu (par défaut)
 *   <div v-reveal="150">              → même chose, avec 150 ms de délai
 *   <div v-reveal:mask="100">         → l'image se dévoile comme un rideau
 *   <div v-reveal:left> / :right / :zoom / :fade / :mask-x / :line
 *
 * Les styles vivent dans style.css (.reveal, data-reveal). Le délai passe par
 * la variable --d pour pouvoir s'ajouter à celui du rideau d'ouverture.
 */
const reveal = {
  mounted(el, binding) {
    if (typeof IntersectionObserver === 'undefined') return

    const delay = typeof binding.value === 'number' ? binding.value : (binding.value?.delay ?? 0)

    el.classList.add('reveal')
    el.dataset.reveal = binding.arg || 'up'
    el.style.setProperty('--d', `${delay}ms`)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          el.classList.add('reveal-in')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )

    // Un rideau (clip-path) masque l'élément lui-même : on observe son parent,
    // sans quoi le navigateur le jugerait invisible et ne le dévoilerait jamais.
    const masked = el.dataset.reveal === 'mask' || el.dataset.reveal === 'mask-x'
    const target = masked && el.parentElement ? el.parentElement : el

    observer.observe(target)
    el._revealObserver = observer
  },
  unmounted(el) {
    el._revealObserver?.disconnect()
    delete el._revealObserver
  },
}

export default reveal
