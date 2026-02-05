<template>
  <div class="space-y-6">
    <!-- List View -->
    <div v-if="!activeForm" class="space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-slate-900">Patient Forms</h1>
            <div v-if="isKioskMode" class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <AlertCircle class="w-3 h-3" /> Kiosk Mode Active
            </div>
        </div>

        <!-- Major Intake Callout -->
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
            <div class="relative z-10 max-w-lg">
                <div class="flex items-center gap-2 mb-4">
                  <div class="px-2 py-0.5 bg-teal-500 text-[10px] font-black uppercase tracking-widest rounded text-white">Universal Health ID</div>
                </div>
                <h2 class="text-3xl font-bold mb-2">Complete Your Intake</h2>
                <p class="text-slate-400 mb-6">Create your universal health profile to share your history across our network of specialists (Dental, Cardiology, ENT & more).</p>
                <button 
                  @click="showIntake = true; activeForm = { title: 'Universal Intake' }"
                  class="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg"
                >
                  Start Universal Intake
                </button>
            </div>
            <div class="absolute right-0 bottom-0 opacity-10 -mr-12 -mb-12">
              <ShieldCheck class="w-64 h-64" />
            </div>
        </div>

        <!-- Regular Forms List -->
        <div class="grid gap-4">
            <div v-for="form in pendingForms" :key="form.id" class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-teal-200 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-500 transition-colors">
                    <FileText class="w-6 h-6" />
                  </div>
                  <div>
                      <h3 class="font-bold text-lg text-slate-900">{{ form.title }}</h3>
                      <p class="text-slate-500 text-sm">Required for your appointment on {{ form.dueDate }}</p>
                  </div>
                </div>
                <button 
                    @click="openForm(form)"
                    class="px-6 py-2 bg-slate-100 text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-colors"
                >
                    Review
                </button>
            </div>
             <div v-if="pendingForms.length === 0" class="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p class="text-slate-500">You're all caught up! No pending forms.</p>
            </div>
        </div>
    </div>

    <!-- Intake Wizard View -->
    <div v-else-if="showIntake">
        <button @click="showIntake = false; activeForm = null" class="mb-4 text-slate-500 text-sm hover:text-slate-900 flex items-center gap-1">
            ← Back to forms
        </button>
        <UniversalIntake @done="handleIntakeDone" />
    </div>

    <!-- Regular Form Filler View -->
    <div v-else>
        <button @click="activeForm = null" class="mb-4 text-slate-500 text-sm hover:text-slate-900 flex items-center gap-1">
            ← Back to list
        </button>
        <FormFiller 
            :title="activeForm.title"
            :description="activeForm.description"
            :fields="activeForm.schema"
            @submit="handleFormSubmit"
            @cancel="activeForm = null"
        />
    </div>

    <!-- Kiosk Success Modal -->
    <div v-if="showConfidentialityAlert" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl">
            <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle class="w-10 h-10" />
            </div>
            <div class="space-y-2">
              <h3 class="text-2xl font-bold text-slate-900">Secure Submission Complete</h3>
              <p class="text-slate-600">Your information has been encrypted and sent to your care team.</p>
            </div>
            <div class="p-4 bg-slate-50 rounded-xl">
              <p class="text-xs text-slate-500 flex items-center justify-center gap-2">
                <Timer class="w-4 h-4" /> Kiosk resetting in {{ logoutCountdown }} seconds
              </p>
            </div>
            <button @click="logoutNow" class="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg">
                 Finish Session
            </button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FormFiller from '@/components/portal/FormFiller.vue';
import UniversalIntake from '@/components/portal/UniversalIntake.vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { 
  FileText, ShieldCheck, CheckCircle, 
  AlertCircle, Timer 
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// View State
const showIntake = ref(false);
const activeForm = ref<any>(null);

// Kiosk Mode Logic
const isKioskMode = ref(false);
const showConfidentialityAlert = ref(false);
const logoutCountdown = ref(5);

// Mock Data (Secondary Forms)
const pendingForms = ref([
    {
        id: 1,
        title: 'HIPAA Release Form',
        description: 'Authorization for disclosure of health information.',
        dueDate: 'Oct 24',
        schema: [
            { id: 'full_name', type: 'text', label: 'Full Legal Name', required: true },
            { id: 'dob', type: 'date', label: 'Date of Birth', required: true },
            { id: 'confirm', type: 'checkbox', label: 'I acknowledge', placeholder: 'I authorize the release of my medical records', required: true },
            { id: 'signature', type: 'signature', label: 'Patient Signature', required: true }
        ]
    }
]);

const completedForms = ref<any[]>([]);

const openForm = (form: any) => {
    activeForm.value = form;
};

const handleIntakeDone = () => {
    showIntake.value = false;
    activeForm.value = null;
    // Potentially refresh dashboard sharing code here
};

const handleFormSubmit = async (data: any) => {
    console.log('Submitted Data:', data);
    
    const idx = pendingForms.value.findIndex(f => f.id === activeForm.value.id);
    if (idx !== -1) {
        completedForms.value.push(pendingForms.value[idx]);
        pendingForms.value.splice(idx, 1);
    }
    
    activeForm.value = null;

    if (isKioskMode.value) {
        startSecureLogout();
    }
};

const startSecureLogout = () => {
    showConfidentialityAlert.value = true;
    const interval = setInterval(() => {
        logoutCountdown.value--;
        if (logoutCountdown.value <= 0) {
            clearInterval(interval);
            logoutNow();
        }
    }, 1000);
};

const logoutNow = () => {
    authStore.logout();
    router.push('/portal/login');
};

onMounted(() => {
    if (route.query.kiosk === 'true') {
        isKioskMode.value = true;
    }
});
</script>
