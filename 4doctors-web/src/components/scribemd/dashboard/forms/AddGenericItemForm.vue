<template>
  <div class="bg-slate-800/80 rounded-2xl border border-slate-700/50 p-4 animate-in slide-in-from-top-2 duration-200">
    <div class="flex gap-2">
      <input
        v-model="text"
        @keyup.enter="handleSubmit"
        :placeholder="`Enter ${label.toLowerCase()}...`"
        class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        ref="inputRef"
      />
      <button
        type="button"
        aria-label="Add item"
        @click="handleSubmit"
        class="bg-emerald-500 hover:bg-emerald-600 p-2 rounded-xl text-white transition-colors"
      >
        <Plus class="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Cancel"
        @click="$emit('cancel')"
        class="p-2 hover:bg-slate-700 rounded-xl text-slate-400 transition-colors"
      >
        <X class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus, X } from 'lucide-vue-next';

defineProps<{
  label: string;
}>();

const emit = defineEmits(['submit', 'cancel']);
const text = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  inputRef.value?.focus();
});

function handleSubmit() {
  if (!text.value.trim()) return;
  emit('submit', { text: text.value.trim() });
  text.value = '';
}
</script>
