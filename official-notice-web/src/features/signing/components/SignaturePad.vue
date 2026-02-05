<template>
  <div class="signature-pad-container">
    <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
      <canvas 
        ref="canvas"
        class="w-full bg-white shadow-sm rounded touch-none cursor-crosshair"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart.prevent="startDrawing"
        @touchmove.prevent="draw"
        @touchend.prevent="stopDrawing"
      ></canvas>
      
      <div v-if="isEmpty" class="text-center text-gray-400 mt-2 text-sm pointer-events-none select-none">
        Sign above
      </div>
    </div>

    <div class="flex justify-between items-center mt-4">
      <button 
        type="button"
        @click="clear"
        class="text-sm text-gray-600 hover:text-red-500 transition-colors"
      >
        Clear Signature
      </button>

      <div class="space-x-4">
        <label class="inline-flex items-center text-sm text-gray-700">
          <input type="checkbox" v-model="agreed" class="rounded border-gray-300 text-blue-600 shadow-sm mr-2">
          I agree to be legally bound by this signature.
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  width?: number
  height?: number
}>()

const emit = defineEmits<{
  (e: 'update:signature', data: string | null): void
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const isEmpty = ref(true)
const agreed = ref(false)
let ctx: CanvasRenderingContext2D | null = null
let lastX = 0
let lastY = 0

// Resize observer to handle responsive canvas
const resizeCanvas = () => {
    if (!canvas.value) return
    const rect = canvas.value.getBoundingClientRect()
    // Make resolution matching layout
    canvas.value.width = rect.width * window.devicePixelRatio
    canvas.value.height = (props.height || 200) * window.devicePixelRatio
    
    // Scale context
    ctx = canvas.value.getContext('2d')
    if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
        ctx.strokeStyle = '#000000'
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.lineWidth = 2.5
    }
}

onMounted(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeCanvas)
})

const getCoords = (event: MouseEvent | TouchEvent) => {
    if (!canvas.value) return { x: 0, y: 0 }
    const rect = canvas.value.getBoundingClientRect()
    
    let clientX: number = 0
    let clientY: number = 0

    if (window.TouchEvent && event instanceof TouchEvent) {
        if (event.touches && event.touches.length > 0) {
          clientX = event.touches[0]!.clientX
          clientY = event.touches[0]!.clientY
        } else {
             return { x: 0, y: 0 }
        }
    } else {
        clientX = (event as MouseEvent).clientX
        clientY = (event as MouseEvent).clientY
    }

    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    }
}

const startDrawing = (event: MouseEvent | TouchEvent) => {
    isDrawing.value = true
    const { x, y } = getCoords(event)
    lastX = x
    lastY = y
}

const draw = (event: MouseEvent | TouchEvent) => {
    if (!isDrawing.value || !ctx) return
    
    const { x, y } = getCoords(event)
    
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(x, y)
    ctx.stroke()
    
    lastX = x
    lastY = y
    isEmpty.value = false
}

const stopDrawing = () => {
    if (isDrawing.value && !isEmpty.value) {
        emitSignature()
    }
    isDrawing.value = false
}

const clear = () => {
    if (!canvas.value || !ctx) return
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    isEmpty.value = true
    emitSignature()
}

const emitSignature = () => {
    if (isEmpty.value || !canvas.value) {
        emit('update:signature', null)
        return
    }
    const data = canvas.value.toDataURL('image/png')
    emit('update:signature', data)
}

watch(agreed, () => {
    // Parent might want to know about agreement separately, 
    // or we just gate the export. For now simpler to just let parent handle enabling 'Submit' 
    // based on signature presence + strict agreement checkbox in parent form, 
    // but requested feature set implies simple component. 
    // I'll keep agreement internal or emit? 
    // Let's just emit signature only if agreed? No, UX usually separates.
    // I won't block emission based on checkbox, let parent validate.
})

defineExpose({
    clear,
    isEmpty,
    getAgreement: () => agreed.value
})
</script>

<style scoped>
canvas {
    touch-action: none; /* Prevent scrolling on mobile while drawing */
}
</style>
