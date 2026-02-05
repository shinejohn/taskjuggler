<template>
  <div class="referrals-page">
    <header class="page-header">
      <div class="header-content">
        <Send class="header-icon" />
        <div>
          <h1 class="page-title">Referrals</h1>
          <p class="page-subtitle">Manage patient referrals and specialist consults</p>
        </div>
      </div>
      <button class="add-btn">
        <Plus class="add-icon" />
        New Referral
      </button>
    </header>

    <ModeBadge mode="practice" :show-label="true" class="mode-indicator" />

    <div class="stats-grid">
      <div class="stat-card">
        <Send class="stat-icon outgoing" />
        <div class="stat-content">
          <span class="stat-value">12</span>
          <span class="stat-label">Outgoing</span>
        </div>
      </div>
      <div class="stat-card">
        <ArrowDownToLine class="stat-icon incoming" />
        <div class="stat-content">
          <span class="stat-value">5</span>
          <span class="stat-label">Incoming</span>
        </div>
      </div>
      <div class="stat-card">
        <Clock class="stat-icon pending" />
        <div class="stat-content">
          <span class="stat-value">3</span>
          <span class="stat-label">Awaiting Response</span>
        </div>
      </div>
      <div class="stat-card">
        <CheckCircle class="stat-icon completed" />
        <div class="stat-content">
          <span class="stat-value">28</span>
          <span class="stat-label">Completed (30d)</span>
        </div>
      </div>
    </div>

    <div class="referrals-grid">
      <!-- Outgoing Referrals -->
      <div class="referral-section">
        <h2 class="section-title">
          <Send class="section-icon" /> Outgoing Referrals
        </h2>
        <div class="referral-list">
          <div class="referral-card" v-for="ref in outgoingReferrals" :key="ref.id">
            <div class="referral-header">
              <span class="patient-name">{{ ref.patient }}</span>
              <span class="referral-status" :class="ref.status">{{ ref.status }}</span>
            </div>
            <div class="referral-details">
              <div class="detail-row">
                <span class="label">Specialist:</span>
                <span class="value">{{ ref.specialist }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Reason:</span>
                <span class="value">{{ ref.reason }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Sent:</span>
                <span class="value">{{ ref.date }}</span>
              </div>
            </div>
            <div class="referral-actions">
              <button class="action-btn">View Details</button>
              <button class="action-btn secondary">Follow Up</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Incoming Referrals -->
      <div class="referral-section">
        <h2 class="section-title">
          <ArrowDownToLine class="section-icon" /> Incoming Referrals
        </h2>
        <div class="referral-list">
          <div class="referral-card incoming" v-for="ref in incomingReferrals" :key="ref.id">
            <div class="referral-header">
              <span class="patient-name">{{ ref.patient }}</span>
              <span class="referral-status" :class="ref.status">{{ ref.status }}</span>
            </div>
            <div class="referral-details">
              <div class="detail-row">
                <span class="label">From:</span>
                <span class="value">{{ ref.referringDoctor }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Reason:</span>
                <span class="value">{{ ref.reason }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Urgency:</span>
                <span class="value urgency" :class="ref.urgency">{{ ref.urgency }}</span>
              </div>
            </div>
            <div class="referral-actions">
              <button class="action-btn primary">Accept & Schedule</button>
              <button class="action-btn">Review Records</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Send, Plus, ArrowDownToLine, Clock, CheckCircle } from 'lucide-vue-next';
import ModeBadge from '@/components/core/ModeBadge.vue';

const outgoingReferrals = ref([
  { id: 1, patient: 'Sarah Johnson', specialist: 'Dr. Martinez - Cardiology', reason: 'Cardiac evaluation', date: 'Jan 28, 2026', status: 'pending' },
  { id: 2, patient: 'John Smith', specialist: 'Dr. Lee - Neurology', reason: 'Chronic headaches', date: 'Jan 25, 2026', status: 'scheduled' },
  { id: 3, patient: 'Maria Garcia', specialist: 'Dr. Patel - Endocrinology', reason: 'Thyroid management', date: 'Jan 20, 2026', status: 'completed' },
]);

const incomingReferrals = ref([
  { id: 1, patient: 'Robert Chen', referringDoctor: 'Dr. Williams - Family Medicine', reason: 'Hypertension management', urgency: 'routine', status: 'new' },
  { id: 2, patient: 'Lisa Williams', referringDoctor: 'Dr. Brown - Urgent Care', reason: 'Chest pain evaluation', urgency: 'urgent', status: 'new' },
]);
</script>

<style scoped>
.referrals-page {
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

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  color: #6d28d9;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
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

.stat-icon.outgoing { color: #8b5cf6; }
.stat-icon.incoming { color: #3b82f6; }
.stat-icon.pending { color: #f59e0b; }
.stat-icon.completed { color: #10b981; }

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

.referrals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.referral-section {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
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

.section-icon {
  width: 20px;
  height: 20px;
  color: #8b5cf6;
}

.referral-card {
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.2s;
}

.referral-card:hover {
  border-color: #8b5cf6;
}

.referral-card.incoming {
  border-left: 4px solid #3b82f6;
}

.referral-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.patient-name {
  font-weight: 700;
  color: #1e293b;
}

.referral-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
}

.referral-status.pending { background: #fef3c7; color: #d97706; }
.referral-status.scheduled { background: #dbeafe; color: #2563eb; }
.referral-status.completed { background: #d1fae5; color: #059669; }
.referral-status.new { background: #ede9fe; color: #7c3aed; }

.referral-details {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 14px;
}

.detail-row .label {
  color: #64748b;
  min-width: 70px;
}

.detail-row .value {
  color: #1e293b;
}

.value.urgency.urgent {
  color: #dc2626;
  font-weight: 600;
}

.value.urgency.routine {
  color: #059669;
}

.referral-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn:hover {
  background: #f8fafc;
}

.action-btn.primary {
  background: #8b5cf6;
  color: white;
  border: none;
}

.action-btn.primary:hover {
  background: #7c3aed;
}
</style>
