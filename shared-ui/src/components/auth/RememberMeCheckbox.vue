<template>
  <label class="flex items-center gap-2 cursor-pointer">
    <input
      :model-value="modelValue"
      type="checkbox"
      :class="['w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-teal-500 focus:ring-teal-500 focus:ring-offset-0', checkboxClass]"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span :class="['text-sm', labelClass]">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
export interface RememberMeCheckboxProps {
  modelValue: boolean
  label?: string
  checkboxClass?: string
  labelClass?: string
}

withDefaults(defineProps<RememberMeCheckboxProps>(), {
  label: 'Remember me',
  checkboxClass: '',
  labelClass: 'text-slate-400',
})

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>



