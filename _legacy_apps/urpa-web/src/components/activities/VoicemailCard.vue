<template>
  <div class="flex flex-col h-full min-h-[350px]">
    <div :class="['flex items-center justify-between p-4 border-b-2', cardBorder, headerBgClass]">
      <div class="flex items-center gap-3">
        <a
          href="#"
          :class="['p-2.5 rounded-lg hover:scale-110 transition-transform shadow-md', bgColor, color]"
          @click.prevent
        >
          <Voicemail class="h-6 w-6" />
        </a>
        <h3 :class="['text-base font-bold', theme === 'dark' ? 'text-slate-200' : 'text-gray-900']">
          Voicemail
        </h3>
      </div>
      <span :class="['text-sm font-bold px-2.5 py-1 rounded-full', badgeBg, textSecondary]">
        {{ voicemails.length }}
      </span>
    </div>
    <div class="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
      <ActivityCard
        v-for="(voicemail, idx) in visibleVoicemails"
        :key="voicemail.id"
        :activity="voicemail"
        :index="idx"
      />
      <div v-if="hasMore" :class="['text-center py-2 text-xs font-semibold', textSecondary]">
        Scroll for {{ voicemails.length - MAX_VISIBLE_ITEMS }} more...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Voicemail } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';
import ActivityCard from './ActivityCard.vue';
import type { ActivityItem } from '@/types/activity';

const props = defineProps<{
  voicemails: ActivityItem[];
}>();

const { theme } = useTheme();

const MAX_VISIBLE_ITEMS = 5;

const cardBorder = computed(() => theme.value === 'dark' ? 'border-slate-700/50' : 'border-purple-400');
const headerBgClass = computed(() => theme.value === 'dark' ? 'bg-slate-800/50' : 'bg-gradient-to-r from-indigo-200 to-indigo-300');
const bgColor = computed(() => theme.value === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-200 text-indigo-800');
const color = computed(() => theme.value === 'dark' ? 'text-indigo-400' : 'text-indigo-800');
const badgeBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/50' : 'bg-purple-200');
const textSecondary = computed(() => theme.value === 'dark' ? 'text-slate-400' : 'text-gray-700');

const visibleVoicemails = computed(() => props.voicemails.slice(0, MAX_VISIBLE_ITEMS));
const hasMore = computed(() => props.voicemails.length > MAX_VISIBLE_ITEMS);
</script>

