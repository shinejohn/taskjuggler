<template>
  <section class="py-24 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Teams Love 4 Projects
        </h2>
      </div>

      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <Card v-for="(t, index) in testimonials" :key="index" class="p-8">
          <CardContent>
            <p class="text-lg text-slate-700 mb-6 leading-relaxed">
              "{{ t.quote }}"
            </p>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-200 rounded-full" />
              <div>
                <div class="font-bold text-slate-900">{{ t.name }}</div>
                <div class="text-sm text-slate-500">{{ t.title }}</div>
                <div class="text-sm text-indigo-600 font-medium">
                  {{ t.company }}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="border-t border-slate-200 pt-16">
        <p
          class="text-center text-sm font-medium text-slate-500 mb-8 uppercase tracking-widest"
        >
          Trusted by teams at
        </p>
        <div class="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50">
          <div
            v-for="i in 5"
            :key="i"
            class="h-8 w-32 bg-slate-300 rounded"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@taskjuggler/ui'

const testimonials = [
  {
    quote:
      'The ability to create tasks via voice while driving between sites has completely changed how our field team operates. Nothing gets forgotten anymore.',
    name: 'Sarah Jenkins',
    title: 'Operations Director',
    company: 'BuildRight Construction',
  },
  {
    quote:
      'Finally, a tool that understands accountability. The Requestor/Owner model cleared up so much confusion in our distributed engineering team.',
    name: 'David Chen',
    title: 'VP of Engineering',
    company: 'TechFlow Systems',
  },
  {
    quote:
      'We were drowning in Slack messages. 4 Projects.ai turned that noise into structured work without us having to change our habits.',
    name: 'Elena Rodriguez',
    title: 'Product Manager',
    company: 'Streamline Digital',
  },
]
</script>

