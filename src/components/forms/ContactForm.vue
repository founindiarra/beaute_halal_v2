<script setup>
import { reactive, ref } from 'vue'

import FormField from './FormField.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { sendContactMessage } from '@/services/api'

/** Formulaire de contact : envoi réel vers l'API (POST /contact). */
const form = reactive({ name: '', email: '', phone: '', message: '' })
const errors = reactive({})
const sending = ref(false)
const sent = ref(false)
const submitError = ref(null)

/**
 * Anti-spam sans captcha, invisible pour une vraie visiteuse :
 *  – un champ leurre caché que seuls les robots remplissent,
 *  – un délai minimal entre l'affichage du formulaire et l'envoi.
 * Dans les deux cas on affiche le message de succès habituel sans rien envoyer :
 * un robot ne doit pas apprendre qu'il a été repéré.
 */
const honeypot = ref('')
const openedAt = Date.now()
const MIN_FILL_TIME = 3000

const looksLikeSpam = () => honeypot.value !== '' || Date.now() - openedAt < MIN_FILL_TIME

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.message = ''
}

const validate = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (form.name.trim().length < 2) errors.name = 'Merci d’indiquer votre nom.'
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = 'Adresse e-mail invalide.'
  if (form.message.trim().length < 10) errors.message = 'Votre message est un peu court.'
  return Object.keys(errors).length === 0
}

/** Remonte les erreurs de validation renvoyées par le serveur sur les bons champs. */
const applyServerErrors = (details) => {
  if (!Array.isArray(details)) return
  details.forEach(({ field, message }) => {
    if (field && field in form) errors[field] = message
  })
}

const submit = async () => {
  submitError.value = null
  sent.value = false
  if (!validate()) return

  if (looksLikeSpam()) {
    sent.value = true
    resetForm()
    return
  }

  sending.value = true
  try {
    await sendContactMessage(form)
    // Le succès n'est affiché qu'après confirmation du serveur.
    sent.value = true
    resetForm()
  } catch (error) {
    applyServerErrors(error?.details)
    submitError.value = error?.message || 'L’envoi a échoué. Merci de réessayer.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <form class="card-surface flex flex-col gap-5 p-5 sm:p-7" novalidate @submit.prevent="submit">
    <div class="flex flex-col gap-1.5">
      <h2 class="text-2xl sm:text-3xl">Écrivez-nous</h2>
      <p class="text-sm text-muted">
        Une question sur une prestation, un conseil d’entretien ? Nous répondons sous 24 h ouvrées.
      </p>
    </div>

    <div
      v-if="sent"
      class="flex items-start gap-3 rounded-xl bg-ivory p-4 text-sm text-cocoa"
      role="status"
    >
      <AppIcon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <span>Merci, votre message a bien été enregistré. Nous vous répondons rapidement.</span>
    </div>

    <div
      v-if="submitError"
      class="flex items-start gap-3 rounded-xl border border-[#d9a898] bg-[#fdf3f0] p-4 text-sm text-[#8c3d2a]"
      role="alert"
    >
      <AppIcon name="shield" class="mt-0.5 h-4 w-4 shrink-0" />
      <span>{{ submitError }}</span>
    </div>

    <!--
      Champ leurre : masqué visuellement, retiré de la navigation clavier et
      des lecteurs d'écran. Seul un robot le remplit.
    -->
    <div aria-hidden="true" class="absolute h-0 w-0 overflow-hidden opacity-0">
      <label for="contact-extra">Laissez ce champ vide</label>
      <!--
        Le nom du champ est volontairement neutre : un nom comme « website »
        ou « phone2 » déclencherait le remplissage automatique du navigateur
        et ferait passer une vraie cliente pour un robot.
      -->
      <input
        id="contact-extra"
        v-model="honeypot"
        type="text"
        name="bh-extra"
        tabindex="-1"
        autocomplete="off"
      />
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <FormField
        v-model="form.name"
        label="Nom"
        required
        autocomplete="name"
        placeholder="Votre nom"
        :error="errors.name"
      />
      <FormField
        v-model="form.email"
        label="E-mail"
        type="email"
        required
        autocomplete="email"
        placeholder="vous@exemple.com"
        :error="errors.email"
      />
      <div class="sm:col-span-2">
        <FormField
          v-model="form.phone"
          label="Téléphone"
          type="tel"
          autocomplete="tel"
          placeholder="+225 00 00 00 00"
          :error="errors.phone"
        />
      </div>
      <div class="sm:col-span-2">
        <FormField
          v-model="form.message"
          label="Message"
          textarea
          required
          :rows="5"
          placeholder="Votre message…"
          :error="errors.message"
        />
      </div>
    </div>

    <div>
      <BaseButton
        type="submit"
        variant="primary"
        size="md"
        :disabled="sending"
        class="w-full sm:w-auto"
      >
        {{ sending ? 'Envoi en cours…' : 'Envoyer le message' }}
        <AppIcon v-if="!sending" name="send" class="h-4 w-4" />
      </BaseButton>
    </div>
  </form>
</template>
