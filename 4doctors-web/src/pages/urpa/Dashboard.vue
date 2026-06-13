<template>
  <div class="urpa-dashboard">
    <!-- Welcome Header -->
    <header class="dashboard-header" :class="[`mode-${currentMode}`]">
      <div class="header-content">
        <h1 class="header-title">{{ greeting }}, Dr. Shine</h1>
        <p class="header-subtitle">{{ headerMessage }}</p>
        
        <button class="urpa-voice-btn" @click="activateVoice">
          <Mic class="voice-icon" />
          "Hey URPA, what's next?"
        </button>
      </div>
      <Bot class="header-decoration" />
    </header>

    <!-- Mode Filter Pills (for unified view) -->
    <div v-if="currentMode === 'all'" class="mode-pills">
      <button 
        v-for="mode in filterModes" 
        :key="mode.value"
        class="mode-pill"
        :class="{ active: activeFilter === mode.value || activeFilter === 'all' }"
        @click="toggleFilter(mode.value)"
      >
        <span class="pill-icon">{{ mode.icon }}</span>
        <span class="pill-label">{{ mode.label }}</span>
      </button>
    </div>

    <!-- Main Dashboard Grid -->
    <div class="dashboard-grid">
      <!-- Left Column: Primary Widgets -->
      <div class="grid-primary">
        <!-- Clinical Overview (Practice Mode Only) -->
        <ClinicalWidget
          v-if="showPractice"
          :stats="clinicalStats"
          @navigate="navigateTo"
        />

        <!-- Calendar Widget -->
        <CalendarWidget
          title="Today's Agenda"
          :events="filteredEvents"
          @view-all="navigateTo('/schedule')"
        />

        <!-- Active Workflows -->
        <div class="workflows-card">
          <div class="card-header">
            <GitBranch class="card-icon" />
            <h3 class="card-title">Active Workflows</h3>
          </div>
          <div class="workflows-list">
            <div 
              v-for="workflow in workflows" 
              :key="workflow.id" 
              class="workflow-item"
            >
              <ModeBadge :mode="workflow.mode" />
              <div class="workflow-info">
                <span class="workflow-name">{{ workflow.name }}</span>
                <span class="workflow-trigger">Trigger: {{ workflow.trigger }}</span>
              </div>
              <div class="workflow-status" :class="workflow.status"></div>
            </div>
          </div>
          <button class="card-action-btn" @click="navigateTo('/urpa/builder')">
            <GitBranch class="action-icon" />
            Build Automation
          </button>
        </div>
      </div>

      <!-- Right Column: Secondary Widgets -->
      <div class="grid-secondary">
        <!-- Email Widget -->
        <EmailWidget
          title="📧 Email"
          :emails="filteredEmails"
          :show-view-all="false"
        />

        <!-- Tasks Widget -->
        <TaskWidget
          title="Tasks"
          :tasks="filteredTasks"
          :show-view-all="false"
        />

        <!-- Voicemail Widget -->
        <VoicemailWidget
          title="Voicemail"
          :voicemails="filteredVoicemails"
          :show-view-all="false"
        />
      </div>

      <!-- Right Sidebar: URPA Assistant -->
      <div class="grid-assistant">
        <div class="assistant-card">
          <div class="assistant-header">
            <Bot class="assistant-icon" />
            <span class="assistant-title">URPA AI</span>
          </div>
          <div class="assistant-prompt">
            <Mic class="prompt-mic" />
            <p>How can I help<br/>you today?</p>
          </div>
          <input 
            type="text" 
            class="assistant-input" 
            placeholder="Type or speak..."
            @keyup.enter="sendMessage"
          />
          <div class="assistant-shortcuts">
            <button class="shortcut-btn">📞 Phone</button>
            <button class="shortcut-btn">✈️ Travel</button>
            <button class="shortcut-btn">🎯 Goals</button>
            <button class="shortcut-btn">📁 Files</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Bot, Mic, GitBranch } from 'lucide-vue-next';
import { useMode } from '@/composables/useMode';
import type { URPAMode } from '@/types/mode';
import api from '@/utils/api';

// Components
import ModeBadge from '@/components/core/ModeBadge.vue';
import ClinicalWidget from '@/components/dashboard/widgets/ClinicalWidget.vue';
import CalendarWidget from '@/components/dashboard/widgets/CalendarWidget.vue';
import EmailWidget from '@/components/dashboard/widgets/EmailWidget.vue';
import TaskWidget from '@/components/dashboard/widgets/TaskWidget.vue';
import VoicemailWidget from '@/components/dashboard/widgets/VoicemailWidget.vue';

const router = useRouter();
const { currentMode, getModeIcon } = useMode();

// Filter state for unified view
const activeFilter = ref<URPAMode | 'all'>('all');

const filterModes = [
  { value: 'practice' as URPAMode, icon: '🔒', label: 'Practice' },
  { value: 'business' as URPAMode, icon: '💼', label: 'Business' },
  { value: 'personal' as URPAMode, icon: '🏠', label: 'Personal' }
];

// Computed: Show sections based on mode
const showPractice = computed(() => 
  currentMode.value === 'practice' || currentMode.value === 'all'
);

// Greeting based on time of day
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
});

// State for Dashboard Data
const isLoading = ref(false);
const clinicalStats = ref({
  todaysPatients: 0,
  pendingCharts: 0,
  pendingAuths: 0,
  rxRefills: 0,
  newLabResults: 0,
  criticalLabs: 0,
  unreadMessages: 0
});

// These will be populated by the API
const allEvents = ref<any[]>([]);
const allEmails = ref<any[]>([]);
const allTasks = ref<any[]>([]);
const allVoicemails = ref<any[]>([]);
const workflows = ref<any[]>([]); // Dynamic workflows from API

// Mapped Stats from API
const headerMessage = ref('Loading your day...');

// Fetch Data from Unified API
const fetchDashboardData = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/urpa/dashboard', {
        params: { mode: currentMode.value }
    });
    
    // Update local state
    const data = response.data;
    
    // Map keys if necessary, or ensure API matches UI expectations
    allEvents.value = data.calendar || [];
    allEmails.value = data.emails || [];
    allTasks.value = data.tasks || [];
    allVoicemails.value = data.voicemails || [];
    workflows.value = data.workflows || [];
    
    if (data.stats && data.stats.clinical) {
        clinicalStats.value = data.stats.clinical;
    }
    
    if (data.stats && data.stats.message) {
        headerMessage.value = data.stats.message;
    }

  } catch (error) {
    // error handled by headerMessage below
    headerMessage.value = 'Failed to load dashboard data.';
  } finally {
    isLoading.value = false;
  }
};

// Initial Load & Watchers
onMounted(() => {
  fetchDashboardData();
});

watch(currentMode, () => {
  fetchDashboardData();
});

watch(activeFilter, () => {
    // If we are in 'all' mode and switch filters, we might want to re-fetch 
    // or just rely on the computed properties below if the API returns *all* data when mode='all'.
    // The current API design returns data based on the requested 'mode'.
    // If mode is 'all', it returns everything. So client-side filtering below is correct.
});


// Filter helpers (Client-side filtering for 'Unified View')
const filterByMode = <T extends { mode: URPAMode }>(items: T[]): T[] => {
  if (currentMode.value === 'all') {
    if (activeFilter.value === 'all') return items;
    return items.filter(item => item.mode === activeFilter.value);
  }
  return items; // Logic handled by API for specific modes, but redundancy is safe
};

const filteredEvents = computed(() => filterByMode(allEvents.value));
const filteredEmails = computed(() => filterByMode(allEmails.value));
const filteredTasks = computed(() => filterByMode(allTasks.value));
const filteredVoicemails = computed(() => filterByMode(allVoicemails.value));

// Actions
const navigateTo = (path: string) => {
  router.push(path);
};

const toggleFilter = (mode: URPAMode) => {
  activeFilter.value = activeFilter.value === mode ? 'all' : mode;
};

const activateVoice = () => {
  // TODO: hook up voice activation when the URPA voice API is available
};

const sendMessage = () => {
  // TODO: send message via URPA chat API when available
};
</script>

<style scoped>
.urpa-dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header Styles */
.dashboard-header {
  position: relative;
  padding: 32px;
  border-radius: 20px;
  overflow: hidden;
  color: white;
}

.dashboard-header.mode-practice {
  background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
}

.dashboard-header.mode-business {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
}

.dashboard-header.mode-personal {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.dashboard-header.mode-all {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
}

.header-content {
  position: relative;
  z-index: 1;
}

.header-title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
}

.header-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 24px;
}

.urpa-voice-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: white;
  color: #7c3aed;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.urpa-voice-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.voice-icon {
  width: 20px;
  height: 20px;
}

.header-decoration {
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 180px;
  height: 180px;
  opacity: 0.15;
  transform: rotate(15deg);
}

/* Mode Filter Pills */
.mode-pills {
  display: flex;
  gap: 8px;
}

.mode-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
}

.mode-pill:hover,
.mode-pill.active {
  background: #f8fafc;
  border-color: #6366f1;
  color: #6366f1;
}

.pill-icon {
  font-size: 14px;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 280px;
  gap: 24px;
}

.grid-primary,
.grid-secondary {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Workflows Card */
.workflows-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.card-icon {
  width: 20px;
  height: 20px;
  color: #8b5cf6;
}

.card-title {
  flex: 1;
  font-weight: 600;
  font-size: 15px;
  color: #1e293b;
}

.workflows-list {
  padding: 12px;
}

.workflow-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
}

.workflow-item:hover {
  border-color: #8b5cf6;
  background: white;
}

.workflow-info {
  flex: 1;
}

.workflow-name {
  display: block;
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
}

.workflow-trigger {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.workflow-status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.workflow-status.active {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.card-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: #faf5ff;
  border: 1px dashed #c4b5fd;
  color: #7c3aed;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
}

.card-action-btn:hover {
  background: #7c3aed;
  color: white;
  border-style: solid;
}

.action-icon {
  width: 16px;
  height: 16px;
}

/* Assistant Card */
.assistant-card {
  background: linear-gradient(180deg, #f8fafc 0%, white 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  position: sticky;
  top: 100px;
}

.assistant-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.assistant-icon {
  width: 28px;
  height: 28px;
  color: #7c3aed;
}

.assistant-title {
  font-weight: 700;
  font-size: 18px;
  color: #1e293b;
}

.assistant-prompt {
  text-align: center;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 16px;
}

.prompt-mic {
  width: 32px;
  height: 32px;
  color: #7c3aed;
  margin-bottom: 8px;
}

.assistant-prompt p {
  font-size: 16px;
  color: #64748b;
  line-height: 1.4;
}

.assistant-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  margin-bottom: 16px;
  transition: border-color 0.15s;
}

.assistant-input:focus {
  outline: none;
  border-color: #7c3aed;
}

.assistant-shortcuts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.shortcut-btn {
  padding: 10px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.shortcut-btn:hover {
  background: #f8fafc;
  border-color: #7c3aed;
}

/* Responsive */
@media (max-width: 1400px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .grid-assistant {
    grid-column: span 2;
  }
  
  .assistant-card {
    position: static;
  }
  
  .assistant-shortcuts {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .grid-assistant {
    grid-column: span 1;
  }
}
</style>
