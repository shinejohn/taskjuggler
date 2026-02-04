<template>
  <div class="relative" ref="menuRef">
    <button
      @click="toggleMenu"
      class="text-white hover:text-gray-300 focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-fast"
      aria-label="Toggle navigation menu"
    >
      <MenuIcon v-if="!isOpen" :size="24" />
      <XIcon v-else :size="24" />
    </button>
    
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-64 glass-prominent rounded-lg shadow-xl border border-border z-50 overflow-hidden"
    >
      <div class="p-2">
        <div
          v-for="(group, groupKey) in groupedMenuItems"
          :key="groupKey"
          class="mb-2 last:mb-0"
        >
          <div v-if="groupKey !== 'main'" class="px-3 py-2 text-caption font-semibold text-text-tertiary uppercase">
            {{ groupKey }}
          </div>
          <router-link
            v-for="item in group"
            :key="item.path"
            :to="item.path"
            @click="isOpen = false"
            class="flex items-center space-x-3 px-3 py-2 rounded-md text-body-medium text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors duration-fast min-h-[44px]"
            active-class="bg-primary/10 text-primary"
          >
            <component :is="item.iconComponent" :size="18" />
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  MenuIcon,
  XIcon,
  HomeIcon,
  PresentationIcon,
  BarChart2Icon,
  TrendingUpIcon,
  BriefcaseIcon,
  DatabaseIcon,
  FileTextIcon,
  NetworkIcon,
  FolderIcon,
  UserIcon,
  LogInIcon,
  UserPlusIcon,
  CalendarIcon,
  BotIcon
} from 'lucide-vue-next';

interface MenuItem {
  path: string;
  label: string;
  iconComponent: any;
  category?: string;
}

const isOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const menuItems: MenuItem[] = [
  {
    path: '/',
    label: 'Video Call',
    iconComponent: HomeIcon,
    category: 'AI Meetings'
  },
  {
    path: '/presentation',
    label: 'Presentation',
    iconComponent: PresentationIcon,
    category: 'Meeting Tools'
  },
  {
    path: '/report',
    label: 'Data Report',
    iconComponent: BarChart2Icon,
    category: 'Meeting Tools'
  },
  {
    path: '/marketing-report',
    label: 'Marketing Report',
    iconComponent: TrendingUpIcon,
    category: 'Meeting Tools'
  },
  {
    path: '/business-profile',
    label: 'Business Profile',
    iconComponent: BriefcaseIcon,
    category: 'Meeting Tools'
  },
  {
    path: '/data-analytics',
    label: 'Data Analytics',
    iconComponent: DatabaseIcon,
    category: 'Meeting Tools'
  },
  {
    path: '/client-proposal',
    label: 'Client Proposal',
    iconComponent: FileTextIcon,
    category: 'Meeting Tools'
  },
  {
    path: '/ai-workflow',
    label: 'AI Workflow',
    iconComponent: NetworkIcon,
    category: 'Meeting Tools'
  },
  {
    path: '/files',
    label: 'My Files',
    iconComponent: FolderIcon,
    category: 'My Account'
  },
  {
    path: '/schedule',
    label: 'Schedule Calls',
    iconComponent: CalendarIcon,
    category: 'My Account'
  },
  {
    path: '/profile',
    label: 'My Profile',
    iconComponent: UserIcon,
    category: 'My Account'
  },
  {
    path: '/login',
    label: 'Login',
    iconComponent: LogInIcon,
    category: 'Authentication'
  },
  {
    path: '/signup',
    label: 'Sign Up',
    iconComponent: UserPlusIcon,
    category: 'Authentication'
  }
];

const groupedMenuItems = computed(() => {
  const grouped: Record<string, MenuItem[]> = {};
  menuItems.forEach(item => {
    const category = item.category || 'main';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(item);
  });
  return grouped;
});

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

