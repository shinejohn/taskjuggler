<template>
  <span
    :class="[
      'badge',
      variant === 'active' && 'badge-active',
      variant === 'on-hold' && 'badge-on-hold',
      variant === 'completed' && 'badge-completed',
      variant === 'archived' && 'badge-archived',
      variant === 'low' && 'badge-priority-low',
      variant === 'medium' && 'badge-priority-medium',
      variant === 'high' && 'badge-priority-high',
      variant === 'critical' && 'badge-priority-critical',
      size === 'sm' && 'text-xs px-2 py-0.5',
      size === 'md' && 'text-xs px-3 py-1',
      size === 'lg' && 'text-sm px-4 py-1.5',
      className
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'active' | 'on-hold' | 'completed' | 'archived' | 'low' | 'medium' | 'high' | 'critical'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'active',
  size: 'md',
  className: ''
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  border-radius: var(--radius-full);
  font-weight: 500;
  line-height: 1.3;
}

.badge-active {
  background-color: rgba(0, 122, 255, 0.1);
  color: var(--color-status-active);
  border: 1px solid rgba(0, 122, 255, 0.3);
}

.badge-on-hold {
  background-color: rgba(255, 149, 0, 0.1);
  color: var(--color-status-on-hold);
  border: 1px solid rgba(255, 149, 0, 0.3);
}

.badge-completed {
  background-color: rgba(52, 199, 89, 0.1);
  color: var(--color-status-completed);
  border: 1px solid rgba(52, 199, 89, 0.3);
}

.badge-archived {
  background-color: rgba(134, 134, 139, 0.1);
  color: var(--color-status-archived);
  border: 1px solid rgba(134, 134, 139, 0.3);
}

.badge-priority-low {
  background-color: rgba(90, 200, 250, 0.1);
  color: var(--color-priority-low);
  border: 1px solid rgba(90, 200, 250, 0.3);
}

.badge-priority-medium {
  background-color: rgba(255, 149, 0, 0.1);
  color: var(--color-priority-medium);
  border: 1px solid rgba(255, 149, 0, 0.3);
}

.badge-priority-high {
  background-color: rgba(255, 59, 48, 0.1);
  color: var(--color-priority-high);
  border: 1px solid rgba(255, 59, 48, 0.3);
}

.badge-priority-critical {
  background-color: rgba(139, 0, 0, 0.1);
  color: var(--color-priority-critical);
  border: 1px solid rgba(139, 0, 0, 0.3);
}

.dark .badge-active {
  background-color: rgba(10, 132, 255, 0.15);
  border-color: rgba(10, 132, 255, 0.3);
}

.dark .badge-on-hold {
  background-color: rgba(255, 159, 10, 0.15);
  border-color: rgba(255, 159, 10, 0.3);
}

.dark .badge-completed {
  background-color: rgba(48, 209, 88, 0.15);
  border-color: rgba(48, 209, 88, 0.3);
}

.dark .badge-priority-critical {
  background-color: rgba(255, 107, 107, 0.15);
  border-color: rgba(255, 107, 107, 0.3);
  color: #FF6B6B;
}
</style>
