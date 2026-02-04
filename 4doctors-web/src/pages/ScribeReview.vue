<template>
  <div class="h-[calc(100vh-120px)] flex flex-col gap-6">
    <!-- breadcrumbs & Actions bar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-sm text-slate-500">
        <router-link to="/scribe" class="hover:text-blue-600 transition-colors">ScribeMD</router-link>
        <ChevronRight class="w-4 h-4" />
        <span class="font-medium text-slate-900">Visit Review - Sarah Johnson</span>
      </div>
      <div class="flex items-center gap-3">
        <button class="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Discard</button>
        <button @click="showSignatureModal = true" class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-all">
          Sign & Finalize
        </button>
      </div>
    </div>

    <!-- Main Review Layout -->
    <div class="flex-grow flex gap-6 overflow-hidden">
      <!-- Left: Transcript & AI Audio (Project 5.1) -->
      <div class="w-1/3 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
        <header class="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <h3 class="text-white font-bold flex items-center gap-2 text-sm">
            <Mic class="w-4 h-4 text-red-500" /> Encounter Transcript
          </h3>
          <span class="text-[10px] text-slate-400 font-mono tracking-widest uppercase bg-slate-700 px-2 py-1 rounded">Locked</span>
        </header>
        <div class="flex-grow p-6 overflow-y-auto space-y-6 custom-scrollbar">
          <div v-for="(msg, idx) in transcript" :key="idx" class="group">
            <div class="flex items-baseline gap-2 mb-1">
              <span :class="['text-[10px] font-bold uppercase tracking-tighter', msg.role === 'Doctor' ? 'text-blue-400' : 'text-purple-400']">
                {{ msg.role }}
              </span>
              <span class="text-[10px] text-slate-600 font-mono">{{ msg.time }}</span>
            </div>
            <p class="text-slate-300 text-xs leading-relaxed group-hover:text-white transition-colors cursor-pointer" @click="highlightNote(msg)">
              {{ msg.text }}
            </p>
          </div>
        </div>
      </div>

      <!-- Right: Generated Note & Coding (Project 5.1 - 5.4) -->
      <div class="flex-grow flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        <!-- SOAP Note Editor (Project 5.1) -->
        <Card title="Clinical SOAP Note">
          <template #header>
            <div class="flex gap-1 bg-slate-100 p-1 rounded-lg">
              <button 
                v-for="section in sections" 
                :key="section"
                @click="activeSection = section"
                :class="['px-3 py-1 text-xs font-bold rounded-md transition-all', activeSection === section ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
              >
                {{ section.charAt(0).toUpperCase() + section.slice(1) }}
              </button>
            </div>
          </template>
          
          <div class="space-y-4">
            <div class="bg-blue-50/30 border border-blue-100 rounded-xl p-4">
              <textarea 
                v-model="noteData[activeSection]" 
                class="w-full h-64 bg-transparent border-none focus:ring-0 text-slate-700 text-sm leading-relaxed resize-none font-sans"
                placeholder="AI is generating content..."
              ></textarea>
            </div>
            <div class="flex items-center justify-between text-[10px] text-slate-400">
              <div class="flex items-center gap-2">
                 <Sparkles class="w-3 h-3" /> AI generated. Edits will be tracked for audit compliance.
              </div>
              <button @click="insertSmartPhrase" class="flex items-center gap-1 hover:text-blue-500 transition-colors">
                  <Wand2 class="w-3 h-3" /> Insert Smart Phrase
              </button>
            </div>
          </div>
        </Card>

        <!-- Billing & Coding (Project 5.2 / Project 7 Integration) -->
        <div class="grid grid-cols-2 gap-6">
          <Card title="ICD-10 Diagnoses">
            <div class="space-y-2">
              <div v-for="code in diagnosisCodes" :key="code.code" class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md hover:border-blue-200">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold font-mono text-slate-900">{{ code.code }}</span>
                    <Badge v-if="code.hcc" variant="purple">HCC</Badge>
                  </div>
                  <p class="text-xs text-slate-500 truncate w-48">{{ code.description }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-emerald-600 font-bold">{{ code.confidence }}%</span>
                  <button class="p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button class="w-full py-2 border border-dashed border-slate-300 rounded-xl text-xs font-medium text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-all">
                + Add Diagnosis
              </button>
            </div>
          </Card>

          <Card title="CPT Procedures">
            <div class="space-y-2">
              <div v-for="cpt in procedureCodes" :key="cpt.code" class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md hover:border-blue-200">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold font-mono text-slate-900">{{ cpt.code }}</span>
                    <span class="text-[10px] text-slate-400">Level {{ cpt.level }}</span>
                  </div>
                  <p class="text-xs text-slate-500 truncate w-48">{{ cpt.description }}</p>
                </div>
                <button class="p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
              <div class="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-xs font-bold text-blue-900">Calculated E/M Level</span>
                  <Badge variant="info">Level 4</Badge>
                </div>
                <p class="text-[10px] text-blue-700 leading-tight">Based on high complexity MDM (2 chronic illnesses stable, high risk of progression).</p>
              </div>
            </div>
          </Card>
        </div>

        <!-- Orders (Project 5.3) -->
        <Card title="Orders & Referrals">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-4">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Prescriptions</h4>
              <div v-for="rx in meds" :key="rx.name" class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h5 class="text-xs font-bold text-slate-900">{{ rx.name }}</h5>
                  <p class="text-[10px] text-slate-500">{{ rx.dose }} • {{ rx.sig }}</p>
                </div>
                <Badge :variant="rx.status === 'Renew' ? 'success' : 'info'">{{ rx.status }}</Badge>
              </div>
            </div>
            <div class="space-y-4">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Labs & Diagnostics</h4>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h5 class="text-xs font-bold text-slate-900">Lipid Panel</h5>
                  <p class="text-[10px] text-slate-500">Quest Diagnostics • Priority: Routine</p>
                </div>
                <Badge variant="warning">New Order</Badge>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <h5 class="text-xs font-bold text-slate-900">Referral: Cardiology</h5>
                  <p class="text-[10px] text-slate-500">Dr. Alan S. • Structural Disease</p>
                </div>
                <Badge variant="warning">New Order</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- Finalization Modal (Project 5.4) -->
    <Modal v-model="showSignatureModal" title="Sign Encounter Note" maxWidth="md">
        <div class="space-y-6">
            <div class="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
                <AlertCircle class="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                    <h4 class="text-sm font-bold text-amber-900">Review Required</h4>
                    <p class="text-xs text-amber-700">By signing, you attest that you have reviewed the AI-generated content and it accurately represents the encounter.</p>
                </div>
            </div>

            <div class="space-y-4">
                <div class="flex items-center gap-2">
                    <input type="checkbox" id="attest1" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500">
                    <label for="attest1" class="text-sm text-slate-700">The SOAP note accurately reflects the encounter.</label>
                </div>
                <div class="flex items-center gap-2">
                    <input type="checkbox" id="attest2" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500">
                    <label for="attest2" class="text-sm text-slate-700">CPT/ICD-10 codes match documentation.</label>
                </div>
            </div>

            <div class="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div class="text-[10px] text-slate-400 uppercase font-bold mb-2">Authenticated Signature</div>
                <p class="font-serif italic text-2xl text-slate-800">John Shine, M.D.</p>
                <div class="w-full h-[1px] bg-slate-300 mt-2 mx-auto max-w-[200px]"></div>
                <p class="text-[10px] text-slate-400 mt-1">E-Signed on {{ new Date().toLocaleString() }}</p>
            </div>
        </div>
        <template #footer>
            <button @click="showSignatureModal = false" class="px-4 py-2 text-slate-600 font-medium">Cancel</button>
            <button @click="finalize" class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg">Submit & Close Task</button>
        </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  ChevronRight, Mic, Sparkles, Trash2, AlertCircle, Wand2
} from 'lucide-vue-next';
import { scribeService } from '@/services/scribe';
import Card from '@/components/ui/Card.vue';
import Badge from '@/components/ui/Badge.vue';
import Modal from '@/components/ui/Modal.vue';

const router = useRouter();
const route = useRoute();
const showSignatureModal = ref(false);
const activeSection = ref('subjective');
const sections = ['subjective', 'objective', 'assessment', 'plan'];
const loading = ref(true);

const transcript = ref<any[]>([]);
const noteData = ref<any>({});
const diagnosisCodes = ref<any[]>([]);
const procedureCodes = ref<any[]>([]);
const meds = ref<any[]>([]);

onMounted(async () => {
    const visitId = route.params.id as string || 'default';
    try {
        const data = await scribeService.getVisitReview(visitId);
        transcript.value = data.transcript || [];
        noteData.value = data.note || {};
        diagnosisCodes.value = data.diagnoses || [];
        procedureCodes.value = data.procedures || [];
        meds.value = data.medications || [];
    } catch (e) {
        console.error('API Error:', e);
        // Fallback for demo if API fails
         transcript.value = [
            { role: 'Doctor', time: '0:01', text: "Good morning, Sarah. How’s that blood pressure medication working out?" },
            { role: 'Patient', time: '0:12', text: "It's okay, but I've been feeling a bit dizzy in the mornings lately." },
        ];
        noteData.value = {
            subjective: "Patient reports morning dizziness since starting Lisinopril 10mg. Denies chest pain or shortness of breath.",
            objective: "BP: 105/65 mmHg. HR: 72 bpm.",
            assessment: "1. Orthostatic hypotension - likely secondary to Lisinopril.",
            plan: "Decrease Lisinopril to 5mg daily. Follow up BP log in 2 weeks. Referred to cardiology for baseline Echo."
        };
    } finally {
        loading.value = false;
    }
});

const finalize = () => {
    // In real app: await scribeService.finalize(id);
    router.push('/docboard');
};

const highlightNote = (msg: any) => {
    console.log('Sync highlighting for:', msg.text);
};

const insertSmartPhrase = () => {
    if (!noteData.value[activeSection.value]) noteData.value[activeSection.value] = "";
    noteData.value[activeSection.value] += "\n[Smart Phrase: Normal Exam - No acute distress]";
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}
</style>
