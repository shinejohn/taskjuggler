<!--
  Example usage of VirtualList component for rendering long lists efficiently
  
  Usage:
  <VirtualList
    :items="items"
    :item-height="60"
    :container-height="600"
    :overscan="3"
  >
    <template #default="{ items: visibleItems, startIndex }">
      <div
        v-for="(item, index) in visibleItems"
        :key="item.id"
        :style="{ height: '60px' }"
        class="border-b border-slate-200 p-4"
      >
        Item {{ startIndex + index }}: {{ item.name }}
      </div>
    </template>
  </VirtualList>
-->

<template>
  <VirtualList
    :items="exampleItems"
    :item-height="60"
    :container-height="600"
    :overscan="3"
  >
    <template #default="{ items: visibleItems, startIndex }">
      <div
        v-for="(item, index) in visibleItems"
        :key="item.id"
        :style="{ height: '60px' }"
        class="border-b border-slate-200 p-4 hover:bg-slate-50"
      >
        <div class="flex items-center justify-between">
          <span>Item {{ startIndex + index + 1 }}: {{ item.name }}</span>
          <span class="text-sm text-slate-500">{{ item.description }}</span>
        </div>
      </div>
    </template>
  </VirtualList>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VirtualList from './VirtualList.vue';

// Example data
const exampleItems = ref(
  Array.from({ length: 1000 }, (_, i) => ({
    id: `item-${i}`,
    name: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
  }))
);
</script>

