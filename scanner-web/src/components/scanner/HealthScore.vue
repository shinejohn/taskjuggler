<template>
  <div :class="['health-score', size === 'sm' && 'health-score-sm', size === 'md' && 'health-score-md', size === 'lg' && 'health-score-lg', className]">
    <svg class="health-score-circle" :width="sizePx" :height="sizePx" viewBox="0 0 120 120">
      <circle
        class="health-score-bg"
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke="var(--color-bg-secondary)"
        stroke-width="8"
      />
      <circle
        class="health-score-progress"
        :class="scoreClass"
        cx="60"
        cy="60"
        r="54"
        fill="none"
        :stroke="scoreColor"
        stroke-width="8"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        transform="rotate(-90 60 60)"
      />
    </svg>
    <div class="health-score-content">
      <div class="health-score-value">{{ score }}</div>
      <div v-if="showLabel" class="health-score-label">{{ statusLabel }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showLabel: true,
  className: ''
})

const circumference = 2 * Math.PI * 54 // radius = 54
const sizePx = computed(() => {
  switch (props.size) {
    case 'sm': return 80
    case 'md': return 120
    case 'lg': return 160
    default: return 120
  }
})

const offset = computed(() => {
  const percentage = props.score / 100
  return circumference * (1 - percentage)
})

const scoreClass = computed(() => {
  if (props.score >= 90) return 'score-excellent'
  if (props.score >= 70) return 'score-good'
  if (props.score >= 50) return 'score-fair'
  return 'score-poor'
})

const scoreColor = computed(() => {
  if (props.score >= 90) return '#10B981' // green
  if (props.score >= 70) return '#3B82F6' // blue
  if (props.score >= 50) return '#F59E0B' // orange
  return '#EF4444' // red
})

const statusLabel = computed(() => {
  if (props.score >= 90) return 'Healthy'
  if (props.score >= 70) return 'Good'
  if (props.score >= 50) return 'Needs Work'
  return 'Critical'
})
</script>

<style scoped>
.health-score {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.health-score-sm {
  width: 80px;
  height: 80px;
}

.health-score-md {
  width: 120px;
  height: 120px;
}

.health-score-lg {
  width: 160px;
  height: 160px;
}

.health-score-circle {
  transform: rotate(-90deg);
}

.health-score-progress {
  transition: stroke-dashoffset 0.6s ease-in-out;
}

.health-score-content {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.health-score-value {
  font-size: var(--font-headline);
  font-weight: 700;
  line-height: 1;
  color: var(--color-text-primary);
}

.health-score-sm .health-score-value {
  font-size: var(--font-title-medium);
}

.health-score-lg .health-score-value {
  font-size: var(--font-display-small);
}

.health-score-label {
  font-size: var(--font-body-small);
  color: var(--color-text-secondary);
  margin-top: var(--space-1);
  font-weight: 500;
}

.health-score-sm .health-score-label {
  font-size: var(--font-caption);
}
</style>
