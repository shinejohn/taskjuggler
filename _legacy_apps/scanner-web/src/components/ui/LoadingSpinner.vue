<template>
  <div :class="['loading-spinner', size === 'sm' && 'w-4 h-4', size === 'md' && 'w-6 h-6', size === 'lg' && 'w-8 h-8', className]">
    <svg
      class="spinner"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="spinner-circle"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-dasharray="31.416"
        stroke-dashoffset="31.416"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  className: ''
})
</script>

<style scoped>
.loading-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.spinner {
  width: 100%;
  height: 100%;
  animation: spin 1s linear infinite;
}

.spinner-circle {
  animation: dash 1.5s ease-in-out infinite;
  stroke-dasharray: 31.416;
  stroke-dashoffset: 31.416;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124;
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner,
  .spinner-circle {
    animation: none;
  }
  
  .spinner-circle {
    stroke-dasharray: none;
    stroke-dashoffset: 0;
  }
}
</style>
