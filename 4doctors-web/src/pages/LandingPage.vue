<template>
  <div class="min-h-screen bg-slate-50 overflow-hidden font-sans">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center gap-2">
            <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity class="h-6 w-6 text-white" />
            </div>
            <span class="text-2xl font-black tracking-tight text-slate-900">
              4Doctors<span class="text-blue-500">.ai</span>
            </span>
          </div>
          
          <div class="hidden md:flex items-center gap-8">
            <a href="#features" class="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" class="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Pricing</a>
            <router-link to="/login" class="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">Log In</router-link>
            <router-link 
              to="/signup" 
              class="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <!-- Decor items -->
      <div class="absolute top-20 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-sm mb-8 animate-slide-in">
          <Stethoscope class="w-4 h-4" />
          <span>The prescribed cure for administrative headaches</span>
        </div>
        
        <h1 class="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-tight">
          Less Paperwork.<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">More Patients.</span>
        </h1>
        
        <p class="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          The all-in-one AI practice management platform that handles your calls, scheduling, and paperwork so you can focus on healing.
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link 
            to="/signup"
            class="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-full shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            Start Free Trial
          </router-link>
          <button class="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold text-lg rounded-full border-2 border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
            <PlayCircle class="w-5 h-5" />
            Watch Demo
          </button>
        </div>
      </div>
    </header>

    <!-- Services Grid -->
    <section id="features" class="py-24 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-black text-slate-900 mb-4">Complete Care for Your Practice</h2>
          <p class="text-lg text-slate-500">Everything you need to run a modern medical office.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- 4Calls Integration -->
          <div class="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Phone class="w-7 h-7 text-blue-600" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">AI Receptionist</h3>
            <p class="text-slate-500 leading-relaxed">
              Never miss a call. Our AI answers phones 24/7, schedules appointments, and handles verified patient inquiries automatically.
            </p>
          </div>

          <!-- URPa Integration -->
          <div class="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Bot class="w-7 h-7 text-teal-600" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Doctor's Assistant</h3>
            <p class="text-slate-500 leading-relaxed">
              Your personal AI scribe. It researches medical journals, drafts follow-up emails, and manages your personal tasks.
            </p>
          </div>

          <!-- Practice Management -->
          <div class="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div class="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Calendar class="w-7 h-7 text-purple-600" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Smart Scheduling</h3>
            <p class="text-slate-500 leading-relaxed">
              Intelligent calendar management that optimizes your day, reduces no-shows, and prevents double-booking.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-24 bg-slate-900 text-white relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10" :style="patternStyle"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-black mb-4">Simple, Transparent Pricing</h2>
          <p class="text-blue-200 text-lg">No hidden fees. No insurance claims needed. 😉</p>
          
          <div class="flex items-center justify-center gap-4 mt-8">
            <span :class="['text-sm font-bold', !pricingAnnual ? 'text-white' : 'text-slate-400']">Monthly</span>
            <button 
              @click="pricingAnnual = !pricingAnnual"
              class="w-14 h-8 rounded-full bg-blue-600 p-1 relative transition-colors"
            >
              <div 
                class="w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300"
                :class="pricingAnnual ? 'translate-x-6' : 'translate-x-0'"
              ></div>
            </button>
            <span :class="['text-sm font-bold', pricingAnnual ? 'text-white' : 'text-slate-400']">Annual (Save 20%)</span>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Starter -->
          <div class="bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-blue-500 transition-colors">
            <h3 class="text-xl font-bold mb-2">Solo Practice</h3>
            <div class="flex items-baseline gap-1 mb-6">
              <span class="text-4xl font-black">${{ pricingAnnual ? '49' : '59' }}</span>
              <span class="text-slate-400">/mo</span>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center gap-3 text-sm text-slate-300">
                <Check class="w-5 h-5 text-blue-400" /> 1 Doctor Profile
              </li>
              <li class="flex items-center gap-3 text-sm text-slate-300">
                <Check class="w-5 h-5 text-blue-400" /> Basic AI Receptionist
              </li>
              <li class="flex items-center gap-3 text-sm text-slate-300">
                <Check class="w-5 h-5 text-blue-400" /> Standard Support
              </li>
            </ul>
            <router-link to="/subscribe?plan=solo" class="block w-full py-3 bg-slate-700 text-white font-bold text-center rounded-xl hover:bg-slate-600 transition-colors">
              Get Started
            </router-link>
          </div>

          <!-- Pro (Popular) -->
          <div class="bg-blue-600 rounded-3xl p-8 border-2 border-blue-400 shadow-2xl relative transform md:-translate-y-4">
            <div class="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-wider">
              Popular
            </div>
            <h3 class="text-xl font-bold mb-2">Clinic</h3>
            <div class="flex items-baseline gap-1 mb-6">
              <span class="text-4xl font-black">${{ pricingAnnual ? '149' : '179' }}</span>
              <span class="text-slate-200">/mo</span>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center gap-3 text-sm text-white">
                <Check class="w-5 h-5 text-white" /> Up to 5 Doctor Profiles
              </li>
              <li class="flex items-center gap-3 text-sm text-white">
                <Check class="w-5 h-5 text-white" /> Advanced AI Receptionist
              </li>
              <li class="flex items-center gap-3 text-sm text-white">
                <Check class="w-5 h-5 text-white" /> URPa Assistant Access
              </li>
            </ul>
            <router-link to="/subscribe?plan=clinic" class="block w-full py-3 bg-white text-blue-600 font-bold text-center rounded-xl hover:bg-blue-50 transition-colors">
              Start Free Trial
            </router-link>
          </div>

          <!-- Enterprise -->
          <div class="bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-blue-500 transition-colors">
            <h3 class="text-xl font-bold mb-2">Hospital</h3>
            <div class="flex items-baseline gap-1 mb-6">
              <span class="text-4xl font-black">Custom</span>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center gap-3 text-sm text-slate-300">
                <Check class="w-5 h-5 text-blue-400" /> Unlimited Profiles
              </li>
              <li class="flex items-center gap-3 text-sm text-slate-300">
                <Check class="w-5 h-5 text-blue-400" /> Custom AI Training
              </li>
              <li class="flex items-center gap-3 text-sm text-slate-300">
                <Check class="w-5 h-5 text-blue-400" /> 24/7 Priority Support
              </li>
            </ul>
            <button class="block w-full py-3 bg-slate-700 text-white font-bold text-center rounded-xl hover:bg-slate-600 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex items-center gap-2">
          <Activity class="h-6 w-6 text-blue-600" />
          <span class="font-bold text-slate-900">4Doctors.ai</span>
        </div>
        <p class="text-slate-500 text-sm">© 2026 4Doctors. Part of the TaskJuggler Ecosystem.</p>
        <div class="flex gap-6">
          <a href="#" class="text-slate-400 hover:text-blue-600"><Twitter class="w-5 h-5" /></a>
          <a href="#" class="text-slate-400 hover:text-blue-600"><Linkedin class="w-5 h-5" /></a>
          <a href="#" class="text-slate-400 hover:text-blue-600"><Github class="w-5 h-5" /></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Activity, 
  Stethoscope, 
  PlayCircle, 
  Phone, 
  Bot, 
  Calendar, 
  Check, 
  Twitter, 
  Linkedin, 
  Github 
} from 'lucide-vue-next';

const pricingAnnual = ref(true);

const patternStyle = computed(() => ({
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
}));
</script>
