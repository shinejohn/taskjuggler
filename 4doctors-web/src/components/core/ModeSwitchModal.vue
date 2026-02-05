<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="cancel">
        <div class="modal-content">
          <div class="modal-header" :class="targetModeClass">
            <div class="mode-icon">{{ getModeIcon(targetMode) }}</div>
            <h2 class="modal-title">Switch to {{ getModeLabel(targetMode) }}?</h2>
          </div>
          
          <div class="modal-body">
            <p class="modal-description">
              {{ getModeDescription(targetMode) }}
            </p>
            
            <div v-if="targetMode === 'practice'" class="hipaa-warning">
              <Shield class="warning-icon" />
              <div class="warning-content">
                <strong>HIPAA Mode Enabled</strong>
                <p>All actions will be logged for compliance. Protected Health Information (PHI) will be accessible.</p>
              </div>
            </div>
            
            <div v-if="currentMode === 'practice' && targetMode !== 'practice'" class="hipaa-exit">
              <AlertTriangle class="exit-icon" />
              <div class="exit-content">
                <strong>Leaving Practice Mode</strong>
                <p>PHI access will be disabled. Ensure all patient data is saved.</p>
              </div>
            </div>
            
            <div class="mode-preview">
              <div class="preview-section" :class="{ active: targetMode === 'practice' }">
                <span class="preview-icon">🔒</span>
                <span class="preview-label">Practice</span>
              </div>
              <div class="preview-section" :class="{ active: targetMode === 'business' }">
                <span class="preview-icon">💼</span>
                <span class="preview-label">Business</span>
              </div>
              <div class="preview-section" :class="{ active: targetMode === 'personal' }">
                <span class="preview-icon">🏠</span>
                <span class="preview-label">Personal</span>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn-cancel" @click="cancel">Cancel</button>
            <button class="btn-confirm" :class="targetModeClass" @click="confirm">
              <Check class="btn-icon" />
              Switch Mode
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Check, Shield, AlertTriangle } from 'lucide-vue-next';
import type { URPAMode } from '@/types/mode';

const props = defineProps<{
  isOpen: boolean;
  targetMode: URPAMode;
  currentMode: URPAMode;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const targetModeClass = computed(() => `mode-${props.targetMode}`);

const getModeIcon = (mode: URPAMode) => {
  switch (mode) {
    case 'practice': return '🔒';
    case 'business': return '💼';
    case 'personal': return '🏠';
    default: return '📊';
  }
};

const getModeLabel = (mode: URPAMode) => {
  switch (mode) {
    case 'practice': return 'Practice Mode';
    case 'business': return 'Business Mode';
    case 'personal': return 'Personal Mode';
    default: return 'All Modes';
  }
};

const getModeDescription = (mode: URPAMode) => {
  switch (mode) {
    case 'practice': return 'Access patient records, clinical tools, and medical documentation. HIPAA compliance logging will be enabled.';
    case 'business': return 'Manage staff, vendors, revenue, and practice operations. Focus on administrative and business tasks.';
    case 'personal': return 'View personal calendar, goals, travel, and non-work activities. Work-related data will be minimized.';
    default: return 'View all content from Practice, Business, and Personal modes together.';
  }
};

const confirm = () => emit('confirm');
const cancel = () => emit('cancel');
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-header {
  padding: 24px;
  text-align: center;
  color: white;
}

.modal-header.mode-practice {
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
}

.modal-header.mode-business {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
}

.modal-header.mode-personal {
  background: linear-gradient(135deg, #10b981, #059669);
}

.modal-header.mode-all {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
}

.mode-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.modal-title {
  font-size: 24px;
  font-weight: 800;
  margin: 0;
}

.modal-body {
  padding: 24px;
}

.modal-description {
  color: #475569;
  line-height: 1.6;
  margin: 0 0 20px 0;
  text-align: center;
}

.hipaa-warning, .hipaa-exit {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.hipaa-warning {
  background: #ede9fe;
  border: 1px solid #c4b5fd;
}

.hipaa-exit {
  background: #fef3c7;
  border: 1px solid #fcd34d;
}

.warning-icon {
  width: 28px;
  height: 28px;
  color: #7c3aed;
  flex-shrink: 0;
}

.exit-icon {
  width: 28px;
  height: 28px;
  color: #d97706;
  flex-shrink: 0;
}

.warning-content strong, .exit-content strong {
  display: block;
  color: #1e293b;
  margin-bottom: 4px;
}

.warning-content p, .exit-content p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.mode-preview {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 24px;
  border-radius: 12px;
  background: #f8fafc;
  opacity: 0.5;
  transition: all 0.2s;
}

.preview-section.active {
  opacity: 1;
  background: #f0fdf4;
  box-shadow: 0 0 0 2px #10b981;
}

.preview-icon {
  font-size: 28px;
}

.preview-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel, .btn-confirm {
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-cancel {
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.btn-cancel:hover {
  background: #f1f5f9;
}

.btn-confirm {
  border: none;
  color: white;
}

.btn-confirm.mode-practice {
  background: #8b5cf6;
}

.btn-confirm.mode-business {
  background: #0ea5e9;
}

.btn-confirm.mode-personal {
  background: #10b981;
}

.btn-confirm.mode-all {
  background: #6366f1;
}

.btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(10px);
}
</style>
