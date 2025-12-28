<template>
  <Card :padding="'md'" :className="className">
    <div class="issue-card">
      <div class="issue-card-header">
        <div class="issue-card-title-section">
          <h4 class="issue-card-title">{{ issue.title }}</h4>
          <p class="issue-card-message">{{ issue.message }}</p>
        </div>
        <div class="issue-card-badges">
          <Badge :variant="severityVariant" size="sm">{{ issue.severity }}</Badge>
          <Badge variant="pending" size="sm">{{ issue.category }}</Badge>
        </div>
      </div>

      <div v-if="expanded" class="issue-card-details">
        <div v-if="issue.page_url" class="issue-card-detail">
          <span class="issue-card-detail-label">Page:</span>
          <a :href="issue.page_url" target="_blank" class="issue-card-link">{{ issue.page_url }}</a>
        </div>
        <div v-if="issue.selector" class="issue-card-detail">
          <span class="issue-card-detail-label">Selector:</span>
          <code class="issue-card-code">{{ issue.selector }}</code>
        </div>
        <div v-if="issue.wcag_criteria && issue.wcag_criteria.length > 0" class="issue-card-detail">
          <span class="issue-card-detail-label">WCAG:</span>
          <span class="issue-card-wcag">{{ issue.wcag_criteria.join(', ') }}</span>
        </div>
        <div v-if="issue.html_context" class="issue-card-detail">
          <span class="issue-card-detail-label">HTML Context:</span>
          <pre class="issue-card-pre"><code>{{ issue.html_context }}</code></pre>
        </div>
        <div v-if="issue.fix_code" class="issue-card-fix">
          <h5 class="issue-card-fix-title">Suggested Fix:</h5>
          <pre class="issue-card-pre"><code>{{ issue.fix_code }}</code></pre>
          <p v-if="issue.fix_explanation" class="issue-card-fix-explanation">{{ issue.fix_explanation }}</p>
          <div v-if="issue.fix_confidence" class="issue-card-confidence">
            Confidence: {{ issue.fix_confidence }}%
          </div>
        </div>
      </div>

      <div class="issue-card-actions">
        <Button
          v-if="!issue.fix_code"
          variant="secondary"
          size="sm"
          :disabled="generatingFix"
          @click="handleGenerateFix"
        >
          {{ generatingFix ? 'Generating...' : 'Generate Fix' }}
        </Button>
        <Button
          v-if="issue.fix_code"
          variant="secondary"
          size="sm"
          @click="handleCopyFix"
        >
          Copy Fix
        </Button>
        <Button
          variant="ghost"
          size="sm"
          @click="handleIgnore"
        >
          {{ issue.status === 'ignored' ? 'Unignore' : 'Ignore' }}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          @click="handleMarkFixed"
        >
          Mark Fixed
        </Button>
        <Button
          variant="ghost"
          size="sm"
          @click="expanded = !expanded"
        >
          {{ expanded ? 'Collapse' : 'Expand' }}
        </Button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import type { Issue } from '@/types'
import { useIssuesStore } from '@/stores/issues'

interface Props {
  issue: Issue
  className?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [issue: Issue]
}>()

const issuesStore = useIssuesStore()
const expanded = ref(false)
const generatingFix = ref(false)

const severityVariant = computed(() => {
  switch (props.issue.severity) {
    case 'critical': return 'error'
    case 'serious': return 'warning'
    case 'moderate': return 'accepted'
    default: return 'pending'
  }
})

const handleGenerateFix = async () => {
  generatingFix.value = true
  try {
    await issuesStore.generateFix(props.issue.id)
    expanded.value = true
  } catch (error) {
    console.error('Failed to generate fix:', error)
  } finally {
    generatingFix.value = false
  }
}

const handleCopyFix = () => {
  if (props.issue.fix_code) {
    navigator.clipboard.writeText(props.issue.fix_code)
  }
}

const handleIgnore = async () => {
  try {
    const newStatus = props.issue.status === 'ignored' ? 'open' : 'ignored'
    await issuesStore.updateIssue(props.issue.id, { status: newStatus })
  } catch (error) {
    console.error('Failed to update issue:', error)
  }
}

const handleMarkFixed = async () => {
  try {
    await issuesStore.updateIssue(props.issue.id, { status: 'fixed' })
  } catch (error) {
    console.error('Failed to mark issue as fixed:', error)
  }
}
</script>

<style scoped>
.issue-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.issue-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
}

.issue-card-title-section {
  flex: 1;
  min-width: 0;
}

.issue-card-title {
  font-size: var(--font-title-small);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1) 0;
}

.issue-card-message {
  font-size: var(--font-body-medium);
  color: var(--color-text-secondary);
  margin: 0;
}

.issue-card-badges {
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
}

.issue-card-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}

.issue-card-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.issue-card-detail-label {
  font-size: var(--font-label);
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.issue-card-link {
  color: var(--color-primary);
  text-decoration: none;
  word-break: break-all;
}

.issue-card-link:hover {
  text-decoration: underline;
}

.issue-card-code,
.issue-card-pre {
  font-family: var(--font-mono);
  font-size: var(--font-body-small);
  background: var(--color-bg-secondary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  overflow-x: auto;
}

.issue-card-pre {
  margin: 0;
}

.issue-card-wcag {
  font-size: var(--font-body-medium);
  color: var(--color-text-primary);
}

.issue-card-fix {
  padding: var(--space-4);
  background: var(--color-primary-light);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-primary);
}

.issue-card-fix-title {
  font-size: var(--font-title-small);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
}

.issue-card-fix-explanation {
  font-size: var(--font-body-medium);
  color: var(--color-text-secondary);
  margin: var(--space-2) 0 0 0;
}

.issue-card-confidence {
  font-size: var(--font-body-small);
  color: var(--color-text-secondary);
  margin-top: var(--space-2);
}

.issue-card-actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}
</style>
