<template>
  <div class="vendor-management">
    <header class="page-header">
      <div class="header-content">
        <Building2 class="header-icon" />
        <div>
          <h1 class="page-title">Vendor Management</h1>
          <p class="page-subtitle">Medical supplies, equipment, and service providers</p>
        </div>
      </div>
      <button class="add-btn">
        <Plus class="add-icon" />
        Add Vendor
      </button>
    </header>

    <ModeBadge mode="business" :show-label="true" class="mode-indicator" />

    <div class="stats-grid">
      <div class="stat-card">
        <Building2 class="stat-icon" />
        <div class="stat-content">
          <span class="stat-value">24</span>
          <span class="stat-label">Active Vendors</span>
        </div>
      </div>
      <div class="stat-card">
        <FileText class="stat-icon warning" />
        <div class="stat-content">
          <span class="stat-value">5</span>
          <span class="stat-label">Pending Orders</span>
        </div>
      </div>
      <div class="stat-card">
        <Clock class="stat-icon" />
        <div class="stat-content">
          <span class="stat-value">3</span>
          <span class="stat-label">Contracts Expiring</span>
        </div>
      </div>
      <div class="stat-card">
        <DollarSign class="stat-icon success" />
        <div class="stat-content">
          <span class="stat-value">$12.4K</span>
          <span class="stat-label">This Month</span>
        </div>
      </div>
    </div>

    <div class="vendors-grid">
      <div class="vendor-card" v-for="vendor in vendors" :key="vendor.id">
        <div class="vendor-header">
          <div class="vendor-logo">{{ vendor.initials }}</div>
          <div class="vendor-info">
            <span class="vendor-name">{{ vendor.name }}</span>
            <span class="vendor-category">{{ vendor.category }}</span>
          </div>
          <span class="vendor-status" :class="vendor.status">{{ vendor.status }}</span>
        </div>
        <div class="vendor-meta">
          <div class="meta-item">
            <span class="meta-label">Last Order</span>
            <span class="meta-value">{{ vendor.lastOrder }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Contract</span>
            <span class="meta-value">{{ vendor.contractEnd }}</span>
          </div>
        </div>
        <button class="vendor-action-btn">View Details →</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Building2, Plus, FileText, Clock, DollarSign } from 'lucide-vue-next';
import ModeBadge from '@/components/core/ModeBadge.vue';

const vendors = ref([
  { id: 1, name: 'Medline Industries', category: 'Medical Supplies', initials: 'MI', status: 'active', lastOrder: 'Jan 15', contractEnd: 'Dec 2026' },
  { id: 2, name: 'Quest Diagnostics', category: 'Lab Services', initials: 'QD', status: 'active', lastOrder: 'Jan 20', contractEnd: 'Jun 2026' },
  { id: 3, name: 'Cardinal Health', category: 'Pharmaceuticals', initials: 'CH', status: 'active', lastOrder: 'Jan 18', contractEnd: 'Mar 2027' },
  { id: 4, name: 'Office Depot', category: 'Office Supplies', initials: 'OD', status: 'review', lastOrder: 'Dec 28', contractEnd: 'Feb 2026' },
  { id: 5, name: 'IT Solutions Co', category: 'IT Services', initials: 'IT', status: 'active', lastOrder: 'Jan 10', contractEnd: 'Sep 2026' },
  { id: 6, name: 'CleanPro Services', category: 'Janitorial', initials: 'CP', status: 'active', lastOrder: 'Weekly', contractEnd: 'Dec 2026' },
]);
</script>

<style scoped>
.vendor-management {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
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

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  color: #0284c7;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.add-btn:hover {
  transform: translateY(-2px);
}

.add-icon {
  width: 20px;
  height: 20px;
}

.mode-indicator {
  width: fit-content;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-icon {
  width: 32px;
  height: 32px;
  color: #64748b;
}

.stat-icon.warning { color: #f59e0b; }
.stat-icon.success { color: #10b981; }

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  display: block;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

.vendors-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.vendor-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  transition: all 0.2s;
}

.vendor-card:hover {
  border-color: #0ea5e9;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
}

.vendor-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.vendor-logo {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  font-weight: 700;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vendor-info {
  flex: 1;
}

.vendor-name {
  display: block;
  font-weight: 700;
  color: #1e293b;
}

.vendor-category {
  font-size: 13px;
  color: #64748b;
}

.vendor-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.vendor-status.active {
  background: #d1fae5;
  color: #059669;
}

.vendor-status.review {
  background: #fef3c7;
  color: #d97706;
}

.vendor-meta {
  display: flex;
  gap: 24px;
  padding: 12px 0;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-value {
  font-weight: 600;
  color: #1e293b;
}

.vendor-action-btn {
  width: 100%;
  padding: 10px;
  background: #f0f9ff;
  border: none;
  border-radius: 8px;
  color: #0284c7;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.vendor-action-btn:hover {
  background: #0ea5e9;
  color: white;
}

@media (max-width: 1200px) {
  .stats-grid, .vendors-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
