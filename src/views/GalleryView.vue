<script setup>
import { computed, ref, watch } from 'vue'

import GalleryFilters from '@/components/gallery/GalleryFilters.vue'
import GalleryGrid from '@/components/gallery/GalleryGrid.vue'
import GalleryLightbox from '@/components/gallery/GalleryLightbox.vue'
import CtaSection from '@/components/sections/CtaSection.vue'
import DataState from '@/components/ui/DataState.vue'
import PageHero from '@/components/ui/PageHero.vue'
import { useApiData } from '@/composables/useApiData'
import { fetchGalleryCategories, fetchGalleryItems } from '@/services/api'
import { images } from '@/data/images'

const activeCategory = ref('all')
const openIndex = ref(null)

/**
 * Toutes les réalisations sont chargées une fois, le filtrage reste local :
 * l'expérience est instantanée et les photos déjà vues ne sont pas rechargées.
 */
const loadGallery = async () => {
  const [categories, items] = await Promise.all([fetchGalleryCategories(), fetchGalleryItems()])
  return { categories, items }
}

const { data, loading, error, reload } = useApiData(loadGallery, { categories: [], items: [] })

const categories = computed(() => data.value?.categories ?? [])

const filteredItems = computed(() => {
  const items = data.value?.items ?? []
  if (activeCategory.value === 'all') return items
  return items.filter((item) => item.category.slug === activeCategory.value)
})

// Le filtre change → on ferme l'aperçu pour éviter tout index obsolète.
watch(activeCategory, () => (openIndex.value = null))
</script>

<template>
  <div>
    <PageHero
      :image="images.heroGalerie"
      :image-mobile="images.heroGalerieMobile"
      eyebrow="Nos coiffures"
      title="Nos coiffures"
      description="Créations, entretiens, coiffures, colorations et transformations avant / après. Une coiffure vous plaît ? Réservez-la directement."
    />

    <section class="section bg-cream">
      <div class="container-page flex flex-col gap-10">
        <DataState
          :loading="loading"
          :error="error"
          :empty="!filteredItems.length && activeCategory === 'all'"
          loading-label="Chargement des coiffures…"
          empty-label="Aucune coiffure n’est publiée pour le moment."
          @retry="reload"
        >
          <GalleryFilters v-if="categories.length" v-model="activeCategory" :categories="categories" />

          <p class="text-center text-sm text-muted">
            {{ filteredItems.length }} coiffure{{ filteredItems.length > 1 ? 's' : '' }}
          </p>

          <GalleryGrid v-if="filteredItems.length" :items="filteredItems" @open="openIndex = $event" />
          <p v-else class="py-10 text-center text-sm text-muted">
            Aucune coiffure dans cette catégorie pour le moment.
          </p>
        </DataState>
      </div>
    </section>

    <CtaSection
      title="Une coiffure vous inspire ?"
      text="Parlons-en ensemble lors de votre rendez-vous : nous adaptons le style à la texture et à la longueur de vos locks."
    />

    <GalleryLightbox
      :items="filteredItems"
      :index="openIndex"
      @update:index="openIndex = $event"
      @close="openIndex = null"
    />
  </div>
</template>
