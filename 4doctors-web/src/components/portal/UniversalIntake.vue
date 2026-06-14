<template>
  <div class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-4xl mx-auto">
    <!-- Progress Stepper -->
    <div class="bg-slate-50 border-b border-slate-200 px-8 py-4 flex justify-between items-center">
      <div v-for="(step, index) in steps" :key="index" class="flex items-center gap-3">
        <div :class="`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${currentStep >= index ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500'}`">
          {{ index + 1 }}
        </div>
        <span :class="`hidden md:block text-xs font-bold uppercase tracking-wider ${currentStep >= index ? 'text-teal-600' : 'text-slate-400'}`">{{ step.name }}</span>
        <div v-if="index < steps.length - 1" class="hidden md:block w-12 h-px bg-slate-200 mx-2"></div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="p-8 min-h-[400px]">
      <!-- Step 1: Identity -->
      <div v-if="currentStep === 0" class="space-y-6">
        <div class="border-b border-slate-100 pb-4">
          <h2 class="text-2xl font-bold text-slate-900">Personal Information</h2>
          <p class="text-slate-500">This data forms your Universal Health Record.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-700">First Name</label>
            <input v-model="form.personal.first_name" type="text" class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="John" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-700">Last Name</label>
            <input v-model="form.personal.last_name" type="text" class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Doe" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-700">Date of Birth</label>
            <input v-model="form.personal.date_of_birth" type="date" class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-700">Phone Number</label>
            <input v-model="form.personal.phone" type="tel" class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="(555) 000-0000" />
          </div>
        </div>
      </div>

      <!-- Step 2: Insurance -->
      <div v-if="currentStep === 1" class="space-y-6">
        <div class="border-b border-slate-100 pb-4">
          <h2 class="text-2xl font-bold text-slate-900">Insurance & Coverage</h2>
          <p class="text-slate-500">We'll use this to verify coverage across all providers.</p>
        </div>
        <div class="grid grid-cols-1 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-700">Primary Carrier</label>
            <select v-model="form.insurance.provider" class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none">
              <option value="">Select Carrier</option>
              <option>Aetna</option>
              <option>Blue Cross Blue Shield</option>
              <option>Cigna</option>
              <option>UnitedHealthcare</option>
              <option>Kaiser Permanente</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-700">Member ID / Policy Number</label>
            <input v-model="form.insurance.policy" type="text" class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="ABC123456789" />
          </div>
        </div>
        <div class="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4 mt-6">
          <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
             <Shield class="w-5 h-5" />
          </div>
          <div>
            <h4 class="font-bold text-blue-900">AI Verification</h4>
            <p class="text-sm text-blue-700">Our Smart Assistant will automatically verify this info with your insurance portal.</p>
          </div>
        </div>
      </div>

      <!-- Step 3: Consent Matrix -->
      <div v-if="currentStep === 2" class="space-y-6">
        <div class="border-b border-slate-100 pb-4">
          <h2 class="text-2xl font-bold text-slate-900">Who can see your records?</h2>
          <p class="text-slate-500">Grant access to healthcare experts across the 4healthcare network.</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="spec in specialties" :key="spec.id" 
               @click="toggleSpec(spec.id)"
               :class="`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${form.consents[spec.id] ? 'border-teal-500 bg-teal-50' : 'border-slate-100 bg-white hover:border-slate-200'}`">
            <div class="flex items-center gap-3">
              <div :class="`w-10 h-10 rounded-xl flex items-center justify-center ${form.consents[spec.id] ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'}`">
                <component :is="spec.icon" class="w-5 h-5" />
              </div>
              <div>
                <span class="font-bold text-slate-900 block leading-tight">{{ spec.label }}</span>
                <span class="text-[10px] text-slate-500 uppercase tracking-widest font-black">Limited Access</span>
              </div>
            </div>
            <div :class="`w-6 h-6 rounded-full border-2 flex items-center justify-center ${form.consents[spec.id] ? 'border-teal-500 bg-teal-500 text-white' : 'border-slate-200'}`">
               <Check v-if="form.consents[spec.id]" class="w-3 h-3" />
            </div>
          </div>
        </div>

        <div class="mt-8 p-6 bg-slate-900 rounded-2xl text-white">
           <div class="flex items-center gap-3 mb-4">
             <div class="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
               <Lock class="w-4 h-4" />
             </div>
             <h3 class="font-bold underline decoration-teal-500 decoration-2">Universal HIPAA Authorization</h3>
           </div>
           <p class="text-xs text-slate-400 leading-relaxed">
             By selecting these providers, I authorize the exchange of my universal medical record (including labs, notes, and medication history) between the selected specialties. This consent is valid for 12 months and can be revoked at any time via my portal.
           </p>
        </div>
      </div>

      <!-- Step 4: Summary/Success -->
      <div v-if="currentStep === 3" class="text-center py-12 space-y-6">
        <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle class="w-10 h-10" />
        </div>
        <h2 class="text-3xl font-bold text-slate-900">Intake Complete!</h2>
        <p class="text-slate-600 max-w-md mx-auto">Your Universal Health Record is now active. Use your unique Health ID below at any participating clinic.</p>
        
        <div class="bg-slate-50 border-2 border-dashed border-slate-300 p-6 rounded-2xl inline-block">
          <span class="text-xs text-slate-500 uppercase font-black block mb-2">Your Universal Health ID</span>
          <span class="text-2xl font-mono font-bold text-slate-900 tracking-tighter">{{ sharingCode || 'HEL-XXXX-XXXX' }}</span>
        </div>

        <div class="flex justify-center gap-4 mt-8">
           <button @click="$emit('done')" class="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
             Go to Dashboard
           </button>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="currentStep < steps.length - 1" class="bg-slate-50 border-t border-slate-200 p-6 flex justify-between items-center">
      <button @click="prevStep" :disabled="currentStep === 0" class="px-6 py-2 text-slate-500 font-bold disabled:opacity-30">
        Back
      </button>
      <button @click="nextStep" class="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all flex items-center gap-2">
        {{ currentStep === steps.length - 2 ? 'Finalize & Submit' : 'Next Step' }}
        <ChevronRight v-if="currentStep < steps.length - 2" class="w-4 h-4" />
        <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  ChevronRight, Check, CheckCircle, 
  Shield, Lock, Loader2, 
  Stethoscope, Eye, Heart, 
  Ear, Wind, Smile 
} from 'lucide-vue-next';
import api from '@/utils/api';
import { useToast } from '@/composables/useToast';

const toast = useToast();

const emit = defineEmits(['done', 'submit']);

const steps = [
  { name: 'Identity' },
  { name: 'Insurance' },
  { name: 'Consent' },
  { name: 'Confirm' }
];

const specialties = [
  { id: 'gp', label: 'Primary Care (GP)', icon: Stethoscope },
  { id: 'opt', label: 'Ophthalmology', icon: Eye },
  { id: 'cardio', label: 'Cardiology', icon: Heart },
  { id: 'ent', label: 'Ear, Nose & Throat', icon: Ear },
  { id: 'allergy', label: 'Allergy & Immunology', icon: Wind },
  { id: 'dental', label: 'Dentistry', icon: Smile }
];

const currentStep = ref(0);
const isSubmitting = ref(false);
const sharingCode = ref('');

const form = ref({
  personal: {
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone: ''
  },
  insurance: {
    provider: '',
    policy: ''
  },
  consents: {
    gp: true,
    opt: false,
    cardio: false,
    ent: false,
    allergy: false,
    dental: false
  } as Record<string, boolean>
});

const toggleSpec = (id: string) => {
  form.value.consents[id] = !form.value.consents[id];
};

const nextStep = async () => {
  if (currentStep.value === steps.length - 2) {
    await submitForm();
  } else {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--;
};

const submitForm = async () => {
  isSubmitting.value = true;
  try {
    const response = await api.post('/doctors/portal/intake', {
      personal_info: form.value.personal,
      insurance: form.value.insurance,
      consents: form.value.consents
    });
    sharingCode.value = response.data.sharing_code;
    currentStep.value++;
  } catch (error) {
    toast.error('Failed to submit intake. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
