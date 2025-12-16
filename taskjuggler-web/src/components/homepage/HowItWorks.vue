<template>
  <section id="how-it-works" class="py-16 md:py-24 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          How Task Juggler Works
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          A simple four-step process that transforms communication into
          action.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <div class="flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6">
            <PaperAirplaneIcon class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-xl font-bold mb-3">Send a Task</h3>
          <p class="text-gray-600">
            Create and send a task to anyone using just their email or phone
            number.
          </p>
        </div>
        <div class="flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6">
            <ClockIcon class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-xl font-bold mb-3">Set Timeline</h3>
          <p class="text-gray-600">
            Do-er sets realistic start and completion dates they can commit
            to.
          </p>
        </div>
        <div class="flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6">
            <ArrowPathIcon class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-xl font-bold mb-3">Track Progress</h3>
          <p class="text-gray-600">
            Both parties stay updated with automatic notifications on timeline
            changes.
          </p>
        </div>
        <div class="flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-xl font-bold mb-3">Complete Task</h3>
          <p class="text-gray-600">
            Task is marked complete, creating a clear record of
            accomplishment.
          </p>
        </div>
      </div>
      <div class="mt-20 bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-2/3 mb-8 md:mb-0 md:pr-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">
              See Task Juggler in Action
            </h3>
            <p class="text-gray-600 mb-6">
              Watch how Task Juggler transforms chaotic communications into
              clear, actionable tasks with full accountability.
            </p>
            <button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md inline-flex items-center">
              <PlayIcon class="w-4 h-4 mr-2" />
              Watch Demo
            </button>
          </div>
          <div class="md:w-1/3 flex justify-center">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <PlayIcon class="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  PaperAirplaneIcon,
  ClockIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  PlayIcon,
} from '@heroicons/vue/24/outline'
</script>

