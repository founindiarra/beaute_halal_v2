/**
 * Avis clientes.
 * ⚠️ DONNÉES FICTIVES — à remplacer par de vrais avis.
 */
export const testimonials = [
  {
    id: 't-1',
    firstName: 'Awa',
    rating: 5,
    date: '2026-07-12',
    service: 'Création de locks',
    comment:
      'On m’a expliqué chaque étape avant de commencer. Six mois plus tard, mes locks sont régulières et je n’ai eu aucune casse.',
  },
  {
    id: 't-2',
    firstName: 'Nadia',
    rating: 5,
    date: '2026-06-28',
    service: 'Retwist',
    comment:
      'La finition est nette et la tension est douce. C’est le premier salon où je ne repars pas avec des racines douloureuses.',
  },
  {
    id: 't-3',
    firstName: 'Kadiatou',
    rating: 4,
    date: '2026-06-05',
    service: 'Coloration',
    comment:
      'Le test de couleur avant le rendez-vous m’a rassurée. Le résultat est exactement la nuance que nous avions choisie ensemble.',
  },
  {
    id: 't-4',
    firstName: 'Sarah',
    rating: 5,
    date: '2026-05-19',
    service: 'Réparation de locks',
    comment:
      'Trois de mes locks étaient cassées, je pensais devoir tout recommencer. Elles ont été reprises une par une, on ne voit plus rien.',
  },
  {
    id: 't-5',
    firstName: 'Mariam',
    rating: 5,
    date: '2026-04-30',
    service: 'Entretien + coiffure',
    comment:
      'Le salon est calme et l’accueil est vraiment chaleureux. J’y viens désormais toutes les six semaines.',
  },
  {
    id: 't-6',
    firstName: 'Léa',
    rating: 4,
    date: '2026-04-11',
    service: 'Soin profond',
    comment:
      'Mes longueurs étaient très sèches. Après le soin et les conseils donnés, elles sont nettement plus souples.',
  },
]

export const averageRating =
  Math.round((testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length) * 10) / 10

export default testimonials
