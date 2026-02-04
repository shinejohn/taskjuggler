<template>
  <div class="landing-page">
    <!-- Navigation Header -->
    <nav
      :class="[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      ]"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-2">
            <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg transform -rotate-6 hover:rotate-0 transition-transform">
              <ScanSearch class="h-7 w-7 text-white" />
            </div>
            <span class="text-2xl font-black tracking-tight text-slate-900">
              SiteHealth
            </span>
          </router-link>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-8">
            <a
              href="#features"
              class="text-slate-600 hover:text-green-600 font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              class="text-slate-600 hover:text-green-600 font-medium transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              class="text-slate-600 hover:text-green-600 font-medium transition-colors"
            >
              Pricing
            </a>
          </div>

          <!-- CTA Buttons -->
          <div class="hidden md:flex items-center gap-4">
            <router-link
              v-if="!authStore.isAuthenticated"
              to="/login"
              class="text-slate-600 hover:text-green-600 font-medium transition-colors"
            >
              Login
            </router-link>
            <router-link
              v-if="!authStore.isAuthenticated"
              to="/register"
              class="px-5 py-2 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold rounded-lg transition-all duration-200"
            >
              Sign Up
            </router-link>
            <router-link
              v-if="!authStore.isAuthenticated"
              to="/register"
              class="px-5 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-200"
            >
              Subscribe
            </router-link>
            <router-link
              v-if="authStore.isAuthenticated"
              to="/profile"
              class="flex items-center gap-2 text-slate-600 hover:text-green-600 font-medium transition-colors"
            >
              <User class="h-5 w-5" />
              <span>{{ authStore.user?.name || 'Profile' }}</span>
            </router-link>
            <router-link
              v-if="authStore.isAuthenticated"
              to="/subscribe"
              class="px-5 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-all duration-200"
            >
              Subscribe
            </router-link>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-slate-600"
          >
            <Menu v-if="!mobileMenuOpen" class="h-8 w-8" />
            <X v-else class="h-8 w-8" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="md:hidden bg-white border-b-4 border-slate-200">
          <div class="px-6 py-6 space-y-4">
            <a
              href="#features"
              class="block text-xl font-bold text-slate-800 hover:text-green-600"
              @click="mobileMenuOpen = false"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              class="block text-xl font-bold text-slate-800 hover:text-green-600"
              @click="mobileMenuOpen = false"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              class="block text-xl font-bold text-slate-800 hover:text-green-600"
              @click="mobileMenuOpen = false"
            >
              Pricing
            </a>
            <div class="pt-4 space-y-3 border-t border-slate-200">
              <router-link
                v-if="!authStore.isAuthenticated"
                to="/login"
                class="block w-full py-3 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 text-center"
                @click="mobileMenuOpen = false"
              >
                Login
              </router-link>
              <router-link
                v-if="!authStore.isAuthenticated"
                to="/register"
                class="block w-full py-3 border-2 border-green-600 text-green-600 font-semibold rounded-xl text-center"
                @click="mobileMenuOpen = false"
              >
                Sign Up
              </router-link>
              <router-link
                v-if="!authStore.isAuthenticated"
                to="/register"
                class="block w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl text-center shadow-lg shadow-green-500/30"
                @click="mobileMenuOpen = false"
              >
                Subscribe
              </router-link>
              <router-link
                v-if="authStore.isAuthenticated"
                to="/profile"
                class="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200"
                @click="mobileMenuOpen = false"
              >
                <User class="h-5 w-5" />
                <span>{{ authStore.user?.name || 'Profile' }}</span>
              </router-link>
              <router-link
                v-if="authStore.isAuthenticated"
                to="/subscribe"
                class="block w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl text-center shadow-lg shadow-green-500/30"
                @click="mobileMenuOpen = false"
              >
                Subscribe
              </router-link>
            </div>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          Automated Website Accessibility Scanning
        </h1>
        <p class="hero-subtitle">
          Monitor your websites for accessibility issues, performance problems, and SEO concerns. 
          Get AI-powered fixes and actionable insights.
        </p>
        <div class="hero-actions">
          <Button 
            size="lg" 
            @click="handleGetStarted"
            class="hero-cta-primary"
          >
            Get Started Free
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            @click="handleLearnMore"
            class="hero-cta-secondary"
          >
            Learn More
          </Button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-image-placeholder">
          <div class="scanner-preview">
            <div class="preview-header">
              <div class="preview-dot"></div>
              <div class="preview-dot"></div>
              <div class="preview-dot"></div>
            </div>
            <div class="preview-content">
              <div class="preview-site-card">
                <div class="preview-site-header">
                  <Skeleton class="h-4 w-32" />
                  <Badge variant="secondary">Healthy</Badge>
                </div>
                <Skeleton class="h-20 w-full mt-2" />
              </div>
              <div class="preview-issues">
                <div class="preview-issue" v-for="i in 3" :key="i">
                  <Skeleton class="h-3 w-24" />
                  <Skeleton class="h-3 w-full mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-container">
        <h2 class="section-title">Everything you need to keep your sites accessible</h2>
        <div class="features-grid">
          <Card v-for="feature in features" :key="feature.title" class="feature-card">
            <CardContent class="p-6">
              <div class="feature-icon">{{ feature.icon }}</div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section">
      <div class="section-container">
        <h2 class="section-title">How It Works</h2>
        <div class="steps">
          <div v-for="(step, index) in steps" :key="index" class="step">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="section-container">
        <Card class="cta-card">
          <CardContent class="p-12 text-center">
            <h2 class="cta-title">Ready to improve your website accessibility?</h2>
            <p class="cta-subtitle">Start scanning your sites today. No credit card required.</p>
            <Button size="lg" @click="handleGetStarted" class="cta-button">
              Start Free Trial
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, Button, Badge, Skeleton } from '@taskjuggler/ui'
import { ScanSearch, Menu, X, User } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // Fetch user if token exists but user data is missing
  if (authStore.token && !authStore.user) {
    authStore.fetchUser()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const features = [
  {
    icon: '🔍',
    title: 'Automated Scanning',
    description: 'Schedule regular scans to catch accessibility issues before they impact users.'
  },
  {
    icon: '🤖',
    title: 'AI-Powered Fixes',
    description: 'Get suggested code fixes generated by AI to resolve issues quickly.'
  },
  {
    icon: '📊',
    title: 'Detailed Reports',
    description: 'Comprehensive reports with WCAG compliance scores and actionable insights.'
  },
  {
    icon: '🔔',
    title: 'Real-Time Alerts',
    description: 'Get notified immediately when critical issues are detected on your sites.'
  },
  {
    icon: '👥',
    title: 'Team Collaboration',
    description: 'Share scans with your team and create tasks directly from issues.'
  },
  {
    icon: '📈',
    title: 'Track Progress',
    description: 'Monitor your accessibility improvements over time with detailed analytics.'
  }
]

const steps = [
  {
    title: 'Add Your Site',
    description: 'Enter your website URL and configure authentication if needed.'
  },
  {
    title: 'Run Your First Scan',
    description: 'Our scanner crawls your site and identifies accessibility issues.'
  },
  {
    title: 'Review & Fix',
    description: 'Review the issues, use AI-generated fixes, or create tasks for your team.'
  },
  {
    title: 'Monitor Continuously',
    description: 'Set up scheduled scans to catch new issues as your site evolves.'
  }
]

const handleGetStarted = () => {
  router.push('/register')
}

const handleLearnMore = () => {
  // Scroll to features section
  const featuresSection = document.querySelector('.features-section')
  featuresSection?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: var(--color-bg-primary);
  padding-top: 4rem; /* Add padding for fixed header */
}

/* Navigation Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Hero Section */
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
  align-items: center;
  padding: var(--space-16) var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.hero-title {
  font-size: var(--font-display-large);
  font-weight: 800;
  line-height: 1.1;
  color: var(--color-text-primary);
  margin: 0;
}

.hero-subtitle {
  font-size: var(--font-body-large);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.hero-actions {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-2);
}

.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image-placeholder {
  width: 100%;
  max-width: 600px;
}

.scanner-preview {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-3);
}

.preview-header {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
}

.preview-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-text-tertiary);
}

.preview-content {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.preview-site-card {
  padding: var(--space-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.preview-site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-issues {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.preview-issue {
  padding: var(--space-3);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
}

/* Features Section */
.features-section {
  padding: var(--space-20) var(--space-6);
  background: var(--color-bg-secondary);
}

.section-container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: var(--font-display-medium);
  font-weight: 700;
  text-align: center;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-12) 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

.feature-card {
  transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-4);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--space-4);
}

.feature-title {
  font-size: var(--font-headline);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
}

.feature-description {
  font-size: var(--font-body-medium);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* How It Works Section */
.how-it-works-section {
  padding: var(--space-20) var(--space-6);
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-8);
  margin-top: var(--space-8);
}

.step {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
}

.step-number {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--font-headline);
  font-weight: 700;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: var(--font-title-medium);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
}

.step-description {
  font-size: var(--font-body-medium);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* CTA Section */
.cta-section {
  padding: var(--space-20) var(--space-6);
  background: var(--color-bg-secondary);
}

.cta-card {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  border: none;
}

.cta-title {
  font-size: var(--font-display-medium);
  font-weight: 700;
  color: white;
  margin: 0 0 var(--space-4) 0;
}

.cta-subtitle {
  font-size: var(--font-body-large);
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 var(--space-6) 0;
}

.cta-button {
  background: white;
  color: var(--color-primary);
}

.cta-button:hover {
  background: rgba(255, 255, 255, 0.95);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    grid-template-columns: 1fr;
    padding: var(--space-8) var(--space-4);
  }

  .hero-title {
    font-size: var(--font-display-small);
  }

  .hero-actions {
    flex-direction: column;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .steps {
    grid-template-columns: 1fr;
  }
}
</style>

