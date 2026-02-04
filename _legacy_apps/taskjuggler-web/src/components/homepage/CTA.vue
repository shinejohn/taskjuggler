<template>
  <section class="py-16 md:py-24 bg-blue-600 text-white">
    <div class="container mx-auto px-4">
      <div class="max-w-5xl mx-auto">
        <div class="md:flex md:items-center md:justify-between">
          <div class="md:w-1/2 mb-8 md:mb-0">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform How You Work?
            </h2>
            <p class="text-blue-100 text-lg mb-6">
              Join thousands of professionals who are streamlining their
              workflow with Task Juggler.
            </p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                <span>Free to get started - no credit card required</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                <span>Set up in minutes with SSO authentication</span>
              </li>
              <li class="flex items-start">
                <CheckIcon class="w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                <span>Import your existing contacts instantly</span>
              </li>
            </ul>
            <button
              class="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-md text-lg"
              @click="$emit('get-started')"
            >
              Get Started Free
            </button>
          </div>
          <div class="md:w-5/12">
            <div class="bg-white rounded-lg p-6 text-gray-900">
              <h3 class="text-xl font-bold mb-4">
                Sign up for early access
              </h3>
              <form @submit.prevent="handleSubmit">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Smith"
                  />
                </div>
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-medium mb-2">
                    Work Email
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@company.com"
                  />
                </div>
                <div class="mb-6">
                  <label class="block text-gray-700 text-sm font-medium mb-2">
                    Company Size
                  </label>
                  <select
                    v-model="form.companySize"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201+">201+ employees</option>
                  </select>
                </div>
                <button
                  type="submit"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                >
                  Request Early Access
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/solid'

defineEmits<{
  'get-started': []
}>()

const form = ref({
  name: '',
  email: '',
  companySize: '',
})

const handleSubmit = () => {
  // Handle form submission
  console.log('Form submitted:', form.value)
  // You can emit an event or call an API here
}
</script>

