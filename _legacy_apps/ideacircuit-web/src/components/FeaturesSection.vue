<template>
  <section id="features" class="py-20 px-6 lg:px-12 bg-white">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
          One Platform for
          <span class="text-indigo-600">
            All Your Collaborative Needs
          </span>
        </h2>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          From team meetings to sales presentations, consulting sessions to
          implementation planning - IdeaCircuit brings AI-powered intelligence
          to every interaction.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="bg-white p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div class="bg-indigo-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <component :is="feature.iconComponent" :size="24" class="text-indigo-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {{ feature.title }}
          </h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  UserIcon,
  FileTextIcon,
  MessageCircleIcon,
  BarChart2Icon,
  FileCheckIcon,
  PresentationIcon,
  UsersIcon,
  BriefcaseIcon,
  TargetIcon,
  RefreshCwIcon,
  LayersIcon,
  ZapIcon
} from 'lucide-vue-next';

const features = [
  {
    iconComponent: UserIcon,
    title: 'AI Collaboration Assistant',
    description: 'Intelligent assistant that facilitates discussions, takes notes, analyzes data, and ensures productive outcomes across all team activities'
  },
  {
    iconComponent: FileTextIcon,
    title: 'Smart Documentation',
    description: 'Automated documentation with real-time transcription, action items extraction, and searchable knowledge base creation'
  },
  {
    iconComponent: PresentationIcon,
    title: 'Interactive Presentations',
    description: 'Dynamic sales and consulting presentations with real-time content adaptation based on audience engagement and feedback'
  },
  {
    iconComponent: TargetIcon,
    title: 'Needs Assessment Tools',
    description: 'AI-powered discovery frameworks for consultants to identify client requirements and generate tailored solutions'
  },
  {
    iconComponent: BriefcaseIcon,
    title: 'Proposal Generator',
    description: 'Create professional proposals, contracts, and implementation plans with AI that learns from successful past projects'
  },
  {
    iconComponent: BarChart2Icon,
    title: 'Insight Analytics',
    description: 'Comprehensive analytics across meetings, sales activities, project implementation, and team performance metrics'
  },
  {
    iconComponent: LayersIcon,
    title: 'Workflow Integration',
    description: 'Seamless connections with your existing tools and processes, from CRM to project management and documentation systems'
  },
  {
    iconComponent: MessageCircleIcon,
    title: 'Context-Aware Communication',
    description: 'AI-powered messaging that understands project history, provides relevant information, and facilitates clear team communication'
  },
  {
    iconComponent: ZapIcon,
    title: 'Idea Acceleration',
    description: 'Collaborative ideation tools with AI suggestions, visual mapping, and real-time co-creation capabilities'
  }
];
</script>

