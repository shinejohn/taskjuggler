<template>
  <!-- Backdrop -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/20 z-40 transition-opacity"
    @click="$emit('close')"
  />

  <!-- Sidebar -->
  <div
    :class="[
      'fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto',
      isOpen ? 'translate-x-0' : 'translate-x-full'
    ]"
  >
    <!-- Header -->
    <div class="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-start z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-blue-50 text-[#1B4F72] flex items-center justify-center text-xl font-bold">
          {{ contact?.first_name?.charAt(0) || '?' }}
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-900">
            {{ contact?.first_name }} {{ contact?.last_name || '' }}
          </h2>
          <p class="text-sm text-slate-500">
            Added {{ formatDate(contact?.created_at) }}
          </p>
        </div>
      </div>
      <button
        @click="$emit('close')"
        class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
      >
        <X :size="20" />
      </button>
    </div>

    <div v-if="contact" class="p-6 space-y-8">
      <!-- Contact Details -->
      <section class="space-y-4">
        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div class="flex items-center gap-3">
            <Phone :size="18" class="text-slate-400" />
            <span class="font-mono text-sm font-medium text-slate-700">
              {{ contact.phone || 'N/A' }}
            </span>
          </div>
          <button
            @click="contact.phone ? copyToClipboard(contact.phone) : undefined"
            class="text-slate-400 hover:text-[#1B4F72]"
          >
            <Copy :size="14" />
          </button>
        </div>
        <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div class="flex items-center gap-3">
            <Mail :size="18" class="text-slate-400" />
            <span class="text-sm font-medium text-slate-700">
              {{ contact.email || 'N/A' }}
            </span>
          </div>
          <button
            @click="contact.email ? copyToClipboard(contact.email) : undefined"
            class="text-slate-400 hover:text-[#1B4F72]"
          >
            <Copy :size="14" />
          </button>
        </div>
      </section>

      <!-- Tags -->
      <section>
        <h3 class="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Tag :size="16" class="text-slate-400" />
          Tags
        </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in (contact.tags || [])"
            :key="tag"
            class="px-2.5 py-1 rounded-full bg-blue-50 text-[#1B4F72] text-xs font-medium border border-blue-100"
          >
            {{ tag }}
          </span>
          <button
            @click="showAddTag = true"
            class="px-2.5 py-1 rounded-full border border-dashed border-slate-300 text-slate-500 text-xs font-medium hover:border-[#1B4F72] hover:text-[#1B4F72] flex items-center gap-1 transition-colors"
          >
            <Plus :size="12" />
            Add
          </button>
        </div>
      </section>

      <!-- Interaction Timeline -->
      <section>
        <h3 class="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar :size="16" class="text-slate-400" />
          Interaction Timeline
        </h3>
        <div class="space-y-4 relative pl-2">
          <div class="absolute left-[5px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

          <div
            v-for="(interaction, i) in interactions"
            :key="i"
            class="relative pl-6"
          >
            <div
              :class="[
                'absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-white',
                getInteractionColor(interaction.type)
              ]"
            />
            <div class="text-xs font-bold text-slate-400 mb-1">
              {{ interaction.date }}
            </div>
            <div class="font-medium text-slate-900">{{ interaction.desc }}</div>
            <div class="text-xs text-slate-500">by {{ interaction.by }}</div>
          </div>

          <div v-if="interactions.length === 0" class="text-sm text-slate-500 pl-6">
            No interactions yet
          </div>
        </div>
      </section>

      <!-- Notes -->
      <section>
        <h3 class="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <MessageSquareQuote :size="16" class="text-slate-400" />
          Notes
        </h3>
        <textarea
          v-model="note"
          class="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] min-h-[100px]"
          placeholder="Add a note about this contact..."
        />
        <button
          @click="saveNote"
          class="mt-2 px-4 py-2 bg-[#1B4F72] text-white rounded-lg hover:bg-[#153e5a] transition-colors flex items-center gap-2"
        >
          <Save :size="16" />
          Save Note
        </button>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  X,
  Phone,
  Mail,
  Copy,
  Tag,
  Plus,
  Calendar,
  MessageSquareQuote,
  Save,
} from 'lucide-vue-next';
import type { Contact } from '@/api/contacts';

interface Props {
  contact: Contact | null;
  isOpen: boolean;
}

const props = defineProps<Props>();
defineEmits<{
  close: [];
}>();

const note = ref('');
const showAddTag = ref(false);

const interactions = ref([
  {
    type: 'call',
    date: 'Today, 10:42 AM',
    desc: 'Appointment Booked',
    by: 'Sally',
  },
  {
    type: 'appointment',
    date: 'Yesterday, 2:15 PM',
    desc: 'Service Call Completed',
    by: 'Ed',
  },
]);

watch(() => props.contact, (newContact) => {
  if (newContact) {
    note.value = newContact.notes || '';
  }
});

function formatDate(date?: string): string {
  if (!date) return 'Recently';
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getInteractionColor(type: string): string {
  const colors: Record<string, string> = {
    call: 'bg-blue-500',
    appointment: 'bg-green-500',
    message: 'bg-purple-500',
    note: 'bg-amber-500',
  };
  return colors[type] || 'bg-slate-400';
}

function copyToClipboard(text: string) {
  if (text && text !== 'N/A') {
    navigator.clipboard.writeText(text);
    // Would show toast notification
  }
}

function saveNote() {
  // TODO: Implement API call to save note
  // await contactsApi.saveNote(contact.value.id, note.value);
}
</script>

