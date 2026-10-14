import { images } from './images'

/**
 * Membres de l'équipe.
 * ⚠️ DONNÉES FICTIVES — noms et parcours à remplacer.
 */
export const team = [
  {
    id: 'aminata',
    name: 'Aminata',
    role: 'Fondatrice & loctician',
    specialty: 'Création et reconstruction de locks',
    bio: 'Elle a fondé le salon autour d’une idée simple : des locks bien faites tiennent dans le temps. Elle accompagne chaque cliente depuis le premier départ jusqu’à l’entretien régulier.',
    image: images.portrait1,
  },
  {
    id: 'fatou',
    name: 'Fatou',
    role: 'Loctician senior',
    specialty: 'Retwist et entretien',
    bio: 'Précise et patiente, elle est reconnue pour la régularité de ses racines et la propreté de ses finitions, même sur les chevelures les plus denses.',
    image: images.portrait2,
  },
  {
    id: 'mariam',
    name: 'Mariam',
    role: 'Coloriste',
    specialty: 'Coloration, décoloration et patine',
    bio: 'Elle travaille la couleur avec prudence : test préalable, protocole de soin systématique et nuances choisies avec vous avant toute application.',
    image: images.portrait3,
  },
  {
    id: 'salimata',
    name: 'Salimata',
    role: 'Spécialiste soins',
    specialty: 'Soins du cheveu et du cuir chevelu',
    bio: 'Elle établit un diagnostic avant chaque prestation et construit des routines simples à tenir à la maison, entre deux rendez-vous.',
    image: images.portrait4,
  },
]

export default team
