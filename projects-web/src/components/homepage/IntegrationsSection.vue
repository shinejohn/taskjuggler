<template>
  <section class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
        Works With Your Stack
      </h2>
      <p class="text-xl text-slate-600 mb-12">
        Plus our open API and TEF standard connect to anything.
      </p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        <div
          v-for="(partner, index) in partners"
          :key="index"
          class="flex items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
        >
          <span class="text-lg font-bold text-slate-400">
            {{ partner }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const partners = [
  'Slack',
  'Microsoft Teams',
  'Twilio',
  'Zapier',
  'Google Workspace',
  'Microsoft 365',
  'GitHub',
  'Jira',
]
</script>

