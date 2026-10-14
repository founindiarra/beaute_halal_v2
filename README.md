# Beauté Halal — Site web public

Site vitrine du salon **Beauté Halal**, spécialisé dans les **locks**.
Vue 3 · Vite · Tailwind CSS v4 · Vue Router · JavaScript.

> Le site consomme l'API **`backend_beaute_halal`**. Prestations, galerie, équipe,
> avis, horaires, coordonnées, disponibilités et réservations viennent du serveur.

---

## Démarrage

```bash
npm install
copy .env.example .env   # puis vérifiez VITE_API_URL et VITE_SITE_URL
npm run dev              # site sur http://localhost:5173
npm run build            # build de production (dossier dist/)
npm run preview          # prévisualisation du build (port 4173)
npm run lint             # ESLint, avec correction automatique
npm run format           # Prettier sur src/
```

### Quelle API ?

Le fichier `.env` décide seul de l'API utilisée.

| Contexte | `VITE_API_URL` |
| --- | --- |
| **Production (valeur actuelle)** | `https://backend-beaute-halal.aeemci-ce.ci/api` |
| Développement contre l'API locale | `http://localhost:4000/api` |

Pour travailler contre l'API locale, lancez d'abord le backend
(`npm run dev` dans `C:\Users\foune\backend_beaute_halal`, API sur le port 4000),
puis basculez la variable. Les ports 5173 et 4173 sont déjà autorisés par le
`CORS_ORIGINS` du backend ; toute autre origine doit y être ajoutée côté backend.

Si le site affiche « Impossible de joindre le serveur », c'est que l'API visée
par `VITE_API_URL` ne répond pas.

> Les variables sont lues **au moment du build** : après les avoir changées,
> relancez `npm run dev` ou `npm run build`.

---

## Arborescence

```
beaute_halal/
├─ index.html                 Point d'entrée, polices, métadonnées de repli
├─ vite.config.js             Plugins Vue + Tailwind, alias "@" → src/
├─ jsconfig.json              Résolution de l'alias "@" dans l'éditeur
├─ eslint.config.js           Règles ESLint (format plat, ESLint 9)
├─ .prettierrc.json           Style de formatage
├─ vercel.json                Réécriture SPA — Vercel
├─ netlify.toml               Build + réécriture SPA — Netlify
├─ public/
│  ├─ favicon.svg
│  ├─ .htaccess               Réécriture SPA + cache — Apache / cPanel
│  ├─ _redirects              Réécriture SPA — Netlify
│  ├─ robots.txt
│  └─ sitemap.xml
└─ src/
   ├─ main.js                 Création de l'app, router, directive v-reveal
   ├─ App.vue                 Layout global + données structurées du salon
   ├─ style.css               Tokens de design + classes utilitaires communes
   ├─ router/index.js         Les 7 routes + la page 404, titres et descriptions
   ├─ services/api.js         ★ POINT D'ENTRÉE RÉSEAU UNIQUE
   ├─ data/                   Contenu local restant (le reste vient de l'API)
   │  ├─ salon.js             Contenu éditorial : marque et valeurs (À propos)
   │  └─ images.js            Visuels d'ambiance du site
   ├─ utils/
   │  ├─ format.js            Prix, durées, dates (fr-FR)
   │  ├─ date.js              Clés de date locales (sans décalage UTC)
   │  └─ seo.js               Titre, description, canonical, Open Graph, JSON-LD
   ├─ composables/
   │  ├─ useApiData.js        Chargement + états erreur / vide + « Réessayer »
   │  ├─ useSalon.js          Informations du salon, chargées une fois
   │  ├─ useBooking.js        État partagé du parcours de réservation
   │  ├─ useWhatsapp.js       Construction des liens WhatsApp
   │  ├─ useScrollLock.js     Blocage du défilement (menu, lightbox)
   │  └─ useFocusTrap.js      Focus piégé, Échap, focus restitué (menu, lightbox)
   ├─ directives/reveal.js    Apparition douce au défilement
   ├─ components/
   │  ├─ layout/              AppHeader, AppFooter
   │  ├─ ui/                  BaseButton, AppIcon, AppImage, BrandMark, DataState,
   │  │                       SectionHeading, StarRating, WhatsappButton, PageHero
   │  ├─ cards/               ServiceCard, TeamCard, TestimonialCard
   │  ├─ gallery/             GalleryGrid, GalleryFilters, GalleryLightbox
   │  ├─ forms/               FormField, ContactForm
   │  ├─ booking/             BookingWizard, BookingSteps, BookingCalendar,
   │  │                       TimeSlotPicker, StepService, StepDetails,
   │  │                       StepSummary, StepConfirmation
   │  └─ sections/            Hero, Services, Gallery, Team, Testimonials, Cta
   │                          (IntroSection.vue n'est plus utilisée)
   └─ views/                  HomeView, ServicesView, GalleryView (Nos coiffures),
                              AboutView, TeamView, BookingView, ContactView,
                              NotFoundView
```

---

## Identité visuelle

| Rôle | Token | Valeur |
| --- | --- | --- |
| Fond principal | `cream` | `#FDFBF7` |
| Fond alterné | `ivory` | `#F8F2E9` |
| Beige / sable | `sand`, `sand-dark` | `#EFE4D5`, `#E0CDB6` |
| Nude | `nude` | `#D6B79B` |
| Doré (accent) | `gold`, `gold-soft` | `#B08A57`, `#CBAC81` |
| Brun / chocolat | `cocoa`, `cocoa-dark` | `#6B4E3D`, `#4A3528` |
| Texte | `ink`, `muted` | `#33251C`, `#7D6B5D` |

**Typographie** — Cormorant Garamond (titres, élégance) · Jost (textes, lisibilité).
Les tokens sont définis une seule fois dans `src/style.css` (bloc `@theme`) et
utilisables partout via les classes Tailwind (`bg-cream`, `text-gold`…).

---

## Déploiement

Le build produit un dossier `dist/` statique. **Le serveur doit renvoyer
`index.html` pour toute adresse inconnue**, sinon un rafraîchissement sur
`/services` donne une erreur 404 : c'est le routeur Vue qui gère les adresses.

| Hébergeur | Fichier | Action |
| --- | --- | --- |
| Apache / cPanel | `public/.htaccess` | Rien à faire, il est copié dans `dist/` |
| Netlify | `netlify.toml` + `public/_redirects` | Rien à faire |
| Vercel | `vercel.json` | Rien à faire |
| Nginx | — | Ajoutez le bloc ci-dessous à votre configuration |

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Avant de publier, vérifiez que `VITE_API_URL` et `VITE_SITE_URL` pointent bien
sur la production, puis relancez `npm run build`.

---

## Ce qu'il faut remplacer

Le contenu n'est plus dans le code : il vit **dans la base de données** du
backend. Modifiez-le depuis phpMyAdmin ou via l'API admin.

| À remplacer | Où |
| --- | --- |
| Téléphone, e-mail, adresse, horaires, réseaux, **numéro WhatsApp** | table `salon_settings` |
| Prestations, durées, tarifs | tables `services`, `service_categories` |
| Coiffures (« Nos coiffures ») | tables `gallery_items`, `gallery_categories` |
| Prestation réservable depuis une coiffure | colonne `gallery_items.service_id` |
| Équipe | table `team_members` |
| Avis clientes | table `testimonials` |
| Jours fermés et créneaux | tables `opening_hours`, `time_slots`, `closures` |

Restent dans le code du site :

| À remplacer | Fichier |
| --- | --- |
| Visuels d'ambiance (hero, sections, À propos) | `src/data/images.js` — **actuellement des photos Unsplash de démonstration** |
| Valeurs affichées sur la page À propos | `src/data/salon.js` |
| Image d'aperçu de partage, 1200 × 630 px | `public/og-image.jpg` — **à déposer** |

### WhatsApp

Renseignez `whatsapp_number` dans la table `salon_settings`, au format
international sans `+` ni espaces (ex. `2250000000000`). Tant que la valeur est
vide, les boutons WhatsApp restent visibles mais désactivés, avec la mention
« Numéro bientôt disponible ».

---

## Connexion à l'API

| Où | Quoi |
| --- | --- |
| `src/services/api.js` | Point d'entrée réseau **unique** — aucun `fetch` ailleurs |
| `src/composables/useApiData.js` | États chargement / erreur / vide + « Réessayer » |
| `src/composables/useSalon.js` | Informations du salon, chargées une fois et partagées |
| `src/components/ui/DataState.vue` | Affichage commun des trois états |
| `.env` | `VITE_API_URL` |

Les détails sont dans **`INTEGRATION-API.md`**.

---

## Référencement et partage

- Chaque route porte son propre **titre** et sa **description** (`src/router/index.js`).
- `src/utils/seo.js` met à jour à chaque page la description, le lien canonique
  et les balises Open Graph / Twitter, puis écrit les données structurées
  `schema.org/HairSalon` à partir de la réponse de `GET /salon`.
- `public/robots.txt` et `public/sitemap.xml` listent les sept pages publiques.
- Une adresse inconnue affiche une vraie page 404 marquée `noindex`, plutôt
  qu'une redirection vers l'accueil, qui serait vue comme un « soft 404 ».

> Le site étant une application monopage, les robots qui n'exécutent pas
> JavaScript ne voient que les valeurs de repli de `index.html`. Google exécute
> JavaScript ; si un référencement plus poussé devient nécessaire, la piste est
> le pré-rendu des sept pages au moment du build.

---

## Nos coiffures et la réservation

La page `/galerie` s'appelle **Nos coiffures** partout dans l'interface ;
l'adresse reste `/galerie` pour ne casser aucun lien déjà partagé.

Chaque coiffure porte un bouton **Réserver cette coiffure**, dans la grille
comme dans la vue agrandie :

- si la coiffure est rattachée à une prestation (`gallery_items.service_id`),
  celle-ci est **présélectionnée** et la cliente arrive directement au choix
  de la date ;
- sinon elle choisit sa prestation normalement.

Dans les deux cas le titre de la coiffure est repris dans le commentaire envoyé
au salon (« Coiffure souhaitée : … ») et rappelé, photo à l'appui, dans le
récapitulatif latéral du rendez-vous. Le salon sait donc toujours quelle
réalisation a été demandée, **même sans rattachement en base**.

Les cartes de prestation, elles, sont cliquables sur toute leur surface ; le
bouton « Réserver » reste le seul élément focalisable au clavier.

---

## Accessibilité

Mobile d'abord, vérifié à 320, 375, 768 et 1440 px : aucun débordement
horizontal, cibles tactiles d'au moins 42 px, focus visible sur tous les
éléments interactifs, animations neutralisées si le système le demande.

Le menu plein écran et la vue agrandie de la galerie sont de vraies fenêtres
modales : le focus y entre à l'ouverture, y reste tant qu'elles sont ouvertes,
Échap les ferme et le focus revient sur le bouton d'origine
(`src/composables/useFocusTrap.js`).

À l'étape « Informations » du rendez-vous, le bouton **Continuer** reste actif
même si le formulaire est incomplet : c'est le clic qui déclenche la validation,
affiche les messages et amène au premier champ à corriger. Un bouton grisé
n'expliquerait pas ce qui manque.

---

## Périmètre

Inclus : les 7 pages publiques, la page 404, le parcours de réservation en
6 étapes, la galerie filtrable avec vue agrandie, le formulaire de contact.

Hors périmètre à ce stade : tableau de bord administrateur (le dossier
`dashboard_beaute_halal` est encore vide), espace client, paiement en ligne,
application mobile.
