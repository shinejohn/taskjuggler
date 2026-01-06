<template>
  <div class="min-h-screen bg-slate-50 font-sans">
    <!-- Top Navigation Bar -->
    <header class="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Nav -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/dashboard" class="text-2xl font-heading font-bold text-[#1B4F72] flex items-center gap-2">
                <div class="w-8 h-8 bg-[#1B4F72] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  4C
                </div>
                4calls.ai
              </router-link>
            </div>
            <nav class="hidden md:ml-8 md:flex md:space-x-1 h-full">
              <router-link
                v-for="item in navItems"
                :key="item.name"
                :to="item.path"
                :class="[
                  'inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium h-full transition-colors',
                  isActive(item.path) ? 'border-[#1B4F72] text-[#1B4F72] bg-blue-50/30' : 'border-transparent text-slate-500 hover:text-[#1B4F72] hover:border-slate-300'
                ]"
              >
                <component :is="item.icon" :size="16" class="mr-2" />
                {{ item.name }}
              </router-link>
            </nav>
          </div>

          <!-- Right Side Actions -->
          <div class="flex items-center gap-4">
            <button class="p-2 text-slate-400 hover:text-[#1B4F72] transition-colors relative">
              <Bell :size="20" />
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            <div class="relative group">
              <button class="flex items-center gap-2 focus:outline-none">
                <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 overflow-hidden">
                  <User :size="20" class="text-slate-500" />
                </div>
              </button>
              <!-- Dropdown would go here -->
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import {
  LayoutDashboard,
  Users,
  Contact,
  Calendar,
  Phone,
  Megaphone,
  BarChart3,
  Bell,
  User,
  CreditCard,
} from 'lucide-vue-next';

const route = useRoute();

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Coordinators', path: '/coordinators', icon: Users },
  { name: 'Contacts', path: '/contacts', icon: Contact },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Calls', path: '/calls', icon: Phone },
  { name: 'Campaigns', path: '/campaigns', icon: Megaphone },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Billing', path: '/billing', icon: CreditCard },
];

function isActive(path: string): boolean {
  return route.path === path;
}
</script>

