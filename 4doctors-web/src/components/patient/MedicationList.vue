<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
    <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold text-slate-900 flex items-center gap-2">
            <Pill class="w-4 h-4 text-slate-400"/> Active Medications
        </h3>
        <button @click="showAdd = true" class="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded">
            + Add
        </button>
    </div>

    <!-- List -->
    <ul class="space-y-3">
        <li v-for="med in medications" :key="med.id" class="group flex justify-between items-start text-sm border-l-2 border-emerald-400 pl-3">
            <div>
                <div class="font-medium text-slate-900">{{ med.drug_name }} {{ med.dosage }}</div>
                <div class="text-slate-500 text-xs">{{ med.frequency }}</div>
            </div>
            <button @click="remove(med.id)" class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity">
                <Trash2 class="w-4 h-4" />
            </button>
        </li>
         <li v-if="medications.length === 0" class="text-xs text-slate-400 italic">No active medications</li>
    </ul>

    <!-- Add Modal (Inline for now) -->
    <div v-if="showAdd" class="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
        <label class="block text-xs font-medium text-slate-700 mb-1">Drug Name</label>
        <input v-model="newMed.drug_name" type="text" class="w-full text-sm p-2 border border-slate-300 rounded mb-2" placeholder="e.g. Lisinopril">
        
        <div class="flex gap-2 mb-2">
            <div class="flex-1">
                <label class="block text-xs font-medium text-slate-700 mb-1">Dosage</label>
                <input v-model="newMed.dosage" type="text" class="w-full text-sm p-2 border border-slate-300 rounded" placeholder="10mg">
            </div>
             <div class="flex-1">
                <label class="block text-xs font-medium text-slate-700 mb-1">Freq</label>
                <input v-model="newMed.frequency" type="text" class="w-full text-sm p-2 border border-slate-300 rounded" placeholder="Daily">
            </div>
        </div>
        
        <div class="flex justify-end gap-2">
            <button @click="showAdd = false" class="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
            <button @click="add" class="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">Save</button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Pill, Trash2 } from 'lucide-vue-next';
import { patientsService } from '@/services/patients';

const props = defineProps<{
    patientId: string;
    initialMedications: any[];
}>();

const medications = ref([...props.initialMedications]);
const showAdd = ref(false);
const newMed = ref({ drug_name: '', dosage: '', frequency: '' });

const add = async () => {
    try {
        const added = await patientsService.addMedication(props.patientId, { ...newMed.value, status: 'active' });
        medications.value.push(added);
        newMed.value = { drug_name: '', dosage: '', frequency: '' };
        showAdd.value = false;
    } catch (e) {
        console.error(e);
    }
};

const remove = async (id: string) => {
    try {
        await patientsService.removeMedication(props.patientId, id);
        medications.value = medications.value.filter(m => m.id !== id);
    } catch (e) {
        console.error(e);
    }
};
</script>

<style>
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
</style>
