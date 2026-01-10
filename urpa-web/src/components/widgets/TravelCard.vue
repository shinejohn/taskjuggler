<template>
  <div :class="['flex flex-col backdrop-blur-sm rounded-xl border-2 overflow-hidden shrink-0 shadow-lg', cardBg, cardBorder]">
    <div
      @click="isExpanded = !isExpanded"
      :class="['flex items-center justify-between p-4 cursor-pointer transition-colors border-b-2', cardBorder, headerBg, theme === 'dark' ? 'hover:bg-slate-800/70' : 'hover:from-blue-300 hover:to-cyan-300']"
    >
      <div class="flex items-center gap-3">
        <div :class="['p-2 rounded-lg', theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-300 text-blue-900']">
          <Plane class="h-5 w-5" />
        </div>
        <div>
          <h3 :class="['text-base font-bold', textPrimary]">Travel</h3>
          <p v-if="!isExpanded" :class="['text-xs font-semibold', textSecondary]">
            {{ trips.length }} trips
          </p>
        </div>
      </div>
      <ChevronUp v-if="isExpanded" :class="['h-5 w-5', textSecondary]" />
      <ChevronDown v-else :class="['h-5 w-5', textSecondary]" />
    </div>

    <Transition name="expand">
      <div v-if="isExpanded" class="overflow-hidden">
        <div class="p-3 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
          <div
            v-for="trip in trips"
            :key="trip.id"
            :class="['group relative overflow-hidden rounded-lg border-2 shadow-md', cardBorder, theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200']"
          >
            <div :class="['absolute inset-0 z-10', theme === 'dark' ? 'bg-gradient-to-r from-slate-900/90 to-slate-900/40' : 'bg-gradient-to-r from-gray-200/95 to-gray-200/70']" />
            <img
              :src="trip.image"
              :alt="trip.destination"
              class="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110"
            />
            <div class="relative z-20 p-3">
              <div class="flex justify-between items-start">
                <div :class="['flex items-center gap-1.5 text-sm font-bold px-2 py-1 rounded-full backdrop-blur-md', theme === 'dark' ? 'text-blue-300 bg-blue-500/20' : 'text-blue-900 bg-blue-300/90']">
                  <Calendar class="h-4 w-4" />
                  {{ trip.dates }}
                </div>
                <span
                  v-if="trip.status === 'upcoming'"
                  class="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"
                />
              </div>
              <div class="mt-2">
                <div :class="['flex items-center gap-1.5 font-bold text-base', theme === 'dark' ? 'text-white' : 'text-gray-900']">
                  <MapPin :class="['h-4 w-4', theme === 'dark' ? 'text-slate-300' : 'text-gray-800']" />
                  {{ trip.destination }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Plane, MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';

interface Trip {
  id: string;
  destination: string;
  dates: string;
  status: 'upcoming' | 'planning';
  image: string;
}

const { theme } = useTheme();

const isExpanded = ref(false);
const trips = ref<Trip[]>([]);

const cardBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/30' : 'bg-gray-100/95');
const cardBorder = computed(() => theme.value === 'dark' ? 'border-slate-700/50' : 'border-purple-400');
const headerBg = computed(() => theme.value === 'dark' ? 'bg-slate-800/50' : 'bg-gradient-to-r from-blue-200 to-cyan-200');
const textPrimary = computed(() => theme.value === 'dark' ? 'text-slate-200' : 'text-gray-900');
const textSecondary = computed(() => theme.value === 'dark' ? 'text-slate-400' : 'text-gray-700');

onMounted(async () => {
  try {
    // Fetch calendar activities and filter for travel-related ones
    const { useActivitiesStore } = await import('@/stores/activities');
    const activitiesStore = useActivitiesStore();
    await activitiesStore.fetchActivities({ type: 'calendar' });
    
    // Extract travel trips from calendar activities
    const calendarActivities = activitiesStore.activities.filter(a => a.type === 'calendar');
    trips.value = calendarActivities
      .filter(a => {
        const title = a.title.toLowerCase();
        return title.includes('flight') || title.includes('trip') || title.includes('travel') || 
               title.includes('hotel') || title.includes('airport');
      })
      .map((a, idx) => ({
        id: a.id,
        destination: a.title,
        dates: a.activity_timestamp 
          ? new Date(a.activity_timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : 'TBD',
        status: a.status === 'completed' ? 'planning' : 'upcoming' as 'upcoming' | 'planning',
        image: `https://images.unsplash.com/photo-${1500000000000 + idx}?w=1000&auto=format&fit=crop`,
      }));
  } catch (error) {
    // Silently fail - travel widget is optional
  }
});
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  height: 0;
  opacity: 0;
}
</style>

