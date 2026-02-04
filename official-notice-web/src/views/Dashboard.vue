<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { areasApi } from '../services/api'
import { useAuthStore } from '../stores/auth'
import type { DocumentArea } from '../types'

const router = useRouter()
const { isAuthenticated, user, logout } = useAuthStore()

const areas = ref<DocumentArea[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Create Area Modal
const showCreateModal = ref(false)
const newAreaName = ref('')
const creating = ref(false)

onMounted(async () => {
    if (!isAuthenticated.value) {
        router.push('/login')
        return
    }
    await loadAreas()
})

const loadAreas = async () => {
    loading.value = true
    error.value = null
    try {
        areas.value = await areasApi.list()
    } catch (e: any) {
        error.value = e.response?.data?.message || 'Failed to load document areas'
    } finally {
        loading.value = false
    }
}

const createArea = async () => {
    if (!newAreaName.value.trim()) return
    creating.value = true
    try {
        const newArea = await areasApi.create(newAreaName.value.trim())
        areas.value.unshift(newArea)
        showCreateModal.value = false
        newAreaName.value = ''
    } catch (e: any) {
        alert(e.response?.data?.message || 'Failed to create area')
    } finally {
        creating.value = false
    }
}

const navigateToArea = (areaId: string) => {
    router.push(`/areas/${areaId}`)
}

const handleLogout = async () => {
    await logout()
    router.push('/login')
}
</script>

<template>
    <div>
        <!-- Header with user info -->
        <div class="flex justify-between items-center mb-8">
            <div>
                <h2 class="text-2xl font-bold tracking-tight">Document Areas</h2>
                <p class="text-text-secondary mt-1">Manage your teams and critical document workspaces.</p>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-sm text-gray-600">{{ user?.name || user?.email }}</span>
                <button @click="showCreateModal = true" class="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md transition-colors font-medium text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Create Area
                </button>
                <button @click="handleLogout" class="px-3 py-2 text-gray-600 hover:text-gray-900 text-sm">
                    Logout
                </button>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-12">
            <p class="text-red-600 mb-4">{{ error }}</p>
            <button @click="loadAreas" class="px-4 py-2 bg-primary text-white rounded-md">Retry</button>
        </div>

        <!-- Areas Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
                v-for="area in areas" 
                :key="area.id" 
                @click="navigateToArea(area.id)"
                class="p-6 rounded-lg border border-border bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
                <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" :class="area.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'">
                        {{ area.status === 'active' ? 'Active' : 'Archived' }}
                    </span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">{{ area.name }}</h3>
                <p class="text-sm text-gray-500 mb-4">Created on {{ new Date(area.created_at).toLocaleDateString() }}</p>
                
                <div class="flex items-center text-sm text-gray-600 gap-4 mt-auto pt-4 border-t border-gray-100">
                    <div class="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        {{ area.documents_count || 0 }} Docs
                    </div>
                </div>
            </div>

            <!-- Empty State Card -->
            <div v-if="areas.length === 0" class="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-gray-400 mb-4"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                <h3 class="text-lg font-medium text-gray-900">No Document Areas yet</h3>
                <p class="mt-1 text-sm text-gray-500">Get started by creating your first secure workspace.</p>
                <div class="mt-6">
                    <button @click="showCreateModal = true" class="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md transition-colors text-sm font-medium">Create Area</button>
                </div>
            </div>
        </div>

        <!-- Create Area Modal -->
        <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4">
                <h3 class="text-xl font-semibold mb-4">Create Document Area</h3>
                <form @submit.prevent="createArea">
                    <div class="mb-4">
                        <label for="areaName" class="block text-sm font-medium text-gray-700 mb-1">Area Name</label>
                        <input
                            id="areaName"
                            v-model="newAreaName"
                            type="text"
                            required
                            placeholder="e.g., Lease Agreements 2026"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" @click="showCreateModal = false" class="px-4 py-2 text-gray-600 hover:text-gray-900">
                            Cancel
                        </button>
                        <button type="submit" :disabled="creating" class="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg disabled:opacity-50">
                            {{ creating ? 'Creating...' : 'Create' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
