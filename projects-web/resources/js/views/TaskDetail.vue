<template>
    <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Task Detail</h1>
        <div v-if="loading">Loading...</div>
        <div v-else>
            <p>Task ID: {{ $route.params.taskId }}</p>
            <p>TODO: Implement task detail view</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)

onMounted(() => {
    loading.value = false
})
</script>


