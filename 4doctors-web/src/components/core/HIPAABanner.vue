<template>
  <Transition name="hipaa-banner">
    <div v-if="isHIPAAActive" class="hipaa-banner">
      <Shield class="shield-icon" />
      <span class="banner-text">HIPAA Mode Active</span>
      <span class="banner-subtext">• All access logged • PHI encrypted</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { Shield } from 'lucide-vue-next';
import { useMode } from '@/composables/useMode';

const { isHIPAAActive } = useMode();
</script>

<style scoped>
.hipaa-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 1px solid #f59e0b;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #92400e;
}

.shield-icon {
  width: 16px;
  height: 16px;
  color: #d97706;
}

.banner-text {
  font-weight: 700;
}

.banner-subtext {
  color: #b45309;
}

/* Animation */
.hipaa-banner-enter-active,
.hipaa-banner-leave-active {
  transition: all 0.3s ease;
}

.hipaa-banner-enter-from,
.hipaa-banner-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
