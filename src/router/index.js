import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import { brand } from '@/data/salon'
import { applyPageMeta } from '@/utils/seo'

/**
 * Chaque route porte son titre ET sa description : sans cela, les sept pages
 * partageraient la description unique du index.html et se feraient concurrence
 * dans les résultats de recherche.
 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Salon spécialisé dans les locks',
      description:
        'Beauté Halal, salon entièrement dédié aux locks : création, entretien, réparation, coiffure, coloration et soins. Prenez rendez-vous en ligne en moins de deux minutes.',
    },
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('@/views/ServicesView.vue'),
    meta: {
      title: 'Nos services',
      description:
        'Création, entretien, réparation, coiffure, coloration et soins des locks. Durées et tarifs indicatifs, ajustés à la longueur et à l’état de vos locks.',
    },
  },
  {
    path: '/galerie',
    name: 'gallery',
    component: () => import('@/views/GalleryView.vue'),
    meta: {
      title: 'Nos coiffures',
      description:
        'Nos coiffures en images : créations, entretiens, coiffures, colorations et transformations avant / après. Réservez directement la coiffure qui vous plaît.',
    },
  },
  {
    path: '/a-propos',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: 'À propos',
      description:
        'L’histoire de Beauté Halal, nos valeurs et le déroulé d’un rendez-vous : diagnostic, conseil, réalisation et suivi d’entretien.',
    },
  },
  {
    path: '/rendez-vous',
    name: 'booking',
    component: () => import('@/views/BookingView.vue'),
    meta: {
      title: 'Prendre rendez-vous',
      description:
        'Réservez votre rendez-vous en ligne : choisissez votre prestation, votre date et votre créneau. Disponibilités en temps réel.',
    },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: {
      title: 'Contact',
      description:
        'Coordonnées, horaires et accès du salon Beauté Halal. Écrivez-nous par formulaire, par e-mail ou sur WhatsApp.',
    },
  },
  // Une vraie page 404 plutôt qu'une redirection vers l'accueil : la redirection
  // crée un « soft 404 », que les moteurs de recherche pénalisent.
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'Page introuvable',
      description: 'Cette page n’existe pas ou n’existe plus.',
      noindex: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 96, behavior: 'smooth' }
    return { top: 0 }
  },
})

/*
 * Filet contre les déploiements à cheval.
 *
 * Les vues sont chargées à la demande : leur fichier est téléchargé au moment
 * où l'on arrive dessus. Si un nouveau build a été mis en ligne entre-temps,
 * ce fichier n'existe plus sous le nom que la page connaît — le chargement
 * échoue, la vue n'apparaît jamais et l'écran reste figé sur la page
 * précédente, adresse déjà changée. C'est silencieux et très déroutant.
 *
 * On recharge alors la page une seule fois, ce qui va rechercher la version
 * à jour. Le drapeau en sessionStorage évite toute boucle : si le rechargement
 * ne suffit pas, l'erreur est laissée telle quelle plutôt que de tourner sans
 * fin.
 */
const RELOAD_FLAG = 'bh_chunk_reload'

router.onError((error, to) => {
  const message = String(error?.message ?? '')
  const chargementRate =
    /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(
      message,
    )
  if (!chargementRate || !to?.fullPath) return

  let dejaTente = false
  try {
    dejaTente = sessionStorage.getItem(RELOAD_FLAG) === '1'
    sessionStorage.setItem(RELOAD_FLAG, '1')
  } catch {
    // Navigation privée ou stockage bloqué : on tente le rechargement une fois.
  }
  if (!dejaTente) window.location.assign(to.fullPath)
})

router.afterEach(() => {
  try {
    sessionStorage.removeItem(RELOAD_FLAG)
  } catch {
    /* sans importance */
  }
})

router.afterEach((to) => {
  applyPageMeta({
    title: to.meta?.title ? `${brand.name} — ${to.meta.title}` : brand.name,
    description: to.meta?.description ?? '',
    path: to.path,
    noindex: Boolean(to.meta?.noindex),
  })
})

export default router
