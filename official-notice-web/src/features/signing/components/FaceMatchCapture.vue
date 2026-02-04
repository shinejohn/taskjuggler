<template>
  <div class="face-capture text-center">
    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded mb-4">
      {{ error }}
      <button @click="startCamera" class="underline ml-2">Retry</button>
    </div>

    <div class="relative max-w-sm mx-auto bg-black rounded-lg overflow-hidden aspect-[3/4] shadow-lg">
      <!-- Live Video Feed -->
      <video 
        ref="video" 
        class="w-full h-full object-cover transform scale-x-[-1]" 
        autoplay 
        playsinline 
        muted
        v-show="!capturedImage"
      ></video>
      
      <!-- Captured Image Preview -->
      <img 
        v-if="capturedImage" 
        :src="capturedImage" 
        class="w-full h-full object-cover"
      />

      <!-- Instruction Overlay -->
      <div v-if="!capturedImage" class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="border-2 border-white/50 w-48 h-64 rounded-full"></div>
      </div>
      
      <!-- Loading Spinner -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black/50">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    </div>

    <div class="mt-6 space-y-3">
        <p class="text-sm text-gray-500" v-if="!capturedImage">
            Center your face in the oval and ensure good lighting.
        </p>

        <div v-if="!capturedImage">
            <button 
                @click="capture"
                :disabled="!streamReady"
                class="bg-blue-600 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all flex items-center gap-2 mx-auto"
            >
                <div class="w-4 h-4 rounded-full bg-white animate-pulse"></div>
                Take Photo
            </button>
        </div>

        <div v-else class="flex gap-4 justify-center">
            <button 
                @click="retake"
                class="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"
            >
                Retake
            </button>
            <button 
                @click="confirm"
                class="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 font-medium"
            >
                Use This Photo
            </button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits<{
  (e: 'capture', imageBase64: string): void
}>()

const video = ref<HTMLVideoElement | null>(null)
const stream = ref<MediaStream | null>(null)
const capturedImage = ref<string | null>(null)
const error = ref<string | null>(null)
const loading = ref(true)
const streamReady = ref(false)

const startCamera = async () => {
    loading.value = true
    error.value = null
    try {
        stream.value = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        })
        
        if (video.value) {
            video.value.srcObject = stream.value
            video.value.onloadedmetadata = () => {
                streamReady.value = true
                loading.value = false
            }
        }
    } catch (e: any) {
        console.error(e)
        error.value = "Could not access camera. Please allow camera permissions."
        loading.value = false
    }
}

const stopCamera = () => {
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop())
        stream.value = null
    }
}

const capture = () => {
    if (!video.value) return
    
    const canvas = document.createElement('canvas')
    canvas.width = video.value.videoWidth
    canvas.height = video.value.videoHeight
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
        // Flip horizontally to match mirror effect
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(video.value, 0, 0)
        
        capturedImage.value = canvas.toDataURL('image/jpeg', 0.9)
        // Stop stream to save battery/led
        stopCamera() 
    }
}

const retake = () => {
    capturedImage.value = null
    startCamera()
}

const confirm = () => {
    if (capturedImage.value) {
        // Strip prefix for pure base64 if needed, but usually src includes it
        // The service expects full base64 string or we strip 'data:image/jpeg;base64,' in service
        // Service `base64_decode` in PHP handles raw base64. 
        // `toDataURL` returns `data:image/jpeg;base64,...`. 
        // I will ensure I strip the prefix before emitting or let service handle.
        // Let's strip it here to be safe for PHP `base64_decode`.
        const rawBase64 = capturedImage.value.replace(/^data:image\/\w+;base64,/, '')
        emit('capture', rawBase64)
    }
}

onMounted(() => {
    startCamera()
})

onBeforeUnmount(() => {
    stopCamera()
})
</script>
