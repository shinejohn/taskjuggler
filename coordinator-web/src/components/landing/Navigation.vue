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
          <div class="w-8 h-8 bg-[#1B4F72] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            4C
          </div>
          <span class="text-xl font-heading font-bold text-[#1B4F72]">
            4calls.ai
          </span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <a href="#features" class="text-slate-600 hover:text-[#1B4F72] font-medium transition-colors">
            Features
          </a>
          <a href="#pricing" class="text-slate-600 hover:text-[#1B4F72] font-medium transition-colors">
            Pricing
          </a>
          <a href="#industries" class="text-slate-600 hover:text-[#1B4F72] font-medium transition-colors">
            Industries
          </a>
          <a href="#about" class="text-slate-600 hover:text-[#1B4F72] font-medium transition-colors">
            About
          </a>
        </div>

        <!-- CTA Buttons -->
        <div class="hidden md:flex items-center gap-4">
          <router-link to="/login" class="text-slate-600 hover:text-[#1B4F72] font-medium transition-colors">
            Login
          </router-link>
          <router-link
            to="/register"
            class="px-5 py-2 border-2 border-[#1B4F72] text-[#1B4F72] hover:bg-[#1B4F72] hover:text-white font-semibold rounded-lg transition-all duration-200"
          >
            Sign Up
          </router-link>
          <router-link
            to="/register"
            class="px-5 py-2 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            Start Free Trial
          </router-link>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 text-slate-600"
        >
          <Menu v-if="!mobileMenuOpen" :size="24" />
          <X v-else :size="24" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-slate-200">
        <div class="flex flex-col space-y-4">
          <a href="#features" class="text-slate-600 hover:text-[#1B4F72] font-medium">
            Features
          </a>
          <a href="#pricing" class="text-slate-600 hover:text-[#1B4F72] font-medium">
            Pricing
          </a>
          <a href="#industries" class="text-slate-600 hover:text-[#1B4F72] font-medium">
            Industries
          </a>
          <a href="#about" class="text-slate-600 hover:text-[#1B4F72] font-medium">
            About
          </a>
          <router-link to="/login" class="text-slate-600 hover:text-[#1B4F72] font-medium">
            Login
          </router-link>
          <router-link
            to="/register"
            class="px-5 py-2 border-2 border-[#1B4F72] text-[#1B4F72] font-semibold rounded-lg text-center"
          >
            Sign Up
          </router-link>
          <router-link
            to="/register"
            class="px-5 py-2 bg-[#F59E0B] text-white font-semibold rounded-lg text-center"
          >
            Start Free Trial
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Menu, X } from 'lucide-vue-next';

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

