<template>
  <AppLayout>
    <div class="sites-page">
      <div class="sites-header">
        <h1 class="sites-title">Sites</h1>
        <Button @click="showAddSiteModal = true">Add Site</Button>
      </div>

      <div v-if="sitesStore.loading" class="sites-loading">
        <LoadingSpinner size="lg" />
      </div>

      <div v-else-if="sitesStore.error" class="sites-error">
        <p>{{ sitesStore.error }}</p>
      </div>

      <div v-else-if="sitesStore.sites.length === 0" class="sites-empty">
        <p>No sites yet. Add your first site to get started.</p>
        <Button @click="showAddSiteModal = true">Add Site</Button>
      </div>

      <div v-else class="sites-grid">
        <SiteCard
          v-for="site in sitesStore.sites"
          :key="site.id"
          :site="site"
          @click="handleSiteClick"
          @scan="handleSiteScan"
        />
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
import { Button } from '@taskjuggler/ui'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import SiteCard from '@/components/scanner/SiteCard.vue'
import AddSiteModal from '@/components/scanner/AddSiteModal.vue'
import { useSitesStore } from '@/stores/sites'
import type { Site } from '@/types'

const router = useRouter()
const sitesStore = useSitesStore()
const showAddSiteModal = ref(false)

onMounted(() => {
  sitesStore.fetchSites()
})

const handleSiteClick = (site: Site) => {
  router.push(`/sites/${site.id}`)
}

const handleSiteScan = (site: Site) => {
  router.push(`/sites/${site.id}`)
}

const handleSiteCreated = () => {
  sitesStore.fetchSites()
}
</script>

<style scoped>
.sites-page {
  padding: var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
}

.sites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
}

.sites-title {
  font-size: var(--font-display-medium);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.sites-loading,
.sites-error,
.sites-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--space-16);
  gap: var(--space-4);
}

.sites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
}
</style>
