<script setup>
import TeamCard from '@/components/cards/TeamCard.vue'
import CtaSection from '@/components/sections/CtaSection.vue'
import DataState from '@/components/ui/DataState.vue'
import PageHero from '@/components/ui/PageHero.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useApiData } from '@/composables/useApiData'
import { images } from '@/data/images'
import { fetchTeam } from '@/services/api'

const { data: team, loading, error, reload } = useApiData(fetchTeam, [])
</script>

<template>
  <div>
    <PageHero
      eyebrow="Notre équipe"
      title="Les mains derrière vos locks"
      description="Une petite équipe, des spécialités complémentaires et la même exigence sur la qualité du geste."
      :image="images.salon4"
    />

    <section class="section bg-cream">
      <div class="container-page flex flex-col gap-12">
        <SectionHeading
          eyebrow="Faites connaissance"
          title="Chacune sa spécialité"
          subtitle="Lors de la prise de rendez-vous, nous vous orientons vers la personne la plus adaptée à votre demande."
        />

        <DataState
          :loading="loading"
          :error="error"
          :empty="!team.length"
          loading-label="Chargement de l’équipe…"
          empty-label="L’équipe sera présentée très bientôt."
          @retry="reload"
        >
          <ul class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-9">
            <li v-for="(member, index) in team" :key="member.id" v-reveal="index * 60">
              <TeamCard :member="member" detailed />
            </li>
          </ul>
        </DataState>
      </div>
    </section>

    <CtaSection
      title="Envie de rencontrer l’équipe ?"
      text="Réservez votre créneau en ligne : nous vous confirmons le rendez-vous et la praticienne qui vous accompagnera."
    />
  </div>
</template>
