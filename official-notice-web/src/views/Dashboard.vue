<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface DocumentArea {
  id: string
  name: string
  status: string
  documents_count: number
  created_at: string
}

const areas = ref<DocumentArea[]>([])
const loading = ref(true)

onMounted(async () => {
  // Simulate API call for now
  setTimeout(() => {
    areas.value = [
      { id: '1', name: 'Lease Agreements - 2026', status: 'active', documents_count: 5, created_at: '2026-01-20' },
      { id: '2', name: 'Compliance 2026', status: 'active', documents_count: 12, created_at: '2026-01-22' },
    ]
    loading.value = false
  }, 500)
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Document Areas</h2>
        <p class="text-text-secondary mt-1">Manage your teams and critical document workspaces.</p>
      </div>
      <button class="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md transition-colors font-medium text-sm flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Create Area
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="area in areas" :key="area.id" class="p-6 rounded-lg border border-border bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
        <div class="flex justify-between items-start mb-4">
          <div class="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">{{ area.name }}</h3>
        <p class="text-sm text-gray-500 mb-4">Created on {{ new Date(area.created_at).toLocaleDateString() }}</p>
        
        <div class="flex items-center text-sm text-gray-600 gap-4 mt-auto pt-4 border-t border-gray-100">
          <div class="flex items-center gap-1.5">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
             {{ area.documents_count }} Docs
          </div>
          <div class="flex items-center gap-1.5 text-amber-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
             2 Action Items
          </div>
        </div>
      </div>

      <!-- Empty State Card -->
      <div v-if="areas.length === 0" class="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-gray-400 mb-4"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
        <h3 class="text-lg font-medium text-gray-900">No Document Areas yet</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first secure workspace.</p>
        <div class="mt-6">
          <button class="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md transition-colors text-sm font-medium">Create Area</button>
        </div>
      </div>
    </div>
  </div>
</template>
