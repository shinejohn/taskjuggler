<template>
  <div class="flex h-screen bg-slate-50 font-sans">
    <!-- Admin Sidebar -->
    <aside class="w-64 bg-slate-900 text-white hidden md:flex flex-col">
      <div class="p-6 border-b border-slate-800 flex items-center gap-3">
        <div class="w-8 h-8 rounded bg-blue-500 flex items-center justify-center font-bold">A</div>
        <span class="font-bold text-lg tracking-tight">Admin Center</span>
      </div>

      <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <router-link 
          to="/admin" 
          active-class="bg-blue-600 text-white"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LayoutDashboard class="w-5 h-5" />
          <span class="font-medium">Dashboard</span>
        </router-link>

        <div class="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          User Management
        </div>

        <router-link 
          to="/admin/users" 
          active-class="bg-blue-600 text-white"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Users class="w-5 h-5" />
          <span class="font-medium">Users</span>
        </router-link>

        <router-link 
          to="/admin/roles" 
          active-class="bg-blue-600 text-white"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Shield class="w-5 h-5" />
          <span class="font-medium">Roles & Permissions</span>
        </router-link>

        <div class="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          System
        </div>

        <router-link 
          to="/admin/audit-log" 
          active-class="bg-blue-600 text-white"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <FileText class="w-5 h-5" />
          <span class="font-medium">Audit Log</span>
        </router-link>
      </nav>

      <div class="p-4 border-t border-slate-800">
        <router-link 
          to="/dashboard" 
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
          <span class="font-medium">Back to Practice</span>
        </router-link>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Header -->
      <header class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 lg:px-8">
        <h1 class="text-xl font-semibold text-slate-800 truncate">
          {{ $route.name === 'admin-dashboard' ? 'Overview' : ($route.meta.title || 'Admin Center') }}
        </h1>
        <div class="flex items-center gap-4">
            <span class="text-sm text-slate-500">
                Logged in as 
                <span class="font-medium text-slate-700">{{ authStore.user?.name }}</span>
            </span>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-6 lg:p-8">
        <div class="max-w-7xl mx-auto">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard, Users, Shield, FileText, ArrowLeft } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
