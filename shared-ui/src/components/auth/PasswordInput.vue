<template>
  <div>
    <label v-if="label" :class="['block text-sm font-semibold mb-2', labelClass]">
      {{ label }}
    </label>
    <div class="relative">
      <Lock class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      <Input
        :model-value="modelValue"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="placeholder"
        :class="['w-full pl-11 pr-12 py-3 bg-slate-900/50 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors', inputClass, inputFocusColor]"
        :required="required"
        :disabled="disabled"
        @update:model-value="$emit('update:modelValue', String($event))"
      />
      <button
        type="button"
        @click="showPassword = !showPassword"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
        :disabled="disabled"
      >
        <EyeOff v-if="showPassword" class="h-5 w-5" />
        <Eye v-else class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Lock, Eye, EyeOff } from 'lucide-vue-next'
import { Input } from '@taskjuggler/ui'

export interface PasswordInputProps {
  modelValue: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  labelClass?: string
  inputClass?: string
  inputFocusColor?: string
}

withDefaults(defineProps<PasswordInputProps>(), {
  label: '',
  placeholder: '••••••••',
  required: false,
  disabled: false,
  labelClass: 'text-slate-300',
  inputClass: '',
  inputFocusColor: 'focus:border-teal-500',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPassword = ref(false)
</script>

