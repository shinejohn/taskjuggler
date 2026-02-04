<template>
  <div class="h-full flex flex-col">
    <div class="p-3 glass-subtle border-b border-border font-medium text-title-medium text-text-primary flex justify-between items-center">
      <span>Meeting Notes</span>
      <button
        v-if="onAddCategory"
        @click="isAddingCategory = true"
        class="text-primary hover:text-primary-hover text-label font-medium flex items-center transition-colors duration-fast"
        aria-label="Add category"
      >
        <PlusIcon :size="16" class="mr-1" /> Add Category
      </button>
    </div>

    <div v-if="isAddingCategory" class="p-3 bg-primary-light border-b border-border flex items-center gap-2">
      <Input
        v-model="newCategory"
        type="text"
        class="flex-1"
        placeholder="New category name"
        @keypress.enter="handleAddCategory"
      />
      <Button
        @click="handleAddCategory"
        aria-label="Add category"
        class="min-h-[44px]"
      >
        Add
      </Button>
      <Button
        variant="ghost"
        size="icon"
        @click="cancelAddCategory"
        aria-label="Cancel"
        class="min-h-[44px] min-w-[44px]"
      >
        <XIcon :size="16" />
      </Button>
    </div>

    <div class="flex-1 overflow-y-auto p-6 space-y-6">
      <div v-if="notes.length === 0" class="text-center py-8 text-text-secondary">
        <p class="text-body-medium">No notes yet. Add a category to get started.</p>
      </div>
      <div v-else>
        <div
          v-for="(note, index) in notes"
          :key="index"
          class="glass-standard rounded-lg overflow-hidden shadow-1"
        >
          <div class="bg-bg-secondary p-3 font-medium text-title-medium text-text-primary border-b border-border">
            {{ note.category }}
          </div>
          <ul class="p-3 space-y-2">
            <li
              v-for="(item, itemIndex) in note.items"
              :key="itemIndex"
              class="flex items-start"
            >
              <span class="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></span>
              <span class="text-body-medium text-text-primary flex-1">{{ item.text }}</span>
              <span v-if="item.timestamp" class="text-caption text-text-secondary ml-2">{{ item.timestamp }}</span>
            </li>
          </ul>
          <div v-if="onAddNote" class="p-3 border-t border-border">
            <div class="flex items-center gap-2">
              <Input
                v-model="newItemText[note.category]"
                type="text"
                class="flex-1"
                placeholder="Add a note..."
                @keypress.enter="handleAddItem(note.category)"
              />
              <Button
                @click="handleAddItem(note.category)"
                aria-label="Add note"
                class="min-h-[44px]"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PlusIcon, XIcon } from 'lucide-vue-next';
import { Input, Button } from '@/components/ui';

interface NoteItem {
  text: string;
  timestamp?: string;
}

interface NoteCategory {
  category: string;
  items: NoteItem[];
}

interface Props {
  notes: NoteCategory[];
  onAddNote?: (category: string, text: string) => void;
  onAddCategory?: (categoryName: string) => void;
}

const props = defineProps<Props>();

const newCategory = ref('');
const isAddingCategory = ref(false);
const newItemText = ref<{ [key: string]: string }>({});

const handleAddCategory = () => {
  if (newCategory.value.trim() && props.onAddCategory) {
    props.onAddCategory(newCategory.value.trim());
    newCategory.value = '';
    isAddingCategory.value = false;
  }
};

const cancelAddCategory = () => {
  isAddingCategory.value = false;
  newCategory.value = '';
};

const handleAddItem = (category: string) => {
  const text = newItemText.value[category]?.trim();
  if (text && props.onAddNote) {
    props.onAddNote(category, text);
    newItemText.value = { ...newItemText.value, [category]: '' };
  }
};
</script>

