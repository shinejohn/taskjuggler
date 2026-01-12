<template>
  <div class="flex flex-col h-full min-h-[350px]">
    <div :class="['flex items-center justify-between p-4 border-b-2', cardBorder, headerBgClass]">
      <div class="flex items-center gap-3">
        <a
          href="#"
          :class="['p-2.5 rounded-lg hover:scale-110 transition-transform shadow-md', bgColor, color]"
          @click.prevent
        >
          <component :is="iconComponent" class="h-6 w-6" />
        </a>
        <h3 :class="['text-base font-bold', theme === 'dark' ? 'text-slate-200' : 'text-gray-900']">
          {{ typeConfig.label }}
        </h3>
      </div>
      <span :class="['text-sm font-bold px-2.5 py-1 rounded-full', badgeBg, textSecondary]">
        {{ activities.length }}
      </span>
    </div>

    <div class="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
      <template v-if="activities.length > 0">
        <ActivityCard
          v-for="(activity, idx) in visibleActivities"
          :key="activity.id"
          :activity="activity"
          :index="idx"
        />
        <div v-if="hasMore" :class="['text-center py-2 text-xs font-semibold', textSecondary]">
          Scroll for {{ activities.length - MAX_VISIBLE_ITEMS }} more...
        </div>
      </template>
      <div v-else :class="['flex flex-col items-center justify-center h-32', textSecondary]">
        <p class="text-sm font-semibold">
          No {{ typeConfig.label.toLowerCase() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Mail, MessageSquare, CheckSquare, Calendar, Share2 } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';
import ActivityCard from './ActivityCard.vue';
import type { ActivityItem, ActivityType } from '@/types/activity';

const props = defineProps<{
  type: ActivityType;
  activities: ActivityItem[];
}>();

const { theme } = useTheme();

const MAX_VISIBLE_ITEMS = 5;

const ACTIVITY_TYPES = {
  email: {
    label: 'Email',
    icon: Mail,
    colorDark: 'text-blue-400',
    colorLight: 'text-blue-800',
    bgColorDark: 'bg-blue-500/10',
    bgColorLight: 'bg-blue-200',
  },
  text: {
    label: 'Messages',
    icon: MessageSquare,
    colorDark: 'text-green-400',
    colorLight: 'text-green-800',
    bgColorDark: 'bg-green-500/10',
    bgColorLight: 'bg-green-200',
  },
  task: {
    label: 'Tasks',
    icon: CheckSquare,
    colorDark: 'text-amber-400',
    colorLight: 'text-amber-800',
    bgColorDark: 'bg-amber-500/10',
    bgColorLight: 'bg-amber-200',
  },
  calendar: {
    label: 'Calendar',
    icon: Calendar,
    colorDark: 'text-purple-400',
    colorLight: 'text-purple-800',
    bgColorDark: 'bg-purple-500/10',
    bgColorLight: 'bg-purple-200',
  },
  social: {
    label: 'Social',
    icon: Share2,
    colorDark: 'text-pink-400',
    colorLight: 'text-pink-800',
    bgColorDark: 'bg-pink-500/10',
    bgColorLight: 'bg-pink-200',
  },
};

const typeConfig = computed(() => ACTIVITY_TYPES[props.type]);
const iconComponent = computed(() => typeConfig.value.icon);
const color = computed(() => theme.value === 'dark' ? typeConfig.value.colorDark : typeConfig.value.colorLight);
const bgColor = computed(() => theme.value === 'dark' ? typeConfig.value.bgColorDark : typeConfig.value.bgColorLight);
const headerBgClass = computed(() => {
  if (theme.value === 'dark') return 'bg-slate-800/50';
  const bg = typeConfig.value.bgColorLight.replace('bg-', 'from-');
  return `bg-gradient-to-r ${bg} ${bg.replace('200', '300')}`;
});
const cardBorder = computed(() => theme.value === 'dark' ? 'border-slate-700/50' : 'border-purple-400');
const badgeBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/50' : 'bg-purple-200');
const textSecondary = computed(() => theme.value === 'dark' ? 'text-slate-400' : 'text-gray-700');

const visibleActivities = computed(() => props.activities.slice(0, MAX_VISIBLE_ITEMS));
const hasMore = computed(() => props.activities.length > MAX_VISIBLE_ITEMS);
</script>

