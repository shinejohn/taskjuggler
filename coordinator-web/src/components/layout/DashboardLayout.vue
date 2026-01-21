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
                <button 
                  @click="toggleDropdown" 
                  class="flex items-center gap-2 focus:outline-none"
                >
                  <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300 overflow-hidden">
                    <User :size="20" class="text-slate-500" />
                  </div>
                </button>
                
                <!-- Dropdown Menu -->
                <div 
                  v-if="isDropdownOpen"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                >
                  <router-link 
                    to="/profile" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="isDropdownOpen = false"
                  >
                    Your Profile
                  </router-link>
                  <router-link 
                    to="/settings" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="isDropdownOpen = false"
                  >
                    Settings
                  </router-link>
                  <button 
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
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
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
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
const router = useRouter();
const authStore = useAuthStore();
const isDropdownOpen = ref(false);

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  // { name: '4 Calls', path: '/coordinators', icon: Users },
  { name: 'Appointments', path: '/appointments', icon: Calendar },
  { name: 'Contacts', path: '/contacts', icon: Contact },
  { name: 'Calls', path: '/calls', icon: Phone },
  { name: 'Campaigns', path: '/campaigns', icon: Megaphone },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  // { name: 'Billing', path: '/billing', icon: CreditCard },
];

function isActive(path: string): boolean {
  return route.path === path;
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

async function handleLogout() {
  await authStore.logout();
  router.push('/login');
}
</script>

