<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="p-2 bg-indigo-50 rounded-lg text-indigo-600">
        <LinkIcon class="w-5 h-5" />
      </div>
      <h2 class="font-semibold text-slate-900">Connect Universal Record</h2>
    </div>
    
    <p class="text-sm text-slate-500 mb-6">Enter a patient's Universal Health ID to request access to their clinical history across our network.</p>
    
    <div v-if="!searchResult" class="flex gap-2">
      <input 
        v-model="sharingCode" 
        type="text" 
        placeholder="HEL-XXXX-XXXX" 
        class="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-mono uppercase"
        @keyup.enter="handleLookup"
      />
      <button 
        @click="handleLookup"
        :disabled="loading || !sharingCode"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
      >
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
        <Search v-else class="w-4 h-4" />
        Fetch
      </button>
    </div>

    <!-- Search Result -->
    <div v-else class="space-y-4">
      <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-500 uppercase font-black">Patient Found</p>
            <h3 class="font-bold text-slate-900 text-lg">{{ searchResult.first_name }} {{ searchResult.last_name }}</h3>
            <p class="text-sm text-slate-600">DOB: {{ searchResult.dob }}</p>
          </div>
          <button @click="searchResult = null; sharingCode = ''" class="text-slate-400 hover:text-slate-600">
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div v-if="!hasAccess" class="p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <div class="flex gap-3">
          <AlertCircle class="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p class="text-sm font-bold text-amber-900">Access Restricted</p>
            <p class="text-xs text-amber-700 mb-3">You do not have active consent to view this record. Request specialty access now.</p>
            <button 
              @click="handleRequestAccess"
              :disabled="requesting"
              class="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors flex items-center gap-2"
            >
              <Loader2 v-if="requesting" class="w-3 h-3 animate-spin" />
              Request Clinical Access
            </button>
          </div>
        </div>
      </div>

      <div v-else class="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center justify-between font-bold text-green-700">
        <div class="flex items-center gap-2">
           <CheckCircle class="w-5 h-5" />
           <span>Consent Verified</span>
        </div>
        <button @click="viewChart" class="px-4 py-2 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700">
          Open Chart
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, Link as LinkIcon, Loader2, X, AlertCircle, CheckCircle } from 'lucide-vue-next';
import api from '@/utils/api';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const toast = useToast();
const sharingCode = ref('');
const loading = ref(false);
const requesting = ref(false);
const searchResult = ref<any>(null);
const hasAccess = ref(false);

const handleLookup = async () => {
    if (!sharingCode.value) return;
    loading.value = true;
    try {
        const response = await api.post('/doctors/patients/lookup', {
            sharing_code: sharingCode.value.toUpperCase()
        });
        searchResult.value = response.data.patient;
        
        // Check if we already have access
        try {
            await api.get(`/doctors/portal/consents?patient_id=${searchResult.value.id}`);
            hasAccess.value = true;
        } catch (e) {
            hasAccess.value = false;
        }
    } catch (e) {
        toast.error('Patient not found or invalid Health ID.');
    } finally {
        loading.value = false;
    }
};

const handleRequestAccess = async () => {
    requesting.value = true;
    // Simulate requesting access
    // In production, this would create a 'consent_request' record
    setTimeout(() => {
        toast.success('Access request sent to patient portal.');
        requesting.value = false;
    }, 1500);
};

const viewChart = () => {
    router.push(`/patients/${searchResult.value.id}`);
};
</script>
