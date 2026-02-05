<template>
  <section
    class="py-24 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white text-center relative overflow-hidden"
  >
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute top-0 left-1/4 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-pulse"
      />
      <div
        class="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"
      />
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <h2 class="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
        Ready to Capture Every Task? 🎯
      </h2>
      <p class="text-xl text-white/95 mb-10 max-w-2xl mx-auto drop-shadow">
        Join thousands of teams who've eliminated lost work and unclear
        accountability.
      </p>

      <div
        class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-12"
      >
        <input
          v-model="email"
          type="email"
          placeholder="Enter your work email"
          class="px-6 py-4 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-yellow-300 w-full shadow-xl"
        />
        <Button
          size="lg"
          class="w-full sm:w-auto whitespace-nowrap shadow-2xl hover:scale-105 transition-transform bg-white text-purple-600 hover:bg-yellow-300"
          @click="$emit('get-started')"
        >
          Start Free 🚀
        </Button>
      </div>

      <div
        class="flex flex-col md:flex-row items-center justify-center gap-8 text-sm text-white/90 font-medium"
      >
        <div class="flex items-center gap-2">
          <span class="text-2xl">💳</span>
          <span>No credit card required</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">🎉</span>
          <span>Free forever plan available</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">🔒</span>
          <span>SOC 2 Type II certified</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@taskjuggler/ui'

defineEmits<{
  'get-started': []
}>()

const email = ref('')
</script>

