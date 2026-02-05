<template>
  <span
    :class="[
      'badge',
      variant === 'running' && 'badge-running',
      variant === 'completed' && 'badge-completed',
      variant === 'failed' && 'badge-failed',
      variant === 'cancelled' && 'badge-cancelled',
      variant === 'draft' && 'badge-draft',
      variant === 'published' && 'badge-published',
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
  variant?: 'running' | 'completed' | 'failed' | 'cancelled' | 'draft' | 'published'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'draft',
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

.badge-running {
  background-color: rgba(88, 86, 214, 0.1);
  color: var(--color-execution-running);
  border: 1px solid rgba(88, 86, 214, 0.3);
}

.badge-completed {
  background-color: rgba(52, 199, 89, 0.1);
  color: var(--color-execution-completed);
  border: 1px solid rgba(52, 199, 89, 0.3);
}

.badge-failed {
  background-color: rgba(255, 59, 48, 0.1);
  color: var(--color-execution-failed);
  border: 1px solid rgba(255, 59, 48, 0.3);
}

.badge-cancelled {
  background-color: rgba(255, 149, 0, 0.1);
  color: var(--color-execution-cancelled);
  border: 1px solid rgba(255, 149, 0, 0.3);
}

.badge-draft {
  background-color: rgba(134, 134, 139, 0.1);
  color: var(--color-text-tertiary);
  border: 1px solid rgba(134, 134, 139, 0.3);
}

.badge-published {
  background-color: rgba(88, 86, 214, 0.1);
  color: var(--color-primary);
  border: 1px solid rgba(88, 86, 214, 0.3);
}

.dark .badge-running {
  background-color: rgba(94, 92, 230, 0.15);
  border-color: rgba(94, 92, 230, 0.3);
}

.dark .badge-completed {
  background-color: rgba(48, 209, 88, 0.15);
  border-color: rgba(48, 209, 88, 0.3);
}

.dark .badge-failed {
  background-color: rgba(255, 69, 58, 0.15);
  border-color: rgba(255, 69, 58, 0.3);
}

.dark .badge-cancelled {
  background-color: rgba(255, 159, 10, 0.15);
  border-color: rgba(255, 159, 10, 0.3);
}
</style>
