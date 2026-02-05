<template>
  <div class="min-h-screen bg-white font-sans text-slate-900">
    <Navigation />
    <main>
      <HeroSection @get-started="handleGetStarted" />
      <ProblemSection />
      <SolutionSection />
      <DifferentiatorsSection />
      <AIFeaturesSection />
      <ProductViewsSection />
      <ComparisonSection />
      <PricingSection @get-started="handleGetStarted" />
      <TestimonialsSection />
      <IntegrationsSection />
      <FinalCTASection @get-started="handleGetStarted" />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navigation from '@/components/homepage/Navigation.vue'
import HeroSection from '@/components/homepage/HeroSection.vue'
import ProblemSection from '@/components/homepage/ProblemSection.vue'
import SolutionSection from '@/components/homepage/SolutionSection.vue'
import DifferentiatorsSection from '@/components/homepage/DifferentiatorsSection.vue'
import AIFeaturesSection from '@/components/homepage/AIFeaturesSection.vue'
import ProductViewsSection from '@/components/homepage/ProductViewsSection.vue'
import ComparisonSection from '@/components/homepage/ComparisonSection.vue'
import PricingSection from '@/components/homepage/PricingSection.vue'
import TestimonialsSection from '@/components/homepage/TestimonialsSection.vue'
import IntegrationsSection from '@/components/homepage/IntegrationsSection.vue'
import FinalCTASection from '@/components/homepage/FinalCTASection.vue'
import Footer from '@/components/homepage/Footer.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleGetStarted = () => {
  if (authStore.isAuthenticated) {
    router.push('/projects/new')
  } else {
    router.push('/register')
  }
}
</script>

