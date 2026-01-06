<template>
  <div class="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start mb-4">
      <div class="p-2.5 bg-blue-50 text-[#1B4F72] rounded-lg">
        <component :is="icon" :size="20" />
      </div>
      <div
        v-if="trend"
        :class="[
          'flex items-center text-xs font-medium px-2 py-1 rounded-full',
          trend.direction === 'up' ? 'text-green-700 bg-green-50' : trend.direction === 'down' ? 'text-red-700 bg-red-50' : 'text-slate-600 bg-slate-100'
        ]"
      >
        <ArrowUp v-if="trend.direction === 'up'" :size="12" class="mr-1" />
        <ArrowDown v-else-if="trend.direction === 'down'" :size="12" class="mr-1" />
        <Minus v-else :size="12" class="mr-1" />
        {{ trend.value }}
      </div>
    </div>

    <div class="space-y-1">
      <h3 class="text-sm font-medium text-slate-500">{{ title }}</h3>
      <div class="text-3xl font-bold text-slate-900">{{ value }}</div>
      <p v-if="subStat" class="text-xs text-slate-400 mt-1">{{ subStat }}</p>
      <p v-if="trend?.label" class="text-xs text-slate-400 mt-1">{{ trend.label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUp, ArrowDown, Minus } from 'lucide-vue-next';
import type { Component } from 'vue';

interface Props {
  title: string;
  value: string | number;
  icon: Component;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  subStat?: string;
}

defineProps<Props>();
</script>

