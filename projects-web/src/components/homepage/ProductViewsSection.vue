<template>
  <section class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          See Your Work, Your Way
        </h2>
      </div>

      <div class="flex flex-wrap justify-center gap-2 mb-12">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-6 py-3 rounded-full text-sm font-medium transition-all duration-200',
            activeTab === tab.id
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <Card
        class="w-full aspect-[16/9] bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center"
      >
        <CardContent>
          <div class="text-center">
            <h3 class="text-2xl font-bold text-white mb-2">
              {{ activeTabLabel }}
            </h3>
            <p class="text-slate-500">
              Interactive mockup of the {{ activeTabLabel.toLowerCase() }}
              interface
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, CardContent } from '@taskjuggler/ui'

const activeTab = ref('list')

const tabs = [
  { id: 'list', label: 'List View' },
  { id: 'kanban', label: 'Kanban Board' },
  { id: 'gantt', label: 'Gantt Chart' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'dashboard', label: 'Dashboard' },
]

const activeTabLabel = computed(() => {
  return tabs.find((t) => t.id === activeTab.value)?.label || 'List View'
})
</script>

