<template>
  <Card class="hover:shadow-md transition-shadow" :class="size === 'standard' ? 'p-6' : 'p-4'">
    <CardContent>
      <div class="flex justify-between items-start mb-4">
        <div
          :class="[
            'p-2.5 rounded-lg',
            variantClasses[variant]
          ]"
        >
          <component :is="icon" :size="size === 'standard' ? 20 : 16" />
        </div>
        <Badge
          v-if="trend"
          :variant="trend.direction === 'up' ? 'default' : trend.direction === 'down' ? 'destructive' : 'secondary'"
          :class="trendColors[trend.direction]"
        >
          <TrendingUp v-if="trend.direction === 'up'" :size="12" class="mr-1" />
          <TrendingDown v-else-if="trend.direction === 'down'" :size="12" class="mr-1" />
          <Minus v-else :size="12" class="mr-1" />
          {{ trend.value }}
        </Badge>
      </div>

      <div class="space-y-1">
        <h3 :class="['font-medium text-slate-500', size === 'standard' ? 'text-sm' : 'text-xs']">
          {{ label }}
        </h3>
        <div :class="['font-bold text-slate-900', size === 'standard' ? 'text-3xl' : 'text-2xl']">
          {{ value }}
        </div>
        <p v-if="trend?.label" class="text-xs text-slate-400 mt-1">{{ trend.label }}</p>
        <p v-if="subStat" class="text-xs text-slate-400 mt-1">{{ subStat }}</p>
      </div>

      <!-- Progress Bar -->
      <div v-if="progress" class="mt-4">
        <div class="flex justify-between text-xs text-slate-500 mb-2">
          <span>{{ progress.label || 'Progress' }}</span>
          <span>
            {{ progress.current }} / {{ progress.total }}
          </span>
        </div>
        <Progress :model-value="(progress.current / progress.total) * 100" :class="progressColors[variant]" />
      </div>

      <!-- Sparkline -->
      <div v-if="sparkline && sparkline.length > 0" class="mt-4 h-12 flex items-end gap-0.5">
        <div
          v-for="(value, i) in sparkline"
          :key="i"
          :class="[
            'flex-1 rounded-t transition-all duration-300',
            sparklineColors[variant]
          ]"
          :style="{ height: `${(value / Math.max(...sparkline)) * 100}%` }"
        />
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, Badge, Progress } from '@taskjuggler/ui';
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next';
import type { Component } from 'vue';

interface Props {
  label: string;
  value: string | number;
  icon: Component;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  progress?: {
    current: number;
    total: number;
    label?: string;
  };
  sparkline?: number[];
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'standard' | 'compact';
  subStat?: string;
  className?: string;
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'standard',
});

const variantClasses = {
  default: 'bg-blue-50 text-[#1B4F72]',
  success: 'bg-green-50 text-green-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-red-50 text-red-600',
};

const trendColors = {
  up: 'text-green-600 bg-green-50',
  down: 'text-red-600 bg-red-50',
  neutral: 'text-slate-600 bg-slate-100',
};

const progressColors = {
  default: '[&>div]:bg-[#1B4F72]',
  success: '[&>div]:bg-green-500',
  warning: '[&>div]:bg-amber-500',
  danger: '[&>div]:bg-red-500',
};

const sparklineColors = {
  default: 'bg-blue-200',
  success: 'bg-green-200',
  warning: 'bg-amber-200',
  danger: 'bg-red-200',
};
</script>

