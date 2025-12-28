<template>
  <button
    :class="[
      'btn',
      variant === 'primary' && 'btn-primary',
      variant === 'secondary' && 'btn-secondary',
      variant === 'ghost' && 'btn-ghost',
      size === 'sm' && 'px-4 py-2 text-xs min-h-[36px]',
      size === 'md' && 'px-5 py-3 text-sm min-h-[44px]',
      size === 'lg' && 'px-6 py-4 text-base min-h-[52px]',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    ]"
    :disabled="disabled"
    :type="type"
    @click="handleClick"
  >
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button',
  className: ''
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.btn {
  transition: all var(--duration-fast) var(--ease-out);
}

.btn:active:not(:disabled) {
  transform: scale(0.97);
}
</style>
