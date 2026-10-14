# Connexion du site à l'API

Le site public ne contient plus de données fictives : prestations, galerie,
équipe, avis, horaires, coordonnées, disponibilités et rendez-vous viennent
désormais du backend (`C:\Users\foune\backend_beaute_halal`).

---

## 1. Démarrage

Le site se branche sur l'API désignée par `VITE_API_URL`. **Aujourd'hui, le
`.env` du projet pointe sur l'API de production** : le site fonctionne donc sans
rien lancer en local.

```powershell
cd C:\Users\foune\beaute_halal
npm run dev            # http://localhost:5173, contre l'API de production
```

Pour travailler contre l'API locale, basculez `VITE_API_URL` puis lancez les
deux serveurs :

```powershell
# Terminal 1 — l'API
cd C:\Users\foune\backend_beaute_halal
npm run dev            # http://localhost:4000

# Terminal 2 — le site
cd C:\Users\foune\beaute_halal
npm run dev            # http://localhost:5173
```

Si l'API visée ne répond pas, le site s'affiche quand même mais chaque section
montre « Impossible de joindre le serveur » avec un bouton **Réessayer**.

---

## 2. Configuration

Deux variables, dans `.env` (modèle fourni dans `.env.example`) :

```
# Production — valeur actuellement en place
VITE_API_URL=https://backend-beaute-halal.aeemci-ce.ci/api

# Développement contre l'API locale
# VITE_API_URL=http://localhost:4000/api

# Adresse publique du site : canonical, partage social, sitemap
VITE_SITE_URL=https://beaute-halal.aeemci-ce.ci
```

Le préfixe `/api` fait partie de l'adresse : le backend expose toutes ses routes
publiques sous `/api` (par exemple `.../api/services`).

Les variables sont lues **au moment du build** : après les avoir changées,
relancez `npm run dev` ou `npm run build`.

Aucun secret ne doit figurer ici : tout ce qui se trouve dans un fichier `.env`
du front est visible par les visiteurs une fois le site publié.

### CORS

Le backend n'autorise que les origines listées dans **son** `.env` :

```
CORS_ORIGINS=http://localhost:5173,http://localhost:4173
```

L'adresse publique du site (`https://beaute-halal.aeemci-ce.ci`) doit figurer
dans cette liste côté backend, sans quoi les appels seront refusés par le
navigateur en production. Toute autre origine doit y être ajoutée de la même
manière — jamais en désactivant la sécurité du navigateur.

---

## 3. Où passent les appels

Tous les appels réseau passent par **`src/services/api.js`**. Aucun `fetch`
n'est écrit ailleurs dans le projet.

| Donnée affichée | Endpoint | Utilisé par |
| --- | --- | --- |
| Coordonnées, horaires, réseaux, WhatsApp | `GET /salon` | en-tête, pied de page, Contact, Rendez-vous, boutons WhatsApp |
| Catégories de prestations | `GET /service-categories` | Nos services, étape 1 du rendez-vous |
| Prestations | `GET /services` | Nos services, étape 1 du rendez-vous |
| Prestations mises en avant | `GET /services?featured=true` | Accueil |
| Catégories de coiffures | `GET /gallery/categories` | Nos coiffures |
| Coiffures | `GET /gallery` · `GET /gallery?featured=true` | Nos coiffures, Accueil |
| Équipe | `GET /team` | Notre équipe, Accueil |
| Avis et note moyenne | `GET /testimonials` | Accueil |
| Dates réservables | `GET /availability/days` | calendrier du rendez-vous |
| Créneaux d'une journée | `GET /availability/slots?date=…` | étape 3 du rendez-vous |
| Création d'un rendez-vous | `POST /appointments` | confirmation du rendez-vous |
| Message de contact | `POST /contact` | formulaire Contact |

Le site public n'appelle **aucune** route `/admin`.

---

## 4. Le serveur reste maître des valeurs sensibles

À la confirmation d'un rendez-vous, le navigateur n'envoie que :

```json
{
  "serviceSlug": "creation-de-locks",
  "date": "2026-09-22",
  "time": "10:00",
  "firstName": "…", "lastName": "…", "phone": "…", "email": "…", "note": null
}
```

Ni le prix, ni la durée ne sont transmis : le backend les relit lui-même dans la
table `services`. L'écran de confirmation affiche ensuite **la réponse du
serveur** (référence, prestation, date, heure, durée, prix), jamais un calcul
local.

Si le créneau a été pris entre-temps, l'API répond `409` : le site affiche un
message clair, ramène automatiquement à l'étape « Heure » et recharge les
créneaux disponibles.

---

## 5. Fichiers de l'intégration

| Fichier | Rôle |
| --- | --- |
| `src/services/api.js` | Client HTTP unique : URL, erreurs, délai d'attente, ressources |
| `src/composables/useApiData.js` | États chargement / erreur / vide pour chaque écran |
| `src/composables/useSalon.js` | Informations du salon, chargées une fois et partagées |
| `src/components/ui/DataState.vue` | Rendu visuel de ces trois états |
| `src/utils/date.js` | Dates en heure locale (jamais d'UTC) |
| `src/utils/seo.js` | Titre, description, canonical, Open Graph et JSON-LD par page |
| `src/data/salon.js` | Contenu éditorial restant : marque, chiffres, valeurs |
| `src/data/images.js` | Visuels d'ambiance (hero, photos de salon), non gérés par l'API |

---

## 6. Modifier le contenu du site

Le contenu ne se modifie plus dans le code mais dans la base, via phpMyAdmin ou
l'API admin du backend :

| À modifier | Où |
| --- | --- |
| Téléphone, e-mail, adresse, réseaux, **numéro WhatsApp** | table `salon_settings` |
| Prestations, durées, tarifs | tables `services`, `service_categories` |
| Photos des prestations, de la galerie, de l'équipe | champ `image_url` des tables concernées |
| Réalisations | tables `gallery_items`, `gallery_categories` |
| Équipe | table `team_members` |
| Avis | table `testimonials` |
| Horaires, créneaux, fermetures | tables `opening_hours`, `time_slots`, `closures` |

Le numéro WhatsApp reste volontairement vide : tant qu'il n'est pas renseigné,
les boutons s'affichent en « Numéro bientôt disponible ».

---

## 7. Fichiers devenus inutiles

Ces modules ne sont importés nulle part — vérifié : zéro référence dans tout le
projet, et le build n'en dépend pas. Ils peuvent être supprimés :

```
src/data/services.js
src/data/gallery.js
src/data/team.js
src/data/testimonials.js
src/data/availability.js
src/components/HelloWorld.vue
src/assets/hero.png
src/assets/vite.svg
src/assets/vue.svg
```

`src/data/images.js` reste utilisé (visuels d'ambiance) et `src/data/salon.js`
a été réduit au contenu éditorial.

---

## 8. Coiffure rattachée à une prestation

Depuis la migration `002_gallery_service.sql`, un élément de `GET /gallery`
porte un champ `service` :

```json
{
  "id": 12,
  "title": "Locks twist",
  "imageUrl": "https://…/locks-twist.jpg",
  "category": { "id": 2, "slug": "creation", "name": "Création" },
  "service": {
    "id": 1, "slug": "creation-de-locks", "name": "Création de locks",
    "durationMinutes": 180, "price": 45000, "currency": "FCFA"
  }
}
```

`service` vaut `null` quand la coiffure n'est rattachée à rien, et **aussi**
quand la prestation liée est désactivée : proposer le raccourci mènerait alors
la cliente dans une impasse.

Côté admin, `POST` et `PATCH /admin/gallery` acceptent `serviceId` ; `null`
détache la coiffure sans la supprimer.

---

## 9. Ce que le site ne fait jamais

- Aucun appel aux routes `/admin`.
- Aucun `fetch` en dehors de `src/services/api.js`.
- Aucun prix ni aucune durée envoyés au serveur : il les relit lui-même.
- Aucun succès affiché avant la réponse du serveur, ni pour un rendez-vous,
  ni pour un message de contact.
