<template>
  <div :class="['fix-preview', className]">
    <div class="fix-preview-header">
      <h4 class="fix-preview-title">Code Fix</h4>
      <Button variant="ghost" size="sm" @click="handleCopy">Copy</Button>
    </div>
    <div class="fix-preview-content">
      <div v-if="before" class="fix-preview-section">
        <h5 class="fix-preview-section-title">Before</h5>
        <pre class="fix-preview-code"><code>{{ before }}</code></pre>
      </div>
      <div class="fix-preview-section">
        <h5 class="fix-preview-section-title">{{ before ? 'After' : 'Fix' }}</h5>
        <pre class="fix-preview-code"><code>{{ after }}</code></pre>
      </div>
    </div>
    <div v-if="explanation" class="fix-preview-explanation">
      <h5 class="fix-preview-section-title">Explanation</h5>
      <p>{{ explanation }}</p>
    </div>
    <div v-if="confidence !== undefined" class="fix-preview-confidence">
      Confidence: {{ confidence }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue'

interface Props {
  before?: string
  after: string
  explanation?: string
  confidence?: number
  className?: string
}

const props = defineProps<Props>()

const handleCopy = () => {
  navigator.clipboard.writeText(props.after)
}
</script>

<style scoped>
.fix-preview {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.fix-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fix-preview-title {
  font-size: var(--font-title-medium);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.fix-preview-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.fix-preview-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.fix-preview-section-title {
  font-size: var(--font-label);
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.fix-preview-code {
  font-family: var(--font-mono);
  font-size: var(--font-body-small);
  background: var(--color-bg-secondary);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: 0;
}

.fix-preview-explanation {
  padding: var(--space-4);
  background: var(--color-primary-light);
  border-radius: var(--radius-md);
}

.fix-preview-explanation p {
  margin: 0;
  font-size: var(--font-body-medium);
  color: var(--color-text-primary);
}

.fix-preview-confidence {
  font-size: var(--font-body-small);
  color: var(--color-text-secondary);
  text-align: right;
}
</style>
