<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled
        ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50'
        : 'bg-white/80 backdrop-blur-xl',
    ]"
  >
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <span class="text-xl font-semibold text-slate-900"> 4 Projects </span>
        </div>

        <div class="hidden md:flex items-center space-x-10">
          <a
            v-for="link in navLinks"
            :key="link.name"
            :href="link.href"
            class="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            {{ link.name }}
          </a>
        </div>

        <div class="hidden md:flex items-center space-x-6">
          <router-link
            to="/login"
            class="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            Login
          </router-link>
          <router-link to="/register">
            <Button size="sm">Sign Up</Button>
          </router-link>
        </div>
        
        <!-- Mobile menu button -->
        <button
          class="md:hidden text-slate-600"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-t border-slate-200">
        <div class="px-6 py-4 space-y-4">
          <a
            v-for="link in navLinks"
            :key="link.name"
            :href="link.href"
            class="block text-sm text-slate-600 hover:text-slate-900 transition-colors"
            @click="isMobileMenuOpen = false"
          >
            {{ link.name }}
          </a>
          <router-link
            to="/login"
            class="block text-sm text-slate-600 hover:text-slate-900 transition-colors"
            @click="isMobileMenuOpen = false"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="block"
            @click="isMobileMenuOpen = false"
          >
            <Button size="sm" class="w-full">Sign Up</Button>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Button } from '@taskjuggler/ui'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Product', href: '#product' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Resources', href: '#resources' },
  { name: 'Enterprise', href: '#enterprise' },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

