import { images } from './images'

/**
 * Catalogue des prestations.
 * ⚠️ DONNÉES FICTIVES — noms, durées et tarifs sont indicatifs et remplaçables.
 * `duration` est exprimée en minutes, `price` en FCFA.
 */
export const serviceCategories = [
  {
    id: 'creation',
    name: 'Création',
    description: 'Le point de départ de vos locks, pensé selon votre texture et votre projet.',
  },
  {
    id: 'entretien',
    name: 'Entretien',
    description: 'Des racines nettes et des longueurs saines, à un rythme adapté à vos cheveux.',
  },
  {
    id: 'reparation',
    name: 'Réparation',
    description: 'Renforcer, reconstruire, rattraper : redonner de la tenue à des locks fragilisées.',
  },
  {
    id: 'coiffure',
    name: 'Coiffure',
    description: 'Des mises en forme élégantes, du quotidien aux grandes occasions.',
  },
  {
    id: 'coloration',
    name: 'Coloration',
    description: 'Des nuances travaillées avec précaution pour préserver la fibre.',
  },
  {
    id: 'soins',
    name: 'Soins',
    description: 'Nettoyage, hydratation et soin du cuir chevelu, la base de belles locks.',
  },
]

export const services = [
  // ---------- Création ----------
  {
    id: 'creation-locks',
    name: 'Création de locks',
    category: 'creation',
    description:
      'Création complète de vos locks, méthode choisie ensemble après un diagnostic du cheveu et de votre style de vie.',
    duration: 300,
    price: 60000,
    image: images.locks1,
    featured: true,
  },
  {
    id: 'starter-locks',
    name: 'Starter locks',
    category: 'creation',
    description:
      'Départ de locks sur cheveux courts, avec section régulière et conseils d’entretien des premières semaines.',
    duration: 210,
    price: 45000,
    image: images.locks7,
  },

  // ---------- Entretien ----------
  {
    id: 'retwist',
    name: 'Retwist',
    category: 'entretien',
    description:
      'Reprise des racines, tension maîtrisée et finition nette pour des locks bien alignées.',
    duration: 120,
    price: 20000,
    image: images.gesture1,
    featured: true,
  },
  {
    id: 'entretien-classique',
    name: 'Entretien classique',
    category: 'entretien',
    description:
      'Lavage, retwist et séchage : la routine complète pour garder des locks propres et souples.',
    duration: 150,
    price: 27000,
    image: images.gesture2,
  },
  {
    id: 'entretien-coiffure',
    name: 'Entretien + coiffure',
    category: 'entretien',
    description:
      'L’entretien complet suivi d’une mise en forme au choix, pour repartir prête pour l’occasion.',
    duration: 195,
    price: 38000,
    image: images.locks4,
  },

  // ---------- Réparation ----------
  {
    id: 'reparation-locks',
    name: 'Réparation de locks',
    category: 'reparation',
    description:
      'Réparation des locks cassées ou amincies, lock par lock, pour retrouver une longueur homogène.',
    duration: 180,
    price: 35000,
    image: images.gesture3,
    featured: true,
  },
  {
    id: 'renforcement',
    name: 'Renforcement',
    category: 'reparation',
    description:
      'Consolidation des racines fragilisées et des zones de tension, avec un protocole de soin adapté.',
    duration: 120,
    price: 25000,
    image: images.gesture4,
  },
  {
    id: 'reconstruction',
    name: 'Reconstruction',
    category: 'reparation',
    description:
      'Reprise en profondeur d’un ensemble abîmé : sections revues, longueurs rattrapées, équilibre retrouvé.',
    duration: 270,
    price: 55000,
    image: images.locks8,
  },

  // ---------- Coiffure ----------
  {
    id: 'coiffure-locks',
    name: 'Coiffures sur locks',
    category: 'coiffure',
    description:
      'Chignons, tresses, attaches hautes ou basses : une coiffure élégante pensée pour tenir toute la journée.',
    duration: 90,
    price: 18000,
    image: images.locks2,
    featured: true,
  },
  {
    id: 'styles-specifiques',
    name: 'Styles spécifiques',
    category: 'coiffure',
    description:
      'Coiffures de cérémonie et créations sur mesure, préparées ensemble avant le rendez-vous.',
    duration: 150,
    price: 32000,
    image: images.locks3,
  },

  // ---------- Coloration ----------
  {
    id: 'coloration',
    name: 'Coloration',
    category: 'coloration',
    description:
      'Coloration sur locks avec test préalable, pour une nuance homogène et un cheveu respecté.',
    duration: 180,
    price: 42000,
    image: images.locks5,
    featured: true,
  },
  {
    id: 'decoloration',
    name: 'Décoloration',
    category: 'coloration',
    description:
      'Éclaircissement progressif et contrôlé, accompagné d’un soin reconstructeur systématique.',
    duration: 210,
    price: 50000,
    image: images.locks9,
  },
  {
    id: 'patine',
    name: 'Patine',
    category: 'coloration',
    description: 'Correction et raffinement de la nuance pour un résultat plus doux et lumineux.',
    duration: 60,
    price: 15000,
    image: images.locks10,
  },

  // ---------- Soins ----------
  {
    id: 'soin-profond',
    name: 'Soin profond',
    category: 'soins',
    description:
      'Bain de soin nourrissant en profondeur, idéal après une coloration ou en période sèche.',
    duration: 75,
    price: 16000,
    image: images.gesture5,
    featured: true,
  },
  {
    id: 'hydratation',
    name: 'Hydratation',
    category: 'soins',
    description:
      'Rituel d’hydratation pour redonner souplesse et brillance à des locks qui manquent d’eau.',
    duration: 60,
    price: 12000,
    image: images.locks6,
  },
  {
    id: 'nettoyage',
    name: 'Nettoyage',
    category: 'soins',
    description:
      'Nettoyage en profondeur qui élimine les résidus accumulés et allège les locks.',
    duration: 75,
    price: 14000,
    image: images.locks11,
  },
  {
    id: 'soin-cuir-chevelu',
    name: 'Soin du cuir chevelu',
    category: 'soins',
    description:
      'Apaisement et rééquilibrage du cuir chevelu, avec massage et conseils personnalisés.',
    duration: 60,
    price: 13000,
    image: images.locks12,
  },
]

export const featuredServices = services.filter((service) => service.featured)

export const getServiceById = (id) => services.find((service) => service.id === id) || null

export const getServicesByCategory = (categoryId) =>
  services.filter((service) => service.category === categoryId)

export const getCategoryById = (id) =>
  serviceCategories.find((category) => category.id === id) || null

export default services
