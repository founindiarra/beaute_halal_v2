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
  <section class="bg-espresso-deep grain section relative overflow-hidden">
    <span
      v-parallax="0.1"
      class="outline-text pointer-events-none absolute -right-10 top-4 select-none font-display text-[14rem] font-light italic leading-none opacity-50 lg:text-[22rem]"
      aria-hidden="true"
    >
      02
    </span>

    <div class="container-page relative z-10 flex flex-col gap-14 lg:gap-20">
      <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Nos coiffures"
          title="Quelques coiffures du salon"
          subtitle="Créations, entretiens, coiffures et colorations : cliquez sur « Réserver cette coiffure » pour partir de celle qui vous plaît."
          tone="light"
        />

        <div v-reveal class="shrink-0">
          <BaseButton :to="{ name: 'gallery' }" variant="outline-light" size="md">
            Voir toutes nos coiffures
            <AppIcon name="arrow-right" class="h-4 w-4" />
          </BaseButton>
        </div>
      </div>

      <DataState
        :loading="loading"
        :error="error"
        :empty="!items.length"
        loading-label="Chargement des coiffures…"
        empty-label="Aucune coiffure n’est publiée pour le moment."
        tone="light"
        @retry="reload"
      >
        <GalleryGrid :items="items" tone="dark" @open="openIndex = $event" />
      </DataState>
    </div>

    <GalleryLightbox
      :items="items"
      :index="openIndex"
      @update:index="openIndex = $event"
      @close="openIndex = null"
    />
  </section>
</template>
