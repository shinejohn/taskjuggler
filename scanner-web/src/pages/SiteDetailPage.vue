<template>
  <AppLayout>
    <div v-if="loading" class="page-loading">
      <LoadingSpinner size="lg" />
    </div>
    <div v-else-if="error" class="page-error">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="site" class="site-detail-page">
      <div class="site-detail-header">
        <div>
          <h1 class="site-detail-title">{{ site.name }}</h1>
          <p class="site-detail-url">{{ site.url }}</p>
        </div>
        <HealthScore :score="site.health_score || 0" size="lg" />
      </div>

      <div class="site-detail-content">
        <Card :padding="'lg'">
          <h2 class="section-title">Recent Scans</h2>
          <div v-if="scans.length === 0" class="empty-state">
            <p>No scans yet. Start your first scan to see results.</p>
          </div>
          <div v-else class="scans-list">
            <div
              v-for="scan in scans"
              :key="scan.id"
              class="scan-item"
              @click="handleScanClick(scan)"
            >
              <div class="scan-item-info">
                <div class="scan-item-date">{{ formatDate(scan.started_at) }}</div>
                <div class="scan-item-status">
                  <Badge :variant="getStatusVariant(scan.status)" size="sm">
                    {{ scan.status }}
                  </Badge>
                </div>
              </div>
              <div class="scan-item-score">
                <HealthScore :score="scan.health_score" size="sm" />
              </div>
            </div>
          </div>
          <Button variant="primary" @click="handleStartScan">Start New Scan</Button>
        </Card>

        <Card :padding="'lg'">
          <h2 class="section-title">Open Issues</h2>
          <div v-if="openIssues.length === 0" class="empty-state">
            <p>No open issues. Great job!</p>
          </div>
          <div v-else class="issues-list">
            <IssueCard
              v-for="issue in openIssues"
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
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import HealthScore from '@/components/scanner/HealthScore.vue'
import IssueCard from '@/components/scanner/IssueCard.vue'
import { useSitesStore } from '@/stores/sites'
import { useScansStore } from '@/stores/scans'
import { useIssuesStore } from '@/stores/issues'
import type { Scan } from '@/types'

const route = useRoute()
const router = useRouter()
const sitesStore = useSitesStore()
const scansStore = useScansStore()
const issuesStore = useIssuesStore()

const loading = ref(true)
const error = ref<string | null>(null)

const siteId = computed(() => parseInt(route.params.id as string))
const site = computed(() => sitesStore.currentSite)
const scans = computed(() => scansStore.scans)
const openIssues = computed(() => issuesStore.issues.filter(i => i.status === 'open'))

onMounted(async () => {
  try {
    await Promise.all([
      sitesStore.fetchSite(siteId.value),
      scansStore.fetchScansBySite(siteId.value),
      issuesStore.fetchIssues({ site_id: siteId.value, status: 'open' }),
    ])
  } catch (err: any) {
    error.value = err.message || 'Failed to load site details'
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed': return 'success'
    case 'running': return 'in-progress'
    case 'failed': return 'error'
    default: return 'pending'
  }
}

const handleScanClick = (scan: Scan) => {
  router.push(`/scans/${scan.id}`)
}

const handleStartScan = async () => {
  try {
    const scan = await scansStore.createScan({ site_id: siteId.value })
    router.push(`/scans/${scan.id}`)
  } catch (err) {
    console.error('Failed to start scan:', err)
  }
}
</script>

<style scoped>
.site-detail-page {
  padding: var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
}

.site-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
  gap: var(--space-6);
}

.site-detail-title {
  font-size: var(--font-display-medium);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
}

.site-detail-url {
  font-size: var(--font-body-large);
  color: var(--color-text-secondary);
  margin: 0;
}

.site-detail-content {
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

.empty-state {
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-secondary);
}

.scans-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.scan-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.scan-item:hover {
  background: var(--color-bg-tertiary);
}

.scan-item-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.scan-item-date {
  font-size: var(--font-body-medium);
  color: var(--color-text-primary);
  font-weight: 500;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.page-loading,
.page-error {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-16);
}
</style>
