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
      class="border-b border-sand bg-cream"
      aria-label="Catégories de services"
    >
      <div class="container-page py-4">
        <ul
          class="-mx-5 flex w-auto gap-2 overflow-x-auto px-5 sm:mx-0 sm:w-full sm:flex-wrap sm:justify-center sm:px-0"
        >
          <li v-for="category in grouped" :key="category.id" class="shrink-0">
            <a
              :href="`#${category.slug}`"
              class="inline-flex min-h-[42px] shrink-0 items-center rounded-lg border border-sand-dark bg-white px-5 text-[0.9rem] tracking-[0.03em] text-cocoa transition-colors hover:border-cocoa-dark hover:text-cocoa-dark"
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
          class="section scroll-mt-24"
          :class="index % 2 === 0 ? 'bg-cream' : 'bg-ivory'"
        >
          <div class="container-page flex flex-col gap-10">
            <div class="flex max-w-2xl flex-col gap-3">
              <span class="eyebrow">Catégorie</span>
              <h2 class="text-[1.9rem] sm:text-4xl">{{ category.name }}</h2>
              <span class="h-px w-16 rounded-full bg-gold/50" />
              <p v-if="category.description" class="text-muted">{{ category.description }}</p>
            </div>

            <ul class="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              <li v-for="(service, i) in category.items" :key="service.id" v-reveal="i * 60">
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
