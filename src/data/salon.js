/**
 * Contenu éditorial du site — ce qui ne vient PAS de l'API.
 *
 * Les coordonnées, horaires, réseaux sociaux et le numéro WhatsApp sont
 * désormais servis par l'API (`GET /salon`) et lus via `useSalon()`.
 * Ne remettez pas de coordonnées ici : elles seraient ignorées par le site.
 */

/** Repli affiché avant la réponse de l'API (titre de page, logo). */
export const brand = {
  name: 'Beauté Halal',
  specialty: 'Spécialiste des locks',
}

/** Valeurs présentées sur la page À propos. */
export const values = [
  {
    title: 'Le soin avant tout',
    text: 'Chaque prestation commence par un diagnostic du cheveu et du cuir chevelu, pour ne jamais fragiliser vos locks.',
  },
  {
    title: 'Un geste précis',
    text: 'Des techniques maîtrisées, une racine nette, une tension juste : la beauté des locks tient à la régularité du geste.',
  },
  {
    title: 'Un accueil attentionné',
    text: 'Un espace calme, discret et chaleureux, où l’on prend le temps de vous écouter et de vous conseiller.',
  },
  {
    title: 'La transparence',
    text: 'Durées et tarifs annoncés à l’avance, conseils d’entretien remis après chaque rendez-vous.',
  },
]

export default brand
