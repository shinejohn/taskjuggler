<template>
  <div class="signature-pad-container">
    <canvas 
      ref="canvas"
      class="border border-slate-300 rounded-xl bg-white w-full touch-none cursor-crosshair"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart.prevent="handleTouchStart"
      @touchmove.prevent="handleTouchMove"
      @touchend.prevent="stopDrawing"
    ></canvas>
    <div class="flex justify-between mt-2">
        <span class="text-xs text-slate-400">Sign above</span>
        <button 
            type="button" 
            @click="clear"
            class="text-xs text-red-500 hover:text-red-700 font-medium"
        >
            Clear Signature
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvas = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref(false);
const ctx = ref<CanvasRenderingContext2D | null>(null);
let lastX = 0;
let lastY = 0;

const emit = defineEmits(['update:modelValue']);

// Helper: Get Position
const getPos = (e: MouseEvent | Touch) => {
  if (!canvas.value) return { x: 0, y: 0 };
  const rect = canvas.value.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
};

// Helper: Resize Canvas
const resizeCanvas = () => {
  if (!canvas.value) return;
  const rect = canvas.value.getBoundingClientRect();
  canvas.value.width = rect.width;
  canvas.value.height = 200; 
  
  if (ctx.value) {
    ctx.value.lineWidth = 2;
    ctx.value.lineCap = 'round';
    ctx.value.strokeStyle = '#0f172a';
  }
};

// Helper: Emit
const emitSignature = () => {
    if (canvas.value) {
        emit('update:modelValue', canvas.value.toDataURL());
    }
};

// Mouse Handlers
const startDrawing = (e: MouseEvent) => {
  isDrawing.value = true;
  const { x, y } = getPos(e);
  lastX = x;
  lastY = y;
};

const draw = (e: MouseEvent) => {
  if (!isDrawing.value || !ctx.value) return;
  const { x, y } = getPos(e);
  
  ctx.value.beginPath();
  ctx.value.moveTo(lastX, lastY);
  ctx.value.lineTo(x, y);
  ctx.value.stroke();
  
  lastX = x;
  lastY = y;
};

const stopDrawing = () => {
    if (isDrawing.value) {
        isDrawing.value = false;
        emitSignature();
    }
};

// Touch Handlers
const handleTouchStart = (e: TouchEvent) => {
    if (!e.touches.length) return;
    const touch = e.touches[0];
    if (!touch) return;
    
    isDrawing.value = true;
    const { x, y } = getPos(touch);
    lastX = x;
    lastY = y;
};

const handleTouchMove = (e: TouchEvent) => {
    if (!isDrawing.value || !ctx.value || !e.touches?.length) return;
    const touch = e.touches[0];
    if (!touch) return;
    
    const { x, y } = getPos(touch);
    
    ctx.value.beginPath();
    ctx.value.moveTo(lastX, lastY);
    ctx.value.lineTo(x, y);
    ctx.value.stroke();
    
    lastX = x;
    lastY = y;
};

const clear = () => {
  if (!ctx.value || !canvas.value) return;
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
  emit('update:modelValue', null);
};

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas);
});

defineExpose({ clear });
</script>
