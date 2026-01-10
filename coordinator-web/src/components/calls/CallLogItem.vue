<template>
  <div
    :class="[
      'flex items-center gap-4 p-4 border-b border-slate-100 transition-all cursor-pointer',
      selected ? 'bg-blue-50 border-l-4 border-l-[#1B4F72]' : 'hover:bg-slate-50'
    ]"
    @click="$emit('click')"
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
      <Avatar size="sm" shape="circle">
        <AvatarImage v-if="coordinator.avatar" :src="coordinator.avatar" :alt="coordinator.name" />
        <AvatarFallback class="text-[10px] font-bold text-[#1B4F72] bg-blue-100">
          {{ coordinator.name.charAt(0) }}
        </AvatarFallback>
      </Avatar>
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
      <Badge
        :variant="outcomeConfig[outcome].variant"
        :class="outcomeConfig[outcome].color"
      >
        {{ outcomeConfig[outcome].label }}
      </Badge>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1 flex-shrink-0" @click.stop>
      <Button
        v-if="hasRecording"
        variant="ghost"
        size="icon-sm"
        @click="$emit('play')"
        title="Play Recording"
      >
        <Play :size="16" />
      </Button>
      <Button
        v-if="hasTranscript"
        variant="ghost"
        size="icon-sm"
        @click="$emit('viewTranscript')"
        title="View Transcript"
      >
        <FileText :size="16" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon-sm" title="More Options">
            <MoreVertical :size="16" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Download Recording</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <!-- Timestamp (mobile only) -->
    <div class="sm:hidden absolute top-2 right-2 text-xs text-slate-400">
      {{ timestamp }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback, Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@taskjuggler/ui';
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
}

withDefaults(defineProps<Props>(), {
  hasRecording: false,
  hasTranscript: false,
  selected: false,
});

defineEmits<{
  play: [];
  viewTranscript: [];
  click: [];
}>();

const outcomeConfig = {
  booked: {
    label: 'Appointment Booked',
    color: 'bg-green-50 text-green-700 border-green-200',
    variant: 'default' as const,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-green-50 text-green-700 border-green-200',
    variant: 'default' as const,
  },
  information: {
    label: 'Information',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    variant: 'default' as const,
  },
  transferred: {
    label: 'Transferred',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    variant: 'default' as const,
  },
  voicemail: {
    label: 'Voicemail',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    variant: 'secondary' as const,
  },
  'no-answer': {
    label: 'No Answer',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    variant: 'secondary' as const,
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-50 text-red-700 border-red-200',
    variant: 'destructive' as const,
  },
};
</script>



