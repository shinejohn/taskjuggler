<template>
  <div :class="['flex flex-col h-full backdrop-blur-sm rounded-2xl border-2 overflow-hidden shadow-lg', cardBg, cardBorder]">
    <!-- Header -->
    <div :class="['p-4 border-b-2 sticky top-0 z-10', cardBorder, headerBg]">
      <!-- Search -->
      <div class="relative mb-4">
        <Search :class="['absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5', textSecondary]" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search activities..."
          :class="['w-full rounded-lg pl-10 pr-4 py-2.5 text-base font-medium placeholder-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all border-2', inputBg, textPrimary, theme === 'dark' ? 'focus:ring-teal-500/50' : 'focus:ring-purple-600']"
        />
      </div>

      <!-- Action Card -->
      <ActionCard />
    </div>

    <!-- Draggable Cards Grid -->
    <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
        <DraggableCard
          v-for="(cardConfig, index) in cardOrder"
          :key="cardConfig.id"
          :id="cardConfig.id"
          :index="index"
          :grid-span="cardConfig.gridSpan"
          @resize="handleResize"
        >
          <template v-if="cardConfig.type === 'activity' && cardConfig.activityType">
            <ActivityTypeCard
              :type="cardConfig.activityType"
              :activities="getActivitiesByType(cardConfig.activityType)"
            />
          </template>
          <template v-else-if="cardConfig.type === 'voicemail'">
            <VoicemailCard :voicemails="voicemails" />
          </template>
        </DraggableCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search, Mail, MessageSquare, CheckSquare, Calendar, Share2, Voicemail } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';
import { useActivitiesStore } from '@/stores/activities';
import ActivityCard from './ActivityCard.vue';
import ActionCard from './ActionCard.vue';
import DraggableCard from './DraggableCard.vue';
import type { ActivityItem, ActivityType } from '@/types/activity';

interface CardConfig {
  id: string;
  type: 'activity' | 'voicemail';
  activityType?: ActivityType;
  gridSpan: 1 | 2 | 3;
}

const { theme } = useTheme();
const activitiesStore = useActivitiesStore();

const searchQuery = ref('');
const cardOrder = ref<CardConfig[]>([
  { id: 'email', type: 'activity', activityType: 'email', gridSpan: 1 },
  { id: 'text', type: 'activity', activityType: 'text', gridSpan: 1 },
  { id: 'task', type: 'activity', activityType: 'task', gridSpan: 1 },
  { id: 'calendar', type: 'activity', activityType: 'calendar', gridSpan: 1 },
  { id: 'social', type: 'activity', activityType: 'social', gridSpan: 1 },
  { id: 'voicemail', type: 'voicemail', gridSpan: 1 },
]);

const MAX_VISIBLE_ITEMS = 5;

const cardBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/30' : 'bg-gray-100/95');
const cardBorder = computed(() => theme.value === 'dark' ? 'border-slate-700/50' : 'border-purple-400');
const headerBg = computed(() => theme.value === 'dark' ? 'bg-slate-900/80' : 'bg-gray-100/95');
const inputBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-200 border-purple-400');
const textPrimary = computed(() => theme.value === 'dark' ? 'text-white' : 'text-gray-900');
const textSecondary = computed(() => theme.value === 'dark' ? 'text-slate-400' : 'text-gray-700');

const voicemails = computed(() => {
  return activitiesStore.activities.filter(activity => activity.type === 'voicemail');
});

function getActivitiesByType(type: ActivityType): ActivityItem[] {
  return activitiesStore.activities.filter(activity => {
    const matchesType = activity.type === type;
    const matchesSearch = searchQuery.value === '' || 
      activity.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesType && matchesSearch;
  });
}

function handleResize(id: string, newSpan: 1 | 2 | 3) {
  cardOrder.value = cardOrder.value.map(card => 
    card.id === id ? { ...card, gridSpan: newSpan } : card
  );
}

onMounted(async () => {
  await activitiesStore.fetchActivities();
});
</script>

<script lang="ts">
import ActivityTypeCard from './ActivityTypeCard.vue';
import VoicemailCard from './VoicemailCard.vue';

export default {
  components: {
    ActivityTypeCard,
    VoicemailCard,
  },
};
</script>

