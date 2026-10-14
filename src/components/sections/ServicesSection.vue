<script setup>
import ServiceCard from '@/components/cards/ServiceCard.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import DataState from '@/components/ui/DataState.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useApiData } from '@/composables/useApiData'
import { fetchServices } from '@/services/api'

const {
  data: services,
  loading,
  error,
  reload,
} = useApiData(() => fetchServices({ featured: true }), [])
</script>

<template>
  <section class="section bg-ivory">
    <div class="container-page flex flex-col gap-12">
      <SectionHeading
        eyebrow="Nos prestations"
        title="Des services pensés pour vos locks"
        subtitle="De la création à l’entretien, chaque prestation est adaptée à votre texture, à la longueur de vos locks et au rythme qui vous convient."
      />

      <DataState
        :loading="loading"
        :error="error"
        :empty="!services.length"
        loading-label="Chargement des prestations…"
        empty-label="Aucune prestation n’est disponible pour le moment."
        @retry="reload"
      >
        <ul class="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <li v-for="(service, index) in services" :key="service.id" v-reveal="index * 60">
            <ServiceCard :service="service" />
          </li>
        </ul>
      </DataState>

      <div class="flex">
        <BaseButton :to="{ name: 'services' }" variant="secondary" size="md">
          Voir toutes nos prestations
          <AppIcon name="arrow-right" class="h-4 w-4" />
        </BaseButton>
      </div>
    </div>
  </section>
</template>
