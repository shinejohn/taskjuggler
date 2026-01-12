<template>
  <section class="py-20 px-6 lg:px-12 bg-white">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
          See <span class="text-indigo-600">IdeaCircuit</span> in Action
        </h2>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Experience how teams across your organization use our platform to
          transform their workflow and deliver exceptional results
        </p>
      </div>
      <div class="space-y-20">
        <div
          v-for="(screen, index) in screens"
          :key="index"
          class="relative"
        >
          <!-- Screen showcase -->
          <div class="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <div class="relative">
              <!-- Browser-like header -->
              <div class="bg-gray-800 p-3 flex items-center">
                <div class="flex space-x-2 absolute left-3">
                  <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div class="w-full text-center text-gray-400 text-sm">
                  IdeaCircuit - {{ screen.title }}
                </div>
              </div>
              <!-- Screenshot with overlay -->
              <div class="relative">
                <img :src="screen.image" :alt="screen.title" class="w-full h-auto object-cover opacity-40 max-h-[500px]" />
                <!-- AI Activity Overlay -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="bg-black/70 backdrop-blur-sm p-6 rounded-lg max-w-lg border border-gray-700">
                    <div class="flex items-center mb-3">
                      <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                      <p class="text-green-400 font-medium">
                        AI Assistant Active
                      </p>
                    </div>
                    <div class="space-y-3 text-gray-300">
                      <p class="flex items-start">
                        <Zap :size="18" class="text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                        <span>
                          Analyzing market data and identifying
                          opportunities in the healthcare sector...
                        </span>
                      </p>
                      <p class="flex items-start">
                        <MousePointer :size="18" class="text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                        <span>
                          Generating targeted messaging recommendations
                          based on competitor analysis...
                        </span>
                      </p>
                      <p class="flex items-start">
                        <Zap :size="18" class="text-indigo-400 mr-2 mt-1 flex-shrink-0" />
                        <span>
                          Creating budget allocation suggestions optimized
                          for maximum ROI...
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Description -->
          <div class="bg-white -mt-20 mx-4 md:mx-12 relative z-10 p-6 md:p-8 rounded-lg shadow-xl border border-gray-100">
            <div class="flex flex-col md:flex-row gap-6 md:gap-12">
              <div class="md:w-2/3">
                <h3 class="text-2xl font-bold text-gray-900 mb-3">
                  {{ screen.title }}
                </h3>
                <p class="text-gray-700 mb-4">{{ screen.description }}</p>
                <ul class="space-y-2">
                  <li
                    v-for="(feature, i) in screen.features"
                    :key="i"
                    class="flex items-start"
                  >
                    <ArrowRight :size="16" class="text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                    <span class="text-gray-700">{{ feature }}</span>
                  </li>
                </ul>
              </div>
              <div class="md:w-1/3 bg-indigo-50 p-4 rounded-lg flex items-center justify-center">
                <div class="text-center">
                  <div class="text-indigo-600 font-bold text-xl mb-1">
                    {{ screen.highlight.split(' by ')[0] }}
                  </div>
                  <div v-if="screen.highlight.includes(' by ')" class="text-2xl font-extrabold text-indigo-700">
                    by {{ screen.highlight.split(' by ')[1] }}
                  </div>
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
import { Zap, ArrowRight, MousePointer } from 'lucide-vue-next';

const screens = [
  {
    title: 'Marketing Strategy Development',
    description: 'AI-powered marketing plan generation that analyzes market data, identifies opportunities, and creates comprehensive strategies in real-time.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    features: [
      'Real-time competitive analysis with confidence scoring',
      'Auto-generated marketing strategy recommendations',
      'Interactive collaboration with AI suggestions'
    ],
    highlight: 'Reduced strategy development time by 68%'
  },
  {
    title: 'Sales Discovery & Proposal',
    description: 'Interactive presentations that adapt to client reactions while the AI assistant analyzes needs and generates tailored proposals on the fly.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    features: [
      'Dynamic presentation content based on client engagement',
      'Real-time needs assessment and solution matching',
      'Instant proposal generation with pricing optimization'
    ],
    highlight: '35% higher close rates with AI-assisted presentations'
  },
  {
    title: 'Project Implementation & Collaboration',
    description: 'Unified workspace where implementation teams collaborate, track milestones, and overcome challenges with AI-powered problem solving.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    features: [
      'Visual project planning with AI-suggested improvements',
      'Automated documentation and knowledge capture',
      'Predictive issue identification and resolution'
    ],
    highlight: '42% reduction in implementation time'
  }
];
</script>

