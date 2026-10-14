<script setup>
import { ref } from 'vue'

import GalleryGrid from '@/components/gallery/GalleryGrid.vue'
import GalleryLightbox from '@/components/gallery/GalleryLightbox.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import DataState from '@/components/ui/DataState.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useApiData } from '@/composables/useApiData'
import { fetchGalleryItems } from '@/services/api'

const openIndex = ref(null)

const {
  data: items,
  loading,
  error,
  reload,
} = useApiData(() => fetchGalleryItems({ featured: true }), [])
</script>

<template>
  <section class="bg-cocoa-dark py-10 sm:py-12 lg:py-14">
    <div class="container-page flex flex-col gap-8">
      <SectionHeading
        eyebrow="Nos coiffures"
        title="Quelques coiffures du salon"
        subtitle="Créations, entretiens, coiffures et colorations : cliquez sur « Réserver cette coiffure » pour partir de celle qui vous plaît."
        tone="light"
      />

      <DataState
        :loading="loading"
        :error="error"
        :empty="!items.length"
        loading-label="Chargement des coiffures…"
        empty-label="Aucune coiffure n’est publiée pour le moment."
        @retry="reload"
      >
        <div v-reveal>
          <GalleryGrid :items="items" @open="openIndex = $event" />
        </div>
      </DataState>

      <div class="flex">
        <BaseButton :to="{ name: 'gallery' }" variant="outline-light" size="md">
          Voir toutes nos coiffures
          <AppIcon name="arrow-right" class="h-4 w-4" />
        </BaseButton>
      </div>
    </div>

    <GalleryLightbox
      :items="items"
      :index="openIndex"
      @update:index="openIndex = $event"
      @close="openIndex = null"
    />
  </section>
</template>
