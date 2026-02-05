<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      <div class="relative z-10">
        <h1 class="text-2xl font-bold mb-2">{{ greeting }}, {{ patient?.first_name || 'there' }}</h1>
        <p class="opacity-90" v-if="!visitItems.length">You have no upcoming appointments scheduled.</p>
        <p class="opacity-90" v-else>Follow up on your latest visit items below.</p>
      </div>
      <div class="absolute right-0 top-0 opacity-10 -mr-8 -mt-8">
        <Heart class="w-48 h-48" />
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <router-link to="/portal/appointments" class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:border-teal-200 transition-colors group">
        <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
          <Calendar class="w-5 h-5" />
        </div>
        <span class="text-sm font-bold text-slate-700">Appts</span>
      </router-link>

      <router-link to="/portal/labs" class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:border-teal-200 transition-colors group">
        <div class="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
          <FlaskConical class="w-5 h-5" />
        </div>
        <span class="text-sm font-bold text-slate-700">Labs</span>
      </router-link>

      <router-link to="/portal/prior-auth" class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:border-teal-200 transition-colors group">
        <div class="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
          <ShieldCheck class="w-5 h-5" />
        </div>
        <span class="text-sm font-bold text-slate-700">Auths</span>
      </router-link>

      <router-link to="/portal/messages" class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:border-teal-200 transition-colors group">
        <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
          <MessageSquare class="w-5 h-5" />
        </div>
        <span class="text-sm font-bold text-slate-700">Messages</span>
      </router-link>
    </div>

    <!-- AI Assistant Teaser -->
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div class="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
        <div class="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
          <Bot class="w-4 h-4" />
        </div>
        <div>
          <h3 class="font-bold text-slate-900">HealthBot Assistant</h3>
          <p class="text-xs text-slate-500">Always here to help</p>
        </div>
      </div>
      <div class="p-6 text-center">
        <p class="text-slate-600 mb-4">"Hi {{ patient?.first_name || 'John' }}! I can help you schedule an appointment or refill your prescription. What do you need today?"</p>
        <router-link to="/portal/chat" class="inline-block px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800">
            Start Chat
        </router-link>
      </div>
    </div>

    <!-- Recent Activity -->
    <div v-if="isLoading">
      <div class="h-8 bg-slate-200 rounded w-48 mb-4 animate-pulse"></div>
      <div class="space-y-4">
        <div v-for="i in 2" :key="i" class="h-16 bg-white border border-slate-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
    <div v-else-if="notifications.length">
        <h3 class="font-bold text-slate-900 mb-3 px-1">Notifications</h3>
        <div class="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            <div 
              v-for="note in notifications" 
              :key="note.id" 
              class="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
              @click="store.markAsRead(note.id)"
            >
                <div class="flex items-center gap-3">
                    <div :class="`w-8 h-8 rounded-full flex items-center justify-center ${note.is_read ? 'bg-slate-50 text-slate-400' : 'bg-green-50 text-green-600'}`">
                        <Check class="w-4 h-4" />
                    </div>
                    <div>
                        <p :class="`text-sm font-medium ${note.is_read ? 'text-slate-500' : 'text-slate-900'}`">{{ note.title }}</p>
                        <p class="text-xs text-slate-500">{{ note.summary }}</p>
                    </div>
                </div>
                <div v-if="!note.is_read" class="w-2 h-2 bg-teal-500 rounded-full"></div>
            </div>
        </div>
    </div>

    <!-- Latest Visit Plan -->
    <div v-if="visitItems.length">
        <h3 class="font-bold text-slate-900 mb-3 px-1">Your Visit Plan</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="item in visitItems" 
              :key="item.id" 
              class="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col gap-3 shadow-sm"
            >
                <div class="flex items-center justify-between">
                  <div class="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded">{{ item.item_type }}</div>
                  <div :class="`px-2 py-0.5 text-[10px] font-black uppercase rounded ${getStatusClass(item.status)}`">{{ item.status }}</div>
                </div>
                <h4 class="font-bold text-slate-900">{{ item.title }}</h4>
                <p class="text-sm text-slate-600 leading-relaxed">{{ item.description }}</p>
                <div v-if="item.why_explanation" class="mt-2 p-3 bg-teal-50/50 rounded-xl border border-teal-100/50">
                  <p class="text-[10px] font-black text-teal-600 uppercase mb-1 flex items-center gap-1"><Zap class="w-3 h-3" /> Why this matters</p>
                  <p class="text-xs text-teal-700 italic">"{{ item.why_explanation }}"</p>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { 
  Calendar, FlaskConical, ShieldCheck, MessageSquare, 
  Bot, Check, Heart, Zap 
} from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { usePortalStore } from '@/stores/portalStore';

const store = usePortalStore();
const { patient, notifications, visitItems, isLoading } = storeToRefs(store);

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
});

const getStatusClass = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'ready' || s === 'approved' || s === 'completed') return 'bg-emerald-100 text-emerald-600';
  if (s === 'pending' || s === 'processing') return 'bg-amber-100 text-amber-600';
  if (s === 'denied') return 'bg-red-100 text-red-600';
  return 'bg-slate-100 text-slate-600';
};

onMounted(() => {
  store.loadDashboard();
});
</script>
