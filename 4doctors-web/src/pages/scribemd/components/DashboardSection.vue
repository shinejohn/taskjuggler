<template>
  <div class="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-emerald-500/20 rounded-lg">
          <component :is="getIcon(icon)" class="w-5 h-5 text-emerald-400" />
        </div>
        <h3 class="font-semibold text-white">{{ title }}</h3>
        <span class="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-full">
          {{ items.length }}
        </span>
      </div>
      <button
        @click="showAddForm = !showAddForm"
        class="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
      >
        <Plus class="w-4 h-4 text-slate-400" />
      </button>
    </div>

    <!-- Add Form -->
    <div v-if="showAddForm" class="px-5 py-3 bg-slate-700/30 border-b border-slate-700/50">
      <div class="flex gap-2">
        <input
          v-model="newItemText"
          @keyup.enter="handleAdd"
          type="text"
          :placeholder="`Add ${title.toLowerCase()}...`"
          class="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
        />
        <button
          @click="handleAdd"
          class="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
        >
          Add
        </button>
      </div>
    </div>

    <!-- Items List -->
    <div class="p-4 space-y-2">
      <TransitionGroup name="list">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
          :class="[
            item.is_accepted
              ? 'bg-slate-700/30 border border-slate-600/50'
              : 'bg-slate-800/50 border border-slate-700/30 opacity-60'
          ]"
        >
          <!-- Toggle Checkbox -->
          <button
            @click="$emit('toggle-item', item.id)"
            class="flex-shrink-0"
          >
            <div
              class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
              :class="[
                item.is_accepted
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-slate-500 hover:border-slate-400'
              ]"
            >
              <Check v-if="item.is_accepted" class="w-3 h-3 text-white" />
            </div>
          </button>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm">{{ getItemDisplay(item) }}</p>
            <div v-if="item.source === 'ai'" class="flex items-center gap-2 mt-1">
              <Sparkles class="w-3 h-3 text-amber-400" />
              <span class="text-xs text-slate-400">
                AI detected ({{ Math.round((item.ai_confidence ?? 0) * 100) }}% confidence)
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1">
            <button
              @click="$emit('delete-item', item.id)"
              class="p-1.5 hover:bg-slate-600/50 rounded-lg transition-colors"
            >
              <Trash2 class="w-4 h-4 text-slate-400 hover:text-red-400" />
            </button>
          </div>
        </div>
      </TransitionGroup>

      <!-- Empty State -->
      <div v-if="items.length === 0" class="py-8 text-center">
        <p class="text-slate-400 text-sm">No {{ title.toLowerCase() }} yet</p>
        <p class="text-slate-500 text-xs mt-1">Start recording or add manually</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Check, Sparkles, Trash2, MessageCircle, Search, ClipboardList, FileText } from 'lucide-vue-next';
import type { DashboardItem } from '@/stores/scribemd/dashboardStore';

const props = defineProps<{
  title: string;
  items: DashboardItem[];
  category: string;
  icon: string;
}>();

const emit = defineEmits<{
  'add-item': [data: Record<string, unknown>];
  'toggle-item': [itemId: string];
  'delete-item': [itemId: string];
}>();

const showAddForm = ref(false);
const newItemText = ref('');

// Get icon component
function getIcon(iconName: string) {
  const icons: Record<string, unknown> = {
    MessageCircle,
    Search,
    ClipboardList,
    FileText,
  };
  return icons[iconName] || MessageCircle;
}

// Get display text from item
function getItemDisplay(item: DashboardItem): string {
  const data = item.item_data;
  if (data.text) return String(data.text);
  if (data.description) return String(data.description);
  if (data.code && data.description) return `${data.code}: ${data.description}`;
  return JSON.stringify(data);
}

// Handle add
function handleAdd() {
  if (!newItemText.value.trim()) return;
  
  emit('add-item', { text: newItemText.value.trim() });
  newItemText.value = '';
  showAddForm.value = false;
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
