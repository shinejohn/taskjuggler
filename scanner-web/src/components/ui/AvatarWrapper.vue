<template>
  <Avatar :size="mappedSize" :shape="shape" :class="className">
    <AvatarImage v-if="src" :src="src" :alt="alt" />
    <AvatarFallback>
      {{ initials }}
    </AvatarFallback>
  </Avatar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, AvatarImage, AvatarFallback, type AvatarVariants } from '@taskjuggler/ui'

interface Props {
  src?: string
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | AvatarVariants['size']
  shape?: AvatarVariants['shape']
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'base',
  shape: 'circle',
  className: ''
})

// Map scanner-web size prop to shared-ui size
const mappedSize = computed<AvatarVariants['size']>(() => {
  if (props.size === 'sm') return 'sm'
  if (props.size === 'md' || props.size === 'base') return 'base'
  if (props.size === 'lg' || props.size === 'xl') return 'lg'
  return props.size as AvatarVariants['size']
})

const initials = computed(() => {
  if (!props.name) return '?'
  const parts = props.name.trim().split(' ').filter(p => p.length > 0)
  if (parts.length === 0) return '?'
  if (parts.length === 1) {
    return parts[0]?.charAt(0).toUpperCase() || '?'
  }
  const first = parts[0]?.charAt(0) || ''
  const last = parts[parts.length - 1]?.charAt(0) || ''
  return (first + last).toUpperCase()
})
</script>

