<template>
  <div class="cme-page">
    <header class="page-header">
      <div class="header-content">
        <GraduationCap class="header-icon" />
        <div>
          <h1 class="page-title">CME & Education</h1>
          <p class="page-subtitle">Track continuing medical education credits</p>
        </div>
      </div>
      <div class="header-progress">
        <div class="progress-ring">
          <svg viewBox="0 0 100 100">
            <circle class="bg" cx="50" cy="50" r="45" />
            <circle class="progress" cx="50" cy="50" r="45" :stroke-dasharray="`${progressPercent * 2.83} 283`" />
          </svg>
          <span class="progress-text">{{ completedCredits }}/{{ requiredCredits }}</span>
        </div>
        <span class="progress-label">Credits Complete</span>
      </div>
    </header>

    <ModeBadge mode="business" :show-label="true" class="mode-indicator" />

    <div class="stats-grid">
      <div class="stat-card">
        <BookOpen class="stat-icon blue" />
        <div>
          <span class="stat-value">{{ completedCredits }}</span>
          <span class="stat-label">Credits Earned</span>
        </div>
      </div>
      <div class="stat-card">
        <Clock class="stat-icon orange" />
        <div>
          <span class="stat-value">{{ pendingCredits }}</span>
          <span class="stat-label">Pending Verification</span>
        </div>
      </div>
      <div class="stat-card">
        <Calendar class="stat-icon purple" />
        <div>
          <span class="stat-value">{{ daysRemaining }}</span>
          <span class="stat-label">Days Until Deadline</span>
        </div>
      </div>
      <div class="stat-card">
        <Award class="stat-icon green" />
        <div>
          <span class="stat-value">{{ certifications }}</span>
          <span class="stat-label">Active Certifications</span>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <!-- Active Courses -->
      <div class="panel">
        <h2 class="panel-title">
          <Video class="panel-icon" />
          In-Progress Courses
        </h2>
        <div class="course-item" v-for="course in inProgressCourses" :key="course.id">
          <div class="course-info">
            <span class="course-title">{{ course.title }}</span>
            <span class="course-meta">{{ course.credits }} credits • {{ course.provider }}</span>
          </div>
          <div class="course-progress">
            <div class="mini-progress">
              <div class="mini-fill" :style="{ width: course.progress + '%' }"></div>
            </div>
            <span class="progress-pct">{{ course.progress }}%</span>
          </div>
          <button class="continue-btn">Continue</button>
        </div>
      </div>

      <!-- Completed Courses -->
      <div class="panel">
        <h2 class="panel-title">
          <CheckCircle class="panel-icon" />
          Completed Courses
        </h2>
        <div class="completed-item" v-for="course in completedCourses" :key="course.id">
          <div class="completed-info">
            <span class="course-title">{{ course.title }}</span>
            <span class="course-meta">{{ course.credits }} credits • Completed {{ course.completedDate }}</span>
          </div>
          <div class="course-badge">
            <CheckCircle class="badge-icon" />
            {{ course.credits }}
          </div>
        </div>
      </div>

      <!-- Upcoming Deadlines -->
      <div class="panel">
        <h2 class="panel-title">
          <AlertCircle class="panel-icon" />
          Certification Deadlines
        </h2>
        <div class="deadline-item" v-for="deadline in deadlines" :key="deadline.id" :class="deadline.urgency">
          <div class="deadline-info">
            <span class="deadline-title">{{ deadline.certification }}</span>
            <span class="deadline-date">Due: {{ deadline.dueDate }}</span>
          </div>
          <div class="deadline-status">
            <span class="credits-needed">{{ deadline.creditsNeeded }} credits needed</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { GraduationCap, BookOpen, Clock, Calendar, Award, Video, CheckCircle, AlertCircle } from 'lucide-vue-next';
import ModeBadge from '@/components/core/ModeBadge.vue';

const completedCredits = ref(32);
const requiredCredits = ref(50);
const pendingCredits = ref(5);
const daysRemaining = ref(120);
const certifications = ref(3);

const progressPercent = computed(() => (completedCredits.value / requiredCredits.value) * 100);

const inProgressCourses = ref([
  { id: 1, title: 'Advanced Cardiac Imaging', credits: 10, provider: 'AMA', progress: 65 },
  { id: 2, title: 'HIPAA Compliance 2026', credits: 2, provider: 'MedBridge', progress: 30 },
  { id: 3, title: 'Opioid Prescribing Best Practices', credits: 3, provider: 'DEA', progress: 80 },
]);

const completedCourses = ref([
  { id: 1, title: 'Atrial Fibrillation Management', credits: 8, completedDate: 'Jan 15, 2026' },
  { id: 2, title: 'Telemedicine Best Practices', credits: 5, completedDate: 'Dec 20, 2025' },
  { id: 3, title: 'Pain Management Certification', credits: 12, completedDate: 'Nov 10, 2025' },
]);

const deadlines = ref([
  { id: 1, certification: 'California Medical License', dueDate: 'Jun 30, 2026', creditsNeeded: 18, urgency: 'warning' },
  { id: 2, certification: 'DEA Certification', dueDate: 'Aug 15, 2026', creditsNeeded: 0, urgency: 'ok' },
  { id: 3, certification: 'Board Certification - Cardiology', dueDate: 'Dec 31, 2026', creditsNeeded: 25, urgency: 'ok' },
]);
</script>

<style scoped>
.cme-page {
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

.header-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-ring {
  width: 80px;
  height: 80px;
  position: relative;
}

.progress-ring svg {
  transform: rotate(-90deg);
}

.progress-ring circle {
  fill: none;
  stroke-width: 8;
}

.progress-ring .bg {
  stroke: rgba(255, 255, 255, 0.3);
}

.progress-ring .progress {
  stroke: white;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: 800;
}

.progress-label {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 4px;
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

.stat-icon { width: 28px; height: 28px; }
.stat-icon.blue { color: #3b82f6; }
.stat-icon.orange { color: #f59e0b; }
.stat-icon.purple { color: #8b5cf6; }
.stat-icon.green { color: #10b981; }

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.panel {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
}

.panel:nth-child(3) {
  grid-column: span 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.panel:nth-child(3) .panel-title {
  grid-column: span 3;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}

.panel-icon {
  width: 20px;
  height: 20px;
  color: #0ea5e9;
}

.course-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 12px;
}

.course-info {
  flex: 1;
}

.course-title {
  display: block;
  font-weight: 600;
  color: #1e293b;
}

.course-meta {
  font-size: 12px;
  color: #64748b;
}

.course-progress {
  text-align: center;
}

.mini-progress {
  width: 60px;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.mini-fill {
  height: 100%;
  background: #0ea5e9;
  border-radius: 3px;
}

.progress-pct {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

.continue-btn {
  padding: 8px 16px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.completed-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 12px;
}

.course-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #d1fae5;
  color: #059669;
  font-weight: 700;
  border-radius: 20px;
}

.badge-icon {
  width: 16px;
  height: 16px;
}

.deadline-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.deadline-item.warning {
  border-color: #fbbf24;
  background: #fffbeb;
}

.deadline-title {
  display: block;
  font-weight: 600;
  color: #1e293b;
}

.deadline-date {
  font-size: 13px;
  color: #64748b;
}

.credits-needed {
  font-size: 12px;
  font-weight: 600;
  color: #d97706;
}

.deadline-item.ok .credits-needed {
  color: #059669;
}
</style>
