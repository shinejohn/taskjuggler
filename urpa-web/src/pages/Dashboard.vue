<template>
  <div :class="['min-h-screen w-full font-sans', theme === 'dark' ? 'bg-slate-950 text-slate-200 selection:bg-teal-500/30' : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-900 selection:bg-purple-500/40']">
    <!-- Top Navigation Bar -->
    <header :class="['fixed top-0 left-0 right-0 z-30 h-16 border-b-2 backdrop-blur-md shadow-lg', theme === 'dark' ? 'border-slate-800 bg-slate-950/80' : 'border-purple-400 bg-gray-100/95']">
      <div class="flex h-full items-center justify-between px-3 lg:px-4 max-w-[2000px] mx-auto">
        <!-- Left: Logo -->
        <div class="flex items-center gap-3 min-w-[160px]">
          <button 
            @click="isSidebarOpen = !isSidebarOpen"
            class="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors lg:hidden"
          >
            <Menu class="h-6 w-6" :class="theme === 'dark' ? 'text-white' : 'text-slate-700'" />
          </button>
          <div :class="['flex h-10 w-10 items-center justify-center rounded-lg shadow-lg', theme === 'dark' ? 'bg-gradient-to-br from-teal-500 to-blue-600 shadow-teal-500/20' : 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 shadow-purple-600/50']">
            <Command class="h-6 w-6 text-white" />
          </div>
          <span :class="['text-xl font-bold tracking-tight hidden sm:inline', theme === 'dark' ? 'text-white' : 'text-gray-900']">
            URPa
            <span :class="[theme === 'dark' ? 'text-teal-400' : 'text-purple-700']">.ai</span>
          </span>
        </div>

        <!-- Center: User Name -->
        <div class="flex-1 flex justify-center px-4">
          <div class="text-center">
            <h1 :class="['text-2xl font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900']">
              {{ user?.name || 'Dashboard' }}'s Dashboard
            </h1>
            <p :class="['text-sm font-medium', theme === 'dark' ? 'text-slate-400' : 'text-gray-700']">
              Welcome back!
            </p>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-3 min-w-[160px] justify-end">
          <button
            @click="toggleTheme"
            :class="['p-2 rounded-full transition-colors', theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-purple-200 text-purple-700 hover:text-purple-900']"
          >
            <Sun v-if="theme === 'dark'" class="h-6 w-6" />
            <Moon v-else class="h-6 w-6" />
          </button>
          <button
            @click="router.push('/profile')"
            :class="['p-2 rounded-full transition-colors', theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-purple-200 text-purple-700 hover:text-purple-900']"
          >
            <User class="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>

    <!-- Sidebar Navigation -->
    <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Main Content -->
    <main class="pt-20 pb-6 px-3 lg:px-4 h-screen flex flex-col lg:flex-row gap-4 overflow-hidden max-w-[2000px] mx-auto transition-all duration-300 lg:pl-64">
      <!-- Left Column: Activity Feed -->
      <section class="flex-1 min-h-[400px] lg:h-full">
        <ActivityFeed />
      </section>

      <!-- Right Column: AI Control, Phone, Travel, Goals, AI Tasks -->
      <aside class="w-full lg:w-[420px] xl:w-[460px] min-h-[400px] lg:h-full flex flex-col gap-4 overflow-y-auto">
        <!-- Module Widgets Injection Point -->
        <div v-for="widget in moduleWidgets" :key="widget.id" class="shrink-0">
             <component :is="widget.component" />
        </div>

        <!-- AI Control Card -->
        <div class="shrink-0">
          <AIControlCard />
        </div>

        <!-- Phone Card -->
        <div v-if="widgetVisibility.phone" class="shrink-0">
          <PhoneCard />
        </div>

        <!-- Travel Card -->
        <div v-if="widgetVisibility.travel" class="shrink-0">
          <TravelCard />
        </div>

        <!-- Goals Widget -->
        <div v-if="widgetVisibility.goals" class="shrink-0">
          <GoalsWidget />
        </div>

        <!-- AI Tasks Card -->
        <div v-if="widgetVisibility.aiTasks" class="shrink-0">
          <AITasksCard />
        </div>
      </aside>
    </main>

    <!-- Settings Panel Overlay -->
    <SettingsPanel
      :is-open="isSettingsOpen"
      @close="isSettingsOpen = false"
      :widget-visibility="widgetVisibility"
      :has-phone-service="true"
      @toggle-widget="handleToggleWidget"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Command, Sun, Moon, User, Menu } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';
import { useAuthStore } from '@/stores/auth';
import { getModules } from '@/modules/loader';
import ActivityFeed from '@/components/activities/ActivityFeed.vue';
import AIControlCard from '@/components/ai/AIControlCard.vue';
import PhoneCard from '@/components/phone/PhoneCard.vue';
import TravelCard from '@/components/widgets/TravelCard.vue';
import GoalsWidget from '@/components/widgets/GoalsWidget.vue';
import AITasksCard from '@/components/ai/AITasksCard.vue';
import SettingsPanel from '@/components/settings/SettingsPanel.vue';
import Sidebar from '@/components/layout/Sidebar.vue';

const router = useRouter();
const { theme, toggleTheme } = useTheme();
const authStore = useAuthStore();

const isSettingsOpen = ref(false);
const isSidebarOpen = ref(true); // Default open on desktop
const widgetVisibility = ref({
  travel: true,
  goals: true,
  aiTasks: true,
  files: true,
  phone: true,
});

const user = computed(() => authStore.user);

// Get widgets from loaded modules
const moduleWidgets = computed(() => {
  return getModules().flatMap(m => m.dashboardWidgets || []);
});

function handleToggleWidget(widget: string) {
  widgetVisibility.value = {
    ...widgetVisibility.value,
    [widget]: !widgetVisibility.value[widget as keyof typeof widgetVisibility.value],
  };
}

onMounted(async () => {
  if (!authStore.user && authStore.token) {
    await authStore.fetchUser();
  }
  // If on mobile, close sidebar by default
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false;
  }
});
</script>
