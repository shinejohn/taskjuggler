<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Projects</h1>
            <button
                @click="showCreateModal = true"
                class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
                New Project
            </button>
        </div>

        <div v-if="loading" class="text-center py-12">
            <div class="text-gray-500">Loading projects...</div>
        </div>

        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
                v-for="project in projects"
                :key="project.id"
                class="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-lg transition"
                @click="$router.push({ name: 'project-detail', params: { id: project.id } })"
            >
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-1">
                            <h3 class="text-lg font-medium text-gray-900">{{ project.name }}</h3>
                            <p class="mt-1 text-sm text-gray-500">{{ project.code }}</p>
                        </div>
                    </div>
                    <div class="mt-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {{ project.status }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const loading = ref(true)
const projects = ref([])
const showCreateModal = ref(false)

onMounted(async () => {
    try {
        const response = await axios.get('/projects')
        projects.value = response.data.data
    } catch (error) {
        console.error('Failed to load projects:', error)
    } finally {
        loading.value = false
    }
})
</script>


