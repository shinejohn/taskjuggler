<template>
  <div
    :class="[
      'avatar',
      size === 'sm' && 'w-6 h-6 text-xs',
      size === 'md' && 'w-8 h-8 text-sm',
      size === 'lg' && 'w-12 h-12 text-base',
      size === 'xl' && 'w-16 h-16 text-lg',
      className
    ]"
    :style="avatarStyle"
  >
    <img v-if="src" :src="src" :alt="alt" class="avatar-image" />
    <span v-else class="avatar-initials">{{ initials }}</span>
    <span
      v-if="showOnline"
      :class="[
        'avatar-online-indicator',
        size === 'sm' && 'w-2 h-2',
        size === 'md' && 'w-2.5 h-2.5',
        size === 'lg' && 'w-3 h-3',
        size === 'xl' && 'w-4 h-4'
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  src?: string
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showOnline?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showOnline: false,
  className: ''
})

const initials = computed(() => {
  if (!props.name) return '?'
  const parts = props.name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
})

// Generate a color based on the name hash for consistent avatar colors
const avatarStyle = computed(() => {
  if (props.src) return {}
  
  let hash = 0
  const name = props.name || 'user'
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = hash % 360
  return {
    background: `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue + 30}, 70%, 50%))`
  }
})
</script>

<style scoped>
.avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-bg-primary);
  overflow: hidden;
  flex-shrink: 0;
  font-weight: 600;
  color: white;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.avatar-online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: var(--color-success);
  border: 2px solid var(--color-bg-primary);
  border-radius: var(--radius-full);
}

.dark .avatar-online-indicator {
  border-color: var(--color-bg-primary);
}
</style>
