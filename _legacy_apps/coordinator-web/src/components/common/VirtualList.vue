<template>
  <div
    ref="containerRef"
    class="virtual-list-container"
    :style="{ height: `${containerHeight}px`, overflow: 'auto' }"
    @scroll="handleScroll"
  >
    <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
      <div
        :style="{
          transform: `translateY(${offsetY}px)`,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }"
      >
        <slot
          :items="visibleItems"
          :start-index="startIndex"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

const props = withDefaults(defineProps<Props>(), {
  overscan: 3,
});

const containerRef = ref<HTMLElement | null>(null);
const scrollTop = ref(0);

const itemCount = computed(() => props.items.length);
const totalHeight = computed(() => itemCount.value * props.itemHeight);

const startIndex = computed(() => {
  const index = Math.floor(scrollTop.value / props.itemHeight);
  return Math.max(0, index - props.overscan);
});

const endIndex = computed(() => {
  const visibleCount = Math.ceil(props.containerHeight / props.itemHeight);
  const index = startIndex.value + visibleCount + props.overscan * 2;
  return Math.min(itemCount.value, index);
});

const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value);
});

const offsetY = computed(() => {
  return startIndex.value * props.itemHeight;
});

function handleScroll(event: Event) {
  const target = event.target as HTMLElement;
  scrollTop.value = target.scrollTop;
}

let rafId: number | null = null;

function throttledScroll(event: Event) {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }
  rafId = requestAnimationFrame(() => {
    handleScroll(event);
  });
}

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('scroll', throttledScroll, { passive: true });
  }
});

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', throttledScroll);
  }
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }
});
</script>

<style scoped>
.virtual-list-container {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>

