<template>
  <div class="goals-page">
    <header class="page-header">
      <div class="header-content">
        <Target class="header-icon" />
        <div>
          <h1 class="page-title">Goals</h1>
          <p class="page-subtitle">Track personal and professional goals</p>
        </div>
      </div>
      <button class="add-btn">
        <Plus class="add-icon" />
        New Goal
      </button>
    </header>

    <ModeBadge mode="personal" :show-label="true" class="mode-indicator" />

    <div class="goals-grid">
      <div class="goal-card" v-for="goal in goals" :key="goal.id">
        <div class="goal-header">
          <span class="goal-emoji">{{ goal.emoji }}</span>
          <span class="goal-category" :class="goal.category">{{ goal.categoryLabel }}</span>
        </div>
        <h3 class="goal-title">{{ goal.title }}</h3>
        <p class="goal-description">{{ goal.description }}</p>
        <div class="goal-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: goal.progress + '%' }"></div>
          </div>
          <span class="progress-text">{{ goal.progress }}% complete</span>
        </div>
        <div class="goal-footer">
          <span class="goal-deadline">{{ goal.deadline }}</span>
          <span class="goal-streak" v-if="goal.streak">🔥 {{ goal.streak }} day streak</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Target, Plus } from 'lucide-vue-next';
import ModeBadge from '@/components/core/ModeBadge.vue';

const goals = ref([
  { id: 1, title: 'Run a marathon', description: 'Complete the Boston Marathon', emoji: '🏃', category: 'health', categoryLabel: 'Health', progress: 68, deadline: 'Apr 2026', streak: 12 },
  { id: 2, title: 'Learn Spanish', description: '30 minutes daily practice', emoji: '🇪🇸', category: 'learning', categoryLabel: 'Learning', progress: 45, deadline: 'Dec 2026', streak: 7 },
  { id: 3, title: 'Publish research paper', description: 'Cardiology case study', emoji: '📝', category: 'career', categoryLabel: 'Career', progress: 82, deadline: 'Mar 2026', streak: null },
  { id: 4, title: 'Family trip to Japan', description: 'Plan and book 2-week vacation', emoji: '✈️', category: 'family', categoryLabel: 'Family', progress: 30, deadline: 'Jul 2026', streak: null },
  { id: 5, title: 'Read 24 books', description: '2 books per month', emoji: '📚', category: 'personal', categoryLabel: 'Personal', progress: 12, deadline: 'Dec 2026', streak: null },
  { id: 6, title: 'Emergency fund', description: 'Save 6 months expenses', emoji: '💰', category: 'financial', categoryLabel: 'Financial', progress: 75, deadline: 'Jun 2026', streak: null },
]);
</script>

<style scoped>
.goals-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #10b981, #059669);
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
  color: #059669;
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

.goals-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.goal-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  transition: all 0.2s;
}

.goal-card:hover {
  border-color: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.goal-emoji {
  font-size: 32px;
}

.goal-category {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.goal-category.health { background: #fce7f3; color: #be185d; }
.goal-category.learning { background: #dbeafe; color: #2563eb; }
.goal-category.career { background: #fef3c7; color: #d97706; }
.goal-category.family { background: #d1fae5; color: #059669; }
.goal-category.personal { background: #e0e7ff; color: #4f46e5; }
.goal-category.financial { background: #dcfce7; color: #16a34a; }

.goal-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.goal-description {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px 0;
}

.goal-progress {
  margin-bottom: 16px;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.goal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.goal-deadline {
  font-size: 13px;
  color: #64748b;
}

.goal-streak {
  font-size: 13px;
  font-weight: 600;
  color: #f59e0b;
}
</style>
