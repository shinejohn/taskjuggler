<template>
  <div class="mode-toggle-container">
    <button 
      class="mode-toggle-button"
      :class="[`mode-${currentMode}`, { 'compact': compact }]"
      @click="showDropdown = !showDropdown"
      :title="compact ? getModeLabel(currentMode) : ''"
    >
      <span class="mode-icon">{{ getModeIcon(currentMode) }}</span>
      <span v-if="!compact" class="mode-label">{{ getModeLabel(currentMode) }}</span>
      <ChevronDown v-if="!compact" class="chevron" :class="{ 'rotate-180': showDropdown }" />
    </button>
    
    <!-- Dropdown Menu -->
    <Transition name="dropdown">
      <div v-if="showDropdown" class="mode-dropdown" :class="{ 'dropdown-left': compact }" @click.stop>
        <button
          v-for="mode in modes"
          :key="mode.value"
          class="mode-option"
          :class="{ active: currentMode === mode.value }"
          @click="selectMode(mode.value)"
        >
          <span class="mode-icon">{{ mode.icon }}</span>
          <div class="mode-info">
            <span class="mode-name">{{ mode.label }}</span>
            <span class="mode-description">{{ mode.description }}</span>
          </div>
          <Check v-if="currentMode === mode.value" class="check-icon" />
        </button>
        
        <div class="mode-divider"></div>
        
        <button class="mode-option settings" @click="openModeSettings">
          <Settings class="settings-icon" />
          <span>Mode Settings</span>
        </button>
      </div>
    </Transition>
    
    <!-- Backdrop for closing dropdown -->
    <div v-if="showDropdown" class="dropdown-backdrop" @click="showDropdown = false"></div>
    
    <!-- Mode Switch Confirmation Modal -->
    <ModeSwitchModal
      :is-open="showConfirmModal"
      :target-mode="pendingMode"
      :current-mode="currentMode"
      @confirm="confirmModeSwitch"
      @cancel="cancelModeSwitch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronDown, Check, Settings } from 'lucide-vue-next';
import { useMode } from '@/composables/useMode';
import ModeSwitchModal from './ModeSwitchModal.vue';
import type { URPAMode } from '@/types/mode';

const props = defineProps({
  compact: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();
const { currentMode, setMode, getModeIcon, getModeLabel, modes } = useMode();

const showDropdown = ref(false);
const showConfirmModal = ref(false);
const pendingMode = ref<URPAMode>('all');

const selectMode = (mode: URPAMode) => {
  // If selecting current mode, just close dropdown
  if (mode === currentMode.value) {
    showDropdown.value = false;
    return;
  }
  // Show confirmation modal
  pendingMode.value = mode;
  showDropdown.value = false;
  showConfirmModal.value = true;
};

const confirmModeSwitch = async () => {
  await setMode(pendingMode.value);
  showConfirmModal.value = false;
};

const cancelModeSwitch = () => {
  showConfirmModal.value = false;
};

const openModeSettings = () => {
  showDropdown.value = false;
  router.push('/settings?tab=mode');
};
</script>

<style scoped>
.mode-toggle-container {
  position: relative;
  width: 100%;
}

.mode-toggle-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: space-between;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.mode-toggle-button.compact {
  padding: 8px;
  justify-content: center;
  width: auto;
  aspect-ratio: 1;
  margin: 0 auto;
}

.mode-toggle-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.mode-toggle-button.mode-practice {
  background: linear-gradient(135deg, #7c3aed, #5b21b6);
  color: white;
}

.mode-toggle-button.mode-business {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
}

.mode-toggle-button.mode-personal {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.mode-toggle-button.mode-all {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
}

.chevron {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
  margin-left: auto;
}

.chevron.rotate-180 {
  transform: rotate(180deg);
}

.mode-icon {
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mode-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mode-dropdown {
  position: absolute;
  top: 100%;
  left: 0; 
  /* Default to left align for sidebar use */
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  min-width: 260px;
  padding: 8px;
  z-index: 100;
  border: 1px solid #e2e8f0;
}

.mode-dropdown.dropdown-left {
  left: 0; /* Align with left edge */
}

/* Adjust dropdown if it's too close to bottom - relying on Vue portal would be better but simple CSS for now */

.mode-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
  color: #1e293b;
}

.mode-option:hover {
  background: #f1f5f9;
}

.mode-option.active {
  background: #f0f9ff;
}

.mode-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mode-name {
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
}

.mode-description {
  font-size: 12px;
  color: #64748b;
}

.check-icon {
  width: 18px;
  height: 18px;
  color: #0ea5e9;
}

.mode-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}

.mode-option.settings {
  color: #64748b;
}

.mode-option.settings:hover {
  color: #1e293b;
}

.settings-icon {
  width: 18px;
  height: 18px;
}

.dropdown-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99;
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
