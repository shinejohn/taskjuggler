<template>
  <div class="lab-results">
    <header class="page-header">
      <div class="header-content">
        <FlaskConical class="header-icon" />
        <div>
          <h1 class="page-title">Lab Results</h1>
          <p class="page-subtitle">Review and sign pending lab results</p>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat urgent">
          <AlertTriangle class="stat-icon" />
          <span class="stat-value">2</span>
          <span class="stat-label">Critical</span>
        </div>
        <div class="stat pending">
          <Clock class="stat-icon" />
          <span class="stat-value">8</span>
          <span class="stat-label">Pending</span>
        </div>
      </div>
    </header>

    <ModeBadge mode="practice" :show-label="true" class="mode-indicator" />

    <div class="labs-grid">
      <!-- Critical Results Panel -->
      <div class="critical-panel" v-if="criticalLabs.length > 0">
        <h2 class="section-title critical">
          <AlertTriangle /> Critical Values - Immediate Review Required
        </h2>
        <div class="lab-card critical" v-for="lab in criticalLabs" :key="lab.id">
          <div class="lab-header">
            <span class="patient-name">{{ lab.patientName }}</span>
            <span class="lab-time">{{ lab.receivedAt }}</span>
          </div>
          <div class="lab-test">{{ lab.testName }}</div>
          <div class="lab-values">
            <span class="value critical">{{ lab.value }}</span>
            <span class="reference">Ref: {{ lab.reference }}</span>
          </div>
          <div class="lab-actions">
            <button class="action-btn primary">Review & Sign</button>
            <button class="action-btn secondary">Call Patient</button>
          </div>
        </div>
      </div>

      <!-- All Results -->
      <div class="results-list">
        <div class="list-header">
          <h2 class="section-title">All Pending Results</h2>
          <div class="filters">
            <select class="filter-select">
              <option>All Types</option>
              <option>Blood Work</option>
              <option>Imaging</option>
              <option>Pathology</option>
            </select>
          </div>
        </div>
        <div class="lab-item" v-for="lab in pendingLabs" :key="lab.id">
          <div class="lab-icon" :class="lab.type">
            <component :is="getLabIcon(lab.type)" />
          </div>
          <div class="lab-info">
            <span class="patient-name">{{ lab.patientName }}</span>
            <span class="test-name">{{ lab.testName }}</span>
          </div>
          <div class="lab-status">
            <span class="status-badge" :class="lab.status">{{ lab.status }}</span>
            <span class="lab-date">{{ lab.date }}</span>
          </div>
          <div class="lab-actions-mini">
            <button class="icon-btn" title="View Details">
              <Eye />
            </button>
            <button class="icon-btn primary" title="Sign">
              <Check />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FlaskConical, AlertTriangle, Clock, Eye, Check, Droplets, Scan, FileSearch } from 'lucide-vue-next';
import ModeBadge from '@/components/core/ModeBadge.vue';

// Sample data
const allLabs = ref([
  { id: 1, patientName: 'Sarah Johnson', testName: 'Comprehensive Metabolic Panel', value: 'Potassium: 6.2 mEq/L', reference: '3.5-5.0', type: 'blood', status: 'critical', date: 'Today', receivedAt: '2 hours ago' },
  { id: 2, patientName: 'John Smith', testName: 'Complete Blood Count', value: 'WBC: 15,000', reference: '4,500-11,000', type: 'blood', status: 'critical', date: 'Today', receivedAt: '4 hours ago' },
  { id: 3, patientName: 'Maria Garcia', testName: 'Lipid Panel', value: null, reference: null, type: 'blood', status: 'normal', date: 'Today', receivedAt: null },
  { id: 4, patientName: 'Robert Chen', testName: 'Chest X-Ray', value: null, reference: null, type: 'imaging', status: 'pending', date: 'Yesterday', receivedAt: null },
  { id: 5, patientName: 'Lisa Williams', testName: 'Thyroid Panel', value: null, reference: null, type: 'blood', status: 'normal', date: 'Yesterday', receivedAt: null },
  { id: 6, patientName: 'David Kim', testName: 'Biopsy Results', value: null, reference: null, type: 'pathology', status: 'pending', date: '2 days ago', receivedAt: null },
]);

const criticalLabs = computed(() => allLabs.value.filter(lab => lab.status === 'critical'));
const pendingLabs = computed(() => allLabs.value.filter(lab => lab.status !== 'critical'));

const getLabIcon = (type: string) => {
  switch (type) {
    case 'blood': return Droplets;
    case 'imaging': return Scan;
    case 'pathology': return FileSearch;
    default: return FlaskConical;
  }
};
</script>

<style scoped>
.lab-results {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  border-radius: 16px;
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  opacity: 0.9;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  margin: 0;
}

.page-subtitle {
  opacity: 0.9;
  margin-top: 4px;
}

.header-stats {
  display: flex;
  gap: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.stat.urgent {
  background: rgba(239, 68, 68, 0.3);
}

.stat-icon {
  width: 20px;
  height: 20px;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}

.mode-indicator {
  width: fit-content;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title.critical {
  color: #dc2626;
}

.critical-panel {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.lab-card.critical {
  background: white;
  border-radius: 12px;
  border: 2px solid #dc2626;
  padding: 20px;
  margin-bottom: 12px;
}

.lab-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.patient-name {
  font-weight: 700;
  color: #1e293b;
}

.lab-time {
  font-size: 13px;
  color: #64748b;
}

.lab-test {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 12px;
}

.lab-values {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 16px;
}

.value.critical {
  font-size: 20px;
  font-weight: 800;
  color: #dc2626;
}

.reference {
  font-size: 13px;
  color: #94a3b8;
}

.lab-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn.primary {
  background: #8b5cf6;
  color: white;
}

.action-btn.primary:hover {
  background: #7c3aed;
}

.action-btn.secondary {
  background: #f1f5f9;
  color: #475569;
}

.results-list {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-select {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}

.lab-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  transition: background 0.15s;
}

.lab-item:hover {
  background: #f8fafc;
}

.lab-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lab-icon.blood { background: #fef2f2; color: #ef4444; }
.lab-icon.imaging { background: #eff6ff; color: #3b82f6; }
.lab-icon.pathology { background: #f0fdf4; color: #22c55e; }

.lab-info {
  flex: 1;
}

.test-name {
  display: block;
  font-size: 14px;
  color: #64748b;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.normal { background: #d1fae5; color: #059669; }
.status-badge.pending { background: #fef3c7; color: #d97706; }
.status-badge.critical { background: #fee2e2; color: #dc2626; }

.lab-status {
  text-align: right;
}

.lab-date {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.lab-actions-mini {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.icon-btn:hover {
  background: #f8fafc;
}

.icon-btn.primary {
  background: #8b5cf6;
  color: white;
  border: none;
}

.icon-btn.primary:hover {
  background: #7c3aed;
}
</style>
