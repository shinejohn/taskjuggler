<template>
  <Card :class="['bg-slate-800/50 backdrop-blur-xl border-2 border-slate-700/50 shadow-2xl', cardClass]">
    <CardContent :class="['p-8', contentClass]">
      <slot />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@taskjuggler/ui'

export interface AuthCardProps {
  cardClass?: string
  contentClass?: string
}

withDefaults(defineProps<AuthCardProps>(), {
  cardClass: '',
  contentClass: '',
})
</script>

