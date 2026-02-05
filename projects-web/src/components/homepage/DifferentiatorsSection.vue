<template>
  <section class="py-24 bg-slate-50" id="features">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-20">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Built Different. Works Better.
        </h2>
        <p class="text-xl text-slate-600">
          We rethought project management from first principles.
        </p>
      </div>

      <div class="space-y-16">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="flex flex-col lg:flex-row gap-12 items-center"
        >
          <div class="flex-1 space-y-4">
            <span class="text-sm font-bold text-indigo-600 uppercase tracking-wider">
              {{ feature.headline }}
            </span>
            <h3 class="text-3xl font-bold text-slate-900">
              {{ feature.title }}
            </h3>
            <p class="text-lg text-slate-600 leading-relaxed">
              {{ feature.description }}
            </p>
            <span
              v-if="feature.badge"
              class="inline-flex items-center px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-sm font-medium"
            >
              {{ feature.badge }}
            </span>
          </div>
          <div class="flex-1 w-full">
            <Card
              class="h-80 w-full bg-white border border-slate-200 shadow-xl flex items-center justify-center"
            >
              <CardContent>
                <p class="text-slate-400 font-medium">Feature Visualization</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@taskjuggler/ui'

const features = [
  {
    title: 'Crystal-Clear Accountability',
    headline: 'Requestor/Owner Model',
    description:
      "Every task has a Requestor who defines the work and an Owner who delivers it. No more confusion about who asked for what or who's responsible.",
    badge: 'Unique to 4 Projects',
  },
  {
    title: 'Every Action, Logged Forever',
    headline: 'Complete Audit Trail',
    description:
      'Full compliance-ready history of every task creation, assignment, status change, and completion. Know exactly what happened and when.',
  },
  {
    title: 'Your Data, Never Locked In',
    headline: 'Task Exchange Format (TEF)',
    description:
      'Our open Task Exchange Format means you can export everything—tasks, history, attachments—and take it anywhere. We earn your loyalty, not trap it.',
    badge: 'Open Standard',
  },
  {
    title: 'Capture Uncertainty, Find Answers',
    headline: 'Question Forum',
    description:
      'Built-in forum lets teams ask questions, vote on answers, and convert decisions into tasks. AI suggests answers from your project history.',
  },
]
</script>

