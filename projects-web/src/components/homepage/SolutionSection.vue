<template>
  <section class="py-24 bg-white" id="product">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          One orchestrated project, managed as a todo list on everyone's device.
        </h2>
        <p class="text-xl text-slate-600">
          Create tasks from six different channels, all flowing into one
          intelligent platform.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          v-for="(channel, index) in channels"
          :key="index"
          :class="`p-6 bg-gradient-to-br ${channel.color} text-white shadow-lg`"
        >
          <CardContent>
            <div class="text-5xl mb-3">{{ channel.icon }}</div>
            <h3 class="text-xl font-bold mb-2">{{ channel.name }}</h3>
            <p class="text-white/90 text-sm leading-relaxed">
              {{ channel.description }}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@taskjuggler/ui'

const channels = [
  {
    icon: '🌐',
    name: 'Web',
    description: 'Full-featured dashboard with AI-powered project setup',
    color: 'from-blue-400 to-cyan-400',
  },
  {
    icon: '📱',
    name: 'Mobile',
    description: 'Native iOS/Android apps with offline capability',
    color: 'from-purple-400 to-pink-400',
  },
  {
    icon: '📧',
    name: 'Email',
    description: 'Send to tasks@4projects.ai—AI extracts the details',
    color: 'from-yellow-400 to-orange-400',
  },
  {
    icon: '💬',
    name: 'SMS',
    description: 'Text to create tasks—perfect for field workers',
    color: 'from-green-400 to-teal-400',
  },
  {
    icon: '🎤',
    name: 'Voice',
    description: 'Call to dictate tasks completely hands-free',
    color: 'from-red-400 to-pink-400',
  },
  {
    icon: '💼',
    name: 'Slack',
    description: 'Create tasks without leaving your conversation',
    color: 'from-indigo-400 to-purple-400',
  },
]
</script>

