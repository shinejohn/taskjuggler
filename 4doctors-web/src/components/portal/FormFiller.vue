<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    <!-- Form Header -->
    <div class="bg-slate-50 border-b border-slate-200 p-6">
      <h2 class="text-xl font-bold text-slate-900">{{ title }}</h2>
      <p class="text-slate-500 mt-1">{{ description }}</p>
    </div>

    <!-- Form Fields -->
    <div class="p-6 space-y-6">
      <div v-for="field in fields" :key="field.id" class="space-y-2">
        <label :for="field.id" class="block text-sm font-bold text-slate-700">
          {{ field.label }} <span v-if="field.required" class="text-red-500">*</span>
        </label>

        <!-- Text Input -->
        <div v-if="field.type === 'text'">
          <input 
            :id="field.id"
            v-model="formData[field.id]"
            type="text"
            :placeholder="field.placeholder"
            class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-lg"
          />
        </div>

        <!-- Date Input -->
        <div v-if="field.type === 'date'">
          <input 
            :id="field.id"
            v-model="formData[field.id]"
            type="date"
            class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-lg"
          />
        </div>

        <!-- Checkbox / Radio -->
        <div v-if="field.type === 'checkbox'" class="flex items-center gap-3 py-2">
            <input 
                :id="field.id"
                v-model="formData[field.id]"
                type="checkbox"
                class="w-6 h-6 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span class="text-slate-700 text-base">{{ field.placeholder || 'Yes, I agree' }}</span>
        </div>

        <!-- Signature Pad -->
        <div v-if="field.type === 'signature'">
            <SignaturePad v-model="formData[field.id]" />
        </div>

        <!-- Select -->
        <div v-if="field.type === 'select'">
            <select 
                :id="field.id"
                v-model="formData[field.id]"
                class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-lg bg-white"
            >
                <option value="" disabled>Select an option</option>
                <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
            </select>
        </div>

      </div>
    </div>

    <!-- Footer Actions -->
    <div class="bg-slate-50 border-t border-slate-200 p-6 flex flex-col sm:flex-row justify-end gap-3">
        <button 
            @click="$emit('cancel')"
            class="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-white transition-colors"
        >
            Cancel
        </button>
        <button 
            @click="handleSubmit"
            class="px-8 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 shadow-md transition-colors"
        >
            Submit Form
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SignaturePad from './SignaturePad.vue';
import { useToast } from '@/composables/useToast';

const toast = useToast();
// ... rest of script

interface Field {
    id: string;
    type: 'text' | 'date' | 'select' | 'checkbox' | 'signature';
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: string[]; // For select
    value?: any;
}

const props = defineProps<{
    title: string;
    description?: string;
    fields: Field[];
    initialData?: Record<string, any>;
}>();

const emit = defineEmits(['submit', 'cancel']);

const formData = ref<Record<string, any>>({});

// Initialize data
if (props.initialData) {
    formData.value = { ...props.initialData };
}

const handleSubmit = () => {
    // Basic validation
    for (const field of props.fields) {
        if (field.required && !formData.value[field.id]) {
            toast.error(`Please complete the field: ${field.label}`);
            return;
        }
    }
    emit('submit', formData.value);
};
</script>
