<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="call"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click="$emit('close')"
      >
        <div
          :class="['bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col', theme === 'dark' ? 'bg-slate-800' : 'bg-white']"
          @click.stop
        >
          <!-- Header -->
          <div :class="['flex items-center justify-between p-6 border-b', theme === 'dark' ? 'border-slate-700' : 'border-gray-200']">
            <div>
              <h2 :class="['text-2xl font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900']">
                Call Details
              </h2>
              <p :class="['text-sm mt-1', theme === 'dark' ? 'text-slate-400' : 'text-gray-600']">
                {{ formatCallTime(call.started_at) }}
              </p>
            </div>
            <button
              @click="$emit('close')"
              :class="['p-2 rounded-lg transition-colors', theme === 'dark' ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900']"
            >
              <X class="h-6 w-6" />
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <!-- Call Info -->
            <div>
              <h3 :class="['text-lg font-bold mb-4', theme === 'dark' ? 'text-white' : 'text-gray-900']">
                Call Information
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p :class="['text-sm font-semibold mb-1', theme === 'dark' ? 'text-slate-400' : 'text-gray-600']">
                    Caller
                  </p>
                  <p :class="['text-base', theme === 'dark' ? 'text-white' : 'text-gray-900']">
                    {{ call.contact?.first_name || call.caller_number || 'Unknown' }}
                  </p>
                </div>
                <div>
                  <p :class="['text-sm font-semibold mb-1', theme === 'dark' ? 'text-slate-400' : 'text-gray-600']">
                    Duration
                  </p>
                  <p :class="['text-base', theme === 'dark' ? 'text-white' : 'text-gray-900']">
                    {{ call.duration_seconds ? formatDuration(call.duration_seconds) : '0:00' }}
                  </p>
                </div>
                <div>
                  <p :class="['text-sm font-semibold mb-1', theme === 'dark' ? 'text-slate-400' : 'text-gray-600']">
                    Direction
                  </p>
                  <p :class="['text-base capitalize', theme === 'dark' ? 'text-white' : 'text-gray-900']">
                    {{ call.direction }}
                  </p>
                </div>
                <div>
                  <p :class="['text-sm font-semibold mb-1', theme === 'dark' ? 'text-slate-400' : 'text-gray-600']">
                    Status
                  </p>
                  <p :class="['text-base capitalize', theme === 'dark' ? 'text-white' : 'text-gray-900']">
                    {{ call.status }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Transcript -->
            <div v-if="call.transcript">
              <h3 :class="['text-lg font-bold mb-4', theme === 'dark' ? 'text-white' : 'text-gray-900']">
                Transcript
              </h3>
              <div :class="['p-4 rounded-lg border', theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-gray-50 border-gray-200']">
                <p :class="['text-sm whitespace-pre-wrap leading-relaxed', theme === 'dark' ? 'text-slate-200' : 'text-gray-800']">
                  {{ call.transcript }}
                </p>
              </div>
            </div>

            <!-- AI Summary -->
            <div v-if="call.ai_summary">
              <h3 :class="['text-lg font-bold mb-4', theme === 'dark' ? 'text-white' : 'text-gray-900']">
                AI Summary
              </h3>
              <div :class="['p-4 rounded-lg border', theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-gray-50 border-gray-200']">
                <p :class="['text-sm leading-relaxed', theme === 'dark' ? 'text-slate-200' : 'text-gray-800']">
                  {{ call.ai_summary }}
                </p>
              </div>
            </div>

            <!-- Actions Taken -->
            <div v-if="call.actions_taken && call.actions_taken.length > 0">
              <h3 :class="['text-lg font-bold mb-4', theme === 'dark' ? 'text-white' : 'text-gray-900']">
                Actions Taken
              </h3>
              <div class="space-y-2">
                <div
                  v-for="(action, idx) in call.actions_taken"
                  :key="idx"
                  :class="['flex items-center gap-2 p-3 rounded-lg', theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-50']"
                >
                  <CheckSquare class="h-4 w-4 text-green-500" />
                  <span :class="['text-sm', theme === 'dark' ? 'text-slate-200' : 'text-gray-800']">
                    {{ action }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Recording -->
            <div v-if="call.recording_url">
              <h3 :class="['text-lg font-bold mb-4', theme === 'dark' ? 'text-white' : 'text-gray-900']">
                Recording
              </h3>
              <audio :src="call.recording_url" controls class="w-full" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X, CheckSquare } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';

import type { PhoneCall } from '@/types/phone';

const props = defineProps<{
  call: PhoneCall;
}>();

defineEmits<{
  close: [];
}>();

const { theme } = useTheme();

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatCallTime(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString();
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

