<template>
  <div
    :class="[
      'bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group',
      status === 'active' && !compact ? 'border-l-4 border-l-[#1B4F72]' : ''
    ]"
  >
    <div class="p-5">
      <div class="flex justify-between items-start mb-4">
        <div
          :class="[
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
            status === 'active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
          ]"
        >
          <span
            :class="[
              'w-1.5 h-1.5 rounded-full',
              status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'
            ]"
          />
          {{ status === 'active' ? 'Active' : 'Paused' }}
        </div>
        <button class="text-slate-400 hover:text-[#1B4F72]">
          <MoreVertical :size="16" />
        </button>
      </div>

      <div class="flex flex-col items-center text-center mb-4">
        <div class="w-16 h-16 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-xl font-bold text-[#1B4F72] mb-3 overflow-hidden">
          <img v-if="avatar" :src="avatar" :alt="name" class="w-full h-full object-cover" />
          <span v-else>{{ name.charAt(0) }}</span>
        </div>
        <h3 class="text-lg font-bold text-slate-900">{{ name }}</h3>
        <div class="text-sm text-slate-500 flex items-center gap-1.5">
          {{ role }}
          <span v-if="price" class="text-slate-300">•</span>
          <span v-if="price">{{ price }}</span>
        </div>
        <div v-if="phone" class="mt-2 text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
          {{ phone }}
        </div>
      </div>

      <div v-if="!compact && stats" class="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 mt-2">
        <div class="text-center">
          <div class="text-xs text-slate-400 mb-1">Calls</div>
          <div class="font-semibold text-slate-700">{{ stats.calls }}</div>
        </div>
        <div class="text-center border-l border-slate-100">
          <div class="text-xs text-slate-400 mb-1">Appts</div>
          <div class="font-semibold text-slate-700">
            {{ stats.appointments }}
          </div>
        </div>
        <div class="text-center border-l border-slate-100">
          <div class="text-xs text-slate-400 mb-1">Success</div>
          <div class="font-semibold text-green-600">
            {{ stats.successRate }}
          </div>
        </div>
      </div>

      <div v-if="compact" class="text-sm text-slate-500 text-center border-t border-slate-100 pt-3 mt-1">
        <span class="font-medium text-slate-900">{{ compactStats }}</span> today
      </div>

      <div v-if="!compact" class="flex gap-3 mt-5">
        <router-link
          :to="`/coordinators/${id}`"
          class="flex-1 py-2 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#1B4F72] transition-colors text-center"
        >
          View Details
        </router-link>
        <button class="flex-1 py-2 px-3 rounded-lg border border-transparent bg-blue-50 text-sm font-medium text-[#1B4F72] hover:bg-blue-100 transition-colors">
          Test Call
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MoreVertical } from 'lucide-vue-next';

interface Props {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'paused';
  avatar?: string;
  stats?: {
    calls?: number;
    appointments?: number;
    successRate?: string;
  };
  phone?: string;
  price?: string;
  compact?: boolean;
  compactStats?: string;
}

defineProps<Props>();
</script>

