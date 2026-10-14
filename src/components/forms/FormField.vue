<script setup>
import { computed, useId } from 'vue'

/** Champ de formulaire réutilisable (input ou textarea) avec libellé et erreur. */
const props = defineProps({
  label: { type: String, required: true },
  modelValue: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: null },
  required: { type: Boolean, default: false },
  textarea: { type: Boolean, default: false },
  rows: { type: Number, default: 4 },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  /** Bornes d'un champ date ou nombre — « max » évite de naître demain. */
  min: { type: [String, Number], default: null },
  max: { type: [String, Number], default: null },
})

defineEmits(['update:modelValue'])

const uid = useId()
const fieldId = computed(() => `field-${uid}`)
const describedBy = computed(() =>
  props.error || props.hint ? `${fieldId.value}-desc` : undefined,
)
</script>

<template>
  <div class="flex flex-col">
    <label :for="fieldId" class="field-label">
      {{ label }}
      <span v-if="!required" class="normal-case tracking-normal text-muted/70">(facultatif)</span>
    </label>

    <textarea
      v-if="textarea"
      :id="fieldId"
      class="field-input resize-y"
      :rows="rows"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <input
      v-else
      :id="fieldId"
      class="field-input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      :min="min ?? undefined"
      :max="max ?? undefined"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <p
      v-if="error || hint"
      :id="describedBy"
      class="mt-1.5 text-xs"
      :class="error ? 'text-[#b4523f]' : 'text-muted'"
    >
      {{ error || hint }}
    </p>
  </div>
</template>
