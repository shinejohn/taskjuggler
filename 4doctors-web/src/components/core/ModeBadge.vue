<template>
  <span 
    class="mode-badge" 
    :class="[`mode-${mode}`, { compact }]"
    :title="getModeLabel(mode)"
  >
    {{ getModeIcon(mode) }}
    <span v-if="showLabel && !compact" class="badge-label">{{ getModeLabel(mode) }}</span>
  </span>
</template>

<script setup lang="ts">
import { useMode } from '@/composables/useMode';
import type { URPAMode } from '@/types/mode';

const props = withDefaults(defineProps<{
  mode: URPAMode;
  showLabel?: boolean;
  compact?: boolean;
}>(), {
  showLabel: false,
  compact: true
});

const { getModeIcon, getModeLabel } = useMode();
</script>

<style scoped>
.mode-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.mode-badge.compact {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
}

.mode-badge.mode-practice {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}

.mode-badge.mode-business {
  background: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
}

.mode-badge.mode-personal {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.badge-label {
  font-weight: 500;
}
</style>
