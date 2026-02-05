<template>
  <div class="widget-card clinical">
    <div class="widget-header">
      <Activity class="widget-icon" />
      <h3 class="widget-title">Clinical Overview</h3>
      <span class="hipaa-tag">🔒 HIPAA</span>
    </div>
    
    <div class="widget-content">
      <div class="stats-grid">
        <div class="stat-item" @click="$emit('navigate', '/patients')">
          <Users class="stat-icon patients" />
          <div class="stat-info">
            <span class="stat-value">{{ stats.todaysPatients }}</span>
            <span class="stat-label">Today's Patients</span>
          </div>
        </div>
        
        <div class="stat-item" @click="$emit('navigate', '/scribe')">
          <FileText class="stat-icon charts" />
          <div class="stat-info">
            <span class="stat-value" :class="{ warning: stats.pendingCharts > 0 }">{{ stats.pendingCharts }}</span>
            <span class="stat-label">Pending Charts</span>
          </div>
        </div>
        
        <div class="stat-item" @click="$emit('navigate', '/prior-auth')">
          <Shield class="stat-icon auth" />
          <div class="stat-info">
            <span class="stat-value" :class="{ warning: stats.pendingAuths > 0 }">{{ stats.pendingAuths }}</span>
            <span class="stat-label">Prior Auths</span>
          </div>
        </div>
        
        <div class="stat-item" @click="$emit('navigate', '/rx')">
          <Pill class="stat-icon rx" />
          <div class="stat-info">
            <span class="stat-value">{{ stats.rxRefills }}</span>
            <span class="stat-label">Rx Refills</span>
          </div>
        </div>
        
        <div class="stat-item">
          <FlaskConical class="stat-icon labs" />
          <div class="stat-info">
            <span class="stat-value" :class="{ critical: stats.criticalLabs > 0 }">{{ stats.newLabResults }}</span>
            <span class="stat-label">Lab Results</span>
          </div>
        </div>
        
        <div class="stat-item">
          <MessageSquare class="stat-icon messages" />
          <div class="stat-info">
            <span class="stat-value">{{ stats.unreadMessages }}</span>
            <span class="stat-label">Messages</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="quick-actions">
      <button class="action-btn" @click="$emit('navigate', '/scribe')">
        <Mic class="action-icon" />
        Open ScribeMD
      </button>
      <button class="action-btn" @click="$emit('navigate', '/schedule')">
        <Calendar class="action-icon" />
        View Schedule
      </button>
      <button class="action-btn" @click="$emit('navigate', '/prior-auth')">
        <Shield class="action-icon" />
        Prior Auth Queue
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Activity, Users, FileText, Shield, Pill, FlaskConical, 
  MessageSquare, Mic, Calendar 
} from 'lucide-vue-next';

interface ClinicalStats {
  todaysPatients: number;
  pendingCharts: number;
  pendingAuths: number;
  rxRefills: number;
  newLabResults: number;
  criticalLabs: number;
  unreadMessages: number;
}

withDefaults(defineProps<{
  stats: ClinicalStats;
}>(), {
  stats: () => ({
    todaysPatients: 0,
    pendingCharts: 0,
    pendingAuths: 0,
    rxRefills: 0,
    newLabResults: 0,
    criticalLabs: 0,
    unreadMessages: 0
  })
});

defineEmits(['navigate']);
</script>

<style scoped>
.widget-card.clinical {
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  border-radius: 16px;
  border: 1px solid #ddd6fe;
  overflow: hidden;
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border-bottom: 1px solid rgba(124, 58, 237, 0.1);
}

.widget-icon {
  width: 24px;
  height: 24px;
  color: #7c3aed;
}

.widget-title {
  flex: 1;
  font-weight: 700;
  font-size: 17px;
  color: #1e1b4b;
}

.hipaa-tag {
  font-size: 11px;
  font-weight: 600;
  color: #7c3aed;
  background: white;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid #c4b5fd;
}

.widget-content {
  padding: 16px 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.stat-item:hover {
  border-color: #7c3aed;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
}

.stat-icon {
  width: 22px;
  height: 22px;
}

.stat-icon.patients { color: #3b82f6; }
.stat-icon.charts { color: #f59e0b; }
.stat-icon.auth { color: #8b5cf6; }
.stat-icon.rx { color: #06b6d4; }
.stat-icon.labs { color: #10b981; }
.stat-icon.messages { color: #ec4899; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: #1e1b4b;
  line-height: 1;
}

.stat-value.warning {
  color: #f59e0b;
}

.stat-value.critical {
  color: #ef4444;
}

.stat-label {
  font-size: 11px;
  color: #64748b;
  margin-top: 3px;
}

.quick-actions {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid rgba(124, 58, 237, 0.1);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  background: white;
  border: 1px solid #c4b5fd;
  border-radius: 8px;
  color: #7c3aed;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #7c3aed;
  color: white;
  border-color: #7c3aed;
}

.action-icon {
  width: 14px;
  height: 14px;
}
</style>
