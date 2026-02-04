<template>
  <span
    :class="[
      'badge',
      variant === 'pending' && 'badge-pending',
      variant === 'accepted' && 'badge-accepted',
      variant === 'in-progress' && 'badge-in-progress',
      variant === 'completed' && 'badge-completed',
      variant === 'cancelled' && 'badge-cancelled',
      variant === 'success' && 'badge-success',
      variant === 'warning' && 'badge-warning',
      variant === 'error' && 'badge-error',
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
  variant?: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'pending',
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

.badge-pending {
  background-color: rgba(134, 134, 139, 0.1);
  color: var(--color-status-pending);
  border: 1px solid rgba(134, 134, 139, 0.3);
}

.badge-accepted {
  background-color: rgba(0, 122, 255, 0.1);
  color: var(--color-status-accepted);
  border: 1px solid rgba(0, 122, 255, 0.3);
}

.badge-in-progress {
  background-color: rgba(255, 149, 0, 0.1);
  color: var(--color-status-in-progress);
  border: 1px solid rgba(255, 149, 0, 0.3);
}

.badge-completed {
  background-color: rgba(52, 199, 89, 0.1);
  color: var(--color-status-completed);
  border: 1px solid rgba(52, 199, 89, 0.3);
}

.badge-cancelled {
  background-color: rgba(255, 59, 48, 0.1);
  color: var(--color-status-cancelled);
  border: 1px solid rgba(255, 59, 48, 0.3);
}

.badge-success {
  background-color: rgba(52, 199, 89, 0.1);
  color: var(--color-success);
  border: 1px solid rgba(52, 199, 89, 0.3);
}

.badge-warning {
  background-color: rgba(255, 149, 0, 0.1);
  color: var(--color-warning);
  border: 1px solid rgba(255, 149, 0, 0.3);
}

.badge-error {
  background-color: rgba(255, 59, 48, 0.1);
  color: var(--color-destructive);
  border: 1px solid rgba(255, 59, 48, 0.3);
}

.dark .badge-pending {
  background-color: rgba(110, 110, 115, 0.15);
  border-color: rgba(110, 110, 115, 0.3);
}

.dark .badge-accepted {
  background-color: rgba(10, 132, 255, 0.15);
  border-color: rgba(10, 132, 255, 0.3);
}

.dark .badge-in-progress {
  background-color: rgba(255, 159, 10, 0.15);
  border-color: rgba(255, 159, 10, 0.3);
}

.dark .badge-completed {
  background-color: rgba(48, 209, 88, 0.15);
  border-color: rgba(48, 209, 88, 0.3);
}

.dark .badge-cancelled {
  background-color: rgba(255, 69, 58, 0.15);
  border-color: rgba(255, 69, 58, 0.3);
}
</style>
