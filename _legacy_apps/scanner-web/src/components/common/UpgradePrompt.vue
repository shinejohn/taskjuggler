<template>
  <Card class="upgrade-prompt">
    <div class="upgrade-content">
      <div class="upgrade-icon">
        <SparklesIcon />
      </div>
      <div class="upgrade-text">
        <h4>{{ title }}</h4>
        <p>{{ message }}</p>
      </div>
      <Button variant="default" @click="handleUpgrade">
        Upgrade Now
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card, Button } from '@taskjuggler/ui'
import { SparklesIcon } from 'lucide-vue-next'

interface Props {
  title?: string
  message: string
  feature?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Upgrade Required',
})

function handleUpgrade() {
  const reason = props.feature ? `?upgrade_reason=${props.feature}` : ''
  window.location.href = `/settings/billing${reason}`
}
</script>

<style scoped>
.upgrade-prompt {
  background: linear-gradient(135deg, var(--color-primary-light), transparent);
  border: 1px solid var(--color-primary);
}

.upgrade-content {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
}

.upgrade-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.upgrade-icon svg {
  width: 24px;
  height: 24px;
}

.upgrade-text {
  flex: 1;
}

.upgrade-text h4 {
  margin: 0 0 var(--space-2) 0;
  font-size: var(--font-title-medium);
  font-weight: 600;
}

.upgrade-text p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-body-medium);
}
</style>

