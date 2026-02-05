<template>
    <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Project Detail</h1>
        <div v-if="loading">Loading...</div>
        <div v-else>
            <p>Project ID: {{ $route.params.id }}</p>
            <p>TODO: Implement project detail view</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(true)

onMounted(() => {
    loading.value = false
})
</script>


