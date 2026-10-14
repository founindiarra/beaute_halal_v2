<script setup>
import { computed, ref } from 'vue'

import TestimonialCard from '@/components/cards/TestimonialCard.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import DataState from '@/components/ui/DataState.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import StarRating from '@/components/ui/StarRating.vue'
import { useApiData } from '@/composables/useApiData'
import { fetchTestimonials } from '@/services/api'

const track = ref(null)

const { data, loading, error, reload } = useApiData(fetchTestimonials, {
  items: [],
  averageRating: 0,
})

const testimonials = computed(() => data.value?.items ?? [])
const averageRating = computed(() => data.value?.averageRating ?? 0)

const scrollBy = (direction) => {
  const el = track.value
  if (!el) return
  const step = el.clientWidth * 0.85
  el.scrollBy({ left: direction * step, behavior: 'smooth' })
}
</script>

<template>
  <section class="section bg-cream">
    <div class="container-page flex flex-col gap-10">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          align="left"
          eyebrow="Avis clientes"
          title="Ce que disent nos clientes"
          subtitle="Des retours recueillis après les rendez-vous, sur la qualité du geste comme sur l’accueil."
        >
          <div v-if="testimonials.length" class="mt-1 flex items-center gap-3">
            <StarRating :rating="averageRating" />
            <span class="text-sm text-muted">
              {{ averageRating }} / 5 · {{ testimonials.length }} avis
            </span>
          </div>
        </SectionHeading>

        <div v-if="testimonials.length" class="hidden shrink-0 gap-2 lg:flex">
          <button
            type="button"
            class="grid h-12 w-12 place-items-center rounded-lg border border-sand-dark text-cocoa transition-colors hover:border-cocoa-dark hover:bg-cocoa-dark hover:text-cream"
            aria-label="Avis précédents"
            @click="scrollBy(-1)"
          >
            <AppIcon name="chevron-left" class="h-4 w-4" />
          </button>
          <button
            type="button"
            class="grid h-12 w-12 place-items-center rounded-lg border border-sand-dark text-cocoa transition-colors hover:border-cocoa-dark hover:bg-cocoa-dark hover:text-cream"
            aria-label="Avis suivants"
            @click="scrollBy(1)"
          >
            <AppIcon name="chevron-right" class="h-4 w-4" />
          </button>
        </div>
      </div>

      <DataState
        :loading="loading"
        :error="error"
        :empty="!testimonials.length"
        loading-label="Chargement des avis…"
        empty-label="Les premiers avis seront publiés très bientôt."
        @retry="reload"
      >
        <!-- Carousel : défilement tactile sur mobile, flèches sur desktop -->
        <ul
          ref="track"
          class="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 sm:-mx-8 sm:gap-6 sm:px-8 lg:mx-0 lg:px-0"
          style="scrollbar-width: none"
        >
          <li
            v-for="testimonial in testimonials"
            :key="testimonial.id"
            class="w-[85%] shrink-0 snap-start sm:w-[55%] lg:w-[calc((100%-3rem)/3)]"
          >
            <TestimonialCard :testimonial="testimonial" />
          </li>
        </ul>

        <p class="text-center text-xs text-muted lg:hidden">Faites défiler pour voir plus d’avis →</p>
      </DataState>
    </div>
  </section>
</template>

<style scoped>
ul::-webkit-scrollbar {
  display: none;
}
</style>
