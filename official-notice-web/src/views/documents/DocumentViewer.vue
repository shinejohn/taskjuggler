<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Calendar, AlertTriangle } from 'lucide-vue-next'

const route = useRoute()
const document = ref<any>(null)
const loading = ref(true)

const fetchDocument = async () => {
  try {
    // In production: const { data } = await axios.get(`/api/official-notice/documents/${route.params.id}`)
    // Mock Data for MVP
    setTimeout(() => {
        document.value = {
            id: route.params.id,
            title: 'Lease Agreement - 2026',
            status: 'Analyzed',
            risk_score: 85,
            sections: [
                { type: 'termination', content: 'Either party may terminate this agreement with 30 days notice.', risk_score: 20 },
                { type: 'indemnification', content: 'Tenant agrees to indemnify Landlord against all claims...', risk_score: 90, analysis: 'Broad indemnification clause.' },
            ],
            critical_dates: [
                { title: 'Lease Expiration', due_date: '2026-12-31', notification_type: 'email' }
            ]
        }
        loading.value = false
    }, 500)
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  fetchDocument()
})
</script>

<template>
  <div v-if="loading" class="flex justify-center py-12">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
  
  <div v-else-if="document" class="grid grid-cols-12 gap-6 h-[calc(100vh-100px)]">
    <!-- Left: Document Viewer (Placeholder) -->
    <div class="col-span-8 bg-gray-100 rounded-lg p-4 overflow-y-auto">
        <div class="bg-white shadow-sm p-8 min-h-full rounded">
            <h1 class="text-2xl font-bold mb-4">{{ document.title }}</h1>
            <p class="text-gray-600 mb-8">Original PDF content would be rendered here via pdf.js...</p>
            
            <div class="space-y-4">
                <div v-for="(section, idx) in document.sections" :key="idx" 
                    class="p-4 border rounded relative group hover:ring-2 ring-primary transition-all"
                    :class="section.risk_score > 50 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'">
                    
                    <span class="text-xs font-mono uppercase text-gray-400 mb-1 block">{{ section.type }}</span>
                    <p class="text-sm font-medium">{{ section.content }}</p>

                    <div v-if="section.analysis" class="mt-2 text-xs text-red-600 flex items-start gap-1">
                        <AlertTriangle class="w-3 h-3 mt-0.5" />
                        {{ section.analysis }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Right: Intelligence Sidebar -->
    <div class="col-span-4 space-y-6 overflow-y-auto pr-2">
        <!-- Risk Score Card -->
        <div class="bg-white p-6 rounded-lg border border-border shadow-sm">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Risk Analysis</h3>
            <div class="flex items-center gap-4">
                <div class="relative w-16 h-16 flex items-center justify-center rounded-full border-4"
                    :class="document.risk_score > 70 ? 'border-red-500 text-red-600' : 'border-green-500 text-green-600'">
                    <span class="text-xl font-bold">{{ document.risk_score }}</span>
                </div>
                <div>
                    <p class="font-medium" :class="document.risk_score > 70 ? 'text-red-700' : 'text-green-700'">
                        {{ document.risk_score > 70 ? 'High Risk Detected' : 'Low Risk' }}
                    </p>
                    <p class="text-xs text-gray-500">Based on clause fairness</p>
                </div>
            </div>
        </div>

        <!-- Critical Dates Card -->
        <div class="bg-white p-6 rounded-lg border border-border shadow-sm">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-medium text-gray-500">Critical Dates</h3>
                <button class="text-xs text-primary hover:underline">+ Add</button>
            </div>
            
            <div class="space-y-3">
                <div v-for="(date, idx) in document.critical_dates" :key="idx" class="flex items-start gap-3 p-3 bg-amber-50 rounded-md border border-amber-100">
                    <Calendar class="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                        <p class="text-sm font-semibold text-gray-900">{{ date.title }}</p>
                        <p class="text-xs text-amber-700">Due: {{ date.due_date }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Actions -->
        <div class="bg-white p-6 rounded-lg border border-border shadow-sm">
            <h3 class="text-sm font-medium text-gray-500 mb-4">Actions</h3>
            <div class="space-y-2">
                <button class="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors text-sm font-medium">
                    Export Analysis Report
                </button>
                <button class="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
                    Share with Team
                </button>
            </div>
        </div>
    </div>
  </div>
</template>
