<template>
  <div class="flex h-screen bg-slate-50 font-sans">
    <!-- Sidebar Component -->
    <aside :class="['bg-slate-900 text-white flex-shrink-0 transition-all duration-300', collapsed ? 'w-20' : 'w-64']">
       <!-- Logo -->
       <div class="h-16 flex items-center px-6 border-b border-slate-800">
           <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl flex-shrink-0">4</div>
           <span v-if="!collapsed" class="ml-3 font-bold text-lg tracking-tight">healthcare</span>
       </div>

       <!-- Mode Toggle (Moved to Sidebar) -->
       <div class="px-4 py-3 border-b border-slate-800">
         <ModeToggle :compact="collapsed" />
       </div>

       <!-- Navigation Scroller -->
       <div class="overflow-y-auto h-[calc(100vh-180px)] py-4 space-y-6">
           
           <!-- ALL MODES Section -->
           <div class="px-4">
               <div v-if="!collapsed" class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                 📊 All Modes
               </div>
               <nav class="space-y-1">
                   <router-link to="/dashboard" :class="navLinkClass()">
                       <LayoutDashboard class="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-500" />
                       <span v-if="!collapsed">Dashboard</span>
                   </router-link>
                   <router-link to="/urpa" :class="navLinkClass()">
                       <Bot class="w-5 h-5 mr-3 text-slate-400 group-hover:text-purple-500" />
                       <span v-if="!collapsed">URPA Assistant</span>
                   </router-link>
                   <router-link to="/docboard" :class="navLinkClass()">
                       <CheckSquare class="w-5 h-5 mr-3 text-slate-400 group-hover:text-emerald-500" />
                       <span v-if="!collapsed">DocBoard</span>
                   </router-link>
               </nav>
           </div>

           <!-- PRACTICE MODE Section (HIPAA) - Filtered -->
           <div class="px-4" v-if="authStore.hasPracticeAccess && (currentMode === 'practice' || currentMode === 'all')">
               <div v-if="!collapsed" class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 px-2" :class="sectionHeaderClass('practice')">
                 🔒 Practice
                 <span v-if="currentMode === 'practice'" class="ml-auto text-[10px] bg-violet-600 text-white px-1.5 py-0.5 rounded">HIPAA</span>
               </div>
               <nav class="space-y-1">
                   <router-link to="/patients" :class="navLinkClass('practice')">
                       <Users class="w-5 h-5 mr-3" :class="iconClass('practice')" />
                       <span v-if="!collapsed">Patients</span>
                   </router-link>
                   <router-link to="/schedule" :class="navLinkClass('practice')">
                       <Calendar class="w-5 h-5 mr-3" :class="iconClass('practice')" />
                       <span v-if="!collapsed">Clinical Schedule</span>
                   </router-link>
                   
                   <!-- Clinical Only Items -->
                   <template v-if="authStore.isClinical">
                       <router-link to="/scribe" :class="navLinkClass('practice')">
                           <Mic class="w-5 h-5 mr-3" :class="iconClass('practice')" />
                           <span v-if="!collapsed">ScribeMD</span>
                       </router-link>
                       <router-link to="/labs" :class="navLinkClass('practice')">
                           <Wand2 class="w-5 h-5 mr-3" :class="iconClass('practice')" />
                           <span v-if="!collapsed">Lab Results</span>
                       </router-link>
                       <router-link to="/rx" :class="navLinkClass('practice')">
                           <Pill class="w-5 h-5 mr-3" :class="iconClass('practice')" />
                           <span v-if="!collapsed">E-Prescribing</span>
                       </router-link>
                   </template>

                   <router-link to="/referrals" :class="navLinkClass('practice')">
                       <Shield class="w-5 h-5 mr-3" :class="iconClass('practice')" />
                       <span v-if="!collapsed">Referrals</span>
                   </router-link>
                   <router-link to="/prior-auth" :class="navLinkClass('practice')">
                       <Shield class="w-5 h-5 mr-3" :class="iconClass('practice')" />
                       <span v-if="!collapsed">Prior Auth</span>
                   </router-link>
               </nav>
           </div>

           <!-- BUSINESS MODE Section - Filtered -->
           <div class="px-4" v-if="authStore.hasBusinessAccess && (currentMode === 'business' || currentMode === 'all')">
               <div v-if="!collapsed" class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 px-2" :class="sectionHeaderClass('business')">
                 💼 Business
               </div>
               <nav class="space-y-1">
                   <router-link to="/claims" :class="navLinkClass('business')">
                       <DollarSign class="w-5 h-5 mr-3" :class="iconClass('business')" />
                       <span v-if="!collapsed">Revenue & Billing</span>
                   </router-link>
                   <router-link to="/staff" :class="navLinkClass('business')">
                       <UserCog class="w-5 h-5 mr-3" :class="iconClass('business')" />
                       <span v-if="!collapsed">Staff Management</span>
                   </router-link>
                   <router-link to="/vendors" :class="navLinkClass('business')">
                       <Building2 class="w-5 h-5 mr-3" :class="iconClass('business')" />
                       <span v-if="!collapsed">Vendors</span>
                   </router-link>
                   <router-link to="/marketing" :class="navLinkClass('business')">
                       <ShoppingBag class="w-5 h-5 mr-3" :class="iconClass('business')" />
                       <span v-if="!collapsed">Marketing</span>
                   </router-link>
                   <router-link to="/cme" :class="navLinkClass('business')" v-if="authStore.isClinical">
                       <Target class="w-5 h-5 mr-3" :class="iconClass('business')" />
                       <span v-if="!collapsed">CME Tracking</span>
                   </router-link>
               </nav>
           </div>
           
           <!-- PERSONAL MODE Section - Filtered -->
           <div class="px-4" v-if="(authStore.isClinical || authStore.isAdmin) && (currentMode === 'personal' || currentMode === 'all')">
               <div v-if="!collapsed" class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 px-2" :class="sectionHeaderClass('personal')">
                 🏠 Personal
               </div>
               <nav class="space-y-1">
                   <router-link to="/travel" :class="navLinkClass('personal')">
                       <Plane class="w-5 h-5 mr-3" :class="iconClass('personal')" />
                       <span v-if="!collapsed">Travel</span>
                   </router-link>
                   <router-link to="/goals" :class="navLinkClass('personal')">
                       <Target class="w-5 h-5 mr-3" :class="iconClass('personal')" />
                       <span v-if="!collapsed">Goals</span>
                   </router-link>
                   <router-link to="/social" :class="navLinkClass('personal')">
                       <MessageCircle class="w-5 h-5 mr-3" :class="iconClass('personal')" />
                       <span v-if="!collapsed">Social</span>
                   </router-link>
                   <router-link to="/files" :class="navLinkClass('personal')">
                       <FolderOpen class="w-5 h-5 mr-3" :class="iconClass('personal')" />
                       <span v-if="!collapsed">Files</span>
                   </router-link>
               </nav>
           </div>

           <!-- Ecosystem Section -->
           <div class="px-4" v-if="!authStore.isPatient">
               <div v-if="!collapsed" class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                 🌐 Ecosystem
               </div>
               <nav class="space-y-1">
                    <router-link to="/doclife" :class="navLinkClass()">
                       <Heart class="w-5 h-5 mr-3 text-slate-400 group-hover:text-pink-400" />
                       <span v-if="!collapsed">DocLife</span>
                   </router-link>
                   <router-link to="/docconnect" :class="navLinkClass()">
                       <Globe class="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-300" />
                       <span v-if="!collapsed">DocConnect</span>
                   </router-link>
                   <router-link to="/settings" :class="navLinkClass()">
                       <Settings class="w-5 h-5 mr-3 text-slate-400" />
                       <span v-if="!collapsed">Settings</span>
                   </router-link>
               </nav>
           </div>
       </div>

       <!-- User Footer -->
       <div class="h-16 border-t border-slate-800 p-4 flex items-center">
           <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">{{ authStore.user?.name?.charAt(0) || 'U' }}</div>
           <div v-if="!collapsed" class="ml-3">
               <p class="text-sm font-medium">{{ authStore.user?.name || 'User' }}</p>
               <p class="text-xs text-slate-500">{{ authStore.user?.role || 'Guest' }}</p>
           </div>
       </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-auto flex flex-col">
        <!-- Top Header -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
            <h2 class="text-xl font-bold text-slate-800 capitalize">{{ $route.name?.toString().replace('-', ' ') }}</h2>
            <div class="flex items-center gap-4">
               
               <!-- DEV ONLY: Role Switcher -->
               <div v-if="isDev" class="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                   <span class="text-[10px] font-bold text-amber-600 uppercase">DEV</span>
                   <select 
                       :value="authStore.user?.role || 'provider'"
                       @change="switchRole(($event.target as HTMLSelectElement).value)"
                       class="text-xs font-bold bg-transparent text-amber-800 outline-none cursor-pointer"
                   >
                       <option value="provider">Provider</option>
                       <option value="nurse">Nurse</option>
                       <option value="staff">Front Desk</option>
                       <option value="admin">Admin</option>
                       <option value="patient">Patient</option>
                   </select>
               </div>
               <button class="p-2 text-slate-400 hover:bg-slate-100 rounded-full relative">
                   <Bell class="w-5 h-5" />
                   <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
               </button>
               <button class="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
                   + Quick Action
               </button>
            </div>
        </header>
        
        <!-- HIPAA Mode Banner -->
        <div class="px-6 pt-4">
            <HIPAABanner />
        </div>

        <!-- Page Content -->
        <div class="p-6">
            <router-view></router-view>
        </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMode } from '@/composables/useMode';
import type { URPAMode } from '@/types/mode';
import ModeToggle from '@/components/core/ModeToggle.vue';
import HIPAABanner from '@/components/core/HIPAABanner.vue';
import { 
    LayoutDashboard, Users, Calendar, Mic, DollarSign, Settings, 
    CheckSquare, Bot, ShoppingBag, Heart, Globe, Bell, Shield, Pill, Wand2,
    UserCog, Building2, Plane, Target, MessageCircle, FolderOpen
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const { currentMode } = useMode();
const collapsed = ref(false);
const isDev = import.meta.env.DEV;

// Section header styling based on current mode
const sectionHeaderClass = (sectionMode: URPAMode) => {
    switch (sectionMode) {
      case 'practice': return 'text-violet-400';
      case 'business': return 'text-sky-400';
      case 'personal': return 'text-emerald-400';
    }
  return 'text-slate-600';
};

// Nav link styling - simpler now that we filter instead of dim
const navLinkClass = (linkMode?: URPAMode) => {
  return 'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 text-slate-300 hover:bg-slate-800 hover:text-white';
};

// Icon styling based on mode - always active colors since we now filter
const iconClass = (iconMode: URPAMode) => {
    switch (iconMode) {
      case 'practice': return 'text-violet-400 group-hover:text-violet-300';
      case 'business': return 'text-sky-400 group-hover:text-sky-300';
      case 'personal': return 'text-emerald-400 group-hover:text-emerald-300';
    }
  return 'text-slate-600 group-hover:text-slate-500';
};

const switchRole = (role: string) => {
    authStore.setDevRole(role as 'provider' | 'staff' | 'patient' | 'admin');
    if (role === 'patient') {
        router.push('/portal/dashboard');
    } else {
        router.push('/dashboard');
    }
};

onMounted(() => {
    if (!authStore.user) {
        authStore.fetchUser();
    }
});
</script>

