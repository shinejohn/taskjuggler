<template>
  <div
    :class="[
      'flex items-center gap-4 p-4 border-b border-slate-100 transition-all cursor-pointer',
      selected ? 'bg-blue-50 border-l-4 border-l-[#1B4F72]' : 'hover:bg-slate-50',
      className
    ]"
    @click="handleClick"
  >
    <!-- Direction Icon -->
    <div
      :class="[
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        direction === 'inbound' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
      ]"
    >
      <ArrowDownLeft v-if="direction === 'inbound'" :size="16" />
      <ArrowUpRight v-else :size="16" />
    </div>

    <!-- Contact Info -->
    <div class="flex-1 min-w-0">
      <div class="font-medium text-slate-900 truncate">
        {{ contact.name }}
      </div>
      <div class="text-xs text-slate-500 font-mono">{{ contact.phone }}</div>
    </div>

    <!-- Coordinator -->
    <div class="hidden sm:flex items-center gap-2 flex-shrink-0">
      <div class="w-6 h-6 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center text-[10px] font-bold">
        <img
          v-if="coordinator.avatar"
          :src="coordinator.avatar"
          :alt="coordinator.name"
          class="w-full h-full rounded-full object-cover"
        />
        <span v-else>{{ coordinator.name.charAt(0) }}</span>
      </div>
      <span class="text-sm text-slate-600 hidden md:inline">
        {{ coordinator.name }}
      </span>
    </div>

    <!-- Duration -->
    <div class="flex-shrink-0 text-sm font-mono text-slate-500 hidden sm:block">
      {{ duration }}
    </div>

    <!-- Outcome Badge -->
    <div class="flex-shrink-0">
      <span
        :class="[
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
          outcomeConfig[outcome].color
        ]"
      >
        {{ outcomeConfig[outcome].label }}
      </span>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1 flex-shrink-0" @click.stop>
      <button
        v-if="hasRecording"
        @click="handlePlay"
        class="p-1.5 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-slate-100 transition-colors"
        title="Play Recording"
      >
        <Play :size="16" />
      </button>
      <button
        v-if="hasTranscript"
        @click="handleViewTranscript"
        class="p-1.5 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-slate-100 transition-colors"
        title="View Transcript"
      >
        <FileText :size="16" />
      </button>
      <button
        class="p-1.5 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-slate-100 transition-colors"
        title="More Options"
      >
        <MoreVertical :size="16" />
      </button>
    </div>

    <!-- Timestamp (mobile only) -->
    <div class="sm:hidden absolute top-2 right-2 text-xs text-slate-400">
      {{ timestamp }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDownLeft, ArrowUpRight, Play, FileText, MoreVertical } from 'lucide-vue-next';

interface Props {
  direction: 'inbound' | 'outbound';
  contact: {
    name: string;
    phone: string;
  };
  coordinator: {
    name: string;
    avatar?: string;
  };
  duration: string;
  outcome: 'booked' | 'confirmed' | 'information' | 'transferred' | 'voicemail' | 'no-answer' | 'failed';
  timestamp: string;
  hasRecording?: boolean;
  hasTranscript?: boolean;
  selected?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  hasRecording: false,
  hasTranscript: false,
  selected: false,
});

const emit = defineEmits<{
  (e: 'play'): void;
  (e: 'viewTranscript'): void;
  (e: 'click'): void;
}>();

const outcomeConfig = {
  booked: {
    label: 'Appointment Booked',
    color: 'bg-green-50 text-green-700 border-green-200',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-green-50 text-green-700 border-green-200',
  },
  information: {
    label: 'Information',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  transferred: {
    label: 'Transferred',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  voicemail: {
    label: 'Voicemail',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  'no-answer': {
    label: 'No Answer',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-50 text-red-700 border-red-200',
  },
};

const handleClick = () => {
  emit('click');
};

const handlePlay = () => {
  emit('play');
};

const handleViewTranscript = () => {
  emit('viewTranscript');
};
</script>



