<template>
  <Sheet :open="isOpen" @update:open="handleOpenChange">
    <SheetContent side="right" class="w-full sm:w-[500px] overflow-y-auto">
      <!-- Header -->
      <SheetHeader class="sticky top-0 bg-white border-b border-slate-100 p-6 -mx-6 -mt-6 mb-6 z-10">
        <div class="flex justify-between items-start">
          <div>
            <SheetTitle class="text-xl font-bold text-slate-900">Call Details</SheetTitle>
            <div class="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <Calendar :size="14" />
              <span>{{ formatDate(call?.started_at) }} at {{ formatTime(call?.started_at) }}</span>
              <span>•</span>
              <Clock :size="14" />
              <span>{{ formatDuration(call?.duration_seconds || 0) }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <Button
              v-if="call?.recording_url"
              variant="ghost"
              size="icon"
              @click="downloadRecording"
              class="text-slate-400 hover:text-slate-600"
            >
              <Download :size="20" />
            </Button>
          </div>
        </div>
      </SheetHeader>

      <div v-if="call" class="space-y-8">
        <!-- Participants -->
        <Card class="bg-slate-50">
          <CardContent class="p-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <User :size="20" />
              </div>
              <div>
                <div class="font-bold text-slate-900">{{ getContactName(call) }}</div>
                <div class="text-xs text-slate-500">{{ call.from_number }}</div>
              </div>
            </div>
            <Separator orientation="vertical" class="h-8" />
            <div class="flex items-center gap-3 text-right">
              <div>
                <div class="font-bold text-slate-900">{{ getCoordinatorName(call) }}</div>
                <div class="text-xs text-slate-500">4 Call</div>
              </div>
              <div class="w-10 h-10 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold">
                {{ getCoordinatorInitial(call) }}
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Outcome Badge -->
        <div class="flex justify-center">
          <Badge :class="getOutcomeClass(call.outcome)">
            {{ call.outcome || 'Completed' }}
          </Badge>
        </div>

        <!-- Audio Player -->
        <Card v-if="call.recording_url">
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle class="text-sm font-bold text-slate-900">Recording</CardTitle>
              <div class="flex gap-2 text-xs font-medium text-slate-500">
                <Button variant="ghost" size="sm" class="h-auto p-0 text-xs hover:text-[#1B4F72]">1x</Button>
                <Button variant="ghost" size="sm" class="h-auto p-0 text-xs hover:text-[#1B4F72]">1.5x</Button>
                <Button variant="ghost" size="sm" class="h-auto p-0 text-xs hover:text-[#1B4F72]">2x</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <!-- Waveform Visualization -->
            <div class="h-12 flex items-center gap-0.5 mb-4 px-2">
              <div
                v-for="i in 40"
                :key="i"
                :class="[
                  'w-1.5 rounded-full transition-all',
                  i < 15 ? 'bg-[#1B4F72]' : 'bg-slate-200'
                ]"
                :style="{ height: `${Math.max(20, Math.random() * 100)}%` }"
              />
            </div>

            <div class="flex items-center gap-4">
              <Button
                @click="togglePlayback"
                size="icon"
                class="w-10 h-10 rounded-full bg-[#1B4F72] hover:bg-[#153e5a]"
              >
                <Play v-if="!isPlaying" :size="18" fill="currentColor" class="ml-0.5" />
                <Pause v-else :size="18" />
              </Button>
              <div class="flex-1">
                <div class="h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div class="h-full bg-[#1B4F72] rounded-full" style="width: 35%"></div>
                </div>
                <div class="flex justify-between text-xs text-slate-500 mt-1">
                  <span>0:45</span>
                  <span>{{ formatDuration(call.duration_seconds) }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Transcript -->
        <Card v-if="call.transcript">
          <CardHeader>
            <CardTitle class="text-sm font-bold text-slate-900">Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3 text-sm text-slate-700">
              <Card
                v-for="(segment, i) in transcriptSegments"
                :key="i"
                :class="segment.speaker === 'coordinator' ? 'bg-blue-50' : 'bg-slate-50'"
              >
                <CardContent class="p-3">
                  <div class="font-semibold text-xs text-slate-500 mb-1">
                    {{ segment.speaker === 'coordinator' ? getCoordinatorName(call) : getContactName(call) }}
                  </div>
                  <div>{{ segment.text }}</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <!-- AI Summary -->
        <Card v-if="call.ai_summary">
          <CardHeader>
            <CardTitle class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb :size="16" class="text-amber-500" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-slate-700">{{ call.ai_summary }}</p>
          </CardContent>
        </Card>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Play,
  Pause,
  Calendar,
  Clock,
  Download,
  User,
  Lightbulb,
} from 'lucide-vue-next';
import type { CallLog } from '@/api/calls';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Separator,
} from '@taskjuggler/ui';

interface Props {
  call: CallLog | null;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const isPlaying = ref(false);

function handleOpenChange(open: boolean) {
  if (!open) {
    emit('close');
  }
}

const transcriptSegments = computed(() => {
  if (!props.call?.transcript) return [];
  // Would parse transcript segments from backend
  return [
    { speaker: 'coordinator', text: 'Hello, thank you for calling...' },
    { speaker: 'customer', text: 'Hi, I need to schedule an appointment...' },
  ];
});

function formatDate(date?: string): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(date?: string): string {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getContactName(call: CallLog): string {
  if ((call as any).contact) {
    const contact = (call as any).contact;
    return `${contact.first_name} ${contact.last_name || ''}`.trim() || 'Unknown';
  }
  return 'Unknown';
}

function getCoordinatorName(call: CallLog): string {
  if ((call as any).coordinator) {
    return (call as any).coordinator.display_name || '4 Call';
  }
  return 'Unknown';
}

function getCoordinatorInitial(call: CallLog): string {
  return getCoordinatorName(call).charAt(0).toUpperCase();
}

function getOutcomeClass(outcome?: string): string {
  if (!outcome) return 'bg-slate-50 text-slate-600 border-slate-200';
  const lower = outcome.toLowerCase();
  if (lower.includes('booked') || lower.includes('confirmed')) {
    return 'bg-green-50 text-green-700 border-green-200';
  }
  if (lower.includes('info')) {
    return 'bg-blue-50 text-blue-700 border-blue-200';
  }
  if (lower.includes('transferred')) {
    return 'bg-amber-50 text-amber-700 border-amber-200';
  }
  return 'bg-slate-50 text-slate-600 border-slate-200';
}

function togglePlayback() {
  isPlaying.value = !isPlaying.value;
}

function downloadRecording() {
  if (props.call?.recording_url) {
    window.open(props.call.recording_url, '_blank');
  }
}
</script>

