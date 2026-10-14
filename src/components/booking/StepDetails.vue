<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import FormField from '@/components/forms/FormField.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { lookupCustomer } from '@/services/api'

const props = defineProps({
  customer: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
})

/** Le composant ne mute pas ses props : c'est le parent qui écrit dans l'état. */
const emit = defineEmits(['update'])

const update = (key, value) => emit('update', key, value)

/* ═════════════════════ « Êtes-vous déjà venue ? » ═════════════════════

   Le numéro de téléphone tient lieu de matricule au salon : une cliente
   revenue six mois plus tard est la même personne, avec la même fiche. La
   question posée ici sert à lui éviter de retaper ce qu'elle a déjà donné.

   On POSE la question plutôt que de deviner en silence. Une reconnaissance
   invisible, qui remplit des champs toute seule pendant qu'on tape, laisse
   la cliente se demander d'où sortent ces informations — et ne dit rien à
   celle qui vient pour la première fois.

   Quatre règles tiennent cet écran.

    1. AUCUNE RÉPONSE NE MÈNE À UNE IMPASSE. « Déjà venue » avec un numéro
       inconnu ne bloque pas : on le dit, et on propose de continuer comme
       nouvelle cliente, sans retaper le numéro.

    2. « PREMIÈRE VISITE » RECONNAÎT QUAND MÊME. Si le numéro saisi
       correspond à une fiche — la cliente avait oublié, ou c'est sa sœur
       qui avait réservé —, on reprend ses coordonnées et on le dit. Sans
       cela, un nom orthographié autrement écraserait sa propre fiche.

    3. ON NE REMPLACE JAMAIS UNE SAISIE. Ce que la cliente a tapé lui
       appartient : la reconnaissance ne remplit que les champs vides.

    4. RIEN NE PEUT BLOQUER LA RÉSERVATION. Réseau coupé, serveur lent :
       `lookupCustomer` ne lève jamais, et le formulaire reste utilisable.

   Côté serveur, la route ne renvoie que ce que la cliente a elle-même saisi
   — prénom, nom, e-mail — et elle est limitée en fréquence, pour qu'on ne
   puisse pas balayer les numéros d'un opérateur afin de savoir lesquels
   appartiennent à des clientes du salon.
------------------------------------------------------------------------ */

/** null = la question est posée · 'connue' · 'nouvelle' */
const parcours = ref(null)

const recherche = ref(false)
/** null tant qu'on n'a rien cherché, puis true / false. */
const reconnue = ref(null)
/** Le dernier numéro interrogé, pour ne pas reposer deux fois la question. */
let dernierNumero = ''
let minuteur = null

const chiffres = (valeur) => String(valeur ?? '').replace(/\D/g, '')

/** Borne haute du sélecteur : on ne naît pas demain. */
const aujourdhui = new Date().toISOString().slice(0, 10)

/*
 * « Continuer » reste actif à cette étape : c'est le clic qui déclenche la
 * validation et affiche ce qui manque (le parent l'assume, WCAG 3.3.1).
 *
 * Masquer des champs crée donc un piège : une erreur posée sur un champ
 * invisible ne se voit pas, et la cliente clique sans que rien ne bouge —
 * exactement ce qu'on cherchait à éviter. Deux garde-fous :
 *
 *  – tant qu'aucune réponse n'est donnée, l'erreur s'affiche SUR la question ;
 *  – dès qu'une validation échoue, les champs se dévoilent, quoi qu'il arrive.
 */
const revelationForcee = ref(false)

watch(
  () => Object.keys(props.errors).length,
  (combien) => {
    if (combien > 0) revelationForcee.value = true
  },
)

const questionSansReponse = computed(() => !parcours.value && Object.keys(props.errors).length > 0)

/*
 * Revenir en arrière depuis le récapitulatif ne doit pas reposer la question
 * à quelqu'un qui a déjà tout rempli : on rouvre directement le formulaire.
 */
onMounted(() => {
  if (props.customer.phone?.trim() || props.customer.firstName?.trim()) {
    parcours.value = 'nouvelle'
  }
})

const choisir = (valeur) => {
  parcours.value = valeur
  reconnue.value = null
  dernierNumero = ''
}

/** « Ce n'est pas ça » — on repose la question sans rien effacer. */
const revenirALaQuestion = () => {
  parcours.value = null
  reconnue.value = null
}

/** Numéro inconnu : on bascule en nouvelle cliente, numéro conservé. */
const continuerCommeNouvelle = () => {
  parcours.value = 'nouvelle'
  reconnue.value = null
}

watch(
  () => [props.customer.phone, parcours.value],
  () => {
    clearTimeout(minuteur)
    if (!parcours.value) return

    const saisie = chiffres(props.customer.phone)
    if (saisie.length < 8) {
      reconnue.value = null
      dernierNumero = ''
      return
    }
    if (saisie === dernierNumero) return

    minuteur = setTimeout(async () => {
      dernierNumero = saisie
      recherche.value = true
      try {
        const reponse = await lookupCustomer(props.customer.phone)
        // Le numéro a pu changer pendant l'appel : on ignore une réponse qui
        // ne concerne plus ce qui est à l'écran.
        if (chiffres(props.customer.phone) !== saisie) return

        reconnue.value = Boolean(reponse?.found)
        if (reponse?.found && reponse.customer) {
          if (!props.customer.firstName?.trim()) update('firstName', reponse.customer.firstName)
          if (!props.customer.lastName?.trim()) update('lastName', reponse.customer.lastName)
          if (!props.customer.email?.trim() && reponse.customer.email) {
            update('email', reponse.customer.email)
          }
        }
      } finally {
        recherche.value = false
      }
    }, 500)
  },
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- ══════════════════ La question ══════════════════ -->
    <fieldset v-if="!parcours" class="flex flex-col gap-4">
      <legend class="text-base font-medium text-cocoa-dark">
        Êtes-vous déjà venue au salon&nbsp;?
      </legend>
      <p class="-mt-1.5 text-sm text-muted">
        Si oui, nous retrouvons vos coordonnées et vous n’avez rien à retaper.
      </p>

      <p
        v-if="questionSansReponse"
        class="rounded-xl border border-gold/45 bg-gold/15 px-3 py-2 text-sm text-cocoa-dark"
        role="alert"
      >
        Répondez d’abord à cette question pour continuer.
      </p>

      <div class="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          class="flex items-start gap-3 rounded-xl border border-sand bg-white p-4 text-left transition-colors hover:border-gold"
          @click="choisir('connue')"
        >
          <AppIcon name="user" class="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <span>
            <span class="block font-medium text-cocoa-dark">Oui, je suis déjà venue</span>
            <span class="mt-0.5 block text-sm text-muted">
              Votre numéro suffit à retrouver votre fiche.
            </span>
          </span>
        </button>

        <button
          type="button"
          class="flex items-start gap-3 rounded-xl border border-sand bg-white p-4 text-left transition-colors hover:border-gold"
          @click="choisir('nouvelle')"
        >
          <AppIcon name="sparkle" class="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <span>
            <span class="block font-medium text-cocoa-dark">Non, c’est ma première fois</span>
            <span class="mt-0.5 block text-sm text-muted">
              Quelques informations et c’est réservé.
            </span>
          </span>
        </button>
      </div>
    </fieldset>

    <!-- ══════════════════ Le formulaire ══════════════════ -->
    <template v-else>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <p class="text-sm text-muted">
          {{
            parcours === 'connue'
              ? 'Votre numéro, et nous retrouvons le reste.'
              : 'Bienvenue ! Quelques informations pour vous confirmer le rendez-vous.'
          }}
        </p>
        <button
          type="button"
          class="text-sm text-gold underline-offset-4 hover:underline"
          @click="revenirALaQuestion"
        >
          Revenir à la question
        </button>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <FormField
            label="Téléphone"
            type="tel"
            required
            autocomplete="tel"
            placeholder="+225 00 00 00 00"
            hint="C’est lui qui identifie votre fiche au salon."
            :model-value="customer.phone"
            :error="errors.phone"
            @update:model-value="update('phone', $event)"
          />

          <p v-if="recherche" class="mt-2 text-sm text-muted" role="status">
            Nous regardons si nous vous connaissons…
          </p>

          <p
            v-else-if="reconnue === true"
            class="mt-2 flex items-center gap-2 text-sm text-cocoa-dark"
            role="status"
          >
            <AppIcon name="check" class="h-4 w-4 shrink-0 text-gold" />
            <span v-if="parcours === 'connue'">
              Nous vous retrouvons&nbsp;! Vérifiez simplement que tout est exact.
            </span>
            <span v-else>
              Ce numéro correspond déjà à une fiche — nous avons repris vos coordonnées.
            </span>
          </p>

          <!--
            Un numéro inconnu alors qu'on a répondu « déjà venue » : le salon
            l'a peut-être enregistrée sous un autre numéro, ou c'est une
            première fois oubliée. On ne discute pas, on ouvre la porte.
          -->
          <div
            v-else-if="reconnue === false && parcours === 'connue'"
            class="mt-2 flex flex-col items-start gap-2 rounded-xl bg-sand/60 px-3 py-2.5"
          >
            <p class="text-sm text-cocoa">
              Nous ne retrouvons pas ce numéro. Il a peut-être changé depuis votre dernière visite.
            </p>
            <button
              type="button"
              class="text-sm font-medium text-gold underline-offset-4 hover:underline"
              @click="continuerCommeNouvelle"
            >
              Continuer et saisir mes coordonnées
            </button>
          </div>
        </div>

        <!--
          Les champs restent masqués tant qu'on attend une reconnaissance :
          demander le prénom à quelqu'un dont on va le retrouver deux secondes
          plus tard, c'est lui faire un travail pour rien.
        -->
        <template v-if="parcours === 'nouvelle' || reconnue !== null || revelationForcee">
          <FormField
            label="Prénom"
            required
            autocomplete="given-name"
            placeholder="Votre prénom"
            :model-value="customer.firstName"
            :error="errors.firstName"
            @update:model-value="update('firstName', $event)"
          />

          <FormField
            label="Nom"
            required
            autocomplete="family-name"
            placeholder="Votre nom"
            :model-value="customer.lastName"
            :error="errors.lastName"
            @update:model-value="update('lastName', $event)"
          />

          <div class="sm:col-span-2">
            <FormField
              label="E-mail"
              type="email"
              required
              autocomplete="email"
              placeholder="vous@exemple.com"
              :model-value="customer.email"
              :error="errors.email"
              @update:model-value="update('email', $event)"
            />
          </div>

          <!--
            La date de naissance est facultative et le reste : c'est un
            renseignement personnel demandé pour faire plaisir, pas pour
            réserver. Elle n'est proposée qu'aux clientes dont le salon ne
            l'a pas déjà — inutile de redemander chaque année la même chose
            à quelqu'un qu'on connaît.
          -->
          <div class="sm:col-span-2">
            <FormField
              label="Date de naissance"
              type="date"
              autocomplete="bday"
              :max="aujourdhui"
              hint="Pour vous souhaiter votre anniversaire. Vous pouvez laisser vide."
              :model-value="customer.birthDate"
              :error="errors.birthDate"
              @update:model-value="update('birthDate', $event)"
            />
          </div>

          <div class="sm:col-span-2">
            <FormField
              label="Commentaire"
              textarea
              placeholder="Longueur, état de vos locks, souhait particulier…"
              hint="Ces précisions nous aident à préparer votre rendez-vous."
              :model-value="customer.note"
              @update:model-value="update('note', $event)"
            />
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
