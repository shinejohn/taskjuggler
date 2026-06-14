<template>
  <div class="bg-slate-800/80 rounded-2xl border border-emerald-500/30 p-5 space-y-4 animate-in slide-in-from-top-4 duration-300">
    <div class="flex items-center gap-2 mb-2">
      <div class="p-1.5 bg-emerald-500/10 rounded-md">
        <Pill class="w-4 h-4 text-emerald-400" />
      </div>
      <h4 class="text-xs font-black text-white uppercase tracking-widest">Add Prescription</h4>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="col-span-2">
        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Drug Name</label>
        <input
          v-model="form.drug_name"
          placeholder="e.g. Atorvastatin"
          class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>

      <div>
        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Strength</label>
        <input
          v-model="form.strength"
          placeholder="e.g. 20mg"
          class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>

      <div>
        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Form</label>
        <select
          v-model="form.form"
          class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
        >
          <option value="tablet">Tablet</option>
          <option value="capsule">Capsule</option>
          <option value="injection">Injection</option>
          <option value="cream">Cream/Ointment</option>
        </select>
      </div>

      <div class="col-span-2">
        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Sig (Instructions)</label>
        <input
          v-model="form.sig"
          placeholder="e.g. Take 1 tablet by mouth daily at bedtime"
          class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>

      <div>
        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Quantity</label>
        <input
          v-model="form.quantity"
          type="number"
          class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>

      <div>
        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Refills</label>
        <input
          v-model="form.refills"
          type="number"
          class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>
    </div>

    <div class="flex gap-3 pt-2">
      <button
        @click="$emit('cancel')"
        class="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-bold hover:bg-slate-700/50 transition-all"
      >
        Cancel
      </button>
      <button
        @click="handleSubmit"
        class="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-all shadow-lg shadow-emerald-500/10"
      >
        Add Prescription
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Pill } from 'lucide-vue-next';

const emit = defineEmits(['submit', 'cancel']);

const form = ref({
  drug_name: '',
  strength: '',
  sig: '',
  quantity: 30,
  refills: 0,
  form: 'tablet',
  pharmacy: 'CVS Pharmacy #4521'
});

function handleSubmit() {
  if (!form.value.drug_name) return;
  emit('submit', { ...form.value });
}
</script>
