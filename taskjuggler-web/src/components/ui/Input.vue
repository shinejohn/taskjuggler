<template>
  <div class="input-wrapper">
    <label v-if="label" :for="inputId" class="label">
      {{ label }}
      <span v-if="required" class="text-destructive ml-1">*</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="[
        'input',
        error && 'border-destructive',
        className
      ]"
      @input="handleInput"
      @blur="handleBlur"
    />
    <p v-if="error" class="text-sm text-destructive mt-1">{{ error }}</p>
    <p v-else-if="hint" class="text-sm text-text-secondary mt-1">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  label?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  className: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}
</script>

<style scoped>
.input-wrapper {
  @apply w-full;
}

.input {
  width: 100%;
  min-height: 44px;
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1rem; /* Prevents iOS zoom */
  line-height: 1.5;
  color: var(--color-text-primary);
  transition: border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}

.dark .input {
  background: var(--color-bg-secondary);
}

.input::placeholder {
  color: var(--color-text-tertiary);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
}

.input:disabled {
  background: var(--color-bg-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.input.border-destructive {
  border-color: var(--color-destructive);
}

.input.border-destructive:focus {
  box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.15);
}
</style>
