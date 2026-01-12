<template>
  <Card :class="className" @click="handleClick" class="cursor-pointer">
    <CardContent class="p-6">
      <div class="site-card">
      <div class="site-card-header">
        <div class="site-card-info">
          <h3 class="site-card-name">{{ site.name }}</h3>
          <p class="site-card-url">{{ site.url }}</p>
        </div>
        <HealthScore :score="site.health_score || 0" size="sm" />
      </div>
      
      <div class="site-card-stats">
        <div class="site-card-stat">
          <span class="site-card-stat-label">Issues</span>
          <span class="site-card-stat-value">{{ site.issue_count || 0 }}</span>
        </div>
        <div class="site-card-stat">
          <span class="site-card-stat-label">Last Scan</span>
          <span class="site-card-stat-value">{{ lastScanText }}</span>
        </div>
      </div>

      <div class="site-card-actions">
        <Button
          size="sm"
          :disabled="scanning"
          @click.stop="handleScan"
        >
          {{ scanning ? 'Scanning...' : 'Scan Now' }}
        </Button>
        <Badge
          :variant="statusVariant"
          size="sm"
        >
          {{ statusText }}
        </Badge>
      </div>
    </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Card, CardContent, Button, Badge } from '@taskjuggler/ui'
import HealthScore from './HealthScore.vue'
import type { Site } from '@/types'
import { useScansStore } from '@/stores/scans'

interface Props {
  site: Site
  className?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [site: Site]
  scan: [site: Site]
}>()

const scansStore = useScansStore()
const scanning = ref(false)

const lastScanText = computed(() => {
  if (!props.site.last_scan_at) return 'Never'
  const date = new Date(props.site.last_scan_at)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
})

const statusVariant = computed((): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const score = props.site.health_score || 0
  if (score >= 90) return 'default'
  if (score >= 70) return 'secondary'
  if (score >= 50) return 'outline'
  return 'destructive'
})

const statusText = computed(() => {
  const score = props.site.health_score || 0
  if (score >= 90) return 'Healthy'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Needs Work'
  return 'Critical'
})

const handleClick = () => {
  emit('click', props.site)
}

const handleScan = async () => {
  scanning.value = true
  try {
    await scansStore.createScan({ site_id: props.site.id })
    emit('scan', props.site)
  } catch (error) {
    console.error('Failed to start scan:', error)
  } finally {
    scanning.value = false
  }
}
</script>

<style scoped>
.site-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.site-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
}

.site-card-info {
  flex: 1;
  min-width: 0;
}

.site-card-name {
  font-size: var(--font-title-medium);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-1) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-card-url {
  font-size: var(--font-body-small);
  color: var(--color-text-secondary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-card-stats {
  display: flex;
  gap: var(--space-6);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}

.site-card-stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.site-card-stat-label {
  font-size: var(--font-caption);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.site-card-stat-value {
  font-size: var(--font-title-small);
  font-weight: 600;
  color: var(--color-text-primary);
}

.site-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
}
</style>
