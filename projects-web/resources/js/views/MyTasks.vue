<template>
    <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-6">My Tasks</h1>
        <div v-if="loading">Loading...</div>
        <div v-else>
            <p>TODO: Implement my tasks view</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const loading = ref(true)
const tasks = ref([])

onMounted(async () => {
    try {
        const response = await axios.get('/my/tasks')
        tasks.value = response.data.data
    } catch (error) {
        console.error('Failed to load tasks:', error)
    } finally {
        loading.value = false
    }
})
</script>


