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
    class="flex max-w-3xl flex-col gap-5"
    :class="align === 'center' ? 'mx-auto items-center text-center' : 'items-start text-left'"
  >
    <span
      v-if="eyebrow"
      v-reveal:fade
      class="eyebrow"
      :class="[tone === 'light' ? 'text-gold-soft' : '', align === 'center' ? 'eyebrow--center' : '']"
    >
      {{ eyebrow }}
    </span>

    <component
      :is="as"
      v-split
      class="text-[2.4rem] leading-[1.04] sm:text-5xl lg:text-[3.6rem]"
      :class="tone === 'light' ? 'text-cream' : 'text-cocoa-dark'"
    >
      {{ title }}
    </component>

    <span
      v-reveal:line="200"
      class="rule-gold w-24"
      :class="[tone === 'light' ? 'rule-gold-light' : '', align === 'center' ? 'mx-auto' : '']"
    />

    <p
      v-if="subtitle"
      v-reveal="150"
      class="max-w-2xl text-base leading-relaxed sm:text-[1.08rem]"
      :class="tone === 'light' ? 'text-cream/75' : 'text-muted'"
    >
      {{ subtitle }}
    </p>

    <slot />
  </div>
</template>
