<template>
  <div class="min-h-screen bg-slate-50 font-sans p-6">
    <header class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">ScribeMD</h1>
        <p class="text-slate-500">Ambient AI Documentation</p>
      </div>
      <router-link to="/dashboard" class="text-sm font-medium text-blue-600 hover:underline">Back to Dashboard</router-link>
    </header>

    <div class="max-w-3xl mx-auto">
      <!-- No Patient Selected -->
      <div v-if="!patientId" class="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-6">
          <UserSearch class="w-8 h-8" />
        </div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Select a Patient</h2>
        <p class="text-slate-500 mb-8">A documentation session must be linked to a patient chart. Choose a patient to begin.</p>
        <router-link to="/patients" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          Go to Patients
        </router-link>
      </div>

      <!-- Recording Interface -->
      <div v-else-if="!generatedNote" class="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center transition-all duration-500" :class="{'border-red-400 ring-4 ring-red-50': isRecording}">
        
        <div class="relative inline-block mb-8">
            <div v-if="isRecording" class="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
            <button 
                @click="toggleRecording"
                class="relative h-32 w-32 rounded-full flex items-center justify-center transition-all duration-300"
                :class="[isRecording ? 'bg-red-500 text-white' : 'bg-blue-600 text-white hover:scale-105 hover:shadow-xl']"
            >
                <Mic v-if="!isRecording" class="w-12 h-12" />
                <Square v-else class="w-10 h-10" />
            </button>
        </div>

        <h2 class="text-2xl font-bold text-slate-900 mb-2">
            {{ isRecording ? 'Listening...' : 'Tap for Ambient Note' }}
        </h2>
        <p class="text-slate-500">
            {{ isRecording ? 'Focus on your patient. I\'m taking notes.' : 'Ready to start documentation session.' }}
        </p>
        
        <div v-if="isRecording" class="mt-8 flex justify-center gap-1">
            <div class="w-1 h-4 bg-red-400 rounded-full animate-pulse"></div>
            <div class="w-1 h-6 bg-red-400 rounded-full animate-pulse delay-75"></div>
            <div class="w-1 h-3 bg-red-400 rounded-full animate-pulse delay-150"></div>
            <div class="w-1 h-5 bg-red-400 rounded-full animate-pulse delay-100"></div>
            <div class="w-1 h-4 bg-red-400 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>

      <!-- Generated Note Interface -->
      <div v-else class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-slide-in">
        <div class="bg-teal-50 border-b border-teal-100 p-4 flex justify-between items-center">
            <div class="flex items-center gap-2 text-teal-700 font-bold">
                <Sparkles class="w-5 h-5" />
                <span>Note Generated Successfully</span>
            </div>
            <button @click="resetSession" class="text-xs font-bold text-teal-600 hover:text-teal-800 uppercase tracking-wide">New Session</button>
        </div>
        
        <div class="p-8 prose prose-slate max-w-none">
            <!-- Simulated Markdown Content -->
            <div v-html="formattedNote"></div>
        </div>
        
        <div class="bg-slate-50 border-t border-slate-100 p-4 flex justify-end gap-3">
            <button class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Edit</button>
            <button class="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 shadow-sm">Sign & Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Mic, Square, Sparkles, UserSearch } from 'lucide-vue-next';
import { scribeService } from '@/services/scribe';
import type { ScribeSession } from '@/services/scribe';
// Simple markdown parser or just newline replacement for now
const parseMarkdown = (text: string) => {
    return text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

const route = useRoute();
const patientId = computed(() => (typeof route.query.patient === 'string' ? route.query.patient : ''));

const isRecording = ref(false);
const generatedNote = ref<string | null>(null);
const currentSession = ref<ScribeSession | null>(null);

const formattedNote = computed(() => {
    return generatedNote.value ? parseMarkdown(generatedNote.value) : '';
});

async function toggleRecording() {
    if (!isRecording.value) {
        // Start Recording
        if (!patientId.value) return;
        try {
            isRecording.value = true;
            const session = await scribeService.startRecording(patientId.value);
            currentSession.value = session;
        } catch (e) {
            // recording start failed — isRecording reset below
            isRecording.value = false;
        }
    } else {
        // Stop & Generate
        isRecording.value = false;
        if (currentSession.value) {
            try {
                // Determine duration or just stop
                // Call generate API
                const result = await scribeService.generateNote(currentSession.value.note_id);
                generatedNote.value = result.generated_note || "Failed to generate note content.";
            } catch (e) {
                // generation failed — generatedNote stays empty
            }
        }
    }
}

function resetSession() {
    generatedNote.value = null;
    currentSession.value = null;
    isRecording.value = false;
}
</script>

<style>
@keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-slide-in {
    animation: slideIn 0.5s ease-out forwards;
}
</style>
