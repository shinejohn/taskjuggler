<template>
  <div class="relative w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
    <!-- Decor Header -->
    <div class="h-2 bg-gradient-to-r from-blue-500 via-teal-400 to-indigo-500"></div>
    
    <div class="p-8">
      <div class="text-center mb-8">
        <h3 class="text-2xl font-black text-slate-900 mb-2">Get in Touch</h3>
        <p class="text-slate-500">Have questions about Enterprise plans or custom integrations? We're here to help.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6" v-if="!submitted">
        <!-- Name -->
        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-700 ml-1">Full Name</label>
          <div class="relative">
            <User class="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input 
              v-model="form.name"
              required
              type="text" 
              placeholder="Dr. Sarah Johnson" 
              class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium"
            >
          </div>
        </div>

        <!-- Email -->
        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-700 ml-1">Work Email</label>
          <div class="relative">
            <Mail class="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input 
              v-model="form.email"
              required
              type="email" 
              placeholder="sarah@clinic.com" 
              class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium"
            >
          </div>
        </div>

        <!-- Practice Size -->
        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-700 ml-1">Practice Size</label>
          <div class="relative">
            <Building2 class="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <select 
              v-model="form.size"
              class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-600 font-medium appearance-none"
            >
              <option value="solo">Solo Practice</option>
              <option value="small">Small Clinic (2-5 Providers)</option>
              <option value="medium">Medium Clinic (6-20 Providers)</option>
              <option value="large">Large Organization (20+)</option>
            </select>
            <ChevronDown class="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <!-- Message -->
        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-700 ml-1">How can we help?</label>
          <div class="relative">
            <textarea 
              v-model="form.message"
              required
              rows="4"
              placeholder="Tell us about your practice needs..." 
              class="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium resize-none"
            ></textarea>
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="!loading">Send Message</span>
          <Loader2 v-else class="w-5 h-5 animate-spin" />
        </button>
      </form>

      <!-- Success State -->
      <div v-else class="py-12 text-center animate-fade-in">
        <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check class="w-8 h-8" />
        </div>
        <h3 class="text-2xl font-black text-slate-900 mb-2">Message Sent!</h3>
        <p class="text-slate-500 mb-8 max-w-xs mx-auto">Thanks for reaching out, {{ form.name.split(' ')[0] }}. Our team will get back to you within 24 hours.</p>
        <button 
          @click="resetForm"
          class="px-6 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors"
        >
          Send Another
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { User, Mail, Building2, ChevronDown, Check, Loader2 } from 'lucide-vue-next';

const submitted = ref(false);
const loading = ref(false);

const form = reactive({
  name: '',
  email: '',
  size: 'solo',
  message: ''
});

const handleSubmit = async () => {
  loading.value = true;
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  loading.value = false;
  submitted.value = true;
};

const resetForm = () => {
  submitted.value = false;
  form.name = '';
  form.email = '';
  form.message = '';
  form.size = 'solo';
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
