<template>
  <header class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center">
        <router-link
          to="/"
          class="text-2xl font-bold text-blue-600 cursor-pointer"
        >
          Task Juggler
        </router-link>
      </div>
      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-8">
        <a href="#features" class="text-gray-700 hover:text-blue-600 font-medium">
          Features
        </a>
        <a href="#how-it-works" class="text-gray-700 hover:text-blue-600 font-medium">
          How It Works
        </a>
        <a href="#use-cases" class="text-gray-700 hover:text-blue-600 font-medium">
          Use Cases
        </a>
        <a href="#testimonials" class="text-gray-700 hover:text-blue-600 font-medium">
          Testimonials
        </a>
        <router-link
          to="/login"
          class="text-gray-700 hover:text-blue-600 font-medium"
        >
          Login
        </router-link>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          @click="$emit('get-started')"
        >
          Get Started
        </button>
      </nav>
      <!-- Mobile Menu Button -->
      <button
        class="md:hidden text-gray-700"
        @click="isMenuOpen = !isMenuOpen"
      >
        <Bars3Icon v-if="!isMenuOpen" class="w-6 h-6" />
        <XMarkIcon v-else class="w-6 h-6" />
      </button>
    </div>
    <!-- Mobile Navigation -->
    <div
      v-if="isMenuOpen"
      class="md:hidden bg-white py-4 px-4 shadow-md"
    >
      <nav class="flex flex-col space-y-4">
        <a
          href="#features"
          class="text-gray-700 hover:text-blue-600 font-medium"
          @click="isMenuOpen = false"
        >
          Features
        </a>
        <a
          href="#how-it-works"
          class="text-gray-700 hover:text-blue-600 font-medium"
          @click="isMenuOpen = false"
        >
          How It Works
        </a>
        <a
          href="#use-cases"
          class="text-gray-700 hover:text-blue-600 font-medium"
          @click="isMenuOpen = false"
        >
          Use Cases
        </a>
        <a
          href="#testimonials"
          class="text-gray-700 hover:text-blue-600 font-medium"
          @click="isMenuOpen = false"
        >
          Testimonials
        </a>
        <router-link
          to="/login"
          class="text-gray-700 hover:text-blue-600 font-medium text-left"
          @click="isMenuOpen = false"
        >
          Login
        </router-link>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md w-full"
          @click="
            isMenuOpen = false;
            $emit('get-started');
          "
        >
          Get Started
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

defineEmits<{
  'get-started': []
}>()

const isMenuOpen = ref(false)
</script>

