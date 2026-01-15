<template>
  <div :class="['w-full bg-slate-800/50 backdrop-blur-xl border-2 border-slate-700/50 shadow-2xl rounded-lg', cardClass]">
    <div :class="['p-8', contentClass]">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface AuthCardProps {
  cardClass?: string
  contentClass?: string
}

withDefaults(defineProps<AuthCardProps>(), {
  cardClass: '',
  contentClass: '',
})
</script>

