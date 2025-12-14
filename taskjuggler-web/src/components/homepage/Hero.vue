<template>
  <section class="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-blue-50 to-white">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Streamline Your World, One Task at a Time
        </h1>
        <p class="text-xl md:text-2xl text-gray-700 mb-8">
          Transform chaotic communication into clear, actionable task
          exchanges. The AI-powered platform that eliminates the friction
          between intention and action.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md text-lg"
            @click="$emit('get-started')"
          >
            Get Started Free
          </button>
          <button class="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 font-medium py-3 px-8 rounded-md text-lg">
            Watch Demo
          </button>
        </div>
        <div class="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm md:text-base text-gray-700">
          <div class="flex items-center">
            <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2" />
            <span>No credit card required</span>
          </div>
          <div class="flex items-center">
            <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2" />
            <span>Free for basic use</span>
          </div>
          <div class="flex items-center">
            <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2" />
            <span>Instant setup</span>
          </div>
        </div>
      </div>
      <div class="mt-12 max-w-5xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div class="bg-gray-800 p-4 text-white">
          <div class="flex space-x-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <div class="p-4 bg-gray-100">
          <div class="bg-white rounded-md p-6 shadow-sm">
            <div class="flex items-start mb-4">
              <div class="bg-blue-100 rounded-full p-2 mr-4">
                <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  JD
                </div>
              </div>
              <div class="flex-1">
                <div class="flex justify-between mb-2">
                  <h3 class="font-medium">John Doe (Requestor)</h3>
                  <span class="text-gray-500 text-sm">
                    Today, 10:30 AM
                  </span>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg mb-2">
                  <p class="font-medium">
                    Review contract draft by end of week
                  </p>
                </div>
                <div class="flex justify-between text-sm text-gray-600">
                  <span>+ Contract.pdf</span>
                  <span>Priority: High</span>
                </div>
              </div>
            </div>
            <div class="flex items-start ml-12">
              <div class="bg-green-100 rounded-full p-2 mr-4">
                <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  AS
                </div>
              </div>
              <div class="flex-1">
                <div class="flex justify-between mb-2">
                  <h3 class="font-medium">Anna Smith (Do-er)</h3>
                  <span class="text-gray-500 text-sm">
                    Today, 10:45 AM
                  </span>
                </div>
                <div class="bg-green-50 p-3 rounded-lg mb-2">
                  <p>I'll start on Thursday and complete by Friday 3pm</p>
                </div>
                <div class="flex gap-2 text-sm">
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Start: Thu, 10am
                  </span>
                  <span class="bg-green-100 text-green-800 px-2 py-1 rounded">
                    Due: Fri, 3pm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/solid'

defineEmits<{
  'get-started': []
}>()
</script>

