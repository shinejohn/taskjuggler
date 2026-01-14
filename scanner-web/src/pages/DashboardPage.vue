<template>
  <AppLayout>
    <div class="dashboard-page">
      <div class="dashboard-header">
        <h1 class="dashboard-title">Dashboard</h1>
        <Button @click="showAddSiteModal = true">Add Site</Button>
      </div>
      
      <!-- Subscription info banner -->
      <Card v-if="subscriptionStore.plan === 'free'" class="subscription-banner">
        <CardContent class="p-6">
          <div class="banner-content">
            <div>
              <h4>Upgrade to Pro</h4>
              <p>Unlock unlimited scans, AI fixes, and more</p>
            </div>
            <Button  @click="handleUpgrade">
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <!-- Usage stats -->
      <div class="usage-stats">
        <Card>
          <CardContent class="p-6">
            <h4>Usage This Month</h4>
            <div class="stat-row">
              <div class="stat">
                <span class="stat-label">Scans</span>
                <span class="stat-value">
                  {{ usageStore.usage.scans_this_month }} / {{ subscriptionStore.limits.scans_per_month }}
                </span>
              </div>
              <div class="stat">
                <span class="stat-label">AI Fixes</span>
                <span class="stat-value">
                  {{ usageStore.usage.ai_fixes_this_month }} / {{ subscriptionStore.limits.ai_fixes }}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div v-if="dashboardStore.loading" class="dashboard-loading">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else-if="dashboardStore.error" class="dashboard-error">
        <p>{{ dashboardStore.error }}</p>
      </div>

      <div v-else-if="dashboardStore.stats" class="dashboard-content">
        <div class="dashboard-stats-grid">
          <Card>
            <CardContent class="p-6">
              <div class="stat-card">
                <div class="stat-card-label">Total Sites</div>
                <div class="stat-card-value">{{ dashboardStore.stats.total_sites }}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-6">
              <div class="stat-card">
                <div class="stat-card-label">Total Scans</div>
                <div class="stat-card-value">{{ dashboardStore.stats.total_scans }}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-6">
              <div class="stat-card">
                <div class="stat-card-label">Total Issues</div>
                <div class="stat-card-value">{{ dashboardStore.stats.total_issues }}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-6">
              <div class="stat-card">
                <div class="stat-card-label">Average Health Score</div>
                <div class="stat-card-value">{{ Math.round(dashboardStore.stats.average_health_score) }}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="dashboard-sections">
          <Card>
            <CardContent class="p-6">
              <h2 class="dashboard-section-title">Sites</h2>
            <div v-if="dashboardStore.stats.sites.length === 0" class="dashboard-empty">
              <p>No sites yet. Add your first site to get started.</p>
            </div>
            <div v-else class="dashboard-sites-grid">
              <SiteCard
                v-for="site in dashboardStore.stats.sites"
                :key="site.id"
                :site="site"
                @click="handleSiteClick"
                @scan="handleSiteScan"
              />
            </div>
            </CardContent>
          </Card>

          <Card v-if="dashboardStore.stats.sites_needing_attention > 0">
            <CardContent class="p-6">
              <h2 class="dashboard-section-title">Sites Needing Attention</h2>
              <p class="dashboard-section-subtitle">
                {{ dashboardStore.stats.sites_needing_attention }} sites have health scores below 70
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddSiteModal
        :is-open="showAddSiteModal"
        @close="showAddSiteModal = false"
        @created="handleSiteCreated"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { Card, CardContent, Button } from '@taskjuggler/ui'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import SiteCard from '@/components/scanner/SiteCard.vue'
import AddSiteModal from '@/components/scanner/AddSiteModal.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useSitesStore } from '@/stores/sites'
import { useUsageStore } from '@/stores/usage'
import { useSubscriptionStore } from '@/stores/subscription'
import type { Site } from '@/types'

const router = useRouter()
const dashboardStore = useDashboardStore()
const sitesStore = useSitesStore()
const usageStore = useUsageStore()
const subscriptionStore = useSubscriptionStore()
const showAddSiteModal = ref(false)

onMounted(async () => {
  await Promise.all([
    dashboardStore.fetchStats(),
    usageStore.fetchUsage(),
  ])
})

const handleSiteClick = (site: Site) => {
  router.push(`/sites/${site.id}`)
}

const handleSiteScan = (site: Site) => {
  router.push(`/sites/${site.id}`)
}

const handleSiteCreated = () => {
  dashboardStore.fetchStats()
  sitesStore.fetchSites()
  usageStore.fetchUsage()
}

function handleUpgrade() {
  window.location.href = '/settings/billing'
}
</script>

<style scoped>
.dashboard-page {
  padding: var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
}

.dashboard-title {
  font-size: var(--font-display-medium);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.dashboard-loading,
.dashboard-error {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-16);
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.dashboard-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.stat-card-label {
  font-size: var(--font-body-small);
  color: var(--color-text-secondary);
}

.stat-card-value {
  font-size: var(--font-display-small);
  font-weight: 700;
  color: var(--color-text-primary);
}

.dashboard-sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.dashboard-section-title {
  font-size: var(--font-headline);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-4) 0;
}

.dashboard-section-subtitle {
  font-size: var(--font-body-medium);
  color: var(--color-text-secondary);
  margin: 0;
}

.dashboard-empty {
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-secondary);
}

.dashboard-sites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
}

.subscription-banner {
  margin-bottom: var(--space-6);
  background: linear-gradient(135deg, var(--color-primary-light), transparent);
  border: 1px solid var(--color-primary);
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
}

.banner-content h4 {
  margin: 0 0 var(--space-1) 0;
  font-size: var(--font-title-medium);
  font-weight: 600;
  color: var(--color-text-primary);
}

.banner-content p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-body-medium);
}

.usage-stats {
  margin-bottom: var(--space-6);
}

.usage-stats h4 {
  margin: 0 0 var(--space-4) 0;
  font-size: var(--font-title-medium);
  font-weight: 600;
  color: var(--color-text-primary);
}

.stat-row {
  display: flex;
  gap: var(--space-6);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-label {
  font-size: var(--font-body-small);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: var(--font-title-medium);
  font-weight: 600;
  color: var(--color-text-primary);
}
</style>
