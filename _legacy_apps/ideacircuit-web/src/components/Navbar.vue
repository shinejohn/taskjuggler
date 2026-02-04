<template>
  <nav
    :class="[
      'sticky top-0 z-50 transition-all duration-200',
      isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
            IC
          </div>
          <span class="text-xl font-bold text-slate-900">
            IdeaCircuit
          </span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <a href="#features" class="text-slate-600 hover:text-emerald-600 font-medium transition-colors">
            Features
          </a>
          <a href="#pricing" class="text-slate-600 hover:text-emerald-600 font-medium transition-colors">
            Pricing
          </a>
          <a href="#testimonials" class="text-slate-600 hover:text-emerald-600 font-medium transition-colors">
            Reviews
          </a>
        </div>

        <!-- CTA Buttons -->
        <div class="hidden md:flex items-center gap-4">
          <router-link 
            v-if="!isAuthenticated"
            to="/login" 
            class="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
          >
            Login
          </router-link>
          <router-link
            v-if="!isAuthenticated"
            to="/signup"
            class="px-5 py-2 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold rounded-lg transition-all duration-200"
          >
            Sign Up
          </router-link>
          <router-link
            v-if="!isAuthenticated"
            to="/subscribe"
            class="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-200"
          >
            Subscribe
          </router-link>
          <router-link
            v-if="isAuthenticated"
            to="/profile"
            class="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors"
          >
            <UserIcon :size="18" />
            <span>Profile</span>
          </router-link>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 text-slate-600"
        >
          <MenuIcon v-if="!mobileMenuOpen" :size="24" />
          <XIcon v-else :size="24" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-slate-200">
        <div class="flex flex-col space-y-4">
          <a href="#features" class="text-slate-600 hover:text-emerald-600 font-medium" @click="mobileMenuOpen = false">
            Features
          </a>
          <a href="#pricing" class="text-slate-600 hover:text-emerald-600 font-medium" @click="mobileMenuOpen = false">
            Pricing
          </a>
          <a href="#testimonials" class="text-slate-600 hover:text-emerald-600 font-medium" @click="mobileMenuOpen = false">
            Reviews
          </a>
          <router-link 
            v-if="!isAuthenticated"
            to="/login" 
            class="text-slate-600 hover:text-emerald-600 font-medium" 
            @click="mobileMenuOpen = false"
          >
            Login
          </router-link>
          <router-link
            v-if="!isAuthenticated"
            to="/signup"
            class="px-5 py-2 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-lg text-center"
            @click="mobileMenuOpen = false"
          >
            Sign Up
          </router-link>
          <router-link
            v-if="!isAuthenticated"
            to="/subscribe"
            class="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg text-center shadow-lg shadow-emerald-500/30"
            @click="mobileMenuOpen = false"
          >
            Subscribe
          </router-link>
          <router-link
            v-if="isAuthenticated"
            to="/profile"
            class="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium py-2"
            @click="mobileMenuOpen = false"
          >
            <UserIcon :size="18" />
            <span>Profile</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { MenuIcon, XIcon, UserIcon } from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';

const { isAuthenticated } = useAuth();
const isScrolled = ref(false);
const mobileMenuOpen = ref(false);

function handleScroll() {
  isScrolled.value = window.scrollY > 10;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

