<template>
  <div v-if="password" class="space-y-2">
    <div
      v-for="req in requirements"
      :key="req.label"
      class="flex items-center gap-2"
    >
      <div :class="['w-4 h-4 rounded-full flex items-center justify-center', req.met ? 'bg-green-500' : 'bg-slate-700']">
        <Check v-if="req.met" class="h-3 w-3 text-white" />
      </div>
      <span :class="['text-xs', req.met ? 'text-green-400' : 'text-slate-500']">
        {{ req.label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'

export interface PasswordRequirementsProps {
  password: string
  confirmPassword?: string
}

const props = defineProps<PasswordRequirementsProps>()

const requirements = computed(() => [
  {
    label: 'At least 8 characters',
    met: props.password.length >= 8,
  },
  {
    label: 'Contains uppercase letter',
    met: /[A-Z]/.test(props.password),
  },
  {
    label: 'Contains number',
    met: /\d/.test(props.password),
  },
  {
    label: props.confirmPassword ? 'Passwords match' : 'Strong password',
    met: props.confirmPassword
      ? props.password === props.confirmPassword && props.password.length > 0
      : /[!@#$%^&*(),.?":{}|<>]/.test(props.password),
  },
])
</script>



