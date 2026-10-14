<script setup>
import TeamCard from '@/components/cards/TeamCard.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import DataState from '@/components/ui/DataState.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useApiData } from '@/composables/useApiData'
import { fetchTeam } from '@/services/api'

const { data: team, loading, error, reload } = useApiData(fetchTeam, [])
</script>

<template>
  <section class="section bg-ivory">
    <div class="container-page flex flex-col gap-12">
      <SectionHeading
        eyebrow="Notre équipe"
        title="Des mains expertes, un accueil attentionné"
        subtitle="Chaque membre de l’équipe a sa spécialité. Vous êtes accompagnée par la personne la plus adaptée à votre demande."
      />

      <DataState
        :loading="loading"
        :error="error"
        :empty="!team.length"
        loading-label="Chargement de l’équipe…"
        empty-label="L’équipe sera présentée très bientôt."
        @retry="reload"
      >
        <ul class="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <li v-for="(member, index) in team" :key="member.id" v-reveal="index * 60">
            <TeamCard :member="member" />
          </li>
        </ul>
      </DataState>

      <div class="flex justify-center">
        <BaseButton :to="{ name: 'team' }" variant="secondary" size="md">
          Découvrir notre équipe
          <AppIcon name="arrow-right" class="h-4 w-4" />
        </BaseButton>
      </div>
    </div>
  </section>
</template>
