<template>
    <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        <div v-if="loading" class="text-center py-12">
            <div class="text-gray-500">Loading...</div>
        </div>

        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="text-2xl font-bold text-gray-900">{{ stats.my_tasks }}</div>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">My Tasks</dt>
                                <dd class="text-lg font-medium text-gray-900"></dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="text-2xl font-bold text-red-600">{{ stats.my_overdue }}</div>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="text-2xl font-bold text-gray-900">{{ stats.projects }}</div>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Projects</dt>
                            </dl>
                        </div>
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
const stats = ref({
    my_tasks: 0,
    my_overdue: 0,
    projects: 0
})

onMounted(async () => {
    try {
        const response = await axios.get('/dashboard')
        stats.value = response.data.stats
    } catch (error) {
        console.error('Failed to load dashboard:', error)
    } finally {
        loading.value = false
    }
})
</script>


