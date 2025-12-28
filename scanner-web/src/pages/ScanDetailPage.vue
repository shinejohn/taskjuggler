<template>
  <AppLayout>
    <div v-if="loading" class="page-loading">
      <LoadingSpinner size="lg" />
    </div>
    <div v-else-if="error" class="page-error">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="scan" class="scan-detail-page">
      <div class="scan-detail-header">
        <div>
          <h1 class="scan-detail-title">Scan Results</h1>
          <p class="scan-detail-meta">
            Started: {{ formatDate(scan.started_at) }}
            <span v-if="scan.completed_at">
              • Completed: {{ formatDate(scan.completed_at) }}
            </span>
          </p>
        </div>
        <div class="scan-detail-actions">
          <HealthScore :score="scan.health_score" size="lg" />
          <Button variant="secondary" @click="handleDownloadReport">Download Report</Button>
        </div>
      </div>

      <div class="scan-detail-content">
        <Card :padding="'lg'">
          <h2 class="section-title">Category Scores</h2>
          <div class="category-scores">
            <div
              v-for="(score, category) in scan.category_scores"
              :key="category"
              class="category-score-item"
            >
              <div class="category-score-label">{{ category }}</div>
              <div class="category-score-value">{{ score }}</div>
            </div>
          </div>
        </Card>

        <Card :padding="'lg'">
          <h2 class="section-title">Issues ({{ scan.issue_count }})</h2>
          <div v-if="issues.length === 0" class="empty-state">
            <p>No issues found. Excellent!</p>
          </div>
          <div v-else class="issues-list">
            <IssueCard
              v-for="issue in issues"
              :key="issue.id"
              :issue="issue"
            />
          </div>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import HealthScore from '@/components/scanner/HealthScore.vue'
import IssueCard from '@/components/scanner/IssueCard.vue'
import { useScansStore } from '@/stores/scans'
import { useIssuesStore } from '@/stores/issues'

const route = useRoute()
const scansStore = useScansStore()
const issuesStore = useIssuesStore()

const loading = ref(true)
const error = ref<string | null>(null)

const scanId = computed(() => parseInt(route.params.id as string))
const scan = computed(() => scansStore.currentScan)
const issues = computed(() => issuesStore.issues)

onMounted(async () => {
  try {
    await Promise.all([
      scansStore.fetchScan(scanId.value),
      issuesStore.fetchIssues({ scan_id: scanId.value }),
    ])
  } catch (err: any) {
    error.value = err.message || 'Failed to load scan details'
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const handleDownloadReport = async () => {
  try {
    await scansStore.downloadReport(scanId.value)
  } catch (err) {
    console.error('Failed to download report:', err)
  }
}
</script>

<style scoped>
.scan-detail-page {
  padding: var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
}

.scan-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-8);
  gap: var(--space-6);
}

.scan-detail-title {
  font-size: var(--font-display-medium);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
}

.scan-detail-meta {
  font-size: var(--font-body-medium);
  color: var(--color-text-secondary);
  margin: 0;
}

.scan-detail-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.scan-detail-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.section-title {
  font-size: var(--font-headline);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4) 0;
}

.category-scores {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-4);
}

.category-score-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.category-score-label {
  font-size: var(--font-body-small);
  color: var(--color-text-secondary);
  text-transform: capitalize;
}

.category-score-value {
  font-size: var(--font-title-large);
  font-weight: 700;
  color: var(--color-text-primary);
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.empty-state {
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-secondary);
}

.page-loading,
.page-error {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-16);
}
</style>
