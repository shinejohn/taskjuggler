<template>
  <div class="flex flex-col h-full bg-slate-900/40 rounded-2xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
      <div class="flex items-center gap-3">
        <div :class="['p-2 rounded-lg', iconBgColor]">
          <component :is="iconComponent" :class="['w-4 h-4', iconColor]" />
        </div>
        <h3 class="text-sm font-bold text-white uppercase tracking-wider">{{ title }}</h3>
        <span class="px-2 py-0.5 rounded-full bg-slate-700/50 border border-slate-600/50 text-[10px] font-bold text-slate-400">
          {{ items.length }}
        </span>
      </div>
      <button
        type="button"
        aria-label="Add item"
        @click="showInlineAdd = !showInlineAdd"
        class="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
      >
        <Plus class="w-4 h-4" />
      </button>
    </div>

    <!-- Items List -->
    <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
      <div v-if="items.length > 0" class="space-y-3">
        <TransitionGroup name="list">
          <div v-for="item in sortedItems" :key="item.id">
            <template v-if="category === 'prescription'">
              <PrescriptionCard
                :item="item"
                @toggle="$emit('toggle-item', $event)"
                @edit="$emit('edit-item', $event)"
                @delete="$emit('delete-item', $event)"
              />
            </template>
            <template v-else-if="category === 'order'">
              <OrderCard
                :item="item"
                @toggle="$emit('toggle-item', $event)"
                @edit="$emit('edit-item', $event)"
                @delete="$emit('delete-item', $event)"
              />
            </template>
            <template v-else-if="category === 'prior_auth'">
              <PriorAuthCard
                :item="item"
              />
            </template>
            <template v-else>
              <DashboardItem
                :title="getItemTitle(item)"
                :subtitle="getItemSubtitle(item)"
                :is-accepted="item.is_accepted"
                :source="item.source"
                :confidence="item.ai_confidence"
                @toggle="$emit('toggle-item', item.id)"
                @edit="$emit('edit-item', item.id)"
                @delete="$emit('delete-item', item.id)"
              />
            </template>
          </div>
        </TransitionGroup>
      </div>

      <!-- Empty State -->
      <div v-else class="h-full flex flex-col items-center justify-center py-12 opacity-40">
        <component :is="iconComponent" class="w-8 h-8 text-slate-500 mb-3" />
        <p class="text-sm font-medium text-slate-500">No {{ title.toLowerCase() }} yet</p>
      </div>
    </div>

    <!-- Inline Add UI -->
    <div v-if="showInlineAdd" class="p-4 bg-slate-800/80 border-t border-slate-700/50">
      <template v-if="category === 'prescription'">
        <AddPrescriptionForm
          @submit="handleFormSubmit"
          @cancel="showInlineAdd = false"
        />
      </template>
      <template v-else>
        <AddGenericItemForm
          :label="title"
          @submit="handleFormSubmit"
          @cancel="showInlineAdd = false"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Plus, 
  MessageCircle, 
  Activity, 
  ClipboardList, 
  Pill, 
  FlaskConical, 
  ShieldCheck, 
  FileText,
  Stethoscope
} from 'lucide-vue-next';
import DashboardItem from '../items/DashboardItem.vue';
import PrescriptionCard from '../items/PrescriptionCard.vue';
import OrderCard from '../items/OrderCard.vue';
import PriorAuthCard from '../items/PriorAuthCard.vue';
import AddPrescriptionForm from '../forms/AddPrescriptionForm.vue';
import AddGenericItemForm from '../forms/AddGenericItemForm.vue';
import type { DashboardItem as ItemType } from '@/stores/scribemd/dashboardStore';

const props = defineProps<{
  title: string;
  category: string;
  items: ItemType[];
  icon: string;
  color?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' | 'slate';
}>();

const emit = defineEmits(['toggle-item', 'edit-item', 'delete-item', 'add-item']);

const showInlineAdd = ref(false);

const sortedItems = computed(() => {
  return [...props.items].sort((a, b) => b.display_order - a.display_order);
});

const iconComponent = computed(() => {
  const icons: Record<string, object> = {
    symptom: MessageCircle,
    finding: Stethoscope,
    assessment: ClipboardList,
    plan: FileText,
    prescription: Pill,
    order: FlaskConical,
    prior_auth: ShieldCheck,
  };
  return icons[props.category] || icons[props.icon] || Activity;
});

const iconColor = computed(() => {
  const colors: Record<string, string> = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    slate: 'text-slate-400',
  };
  return colors[props.color || 'emerald'];
});

const iconBgColor = computed(() => {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-500/10',
    blue: 'bg-blue-500/10',
    purple: 'bg-purple-500/10',
    amber: 'bg-amber-500/10',
    rose: 'bg-rose-500/10',
    slate: 'bg-slate-500/10',
  };
  return colors[props.color || 'emerald'];
});

function getItemTitle(item: ItemType) {
  return (item.item_data.text || item.item_data.description || item.item_data.name || 'Untitled Item') as string;
}

function getItemSubtitle(item: ItemType) {
  return (item.item_data.details || item.item_data.note || '') as string;
}

function handleFormSubmit(data: Record<string, unknown>) {
  emit('add-item', data);
  showInlineAdd.value = false;
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.2);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.list-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
