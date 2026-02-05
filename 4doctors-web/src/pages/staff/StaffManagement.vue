<template>
  <div class="staff-management">
    <header class="page-header">
      <div class="header-content">
        <UserCog class="header-icon" />
        <div>
          <h1 class="page-title">Staff Management</h1>
          <p class="page-subtitle">Manage your practice team, schedules, and performance</p>
        </div>
      </div>
      <button class="add-btn">
        <Plus class="add-icon" />
        Add Staff Member
      </button>
    </header>

    <ModeBadge mode="business" :show-label="true" class="mode-indicator" />

    <div class="stats-grid">
      <div class="stat-card">
        <Users class="stat-icon" />
        <div class="stat-content">
          <span class="stat-value">12</span>
          <span class="stat-label">Total Staff</span>
        </div>
      </div>
      <div class="stat-card">
        <Clock class="stat-icon active" />
        <div class="stat-content">
          <span class="stat-value">8</span>
          <span class="stat-label">On Shift Today</span>
        </div>
      </div>
      <div class="stat-card">
        <Calendar class="stat-icon warning" />
        <div class="stat-content">
          <span class="stat-value">3</span>
          <span class="stat-label">PTO Requests</span>
        </div>
      </div>
      <div class="stat-card">
        <Award class="stat-icon success" />
        <div class="stat-content">
          <span class="stat-value">95%</span>
          <span class="stat-label">Attendance Rate</span>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <div class="staff-list">
        <h2 class="section-title">Team Members</h2>
        <div class="staff-card" v-for="staff in staffMembers" :key="staff.id">
          <div class="staff-avatar">{{ staff.initials }}</div>
          <div class="staff-info">
            <span class="staff-name">{{ staff.name }}</span>
            <span class="staff-role">{{ staff.role }}</span>
          </div>
          <span class="staff-status" :class="staff.status">{{ staff.status }}</span>
        </div>
      </div>

      <div class="quick-actions">
        <h2 class="section-title">Quick Actions</h2>
        <button class="action-card">
          <Clock class="action-icon" />
          <span>Schedule Shifts</span>
        </button>
        <button class="action-card">
          <FileText class="action-icon" />
          <span>Payroll Report</span>
        </button>
        <button class="action-card">
          <Calendar class="action-icon" />
          <span>Review PTO</span>
        </button>
        <button class="action-card">
          <TrendingUp class="action-icon" />
          <span>Performance Reviews</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserCog, Plus, Users, Clock, Calendar, Award, FileText, TrendingUp } from 'lucide-vue-next';
import ModeBadge from '@/components/core/ModeBadge.vue';

const staffMembers = ref([
  { id: 1, name: 'Sarah Johnson', role: 'Office Manager', initials: 'SJ', status: 'active' },
  { id: 2, name: 'Mike Chen', role: 'Medical Assistant', initials: 'MC', status: 'active' },
  { id: 3, name: 'Lisa Rodriguez', role: 'Receptionist', initials: 'LR', status: 'active' },
  { id: 4, name: 'David Kim', role: 'Billing Specialist', initials: 'DK', status: 'pto' },
  { id: 5, name: 'Emily Davis', role: 'Nurse', initials: 'ED', status: 'active' },
]);
</script>

<style scoped>
.staff-management {
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

.stat-icon.active { color: #0ea5e9; }
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

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}

.staff-list {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
}

.staff-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  transition: background 0.15s;
}

.staff-card:hover {
  background: #f8fafc;
}

.staff-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.staff-info {
  flex: 1;
}

.staff-name {
  display: block;
  font-weight: 600;
  color: #1e293b;
}

.staff-role {
  font-size: 14px;
  color: #64748b;
}

.staff-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.staff-status.active {
  background: #d1fae5;
  color: #059669;
}

.staff-status.pto {
  background: #fef3c7;
  color: #d97706;
}

.quick-actions {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.action-card:hover {
  background: #0ea5e9;
  color: white;
  border-color: #0ea5e9;
}

.action-card:hover .action-icon {
  color: white;
}

.action-icon {
  width: 20px;
  height: 20px;
  color: #0ea5e9;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
