/**
 * Directives de mouvement du site — aucune dépendance, tout est désactivé
 * pour qui a demandé moins d'animations (prefers-reduced-motion) et, quand
 * c'est un effet au pointeur, sur écran tactile.
 *
 *   v-split          titre découpé mot à mot, chaque mot monte de son masque
 *   v-parallax       décalage doux au défilement (valeur = vitesse, ex. 0.15)
 *   v-tilt           inclinaison 3D au survol (valeur = degrés max, ex. 6)
 *   v-magnetic       l'élément est attiré par le pointeur (valeur = force)
 */
const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches

/* ───────────────────────────── v-split ───────────────────────────── */

let wordIndex = 0

/** Remplace chaque mot par un masque + un mot ; les balises (<em>, <br>) sont conservées. */
function splitNode(node) {
  Array.from(node.childNodes).forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const fragment = document.createDocumentFragment()
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return
        if (/^\s+$/.test(part)) {
          fragment.append(document.createTextNode(' '))
          return
        }
        const mask = document.createElement('span')
        mask.className = 'split-w'
        mask.setAttribute('aria-hidden', 'true')
        const inner = document.createElement('span')
        inner.className = 'split-wi'
        inner.style.setProperty('--i', String(wordIndex++))
        inner.textContent = part
        mask.append(inner)
        fragment.append(mask)
      })
      child.replaceWith(fragment)
    } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
      splitNode(child)
    }
  })
}

export const split = {
  mounted(el, binding) {
    if (prefersReduced() || typeof IntersectionObserver === 'undefined') return

    const label = el.textContent.replace(/\s+/g, ' ').trim()
    el.setAttribute('aria-label', label)
    el.style.setProperty('--d', `${typeof binding.value === 'number' ? binding.value : 0}ms`)

    wordIndex = 0
    splitNode(el)

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        el.classList.add('split-in')
        observer.disconnect()
      },
      { threshold: 0.2, rootMargin: '0px 0px -5% 0px' },
    )
    observer.observe(el)
    el._splitObserver = observer
  },
  unmounted(el) {
    el._splitObserver?.disconnect()
  },
}

/* ─────────────────────────── v-parallax ─────────────────────────── */

const parallaxItems = new Set()
let parallaxQueued = false
let parallaxBound = false

function paintParallax() {
  parallaxQueued = false
  const viewport = window.innerHeight
  parallaxItems.forEach((item) => {
    const box = (item.el.parentElement || item.el).getBoundingClientRect()
    if (box.bottom < -300 || box.top > viewport + 300) return
    const offset = box.top + box.height / 2 - viewport / 2
    item.el.style.translate = `0 ${(offset * item.speed).toFixed(1)}px`
  })
}

const queueParallax = () => {
  if (parallaxQueued) return
  parallaxQueued = true
  requestAnimationFrame(paintParallax)
}

export const parallax = {
  mounted(el, binding) {
    if (prefersReduced()) return
    const speed = typeof binding.value === 'number' ? binding.value : 0.15
    el.style.willChange = 'translate'
    const item = { el, speed }
    el._parallaxItem = item
    parallaxItems.add(item)
    if (!parallaxBound) {
      window.addEventListener('scroll', queueParallax, { passive: true })
      window.addEventListener('resize', queueParallax, { passive: true })
      parallaxBound = true
    }
    queueParallax()
  },
  unmounted(el) {
    if (el._parallaxItem) parallaxItems.delete(el._parallaxItem)
  },
}

/* ───────────────────────────── v-tilt ───────────────────────────── */

export const tilt = {
  mounted(el, binding) {
    if (prefersReduced() || !hasFinePointer()) return
    const max = typeof binding.value === 'number' ? binding.value : 6
    el.classList.add('tilt')

    const move = (event) => {
      const box = el.getBoundingClientRect()
      const x = (event.clientX - box.left) / box.width - 0.5
      const y = (event.clientY - box.top) / box.height - 0.5
      el.classList.add('is-tilting')
      el.style.setProperty('--ry', `${(x * 2 * max).toFixed(2)}deg`)
      el.style.setProperty('--rx', `${(-y * 2 * max).toFixed(2)}deg`)
    }
    const leave = () => {
      el.classList.remove('is-tilting')
      el.style.setProperty('--ry', '0deg')
      el.style.setProperty('--rx', '0deg')
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    el._tiltCleanup = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  },
  unmounted(el) {
    el._tiltCleanup?.()
  },
}

/* ──────────────────────────── v-magnetic ──────────────────────────── */

export const magnetic = {
  mounted(el, binding) {
    if (binding.value === false || binding.value === 0) return
    if (prefersReduced() || !hasFinePointer()) return
    const strength = typeof binding.value === 'number' ? binding.value : 0.28

    const move = (event) => {
      const box = el.getBoundingClientRect()
      const dx = event.clientX - (box.left + box.width / 2)
      const dy = event.clientY - (box.top + box.height / 2)
      el.style.translate = `${(dx * strength).toFixed(1)}px ${(dy * strength).toFixed(1)}px`
    }
    const leave = () => {
      el.style.translate = '0 0'
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    el._magneticCleanup = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  },
  unmounted(el) {
    el._magneticCleanup?.()
  },
}
