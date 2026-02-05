<template>
  <div class="max-w-7xl mx-auto space-y-10">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <div class="p-2 bg-pink-100 text-pink-600 rounded-lg">
            <Heart class="w-6 h-6" />
          </div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">DocLife</h1>
        </div>
        <p class="text-slate-500 text-lg">Reclaiming the balance. Resources designed exclusively for the physician lifestyle.</p>
      </div>  
      <!-- Search -->
      <div class="relative">
        <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search resources..." 
          class="pl-9 pr-4 py-2.5 w-64 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-pink-500"
        >
      </div>
    </header>

    <!-- Wellness Dashboard -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Wellness Score Card -->
      <div class="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <h2 class="text-xl font-bold text-slate-900 mb-6">Your Wellness Pulse</h2>
        <div class="flex flex-col items-center py-4">
          <div class="relative w-40 h-40">
            <svg class="w-full h-full" viewBox="0 0 100 100">
              <circle class="text-slate-100" stroke-width="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
              <circle class="text-pink-500" stroke-width="8" stroke-dasharray="251.2" stroke-dashoffset="62.8" stroke-linecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-4xl font-extrabold text-slate-900">75</span>
              <span class="text-xs font-medium text-slate-500 uppercase tracking-widest">Balanced</span>
            </div>
          </div>
          <p class="mt-6 text-sm text-center text-slate-500 leading-relaxed">
            You're doing better than 65% of your peers. Your sleep quality has improved this week.
          </p>
          <button 
            @click="showAssessmentModal = true"
            class="mt-8 w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Take Assessment
          </button>
        </div>
      </div>

      <!-- Quick Actions/Resources -->
      <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="resource in primaryResources" 
          :key="resource.title" 
          class="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
          @click="openResource(resource)"
        >
          <div :class="`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${resource.color}`">
            <component :is="resource.icon" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-2">{{ resource.title }}</h3>
          <p class="text-sm text-slate-500 mb-6 leading-relaxed">{{ resource.description }}</p>
          <div class="mt-auto flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
            Explore <ChevronRight class="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Community Section -->
    <section>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-slate-900">Physician Circles</h2>
        <button class="text-sm font-semibold text-blue-600 hover:underline">Find My Specialty</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="circle in circles" :key="circle.name" class="bg-slate-50 rounded-2xl p-6 border border-transparent hover:border-slate-200 transition-all cursor-pointer">
          <div class="flex -space-x-2 mb-4">
            <img v-for="i in 3" :key="i" :src="`https://i.pravatar.cc/100?u=${circle.name}${i}`" class="w-8 h-8 rounded-full border-2 border-slate-50" />
            <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 border-2 border-slate-50">
              +{{ circle.members }}
            </div>
          </div>
          <h3 class="font-bold text-slate-900 mb-1">{{ circle.name }}</h3>
          <p class="text-xs text-slate-500 mb-4">{{ circle.activity }}</p>
          <button 
            @click.stop="joinCircle(circle)"
            class="w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Join Circle
          </button>
        </div>
      </div>
    </section>

    <!-- Lifestyle Perks -->
    <section class="bg-indigo-600 rounded-3xl p-10 text-white relative overflow-hidden group">
      <div class="absolute right-0 top-0 bottom-0 w-1/3 bg-indigo-500/20 -skew-x-12 translate-x-1/2"></div>
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <span class="inline-block px-3 py-1 bg-indigo-500 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">Exclusive Perks</span>
          <h2 class="text-4xl font-bold mb-4">Concierge Services for You</h2>
          <p class="text-indigo-100 text-lg mb-8 leading-relaxed max-w-md">
            From travel planning and child care to financial management, we've negotiated institutional rates on services that make your life easier.
          </p>
          <div class="flex flex-wrap gap-4">
            <button class="px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-slate-50 transition-colors">
              Access Services
            </button>
            <button class="px-8 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-400 transition-colors border border-indigo-400">
              View All Partners
            </button>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="perk in perks" :key="perk.title" class="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
            <component :is="perk.icon" class="w-8 h-8 mb-4 text-indigo-200" />
            <h4 class="font-bold text-white mb-1">{{ perk.title }}</h4>
            <p class="text-xs text-indigo-100/70">{{ perk.discount }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Assessment Modal -->
    <Modal v-model="showAssessmentModal" title="Wellness Assessment" maxWidth="2xl">
      <div class="space-y-8 py-4">
        <div class="space-y-4">
          <h4 class="text-lg font-bold text-slate-900">How would you rate your sleep quality this week?</h4>
          <div class="grid grid-cols-5 gap-2">
            <button 
              v-for="i in 5" :key="i"
              class="h-12 rounded-xl border flex items-center justify-center font-bold transition-all transition-all"
              :class="i === 4 ? 'bg-pink-600 text-white border-pink-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-pink-200'"
            >
              {{ i }}
            </button>
          </div>
          <div class="flex justify-between text-[10px] uppercase font-black text-slate-400">
            <span>Critical</span>
            <span>Exceptional</span>
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="text-lg font-bold text-slate-900">Clinical workload intensity?</h4>
          <input type="range" class="w-full accent-pink-600" min="1" max="100">
          <div class="flex justify-between text-xs text-slate-500">
            <span>Low (Manageable)</span>
            <span>Overwhelming (Burnout Risk)</span>
          </div>
        </div>

        <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <h5 class="font-bold text-slate-900 mb-2">Why we ask?</h5>
          <p class="text-xs text-slate-500 leading-relaxed">
            4healthcare uses anonymous, aggregated wellness data to advocate for better physician working conditions and staffing levels at an institutional level. Your individual data is always 100% private.
          </p>
        </div>
      </div>
      <template #footer>
        <button @click="showAssessmentModal = false" class="px-8 py-2 bg-pink-600 text-white rounded-xl font-bold shadow-lg shadow-pink-200">
          Save Assessment
        </button>
      </template>
    </Modal>

    <!-- Resource Detail Modal -->
    <Modal v-model="showResourceModal" :title="selectedResource?.title" maxWidth="4xl">
      <div v-if="selectedResource" class="space-y-8">
        <div :class="`h-48 rounded-3xl flex items-center justify-center ${selectedResource.color} bg-opacity-20`">
           <component :is="selectedResource.icon" class="w-20 h-20 opacity-40" />
        </div>
        <div class="prose prose-slate max-w-none">
          <h2 class="text-3xl font-black text-slate-900 leading-tight">Navigating Clinical Burnout in the Post-AI Era</h2>
          <p class="text-slate-500 italic mb-8">By Dr. Amara Vance · 8 min read</p>
          
          <p class="text-lg text-slate-700 leading-relaxed">
            As AI tools like ScribeMD and URPA become staples in modern practices, the nature of physician burnout is shifting. While administrative burden is decreasing, the "clinical throughput" pressure is increasing. We explore strategies for maintaining intentional connection in an automated environment...
          </p>
          
          <h4 class="text-slate-900 font-bold mt-8">Three Strategic Pillars</h4>
          <ul class="space-y-4">
            <li><strong>Intentional Pauses:</strong> Scheduling 5-minute cognitive resets between intensive cases.</li>
            <li><strong>The "Human First" Protocol:</strong> Using URPA to handle data entry so you can maintain eye contact with patients.</li>
            <li><strong>Modular Living:</strong> Applying the same 'loose coupling' logic of our platform to your home life and commitments.</li>
          </ul>
        </div>
        <div class="pt-8 border-t border-slate-100 flex items-center justify-between">
           <div class="flex items-center gap-4">
             <button class="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
               <Bookmark class="w-4 h-4" /> Save for Later
             </button>
             <button class="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
               <Share2 class="w-4 h-4" /> Share with Peer
             </button>
           </div>
           <button @click="showResourceModal = false" class="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">
             Finish Reading
           </button>
        </div>
      </div>
    </Modal>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  Heart, Coffee, 
  ChevronRight, Plane, CreditCard, 
  Sunrise, Shield, Trophy, Bookmark, Share2, Search
} from 'lucide-vue-next';
import Modal from '@/components/ui/Modal.vue';

const searchQuery = ref('');
const showAssessmentModal = ref(false);
const showResourceModal = ref(false);
const selectedResource = ref<any>(null);

const openResource = (res: any) => {
  selectedResource.value = res;
  showResourceModal.value = true;
};

const joinCircle = (circle: any) => {
  alert(`Successfully joined the ${circle.name} circle.`);
};

const primaryResources = [
  {
    title: 'Mindfulness & Resilience',
    description: 'Bite-sized meditation and cognitive reframing exercises built for the clinic.',
    icon: Sunrise,
    color: 'bg-orange-50 text-orange-600'
  },
  {
    title: 'Burnout Prevention',
    description: 'Confidential peer-support resources and evidence-based interventions.',
    icon: Shield,
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'CME & Development',
    description: 'Track your credits and find premium educational opportunities.',
    icon: Trophy,
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Financial Health',
    description: 'Physician-specific investment tools, loan forgiveness trackers and more.',
    icon: CreditCard,
    color: 'bg-indigo-50 text-indigo-600'
  }
];

const circles = [
  { name: 'Surgical Excellence', members: 124, activity: 'Updated 2m ago' },
  { name: 'ER Frontline', members: 89, activity: 'Active now' },
  { name: 'Peds Mental Health', members: 56, activity: 'New post today' },
  { name: 'Private Practice MBA', members: 210, activity: 'Live webinar in 1h' }
];

const perks = [
  { title: 'Global Travel', icon: Plane, discount: 'Up to 25% Off' },
  { title: 'Home Services', icon: Coffee, discount: 'Concierge Rates' },
  { title: 'Fitness & Health', icon: Heart, discount: 'Institutional Access' },
  { title: 'Wealth Mgt', icon: CreditCard, discount: 'Fee-Free Advice' }
];
</script>
