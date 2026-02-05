<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { documentsApi, areasApi, signingApi } from '../../services/api'
import type { Document, DocumentArea } from '../../types'

const route = useRoute()
const router = useRouter()
const documentId = route.params.id as string

const document = ref<Document | null>(null)
const area = ref<DocumentArea | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const pdfUrl = ref<string | null>(null)

// Signing modal state
const showSigningModal = ref(false)
const signingParties = ref([{ name: '', email: '' }])
const creatingSession = ref(false)

onMounted(async () => {
    await loadDocument()
})

const loadDocument = async () => {
    loading.value = true
    error.value = null
    try {
        document.value = await documentsApi.get(documentId)
        if (document.value.area_id) {
            area.value = await areasApi.get(document.value.area_id)
        }
        // Construct PDF URL for viewing
        if (document.value.file_path) {
            pdfUrl.value = `/api/official-notice/documents/${documentId}/file`
        }
    } catch (e: any) {
        error.value = e.response?.data?.message || 'Failed to load document'
    } finally {
        loading.value = false
    }
}

const addParty = () => {
    signingParties.value.push({ name: '', email: '' })
}

const removeParty = (index: number) => {
    if (signingParties.value.length > 1) {
        signingParties.value.splice(index, 1)
    }
}

const createSigningSession = async () => {
    const validParties = signingParties.value.filter(p => p.name && p.email)
    if (validParties.length === 0) {
        alert('Please add at least one signing party')
        return
    }

    creatingSession.value = true
    try {
        const session = await signingApi.create(documentId, validParties)
        router.push(`/signing/${session.id}`)
    } catch (e: any) {
        alert(e.response?.data?.message || 'Failed to create signing session')
    } finally {
        creatingSession.value = false
    }
}

const riskColor = (score: number) => {
    if (score < 30) return 'text-green-600 bg-green-50'
    if (score < 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
}
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button @click="router.push('/')" class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <div>
                        <p class="text-sm text-gray-500">{{ area?.name || 'Document' }}</p>
                        <h1 class="text-xl font-semibold">{{ document?.title || 'Loading...' }}</h1>
                    </div>
                </div>
                <button 
                    @click="showSigningModal = true"
                    class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Start Signing
                </button>
            </div>
        </header>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center h-[calc(100vh-80px)]">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-20">
            <p class="text-red-600 mb-4">{{ error }}</p>
            <button @click="loadDocument" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Retry</button>
        </div>

        <!-- Content -->
        <div v-else class="flex h-[calc(100vh-80px)]">
            <!-- PDF Viewer -->
            <div class="flex-1 bg-gray-800 relative">
                <iframe 
                    v-if="pdfUrl"
                    :src="pdfUrl"
                    class="w-full h-full"
                    frameborder="0"
                ></iframe>
                <div v-else class="flex items-center justify-center h-full text-gray-400">
                    <div class="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mx-auto mb-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <p>No preview available</p>
                    </div>
                </div>
            </div>

            <!-- Sidebar: Analysis -->
            <div class="w-96 bg-white border-l border-gray-200 overflow-y-auto">
                <div class="p-6">
                    <h2 class="text-lg font-semibold mb-4">Document Analysis</h2>
                    
                    <!-- Analysis Status -->
                    <div v-if="!document?.is_analyzed" class="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
                        <p class="text-yellow-800 text-sm">AI analysis is pending. This may take a few minutes.</p>
                    </div>

                    <!-- Critical Dates -->
                    <div class="mb-6">
                        <h3 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            Critical Dates
                        </h3>
                        <div v-if="document?.critical_dates?.length" class="space-y-2">
                            <div v-for="date in document.critical_dates" :key="date.id" class="p-3 bg-gray-50 rounded-lg">
                                <p class="font-medium text-sm">{{ date.title }}</p>
                                <p class="text-xs text-gray-500">{{ new Date(date.due_date).toLocaleDateString() }}</p>
                            </div>
                        </div>
                        <p v-else class="text-sm text-gray-500">No critical dates extracted</p>
                    </div>

                    <!-- Sections/Clauses -->
                    <div>
                        <h3 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                            Sections
                        </h3>
                        <div v-if="document?.sections?.length" class="space-y-2">
                            <div v-for="section in document.sections" :key="section.id" class="p-3 bg-gray-50 rounded-lg">
                                <div class="flex items-center justify-between mb-1">
                                    <span class="text-xs font-medium uppercase text-gray-500">{{ section.section_type }}</span>
                                    <span :class="['text-xs px-2 py-0.5 rounded', riskColor(section.risk_score)]">
                                        Risk: {{ section.risk_score }}
                                    </span>
                                </div>
                                <p class="text-sm text-gray-700 line-clamp-3">{{ section.content }}</p>
                            </div>
                        </div>
                        <p v-else class="text-sm text-gray-500">No sections analyzed</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Signing Session Modal -->
        <div v-if="showSigningModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 m-4 max-h-[90vh] overflow-y-auto">
                <h3 class="text-xl font-semibold mb-4">Start Signing Session</h3>
                <p class="text-sm text-gray-600 mb-6">Add parties who need to sign this document.</p>
                
                <form @submit.prevent="createSigningSession">
                    <div class="space-y-4 mb-6">
                        <div v-for="(party, index) in signingParties" :key="index" class="flex gap-3 items-start">
                            <div class="flex-1">
                                <input
                                    v-model="party.name"
                                    type="text"
                                    placeholder="Full Name"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div class="flex-1">
                                <input
                                    v-model="party.email"
                                    type="email"
                                    placeholder="Email"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <button 
                                v-if="signingParties.length > 1"
                                type="button" 
                                @click="removeParty(index)"
                                class="p-2 text-gray-400 hover:text-red-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                    </div>

                    <button type="button" @click="addParty" class="text-sm text-indigo-600 hover:text-indigo-800 mb-6 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Another Party
                    </button>

                    <div class="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" @click="showSigningModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-900">
                            Cancel
                        </button>
                        <button type="submit" :disabled="creatingSession" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50">
                            {{ creatingSession ? 'Creating...' : 'Create Session' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
