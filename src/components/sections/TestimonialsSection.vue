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
const progress = ref(0)

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

/** Barre de progression sous le carrousel. */
const onScroll = () => {
  const el = track.value
  if (!el) return
  const max = el.scrollWidth - el.clientWidth
  progress.value = max > 0 ? el.scrollLeft / max : 0
}
</script>

<template>
  <section class="section overflow-hidden bg-ivory">
    <div class="container-page flex flex-col gap-14">
      <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          align="left"
          eyebrow="Avis clientes"
          title="Ce que disent nos clientes"
          subtitle="Des retours recueillis après les rendez-vous, sur la qualité du geste comme sur l’accueil."
        >
          <div v-if="testimonials.length" v-reveal class="mt-2 flex items-center gap-4">
            <span class="font-display text-5xl leading-none text-cocoa-dark">{{ averageRating }}</span>
            <div class="flex flex-col gap-1">
              <StarRating :rating="averageRating" />
              <span class="text-xs tracking-wide text-muted">
                sur 5 · {{ testimonials.length }} avis
              </span>
            </div>
          </div>
        </SectionHeading>

        <div v-if="testimonials.length" class="hidden shrink-0 gap-3 lg:flex">
          <button
            type="button"
            class="btn-round h-14 w-14 text-cocoa-dark hover:border-espresso hover:bg-espresso hover:text-cream"
            aria-label="Avis précédents"
            @click="scrollBy(-1)"
          >
            <AppIcon name="chevron-left" class="h-4 w-4" />
          </button>
          <button
            type="button"
            class="btn-round h-14 w-14 text-cocoa-dark hover:border-espresso hover:bg-espresso hover:text-cream"
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
        <div v-reveal>
          <ul
            ref="track"
            class="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-8 pt-2 sm:-mx-8 sm:gap-7 sm:px-8 lg:mx-0 lg:px-0"
            style="scrollbar-width: none"
            @scroll.passive="onScroll"
          >
            <li
              v-for="testimonial in testimonials"
              :key="testimonial.id"
              class="w-[86%] shrink-0 snap-start sm:w-[52%] lg:w-[calc((100%-3.5rem)/3)]"
            >
              <TestimonialCard :testimonial="testimonial" />
            </li>
          </ul>

          <div class="mt-2 flex items-center gap-5">
            <span class="relative block h-px flex-1 bg-sand-dark" aria-hidden="true">
              <span
                class="absolute inset-y-0 left-0 block h-[3px] -translate-y-px bg-gold transition-[width] duration-300"
                :style="{ width: `${Math.max(12, progress * 100)}%` }"
              />
            </span>
            <p class="text-xs text-muted lg:hidden">Faites défiler →</p>
          </div>
        </div>
      </DataState>
    </div>
  </section>
</template>

<style scoped>
ul::-webkit-scrollbar {
  display: none;
}
</style>
