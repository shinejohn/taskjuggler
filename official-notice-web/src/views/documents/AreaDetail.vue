<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { areasApi } from '../../services/api'
import type { DocumentArea } from '../../types'

const route = useRoute()
const router = useRouter()
const areaId = route.params.id as string

const area = ref<DocumentArea | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Upload Modal State
const showUploadModal = ref(false)
const uploadTitle = ref('')
const selectedFile = ref<File | null>(null)
const uploading = ref(false)

onMounted(async () => {
    await loadArea()
})

const loadArea = async () => {
    loading.value = true
    error.value = null
    try {
        area.value = await areasApi.get(areaId)
    } catch (e: any) {
        error.value = e.response?.data?.message || 'Failed to load area details'
    } finally {
        loading.value = false
    }
}

const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0]!
        // Default title to filename without extension
        uploadTitle.value = target.files[0]!.name.replace(/\.[^/.]+$/, "")
    }
}

const handleUpload = async () => {
    if (!selectedFile.value || !uploadTitle.value) return
    
    uploading.value = true
    try {
        const newDoc = await areasApi.uploadDocument(areaId, selectedFile.value as File, uploadTitle.value)
        if (area.value) {
            if (!area.value.documents) area.value.documents = []
            area.value.documents.unshift(newDoc)
        }
        showUploadModal.value = false
        uploadTitle.value = ''
        selectedFile.value = null
    } catch (e: any) {
        alert(e.response?.data?.message || 'Upload failed')
    } finally {
        uploading.value = false
    }
}

const navigateToDocument = (docId: string) => {
    router.push(`/documents/${docId}`)
}

const goBack = () => {
    router.push('/')
}
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button @click="goBack" class="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <div>
                        <h1 class="text-xl font-semibold">{{ area?.name || 'Loading Area...' }}</h1>
                        <p class="text-sm text-gray-500">Document Area Details</p>
                    </div>
                </div>
                <button 
                    @click="showUploadModal = true"
                    class="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Upload Document
                </button>
            </div>
        </header>

        <!-- Main Content -->
        <main class="p-6">
            <div v-if="loading" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>

            <div v-else-if="error" class="text-center py-12">
                <p class="text-red-600 mb-4">{{ error }}</p>
                <button @click="loadArea" class="px-4 py-2 bg-primary text-white rounded-md">Retry</button>
            </div>

            <div v-else>
                <!-- Document List -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50 border-b border-gray-200">
                                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Document</th>
                                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Added</th>
                                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <tr v-for="doc in area?.documents" :key="doc.id" class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="p-2 bg-indigo-50 rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        </div>
                                        <div>
                                            <p class="font-medium text-gray-900">{{ doc.title }}</p>
                                            <p class="text-xs text-gray-500 uppercase">{{ doc.file_type }} File</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="doc.is_analyzed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                                        {{ doc.is_analyzed ? 'Analyzed' : 'Processing' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600">
                                    {{ new Date(doc.created_at).toLocaleDateString() }}
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <button 
                                        @click="navigateToDocument(doc.id)"
                                        class="text-primary hover:text-primary-hover font-medium text-sm"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="!area?.documents || area.documents.length === 0">
                                <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                                    No documents in this area yet.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>

        <!-- Upload Modal -->
        <div v-if="showUploadModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4">
                <h3 class="text-xl font-semibold mb-4">Upload Document</h3>
                <form @submit.prevent="handleUpload">
                    <div class="space-y-4 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Select File</label>
                            <input 
                                type="file" 
                                @change="onFileChange"
                                accept=".pdf,.doc,.docx"
                                required
                                class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-primary hover:file:bg-indigo-100"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                            <input
                                v-model="uploadTitle"
                                type="text"
                                required
                                placeholder="e.g., Master Service Agreement"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" @click="showUploadModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-900">
                            Cancel
                        </button>
                        <button type="submit" :disabled="uploading || !selectedFile" class="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50">
                            {{ uploading ? 'Uploading...' : 'Upload' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
