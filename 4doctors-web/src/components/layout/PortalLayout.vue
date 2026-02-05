<template>
  <div class="min-h-screen bg-slate-50 font-sans">
    <header class="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div class="h-8 w-8 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold">
            P
          </div>
          <span class="text-lg font-bold text-slate-900">Patient<span class="text-teal-500">Portal</span></span>
        </div>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-6">
          <router-link to="/portal/dashboard" class="text-sm font-medium text-slate-600 hover:text-teal-600 active:text-teal-700">Dashboard</router-link>
          <router-link to="/portal/appointments" class="text-sm font-medium text-slate-600 hover:text-teal-600">Appointments</router-link>
          <router-link to="/portal/labs" class="text-sm font-medium text-slate-600 hover:text-teal-600">Lab Results</router-link>
          <router-link to="/portal/prior-auth" class="text-sm font-medium text-slate-600 hover:text-teal-600">Prior Auth</router-link>
          <router-link to="/portal/messages" class="text-sm font-medium text-slate-600 hover:text-teal-600">Messages</router-link>
        </nav>

        <!-- User Profile/Menu -->
        <div class="flex items-center gap-4">
          <button class="p-2 text-slate-400 hover:bg-slate-100 rounded-full relative">
            <Bell class="w-5 h-5" />
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <router-link 
            to="/portal/profile" 
            class="flex items-center gap-2 px-2 py-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <div class="h-8 w-8 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm">
              JD
            </div>
            <div class="hidden lg:block text-left">
              <p class="text-sm font-medium text-slate-700">John Doe</p>
              <p class="text-xs text-slate-400">View Profile</p>
            </div>
          </router-link>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <router-view></router-view>
    </main>

    <!-- Mobile Bottom Nav -->
    <div class="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 pb-safe flex justify-around py-3 z-30">
        <router-link to="/portal/dashboard" class="flex flex-col items-center gap-1 text-slate-400 px-4 active:text-teal-600">
            <Home class="w-5 h-5" />
            <span class="text-[10px] font-medium">Home</span>
        </router-link>
        <router-link to="/portal/appointments" class="flex flex-col items-center gap-1 text-slate-400 px-4">
            <Calendar class="w-5 h-5" />
            <span class="text-[10px] font-medium">Appts</span>
        </router-link>
        <router-link to="/portal/chat" class="flex flex-col items-center gap-1 text-slate-400 px-4">
            <MessageCircle class="w-5 h-5" />
            <span class="text-[10px] font-medium">Chat</span>
        </router-link>
        <router-link to="/portal/forms" class="flex flex-col items-center gap-1 text-slate-400 px-4">
            <FileText class="w-5 h-5" />
            <span class="text-[10px] font-medium">Forms</span>
        </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bell, Home, Calendar, MessageCircle, FileText } from 'lucide-vue-next';
</script>

<style scoped>
/* Safe area padding for newer iPhones */
.pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 20px);
}
.router-link-active {
    color: #14b8a6; /* teal-500 */
}
.router-link-active svg {
    stroke: #14b8a6;
}
</style>
