import { images } from './images'

/**
 * Réalisations affichées dans la galerie.
 * ⚠️ DONNÉES FICTIVES — à remplacer par les photos réelles du salon.
 */
export const galleryCategories = [
  { id: 'all', name: 'Toutes' },
  { id: 'creation', name: 'Création' },
  { id: 'entretien', name: 'Entretien' },
  { id: 'coiffure', name: 'Coiffure' },
  { id: 'coloration', name: 'Coloration' },
  { id: 'avant-apres', name: 'Avant / Après' },
]

export const galleryItems = [
  {
    id: 'g-01',
    title: 'Création de locks moyennes',
    category: 'creation',
    description: 'Sections régulières et départ net sur cheveux naturels.',
    image: images.locks1,
    featured: true,
  },
  {
    id: 'g-02',
    title: 'Retwist finition brillante',
    category: 'entretien',
    description: 'Racines reprises et longueurs lissées, tension maîtrisée.',
    image: images.gesture1,
    featured: true,
  },
  {
    id: 'g-03',
    title: 'Chignon haut sur locks',
    category: 'coiffure',
    description: 'Une attache haute élégante, tenue toute la journée.',
    image: images.locks2,
    featured: true,
  },
  {
    id: 'g-04',
    title: 'Nuance caramel',
    category: 'coloration',
    description: 'Coloration chaude appliquée sur longueurs et pointes.',
    image: images.locks5,
    featured: true,
  },
  {
    id: 'g-05',
    title: 'Reconstruction complète',
    category: 'avant-apres',
    description: 'Locks amincies renforcées puis réalignées.',
    image: images.locks8,
    featured: true,
  },
  {
    id: 'g-06',
    title: 'Starter locks cheveux courts',
    category: 'creation',
    description: 'Départ court, sections fines et régulières.',
    image: images.locks7,
    featured: true,
  },
  {
    id: 'g-07',
    title: 'Entretien classique',
    category: 'entretien',
    description: 'Lavage, retwist et séchage naturel.',
    image: images.gesture2,
  },
  {
    id: 'g-08',
    title: 'Coiffure de cérémonie',
    category: 'coiffure',
    description: 'Mise en forme travaillée pour une grande occasion.',
    image: images.locks3,
  },
  {
    id: 'g-09',
    title: 'Éclaircissement progressif',
    category: 'coloration',
    description: 'Décoloration douce accompagnée d’un soin reconstructeur.',
    image: images.locks9,
  },
  {
    id: 'g-10',
    title: 'Avant / Après entretien',
    category: 'avant-apres',
    description: 'Racines reprises après plusieurs semaines sans entretien.',
    image: images.gesture3,
  },
  {
    id: 'g-11',
    title: 'Locks longues soignées',
    category: 'entretien',
    description: 'Longueurs hydratées et pointes refermées.',
    image: images.locks4,
  },
  {
    id: 'g-12',
    title: 'Attache basse tressée',
    category: 'coiffure',
    description: 'Un style sobre, parfait au quotidien.',
    image: images.locks6,
  },
  {
    id: 'g-13',
    title: 'Patine douce',
    category: 'coloration',
    description: 'Correction de nuance pour un rendu plus lumineux.',
    image: images.locks10,
  },
  {
    id: 'g-14',
    title: 'Départ de locks fines',
    category: 'creation',
    description: 'Sections fines pour un rendu léger et mobile.',
    image: images.locks11,
  },
  {
    id: 'g-15',
    title: 'Renforcement des racines',
    category: 'avant-apres',
    description: 'Zones de tension consolidées puis soignées.',
    image: images.gesture4,
  },
]

export const featuredGalleryItems = galleryItems.filter((item) => item.featured)

export default galleryItems
