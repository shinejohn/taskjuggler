<template>
  <div class="space-y-8">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Marketplace</h1>
        <p class="text-slate-500 mt-1">Enhance your practice with world-class integrations and AI tools.</p>
      </div>
      <div class="relative w-full md:w-96">
        <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search clinical tools, integrations..." 
          class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
        >
      </div>
    </header>

    <!-- Categories -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button 
        v-for="cat in categories" 
        :key="cat"
        class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
        :class="activeCategory === cat ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Featured Section -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-slate-900">Featured Add-ons</h2>
        <button class="text-sm font-medium text-blue-600 hover:underline">View All</button>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div 
          v-for="item in featuredItems" 
          :key="item.id" 
          class="group relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
          @click="openDetail(item)"
        >
          <div class="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform">
            <component :is="item.icon" class="w-64 h-64" />
          </div>
          <div class="relative z-10 flex flex-col h-full">
            <div class="bg-white/20 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <component :is="item.icon" class="w-6 h-6" />
            </div>
            <h3 class="text-2xl font-bold mb-2">{{ item.name }}</h3>
            <p class="text-blue-50/80 mb-6 max-w-sm">{{ item.description }}</p>
            <div class="mt-auto flex items-center gap-3">
              <button class="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Learn More
              </button>
              <span class="text-sm font-medium text-blue-100 italic">{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Discovery Grid -->
    <section>
      <h2 class="text-xl font-semibold text-slate-900 mb-6">Popular Tools</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="tool in filteredTools" 
          :key="tool.id" 
          class="flex flex-col bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-500/30 hover:shadow-lg transition-all group cursor-pointer"
          @click="openDetail(tool)"
        >
          <div class="flex items-start justify-between mb-4">
            <div :class="`p-3 rounded-xl ${tool.color}`">
              <component :is="tool.icon" class="w-6 h-6" />
            </div>
            <button 
              class="opacity-0 group-hover:opacity-100 px-3 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 transition-all"
              @click.stop="installTool(tool)"
            >
              Install
            </button>
          </div>
          <h3 class="font-bold text-slate-900 mb-1">{{ tool.name }}</h3>
          <p class="text-xs text-slate-500 mb-4 line-clamp-2 h-8">{{ tool.description }}</p>
          <div class="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <Star class="w-4 h-4 text-amber-400 fill-amber-400" />
              <span class="text-sm font-semibold text-slate-700">{{ tool.rating }}</span>
              <span class="text-xs text-slate-400">({{ tool.users }})</span>
            </div>
            <span class="text-xs font-bold text-slate-900">{{ tool.price }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Partner Banner -->
    <div class="bg-slate-900 rounded-3xl p-8 text-center text-white relative overflow-hidden">
      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
      <h2 class="text-2xl font-bold mb-2">Build your own tools?</h2>
      <p class="text-slate-400 mb-6 max-w-lg mx-auto">Join our developer program to build clinical integrations seen by thousands of practices.</p>
      <button class="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors relative z-10">
        Developer Portal
      </button>
    </div>

    <!-- Detail Modal -->
    <Modal v-model="showDetailModal" :title="selectedItem?.name" maxWidth="4xl">
      <div v-if="selectedItem" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div :class="`w-20 h-20 rounded-2xl flex items-center justify-center ${selectedItem.color || 'bg-blue-600 text-white'}`">
            <component :is="selectedItem.icon" class="w-10 h-10" />
          </div>
          <div>
            <h2 class="text-3xl font-black text-slate-900 mb-2">{{ selectedItem.name }}</h2>
            <div class="flex items-center gap-4 text-sm text-slate-500">
               <span class="flex items-center gap-1.5"><ShieldCheck class="w-4 h-4 text-emerald-500" /> HIPAA Compliant</span>
               <span class="flex items-center gap-1.5"><Star class="w-4 h-4 text-amber-400" /> {{ selectedItem.rating }} Rating</span>
               <span>{{ selectedItem.users || 'Featured' }} Users</span>
            </div>
          </div>
          <div class="prose prose-slate max-w-none">
            <h4 class="text-slate-900 font-bold">About this module</h4>
            <p class="text-slate-600 leading-relaxed">{{ selectedItem.longDescription || selectedItem.description }}</p>
            <h4 class="text-slate-900 font-bold mt-6">Key Features</h4>
            <ul class="space-y-2">
              <li v-for="feat in selectedItem.features || defaultFeatures" :key="feat" class="flex items-center gap-2 text-sm text-slate-600">
                <div class="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                {{ feat }}
              </li>
            </ul>
          </div>
        </div>
        <div class="lg:col-span-1">
          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100 sticky top-0">
             <p class="text-sm font-bold text-slate-400 uppercase mb-4">Subscription</p>
             <div class="flex items-baseline gap-1 mb-6">
               <span class="text-4xl font-black text-slate-900">{{ selectedItem.price }}</span>
               <span class="text-sm text-slate-500">/mo</span>
             </div>
             <div class="space-y-3 mb-8">
               <div class="flex items-center justify-between text-sm">
                 <span class="text-slate-500">Cancel anytime</span>
                 <Check class="w-4 h-4 text-emerald-500" />
               </div>
               <div class="flex items-center justify-between text-sm">
                 <span class="text-slate-500">Practice-wide</span>
                 <Check class="w-4 h-4 text-emerald-500" />
               </div>
               <div class="flex items-center justify-between text-sm">
                 <span class="text-slate-500">Updates included</span>
                 <Check class="w-4 h-4 text-emerald-500" />
               </div>
             </div>
             <button 
                @click="installTool(selectedItem)"
                class="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
             >
               Add to Practice
             </button>
             <p class="text-[10px] text-center text-slate-400 mt-4 px-4 leading-tight">
               By installing, you agree to our Marketplace Terms and authorize billing to your account.
             </p>
          </div>
        </div>
      </div>
    </Modal>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Search, Star, Brain, Heart, Activity, 
  MessageSquare, ShieldCheck, Zap, Layers, 
  Database, UserPlus, ShoppingBag, Files,
  Stethoscope, Thermometer, FlaskConical,
  Check, X
} from 'lucide-vue-next';
import Modal from '@/components/ui/Modal.vue';

const showDetailModal = ref(false);
const selectedItem = ref<any>(null);

const openDetail = (item: any) => {
  selectedItem.value = item;
  showDetailModal.value = true;
};

const installTool = (tool: any) => {
  alert(`Installing ${tool.name}. This will be available in your core platform shortly.`);
  showDetailModal.value = false;
};

const activeCategory = ref('All');
const categories = ['All', 'Clinical AI', 'Billing', 'Integrations', 'Patient Care', 'Analytics'];

const featuredItems = [
  {
    id: 1,
    name: 'PrecisionRx AI',
    description: 'Advanced genomics-informed prescription engine for personalized medication planning.',
    longDescription: 'PrecisionRx AI integrates directly into your e-prescribing workflow, analyzing patient genomic markers to predict drug efficacy and minimize adverse reactions. It uses the latest NIH and PubMed-sourced data to provide real-time dosage recommendations based on individual metabolic profiles.',
    icon: FlaskConical,
    price: '$79',
    features: ['Pharmacogenomic analysis', 'Adverse reaction prediction', 'Integrated LabSync', 'Clinical justification reports']
  },
  {
    id: 2,
    name: 'Vault Records',
    description: 'Ultra-secure, blockchain-backed medical record storage for multi-practice coordination.',
    longDescription: 'Vault Records provides a tamper-proof audit trail for sensitive medical documents. Ideal for multi-specialty practices and research institutions that require the highest level of data integrity and secure peer-to-peer sharing capabilities without intermediate servers.',
    icon: ShieldCheck,
    price: '$45',
    features: ['Immutable audit logs', 'AES-256 local encryption', 'Multi-sig record access', 'Zero-knowledge storage']
  }
];

const tools = [
  { 
    id: 3, 
    name: 'NeuroSense', 
    description: 'AI-driven neurological assessment tool for early detection.', 
    category: 'Clinical AI',
    icon: Brain, 
    color: 'bg-purple-50 text-purple-600', 
    rating: 4.9, 
    users: '1.2k',
    price: 'Free'
  },
  { 
    id: 4, 
    name: 'EchoCharts', 
    description: 'Instant visualization of longitudinal cardiac data.', 
    category: 'Analytics',
    icon: Activity, 
    color: 'bg-red-50 text-red-600', 
    rating: 4.8, 
    users: '840',
    price: '$19'
  },
  { 
    id: 5, 
    name: 'FastRefer', 
    description: 'Automated referral pathway optimization system.', 
    category: 'Patient Care',
    icon: UserPlus, 
    color: 'bg-blue-50 text-blue-600', 
    rating: 4.7, 
    users: '2.1k',
    price: '$29'
  },
  { 
    id: 6, 
    name: 'PayGuard', 
    description: 'Real-time insurance eligibility and fraud detection.', 
    category: 'Billing',
    icon: Zap, 
    color: 'bg-emerald-50 text-emerald-600', 
    rating: 4.6, 
    users: '3.4k',
    price: '1% fee'
  }
];

const defaultFeatures = ['HIPAA Compliant', 'Mobile Responsive', 'Single Sign-on Enabled', 'Expert Support'];

const filteredTools = computed(() => {
  if (activeCategory.value === 'All') return tools;
  return tools.filter(t => t.category === activeCategory.value);
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
