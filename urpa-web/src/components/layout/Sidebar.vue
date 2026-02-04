<template>
  <aside 
    class="fixed left-0 top-16 bottom-0 w-64 bg-white/80 backdrop-blur-md border-r border-slate-200 shadow-sm z-20 flex flex-col transition-transform duration-300 transform lg:translate-x-0"
    :class="[isOpen ? 'translate-x-0' : '-translate-x-full']"
  >
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <template v-for="item in navItems" :key="item.id">
        <router-link
          :to="item.to || '#'"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="[
            isActive(item.to) 
              ? 'bg-blue-50 text-blue-700' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
          @click="$emit('close')"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" :class="isActive(item.to) ? 'text-blue-600' : 'text-slate-400'" />
          {{ item.label }}
        </router-link>
      </template>

      <!-- Module Section Divider -->
      <div v-if="moduleNavItems.length > 0" class="pt-4 mt-4 border-t border-slate-100">
        <p class="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Apps & Modules
        </p>
        <template v-for="item in moduleNavItems" :key="item.id">
           <router-link
            :to="item.to || '#'"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="[
              isActive(item.to) 
                ? 'bg-purple-50 text-purple-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            ]"
            @click="$emit('close')"
          >
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0" :class="isActive(item.to) ? 'text-purple-600' : 'text-slate-400'" />
            {{ item.label }}
          </router-link>
        </template>
      </div>
    </nav>

    <!-- User Profile / Footer -->
    <div class="p-4 border-t border-slate-200">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
          U
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-900 truncate">Settings</p>
        </div>
        <Settings class="w-4 h-4 text-slate-400" />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUiStore } from '@/stores/ui';
import { Settings } from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
}>();

defineEmits(['close']);

const route = useRoute();
const uiStore = useUiStore();

// Default core items
const navItems = computed(() => uiStore.navItems.filter(i => !['doctor-patients', 'doctor-appointments'].includes(i.id)));
// Separate module items if we want a split view, or just use all
const moduleNavItems = computed(() => uiStore.navItems.filter(i => ['doctor-patients', 'doctor-appointments'].includes(i.id)));


function isActive(path?: string) {
  if (!path) return false;
  return route.path.startsWith(path);
}
</script>
