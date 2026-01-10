<template>
  <div
    :class="[
      'relative backdrop-blur-sm rounded-xl border-2 overflow-hidden shadow-lg',
      currentBgColor,
      currentTextColor,
      currentFontSize,
      cardBorder,
      gridSpan === 2 ? 'md:col-span-2' : gridSpan === 3 ? 'md:col-span-3' : '',
      isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'
    ]"
  >
    <!-- Control Buttons -->
    <div class="absolute top-2 right-2 z-10 flex gap-1">
      <button
        @click="showColorPicker = !showColorPicker"
        :class="['p-2 rounded-lg transition-colors cursor-pointer shadow-md', handleBg, textSecondary]"
        title="Customize appearance"
      >
        <Palette class="h-4 w-4" />
      </button>
      <button
        @click="cycleSize"
        :class="['p-2 rounded-lg transition-colors cursor-pointer shadow-md', handleBg, textSecondary]"
        title="Resize card"
      >
        <Maximize2 class="h-4 w-4" />
      </button>
      <div
        :class="['p-2 rounded-lg cursor-grab active:cursor-grabbing shadow-md', handleBg, textSecondary]"
        title="Drag to reorder"
      >
        <GripVertical class="h-4 w-4" />
      </div>
    </div>

    <!-- Color & Font Size Picker Dropdown -->
    <Transition name="dropdown">
      <div v-if="showColorPicker" class="fixed inset-0 z-20" @click="showColorPicker = false" />
    </Transition>
    <Transition name="dropdown">
      <div
        v-if="showColorPicker"
        :class="['absolute top-14 right-2 z-30 p-4 rounded-lg border-2 shadow-2xl min-w-[220px]', theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-400']"
      >
        <div class="space-y-4">
          <!-- Font Size -->
          <div>
            <label :class="['text-sm font-bold mb-2 block', theme === 'dark' ? 'text-slate-200' : 'text-gray-900']">
              Font Size
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="(size, idx) in FONT_SIZES"
                :key="size.name"
                @click="fontSizeIndex = idx"
                :class="['px-3 py-2 rounded-md border-2 transition-all font-bold', fontSizeIndex === idx ? (theme === 'dark' ? 'border-teal-500 bg-teal-500/20 text-teal-300' : 'border-purple-600 bg-purple-100 text-purple-900') : (theme === 'dark' ? 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500' : 'border-gray-300 bg-gray-100 text-gray-800 hover:border-gray-400')]"
              >
                <span :class="size.class">{{ size.name }}</span>
              </button>
            </div>
          </div>

          <!-- Background Color -->
          <div>
            <label :class="['text-sm font-bold mb-2 block', theme === 'dark' ? 'text-slate-200' : 'text-gray-900']">
              Background Color
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="(color, idx) in BG_COLORS"
                :key="color.name"
                @click="bgColorIndex = idx"
                :class="['h-10 rounded-md border-2 transition-all', theme === 'dark' ? color.dark : color.light, bgColorIndex === idx ? (theme === 'dark' ? 'border-teal-500 ring-2 ring-teal-500/50' : 'border-purple-600 ring-2 ring-purple-500/50') : 'border-gray-400 hover:scale-105']"
                :title="color.name"
              />
            </div>
          </div>

          <!-- Text Color -->
          <div>
            <label :class="['text-sm font-bold mb-2 block', theme === 'dark' ? 'text-slate-200' : 'text-gray-900']">
              Text Color
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="(color, idx) in TEXT_COLORS"
                :key="color.name"
                @click="textColorIndex = idx"
                :class="['h-10 rounded-md border-2 transition-all flex items-center justify-center', theme === 'dark' ? 'bg-slate-900' : 'bg-white', textColorIndex === idx ? (theme === 'dark' ? 'border-teal-500 ring-2 ring-teal-500/50' : 'border-purple-600 ring-2 ring-purple-500/50') : 'border-gray-400 hover:scale-105']"
                :title="color.name"
              >
                <span :class="['text-base font-bold', theme === 'dark' ? color.dark : color.light]">Aa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Card Content -->
    <div class="h-full overflow-y-auto custom-scrollbar">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { GripVertical, Maximize2, Palette } from 'lucide-vue-next';
import { useTheme } from '@/composables/useTheme';

const props = defineProps<{
  id: string;
  index: number;
  gridSpan?: 1 | 2 | 3;
}>();

const emit = defineEmits<{
  resize: [id: string, newSpan: 1 | 2 | 3];
}>();

const { theme } = useTheme();

const isDragging = ref(false);
const showColorPicker = ref(false);
const bgColorIndex = ref(0);
const textColorIndex = ref(0);
const fontSizeIndex = ref(1);

const BG_COLORS = [
  { name: 'Default', light: 'bg-gray-100/95', dark: 'bg-slate-800/30' },
  { name: 'Blue', light: 'bg-blue-100', dark: 'bg-blue-900/30' },
  { name: 'Purple', light: 'bg-purple-100', dark: 'bg-purple-900/30' },
  { name: 'Green', light: 'bg-green-100', dark: 'bg-green-900/30' },
  { name: 'Pink', light: 'bg-pink-100', dark: 'bg-pink-900/30' },
  { name: 'Amber', light: 'bg-amber-100', dark: 'bg-amber-900/30' },
];

const TEXT_COLORS = [
  { name: 'Default', light: 'text-gray-900', dark: 'text-slate-200' },
  { name: 'Blue', light: 'text-blue-900', dark: 'text-blue-200' },
  { name: 'Purple', light: 'text-purple-900', dark: 'text-purple-200' },
  { name: 'Green', light: 'text-green-900', dark: 'text-green-200' },
  { name: 'Pink', light: 'text-pink-900', dark: 'text-pink-200' },
  { name: 'Amber', light: 'text-amber-900', dark: 'text-amber-200' },
];

const FONT_SIZES = [
  { name: 'Small', class: 'text-sm' },
  { name: 'Medium', class: 'text-base' },
  { name: 'Large', class: 'text-lg' },
  { name: 'X-Large', class: 'text-xl' },
];

const currentBgColor = computed(() => theme.value === 'dark' ? BG_COLORS[bgColorIndex.value].dark : BG_COLORS[bgColorIndex.value].light);
const currentTextColor = computed(() => theme.value === 'dark' ? TEXT_COLORS[textColorIndex.value].dark : TEXT_COLORS[textColorIndex.value].light);
const currentFontSize = computed(() => FONT_SIZES[fontSizeIndex.value].class);
const cardBorder = computed(() => theme.value === 'dark' ? 'border-slate-700/50' : 'border-purple-400');
const handleBg = computed(() => theme.value === 'dark' ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-gray-200 hover:bg-gray-300');
const textSecondary = computed(() => theme.value === 'dark' ? 'text-slate-400' : 'text-gray-800');

function cycleSize() {
  const sizes: (1 | 2 | 3)[] = [1, 2, 3];
  const currentIndex = sizes.indexOf(props.gridSpan || 1);
  const nextIndex = (currentIndex + 1) % sizes.length;
  emit('resize', props.id, sizes[nextIndex]);
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

