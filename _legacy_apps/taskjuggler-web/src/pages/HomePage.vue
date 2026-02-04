<template>
  <div class="min-h-screen">
    <Header @get-started="handleGetStarted" />
    <main>
      <Hero @get-started="handleGetStarted" />
      <Features />
      <HowItWorks />
      <UseCases />
      <Testimonials />
      <CTA @get-started="handleGetStarted" />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Header from '@/components/homepage/Header.vue'
import Hero from '@/components/homepage/Hero.vue'
import Features from '@/components/homepage/Features.vue'
import HowItWorks from '@/components/homepage/HowItWorks.vue'
import UseCases from '@/components/homepage/UseCases.vue'
import Testimonials from '@/components/homepage/Testimonials.vue'
import CTA from '@/components/homepage/CTA.vue'
import Footer from '@/components/homepage/Footer.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleGetStarted = () => {
  if (authStore.isAuthenticated) {
    router.push('/tasks/new')
  } else {
    router.push('/register')
  }
}
</script>

