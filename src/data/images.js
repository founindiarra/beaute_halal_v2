/**
 * Images de démonstration (photos libres Unsplash).
 * ⚠️ IMAGES FICTIVES — à remplacer par les photos réelles du salon.
 *
 * Pour utiliser des images locales : déposez-les dans /public/images
 * et remplacez simplement les URL ci-dessous par '/images/mon-image.jpg'.
 *
 * Les clés qui pointent vers /images/… sont les photos réelles fournies par
 * le salon. Elles sont déjà recadrées au format d'affichage : aucun
 * paramètre de redimensionnement ne leur est appliqué, contrairement aux
 * URL Unsplash ci-dessous.
 *
 * Les photos des prestations et de la galerie, elles, ne sont pas ici :
 * elles vivent en base et se téléversent depuis le tableau de bord.
 */
const u = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const images = {
  // Locks — créations et styles
  /*
   * Bandeau d'accueil. Trois couches y sont déjà fondues : la salle du salon
   * floutée tout au fond, le marron de la marque par-dessus, et la cliente
   * devant, elle bien nette. Le sujet est cadré à droite : le titre est
   * aligné à gauche, il tombe donc sur le fond et non sur le visage.
   */
  hero: '/images/hero-accueil.jpg',
  /*
   * Même photo, cadrée en portrait pour les écrans étroits : le visage monte
   * dans le tiers haut et le texte vient se poser sur le buste.
   */
  heroMobile: '/images/hero-accueil-mobile.jpg',
  /*
   * Bandeaux des pages intérieures. Même mise en forme que l'accueil — salle
   * floutée au fond, marron par-dessus, photo nette posée à droite — mais
   * chaque page garde la photo qui lui est propre.
   */
  heroServices: '/images/hero-services.jpg',
  heroGalerie: '/images/hero-galerie.jpg',
  heroRendezVous: '/images/hero-rendez-vous.jpg',
  heroContact: '/images/hero-contact.jpg',
  /* Photo de salle : elle occupe tout le bandeau, sans détourage. */
  heroAPropos: '/images/banniere-galerie.jpg',
  /*
   * Les mêmes, cadrés en portrait pour les écrans étroits : la photo occupe
   * le haut, le texte se pose sur le fond en dessous.
   */
  heroServicesMobile: '/images/hero-services-mobile.jpg',
  heroGalerieMobile: '/images/hero-galerie-mobile.jpg',
  heroRendezVousMobile: '/images/hero-rendez-vous-mobile.jpg',
  heroContactMobile: '/images/hero-contact-mobile.jpg',
  /*
   * Fond du bloc « Rendez-vous » qui ferme les pages : le chignon, cadré
   * serré. À droite du texte sur écran large, au-dessus sur téléphone.
   */
  cta: '/images/fond-rendez-vous.jpg',
  ctaMobile: '/images/fond-rendez-vous-mobile.jpg',
  locks1: u('1551493923-9a1b98921caa'),
  locks2: u('1535146981003-d37e3e2428c3'),
  locks3: u('1635627091599-aedcf8241102'),
  locks4: u('1662991859083-86e0b45208b0'),
  locks5: u('1625536658679-42d76fd167c0'),
  locks6: u('1653263169788-9332cdbf07f5'),
  locks7: u('1616166183781-0fdd2ef83374'),
  locks8: u('1625536658536-a94c4349850b'),
  locks9: u('1625536658660-dc9860965ca5'),
  locks10: u('1630488971092-ebf24950529f'),
  locks11: u('1606459249576-f00b2e5e0917'),
  locks12: u('1624561272659-224ea122b2e9'),

  // Gestes techniques / mains du coiffeur
  gesture1: u('1672788694268-ecc234591d31'),
  gesture2: u('1663851071150-b6617bbee927'),
  gesture3: u('1647462742006-adc8b77b52d2'),
  gesture4: u('1629397662621-0d4b8e82801f'),
  gesture5: u('1575287537815-ef82dd922198'),

  // Salon
  salon1: u('1600948836101-f9ffda59d250', 1400),
  salon2: u('1626379501846-0df4067b8bb9', 1400),
  salon3: u('1626383137804-ff908d2753a2', 1400),
  salon4: u('1626383120723-2a941488860d', 1400),

  // Portraits équipe
  portrait1: u('1531123897727-8f129e1688ce', 800),
  portrait2: u('1593351799227-75df2026356b', 800),
  portrait3: u('1619694770795-e21c58464159', 800),
  portrait4: u('1629145810320-aec9e63dd798', 800),
}

export default images
