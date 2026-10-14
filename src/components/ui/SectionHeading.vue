<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  align: { type: String, default: 'left' }, // center | left
  tone: { type: String, default: 'dark' }, // dark | light
  as: { type: String, default: 'h2' },
})
</script>

<template>
  <div
    class="flex max-w-2xl flex-col gap-4"
    :class="align === 'center' ? 'mx-auto items-center text-center' : 'items-start text-left'"
  >
    <span v-if="eyebrow" class="eyebrow" :class="tone === 'light' ? 'text-gold-soft' : ''">
      {{ eyebrow }}
    </span>

    <component
      :is="as"
      class="text-[2rem] leading-tight sm:text-4xl lg:text-[2.75rem]"
      :class="tone === 'light' ? 'text-cream' : 'text-cocoa-dark'"
    >
      {{ title }}
    </component>

    <span
      class="rule-gold w-20 rounded-full"
      :class="[tone === 'light' ? 'rule-gold-light' : '', align === 'center' ? 'mx-auto' : '']"
    />

    <p
      v-if="subtitle"
      class="text-base leading-relaxed sm:text-[1.05rem]"
      :class="tone === 'light' ? 'text-cream/75' : 'text-muted'"
    >
      {{ subtitle }}
    </p>

    <slot />
  </div>
</template>
