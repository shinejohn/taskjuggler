<template>
  <div class="flex h-screen bg-slate-50 font-sans">
    <!-- 1.2 Sidebar Component -->
    <aside :class="['bg-slate-900 text-white flex-shrink-0 transition-all duration-300', collapsed ? 'w-20' : 'w-64']">
       <!-- Logo -->
       <div class="h-16 flex items-center px-6 border-b border-slate-800">
           <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl">4</div>
           <span v-if="!collapsed" class="ml-3 font-bold text-lg tracking-tight">doctors.ai</span>
       </div>

       <!-- Navigation Scroller -->
       <div class="overflow-y-auto h-[calc(100vh-128px)] py-4 space-y-8">
           
           <!-- Core Platform -->
           <div class="px-4">
               <div v-if="!collapsed" class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Core</div>
               <nav class="space-y-1">
                   <router-link to="/dashboard" class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                       <LayoutDashboard class="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-500" />
                       <span v-if="!collapsed">Dashboard</span>
                   </router-link>
                   <router-link to="/docboard" class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                       <CheckSquare class="w-5 h-5 mr-3 text-slate-400 group-hover:text-emerald-500" />
                       <span v-if="!collapsed">DocBoard</span>
                   </router-link>
                    <router-link to="/urpa" class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                       <Bot class="w-5 h-5 mr-3 text-slate-400 group-hover:text-purple-500" />
                       <span v-if="!collapsed">URPa Assistant</span>
                   </router-link>
               </nav>
           </div>

           <!-- Clinical Modules -->
           <div class="px-4">
               <div v-if="!collapsed" class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Clinical</div>
               <nav class="space-y-1">
                   <router-link to="/patients" class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                       <Users class="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-400" />
                       <span v-if="!collapsed">Patients</span>
                   </router-link>
                    <router-link to="/schedule" class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                       <Calendar class="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-400" />
                       <span v-if="!collapsed">Schedule</span>
                   </router-link>
                   <router-link to="/scribe" class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                       <Mic class="w-5 h-5 mr-3 text-slate-400 group-hover:text-red-400" />
                       <span v-if="!collapsed">ScribeMD</span>
                   </router-link>
                   <router-link to="/scribe/phrases" class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                       <Wand2 class="w-5 h-5 mr-3 text-slate-400 group-hover:text-purple-400" />
                       <span v-if="!collapsed">Smart Phrases</span>
                   </router-link>
                   <router-link to="/prior-auth" class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                       <Shield class="w-5 h-5 mr-3 text-slate-400 group-hover:text-indigo-400" />
                       <span v-if="!collapsed">Prior Auth</span>
                   </router-link>
                   <router-link to="/rx" class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                       <Pill class="w-5 h-5 mr-3 text-slate-400 group-hover:text-cyan-400" />
                       <span v-if="!collapsed">E-Prescribing</span>
                   </router-link>
               </nav>
           </div>

           <!-- Revenue & Admin -->
           <div class="px-4">
               <div v-if="!collapsed" class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Practice</div>
               <nav class="space-y-1">
                   <router-link to="/claims" class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                       <DollarSign class="w-5 h-5 mr-3 text-slate-400 group-hover:text-green-400" />
                       <span v-if="!collapsed">Revenue & Billing</span>
                   </router-link>
                    <router-link to="/marketplace" class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                       <ShoppingBag class="w-5 h-5 mr-3 text-slate-400 group-hover:text-orange-400" />
                       <span v-if="!collapsed">Marketplace</span>
                   </router-link>
                   <router-link to="/settings" class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                       <Settings class="w-5 h-5 mr-3 text-slate-400" />
                       <span v-if="!collapsed">Settings</span>
                   </router-link>
               </nav>
           </div>

           <!-- Ecosystem -->
           <div class="px-4">
               <div v-if="!collapsed" class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Ecosystem</div>
               <nav class="space-y-1">
                    <router-link to="/doclife" class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                       <Heart class="w-5 h-5 mr-3 text-slate-400 group-hover:text-pink-400" />
                       <span v-if="!collapsed">DocLife</span>
                   </router-link>
                   <router-link to="/docconnect" class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white">
                       <Globe class="w-5 h-5 mr-3 text-slate-400 group-hover:text-blue-300" />
                       <span v-if="!collapsed">DocConnect</span>
                   </router-link>
               </nav>
           </div>
       </div>

       <!-- User Footer -->
       <div class="h-16 border-t border-slate-800 p-4 flex items-center">
           <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">JS</div>
           <div v-if="!collapsed" class="ml-3">
               <p class="text-sm font-medium">{{ authStore.user?.name || 'Dr. User' }}</p>
               <p class="text-xs text-slate-500">{{ authStore.user?.specialty || 'Clinician' }}</p>
           </div>
       </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-auto flex flex-col">
        <!-- Top Header -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
            <h2 class="text-xl font-bold text-slate-800 capitalize">{{ $route.name?.toString().replace('-', ' ') }}</h2>
            <div class="flex items-center gap-4">
               <button class="p-2 text-slate-400 hover:bg-slate-100 rounded-full relative">
                   <Bell class="w-5 h-5" />
                   <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
               </button>
               <button class="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
                   + Quick Action
               </button>
            </div>
        </header>

        <!-- Page Content -->
        <div class="p-6">
            <router-view></router-view>
        </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { 
    LayoutDashboard, Users, Calendar, Mic, DollarSign, Settings, 
    CheckSquare, Bot, ShoppingBag, Heart, Globe, Bell, Shield, Pill, Wand2
} from 'lucide-vue-next';

const authStore = useAuthStore();
const collapsed = ref(false);

onMounted(() => {
    if (!authStore.user) {
        authStore.fetchUser();
    }
});

</script>
