<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>

      <!-- Modal -->
      <div class="relative bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emerald-500/20 rounded-lg">
              <CheckCircle2 class="w-5 h-5 text-emerald-400" />
            </div>
            <h2 class="text-lg font-semibold text-white">Approve & Route</h2>
          </div>
          <button @click="$emit('close')" class="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X class="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-4">
          <p class="text-slate-300 text-sm">
            Select which items to route when approving this visit:
          </p>

          <!-- Options -->
          <div class="space-y-3">
            <label class="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors">
              <input v-model="options.sign_note" type="checkbox" class="sr-only peer" />
              <div class="w-5 h-5 rounded-md border-2 border-slate-500 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center">
                <Check v-if="options.sign_note" class="w-3 h-3 text-white" />
              </div>
              <FileText class="w-4 h-4 text-slate-400" />
              <span class="text-white text-sm">Sign clinical note</span>
            </label>

            <label class="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors">
              <input v-model="options.send_prescriptions" type="checkbox" class="sr-only peer" />
              <div class="w-5 h-5 rounded-md border-2 border-slate-500 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center">
                <Check v-if="options.send_prescriptions" class="w-3 h-3 text-white" />
              </div>
              <Pill class="w-4 h-4 text-blue-400" />
              <span class="text-white text-sm">Send prescriptions to pharmacy</span>
            </label>

            <label class="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors">
              <input v-model="options.send_orders" type="checkbox" class="sr-only peer" />
              <div class="w-5 h-5 rounded-md border-2 border-slate-500 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center">
                <Check v-if="options.send_orders" class="w-3 h-3 text-white" />
              </div>
              <FlaskConical class="w-4 h-4 text-purple-400" />
              <span class="text-white text-sm">Send lab/imaging orders</span>
            </label>

            <label class="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors">
              <input v-model="options.queue_prior_auths" type="checkbox" class="sr-only peer" />
              <div class="w-5 h-5 rounded-md border-2 border-slate-500 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center">
                <Check v-if="options.queue_prior_auths" class="w-3 h-3 text-white" />
              </div>
              <Shield class="w-4 h-4 text-amber-400" />
              <span class="text-white text-sm">Queue prior authorizations</span>
            </label>

            <label class="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors">
              <input v-model="options.send_instructions" type="checkbox" class="sr-only peer" />
              <div class="w-5 h-5 rounded-md border-2 border-slate-500 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center">
                <Check v-if="options.send_instructions" class="w-3 h-3 text-white" />
              </div>
              <Bell class="w-4 h-4 text-cyan-400" />
              <span class="text-white text-sm">Send patient instructions</span>
            </label>

            <label class="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors border border-dashed border-slate-600">
              <input v-model="options.submit_claim" type="checkbox" class="sr-only peer" />
              <div class="w-5 h-5 rounded-md border-2 border-slate-500 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center">
                <Check v-if="options.submit_claim" class="w-3 h-3 text-white" />
              </div>
              <FileBarChart class="w-4 h-4 text-emerald-400" />
              <span class="text-white text-sm">Submit claim to clearinghouse</span>
            </label>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex gap-3 px-6 py-4 bg-slate-800/50 border-t border-slate-700">
          <button
            @click="$emit('close')"
            class="flex-1 py-3 px-4 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleApprove"
            class="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 class="w-5 h-5" />
            Approve
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { 
  CheckCircle2, 
  X, 
  Check, 
  FileText, 
  Pill, 
  FlaskConical, 
  Shield, 
  Bell, 
  FileBarChart 
} from 'lucide-vue-next';

const emit = defineEmits<{
  'close': [];
  'approve': [options: typeof options];
}>();

const options = reactive({
  sign_note: true,
  send_prescriptions: true,
  send_orders: true,
  queue_prior_auths: true,
  submit_claim: false,
  schedule_follow_ups: true,
  send_instructions: true,
});

function handleApprove() {
  emit('approve', { ...options });
}
</script>
