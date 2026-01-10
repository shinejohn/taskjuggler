<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        @click="$emit('close')"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />
    </Transition>

    <!-- Panel -->
    <Transition name="slide-right">
      <div
        v-if="isOpen"
        :class="['fixed right-0 top-0 bottom-0 w-full max-w-md shadow-2xl z-50 flex flex-col', panelBg, panelBorder]"
      >
        <div :class="['flex items-center justify-between p-6 border-b-2', panelBorder]">
          <h2 :class="['text-xl font-semibold', textPrimary]">Settings</h2>
          <button
            @click="$emit('close')"
            :class="['p-2 rounded-full transition-colors', hoverBg, textSecondary]"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <!-- Card Creator Section -->
          <section>
            <div class="flex items-center justify-between mb-4">
              <h3 :class="['text-xs font-semibold uppercase tracking-wider', textTertiary]">
                Dashboard Cards
              </h3>
              <button
                @click="showCardCreator = !showCardCreator"
                :class="['flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all', showCardCreator ? theme === 'dark' ? 'bg-teal-600 text-white' : 'bg-purple-600 text-white' : theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
              >
                <Plus class="h-4 w-4" />
                {{ showCardCreator ? 'Close' : 'Add Card' }}
              </button>
            </div>

            <Transition name="expand">
              <div v-if="showCardCreator" class="overflow-hidden">
                <div :class="['p-4 rounded-xl border-2 space-y-4', sectionBg]">
                  <!-- Category Filter -->
                  <div class="flex gap-2">
                    <button
                      v-for="cat in ['all', 'widget', 'api', 'report']"
                      :key="cat"
                      @click="selectedCategory = cat"
                      :class="['px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', selectedCategory === cat ? theme === 'dark' ? 'bg-teal-600 text-white' : 'bg-purple-600 text-white' : theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300']"
                    >
                      {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
                    </button>
                  </div>

                  <!-- Template Grid -->
                  <div class="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                    <button
                      v-for="template in filteredTemplates"
                      :key="template.id"
                      @click="handleCreateCard(template)"
                      :disabled="selectedTemplate?.id === template.id"
                      :class="['w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left', selectedTemplate?.id === template.id ? theme === 'dark' ? 'bg-green-500/20 border-green-500' : 'bg-green-100 border-green-500' : theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-300 hover:border-gray-400']"
                    >
                      <div :class="['p-2 rounded-lg bg-gradient-to-br', template.color]">
                        <component :is="template.icon" class="h-5 w-5 text-white" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p :class="['text-sm font-bold truncate', textPrimary]">
                          {{ template.name }}
                        </p>
                        <p :class="['text-xs truncate', textSecondary]">
                          {{ template.description }}
                        </p>
                      </div>
                      <Check v-if="selectedTemplate?.id === template.id" class="h-4 w-4 text-green-500" />
                      <ChevronRight v-else :class="['h-4 w-4', textSecondary]" />
                    </button>
                  </div>

                  <p :class="['text-xs text-center pt-2', textSecondary]">
                    Click any template to add it to your dashboard
                  </p>
                </div>
              </div>
            </Transition>
          </section>

          <!-- Widget Visibility Section -->
          <section>
            <h3 :class="['text-xs font-semibold uppercase tracking-wider mb-4', textTertiary]">
              Sidebar Widgets
            </h3>
            <div class="space-y-3">
              <!-- Phone Assistant -->
              <div
                :class="['p-3 rounded-lg border-2', hasPhoneService ? panelBorder : 'border-amber-500/50', hasPhoneService ? '' : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10']"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <Phone
                      :class="['h-4 w-4', hasPhoneService ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600' : 'text-amber-500']"
                    />
                    <span :class="['text-sm font-semibold', textPrimary]">
                      Phone Assistant
                    </span>
                    <div
                      v-if="!hasPhoneService"
                      class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold"
                    >
                      <Lock class="h-3 w-3" />
                      Add-on
                    </div>
                  </div>
                  <button
                    v-if="hasPhoneService"
                    @click="$emit('toggleWidget', 'phone')"
                    :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', widgetVisibility.phone ? theme === 'dark' ? 'bg-teal-500' : 'bg-purple-500' : theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300']"
                  >
                    <span
                      :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', widgetVisibility.phone ? 'translate-x-6' : 'translate-x-1']"
                    />
                  </button>
                  <button
                    v-else
                    @click="$emit('upgradePhone')"
                    class="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold"
                  >
                    <CreditCard class="h-3 w-3" />
                    Upgrade
                  </button>
                </div>
                <p v-if="!hasPhoneService" :class="['text-xs ml-6', textSecondary]">
                  AI-powered phone calls, voicemail, and call management
                </p>
              </div>

              <div class="flex items-center justify-between">
                <span :class="['text-sm font-semibold', textPrimary]">Travel Widget</span>
                <button
                  @click="$emit('toggleWidget', 'travel')"
                  :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', widgetVisibility.travel ? theme === 'dark' ? 'bg-teal-500' : 'bg-purple-500' : theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300']"
                >
                  <span
                    :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', widgetVisibility.travel ? 'translate-x-6' : 'translate-x-1']"
                  />
                </button>
              </div>

              <div class="flex items-center justify-between">
                <span :class="['text-sm font-semibold', textPrimary]">Goals Widget</span>
                <button
                  @click="$emit('toggleWidget', 'goals')"
                  :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', widgetVisibility.goals ? theme === 'dark' ? 'bg-teal-500' : 'bg-purple-500' : theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300']"
                >
                  <span
                    :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', widgetVisibility.goals ? 'translate-x-6' : 'translate-x-1']"
                  />
                </button>
              </div>

              <div class="flex items-center justify-between">
                <span :class="['text-sm font-semibold', textPrimary]">AI Tasks Widget</span>
                <button
                  @click="$emit('toggleWidget', 'aiTasks')"
                  :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', widgetVisibility.aiTasks ? theme === 'dark' ? 'bg-teal-500' : 'bg-purple-500' : theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300']"
                >
                  <span
                    :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', widgetVisibility.aiTasks ? 'translate-x-6' : 'translate-x-1']"
                  />
                </button>
              </div>

              <div class="flex items-center justify-between">
                <span :class="['text-sm font-semibold', textPrimary]">Files Widget</span>
                <button
                  @click="$emit('toggleWidget', 'files')"
                  :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', widgetVisibility.files ? theme === 'dark' ? 'bg-teal-500' : 'bg-purple-500' : theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300']"
                >
                  <span
                    :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', widgetVisibility.files ? 'translate-x-6' : 'translate-x-1']"
                  />
                </button>
              </div>
            </div>
          </section>

          <!-- Preferences Section -->
          <section>
            <h3 :class="['text-xs font-semibold uppercase tracking-wider mb-4', textTertiary]">
              Preferences
            </h3>
            <div class="space-y-4">
              <div :class="['flex items-center justify-between p-4 rounded-xl border-2', sectionBg]">
                <div class="flex items-center gap-3">
                  <div
                    :class="['p-2 rounded-lg', theme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600']"
                  >
                    <Bell class="h-5 w-5" />
                  </div>
                  <div>
                    <p :class="['text-sm font-medium', textPrimary]">Notifications</p>
                    <p :class="['text-xs', textSecondary]">Manage alerts and sounds</p>
                  </div>
                </div>
                <div :class="['relative inline-flex h-6 w-11 items-center rounded-full', theme === 'dark' ? 'bg-teal-500' : 'bg-purple-500']">
                  <span class="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                </div>
              </div>

              <div :class="['flex items-center justify-between p-4 rounded-xl border-2', sectionBg]">
                <div class="flex items-center gap-3">
                  <div
                    :class="['p-2 rounded-lg', theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-600']"
                  >
                    <Moon class="h-5 w-5" />
                  </div>
                  <div>
                    <p :class="['text-sm font-medium', textPrimary]">Dark Mode</p>
                    <p :class="['text-xs', textSecondary]">Adjust appearance</p>
                  </div>
                </div>
                <div :class="['relative inline-flex h-6 w-11 items-center rounded-full', theme === 'dark' ? 'bg-teal-500' : 'bg-purple-500']">
                  <span class="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                </div>
              </div>
            </div>
          </section>

          <!-- Account Section -->
          <section>
            <h3 :class="['text-xs font-semibold uppercase tracking-wider mb-4', textTertiary]">
              Account
            </h3>
            <div class="space-y-2">
              <button
                :class="['w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left', hoverBg, textSecondary]"
              >
                <Shield class="h-4 w-4" />
                <span class="text-sm">Privacy & Security</span>
              </button>
              <button
                :class="['w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left', hoverBg, textSecondary]"
              >
                <Globe class="h-4 w-4" />
                <span class="text-sm">Language & Region</span>
              </button>
              <button
                :class="['w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left', hoverBg, textSecondary]"
              >
                <Smartphone class="h-4 w-4" />
                <span class="text-sm">Connected Devices</span>
              </button>
              <button
                :class="['w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left', hoverBg, textSecondary]"
              >
                <HelpCircle class="h-4 w-4" />
                <span class="text-sm">Help & Support</span>
              </button>
            </div>
          </section>
        </div>

        <div :class="['p-6 border-t-2', panelBorder]">
          <p :class="['text-xs text-center', textTertiary]">Version 2.4.0 • Build 8921</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  X,
  Plus,
  Phone,
  Lock,
  CreditCard,
  Shield,
  Globe,
  Smartphone,
  HelpCircle,
  Bell,
  Moon,
  ChevronRight,
  Check,
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Activity,
  Code,
  Database,
} from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';

interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'widget' | 'api' | 'report';
  color: string;
}

const WIDGET_TEMPLATES: WidgetTemplate[] = [
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Real-time analytics and metrics',
    icon: BarChart3,
    category: 'widget',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'revenue',
    name: 'Revenue Tracker',
    description: 'Track revenue and sales data',
    icon: DollarSign,
    category: 'widget',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'performance',
    name: 'Performance Metrics',
    description: 'Monitor system performance',
    icon: TrendingUp,
    category: 'report',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'users',
    name: 'User Activity',
    description: 'Track user engagement',
    icon: Users,
    category: 'widget',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'inventory',
    name: 'Inventory Status',
    description: 'Monitor stock levels',
    icon: Package,
    category: 'widget',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'api-status',
    name: 'API Health Monitor',
    description: 'Track API uptime and status',
    icon: Activity,
    category: 'api',
    color: 'from-teal-500 to-green-500',
  },
  {
    id: 'custom-api',
    name: 'Custom API Integration',
    description: 'Connect your own API endpoint',
    icon: Code,
    category: 'api',
    color: 'from-slate-500 to-slate-600',
  },
  {
    id: 'database',
    name: 'Database Queries',
    description: 'Run custom database reports',
    icon: Database,
    category: 'report',
    color: 'from-red-500 to-rose-500',
  },
];

interface Props {
  isOpen: boolean;
  widgetVisibility: {
    travel: boolean;
    goals: boolean;
    aiTasks: boolean;
    files: boolean;
    phone: boolean;
  };
  hasPhoneService: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  toggleWidget: [widget: 'travel' | 'goals' | 'aiTasks' | 'files' | 'phone'];
  upgradePhone: [];
}>();

const { theme } = useTheme();
const showCardCreator = ref(false);
const selectedCategory = ref<'all' | 'widget' | 'api' | 'report'>('all');
const selectedTemplate = ref<WidgetTemplate | null>(null);

const filteredTemplates = computed(() =>
  selectedCategory.value === 'all'
    ? WIDGET_TEMPLATES
    : WIDGET_TEMPLATES.filter(t => t.category === selectedCategory.value)
);

async function handleCreateCard(template: WidgetTemplate) {
  selectedTemplate.value = template;
  try {
    // TODO: Save card configuration to backend
    // For now, just show success feedback
    setTimeout(() => {
      selectedTemplate.value = null;
      showCardCreator.value = false;
    }, 1500);
  } catch (error) {
    // Handle error silently
  }
}

const panelBg = computed(() => (theme.value === 'dark' ? 'bg-slate-900' : 'bg-white'));
const panelBorder = computed(() => (theme.value === 'dark' ? 'border-slate-700' : 'border-gray-300'));
const sectionBg = computed(() =>
  theme.value === 'dark' ? 'bg-slate-800/50 border-slate-700/50' : 'bg-gray-100 border-gray-300'
);
const textPrimary = computed(() => (theme.value === 'dark' ? 'text-white' : 'text-gray-900'));
const textSecondary = computed(() => (theme.value === 'dark' ? 'text-slate-400' : 'text-gray-600'));
const textTertiary = computed(() => (theme.value === 'dark' ? 'text-slate-500' : 'text-gray-500'));
const hoverBg = computed(() => (theme.value === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-200'));
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from {
  transform: translateX(100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  height: 0;
  opacity: 0;
}
</style>

