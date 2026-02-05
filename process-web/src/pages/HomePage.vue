<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <span class="text-xl font-semibold text-gray-900">Process.ai</span>
          </div>
          
          <div class="hidden md:flex items-center space-x-6">
            <a href="#features" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#pricing" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <router-link
              to="/login"
              class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm"
            >
              Sign Up
            </router-link>
          </div>
          
          <!-- Mobile menu button -->
          <button
            class="md:hidden text-gray-600"
            @click="isMenuOpen = !isMenuOpen"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="isMenuOpen" class="md:hidden bg-white border-t border-gray-200">
        <div class="px-4 py-4 space-y-4">
          <a href="#features" class="block text-sm text-gray-600 hover:text-gray-900" @click="isMenuOpen = false">
            Features
          </a>
          <a href="#pricing" class="block text-sm text-gray-600 hover:text-gray-900" @click="isMenuOpen = false">
            Pricing
          </a>
          <router-link
            to="/login"
            class="block text-sm text-gray-600 hover:text-gray-900"
            @click="isMenuOpen = false"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm text-center"
            @click="isMenuOpen = false"
          >
            Sign Up
          </router-link>
        </div>
      </div>
    </nav>
    
    <!-- Hero Section -->
    <div class="pt-16 pb-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Automate Your Workflows
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Build, manage, and execute automated processes that save time and boost productivity.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/register"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md text-lg"
            >
              Get Started Free
            </router-link>
            <router-link
              to="/login"
              class="bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-8 rounded-md text-lg border border-gray-300"
            >
              Sign In
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Features Section -->
    <div id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Powerful Features</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Visual Builder</h3>
            <p class="text-gray-600">Create complex workflows with our intuitive drag-and-drop interface.</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Automated Execution</h3>
            <p class="text-gray-600">Run processes automatically based on triggers and schedules.</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Analytics & Insights</h3>
            <p class="text-gray-600">Track performance and optimize your workflows with detailed analytics.</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Pricing Section -->
    <div id="pricing" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Simple Pricing</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-xl font-semibold mb-4">Free</h3>
            <p class="text-3xl font-bold mb-4">$0<span class="text-lg text-gray-600">/mo</span></p>
            <ul class="space-y-2 mb-6">
              <li>✓ 5 processes</li>
              <li>✓ Basic automation</li>
              <li>✓ Community support</li>
            </ul>
            <router-link
              to="/register"
              class="block text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-md"
            >
              Get Started
            </router-link>
          </div>
          <div class="bg-blue-600 rounded-lg shadow-lg p-6 text-white">
            <h3 class="text-xl font-semibold mb-4">Pro</h3>
            <p class="text-3xl font-bold mb-4">$29<span class="text-lg">/mo</span></p>
            <ul class="space-y-2 mb-6">
              <li>✓ Unlimited processes</li>
              <li>✓ Advanced automation</li>
              <li>✓ Priority support</li>
            </ul>
            <router-link
              to="/register"
              class="block text-center bg-white hover:bg-gray-100 text-blue-600 font-medium py-2 px-4 rounded-md"
            >
              Get Started
            </router-link>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-xl font-semibold mb-4">Enterprise</h3>
            <p class="text-3xl font-bold mb-4">Custom</p>
            <ul class="space-y-2 mb-6">
              <li>✓ Everything in Pro</li>
              <li>✓ Custom integrations</li>
              <li>✓ Dedicated support</li>
            </ul>
            <router-link
              to="/register"
              class="block text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-md"
            >
              Contact Sales
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)
</script>

