<script setup>
import { computed } from 'vue'

import ServiceCard from '@/components/cards/ServiceCard.vue'
import CtaSection from '@/components/sections/CtaSection.vue'
import DataState from '@/components/ui/DataState.vue'
import PageHero from '@/components/ui/PageHero.vue'
import { useApiData } from '@/composables/useApiData'
import { fetchServiceCategories, fetchServices } from '@/services/api'
import { images } from '@/data/images'

/** Catégories et prestations chargées en parallèle, puis regroupées localement. */
const loadCatalogue = async () => {
  const [categories, services] = await Promise.all([fetchServiceCategories(), fetchServices()])
  return { categories, services }
}

const { data, loading, error, reload } = useApiData(loadCatalogue, {
  categories: [],
  services: [],
})

const grouped = computed(() =>
  (data.value?.categories ?? [])
    .map((category) => ({
      ...category,
      items: (data.value?.services ?? []).filter(
        (service) => service.category.slug === category.slug,
      ),
    }))
    .filter((category) => category.items.length > 0),
)
</script>

<template>
  <div>
    <PageHero
      :image="images.heroServices"
      :image-mobile="images.heroServicesMobile"
      eyebrow="Nos services"
      title="Chaque étape de la vie de vos locks"
      description="Création, entretien, réparation, coiffure, coloration et soins. Les durées et tarifs indiqués sont indicatifs : ils sont ajustés selon la longueur et l’état de vos locks."
    />

    <!-- Sommaire des catégories -->
    <nav
      v-if="grouped.length"
      class="border-b border-sand-dark/50 bg-cream"
      aria-label="Catégories de services"
    >
      <div class="container-page py-5">
        <ul
          class="-mx-5 flex w-auto gap-2.5 overflow-x-auto px-5 sm:mx-0 sm:w-full sm:flex-wrap sm:justify-center sm:px-0"
          style="scrollbar-width: none"
        >
          <li v-for="category in grouped" :key="category.id" class="shrink-0">
            <a
              :href="`#${category.slug}`"
              class="inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-sand-dark px-6 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-cocoa transition-all duration-500 ease-[var(--ease-expo)] hover:-translate-y-0.5 hover:border-espresso hover:bg-espresso hover:text-gold-soft"
            >
              {{ category.name }}
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <div class="bg-cream">
      <DataState
        :loading="loading"
        :error="error"
        :empty="!grouped.length"
        loading-label="Chargement des prestations…"
        empty-label="Aucune prestation n’est disponible pour le moment."
        @retry="reload"
      >
        <section
          v-for="(category, index) in grouped"
          :id="category.slug"
          :key="category.id"
          class="section scroll-mt-20 overflow-hidden"
          :class="index % 2 === 0 ? 'bg-cream' : 'bg-ivory'"
        >
          <span
            class="outline-text pointer-events-none absolute right-4 top-6 select-none font-display text-[9rem] font-light italic leading-none opacity-60 sm:text-[14rem]"
            aria-hidden="true"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>

          <div class="container-page relative flex flex-col gap-12 lg:gap-16">
            <div class="flex max-w-2xl flex-col gap-5">
              <span v-reveal:fade class="eyebrow">Catégorie {{ String(index + 1).padStart(2, '0') }}</span>
              <h2 v-split class="text-[2.4rem] sm:text-5xl lg:text-6xl">{{ category.name }}</h2>
              <span v-reveal:line="200" class="rule-gold w-24" />
              <p v-if="category.description" v-reveal="150" class="text-muted sm:text-[1.05rem]">
                {{ category.description }}
              </p>
            </div>

            <ul class="grid gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
              <li v-for="(service, i) in category.items" :key="service.id" v-reveal="(i % 3) * 100">
                <ServiceCard :service="service" />
              </li>
            </ul>
          </div>
        </section>
      </DataState>
    </div>

    <CtaSection />
  </div>
</template>
