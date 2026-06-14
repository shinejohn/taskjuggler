<template>
  <div class="widget-card">
    <div class="widget-header">
      <CheckSquare class="widget-icon" />
      <h3 class="widget-title">{{ title }}</h3>
      <span class="widget-badge">{{ tasks.length }}</span>
    </div>
    
    <div class="widget-content">
      <div 
        v-for="task in tasks.slice(0, 6)" 
        :key="task.id" 
        class="task-item"
        :class="{ completed: task.completed, 'high-priority': task.priority === 'high' }"
      >
        <div class="task-checkbox" @click="$emit('toggleTask', task.id)">
          <Check v-if="task.completed" class="check-icon" />
        </div>
        <ModeBadge :mode="task.mode" class="task-mode" />
        <span class="task-title">{{ task.title }}</span>
        <span v-if="task.dueDate" class="task-due" :class="{ overdue: isOverdue(task.dueDate) }">
          {{ formatDue(task.dueDate) }}
        </span>
      </div>
      
      <div v-if="tasks.length === 0" class="empty-state">
        No tasks to display
      </div>
    </div>
    
    <button v-if="showViewAll" type="button" class="widget-footer-btn" @click="$emit('viewAll')">
      View All Tasks →
    </button>
  </div>
</template>

<script setup lang="ts">
import { CheckSquare, Check } from 'lucide-vue-next';
import ModeBadge from '@/components/core/ModeBadge.vue';
import type { URPAMode } from '@/types/mode';

interface Task {
  id: string;
  title: string;
  mode: URPAMode;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
}

withDefaults(defineProps<{
  title?: string;
  tasks: Task[];
  showViewAll?: boolean;
}>(), { showViewAll: true });

defineEmits(['viewAll', 'toggleTask']);

function isOverdue(date: Date): boolean {
  return new Date(date) < new Date();
}

function formatDue(date: Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
</script>

<style scoped>
.widget-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.widget-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.widget-icon {
  width: 20px;
  height: 20px;
  color: #10b981;
}

.widget-title {
  flex: 1;
  font-weight: 600;
  font-size: 15px;
  color: #1e293b;
}

.widget-badge {
  background: #f1f5f9;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
}

.widget-content {
  flex: 1;
  padding: 8px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 8px;
  border-radius: 8px;
  transition: background 0.15s;
}

.task-item:hover {
  background: #f8fafc;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #94a3b8;
}

.task-item.high-priority {
  border-left: 3px solid #ef4444;
  padding-left: 5px;
}

.task-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}

.task-checkbox:hover {
  border-color: #10b981;
}

.task-item.completed .task-checkbox {
  background: #10b981;
  border-color: #10b981;
}

.check-icon {
  width: 12px;
  height: 12px;
  color: white;
}

.task-mode {
  flex-shrink: 0;
}

.task-title {
  flex: 1;
  font-size: 14px;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-due {
  font-size: 11px;
  color: #64748b;
  flex-shrink: 0;
}

.task-due.overdue {
  color: #ef4444;
  font-weight: 600;
}

.empty-state {
  padding: 24px;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
}

.widget-footer-btn {
  display: block;
  width: 100%;
  padding: 12px;
  background: #f8fafc;
  border: none;
  border-top: 1px solid #e2e8f0;
  color: #10b981;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.widget-footer-btn:hover {
  background: #f1f5f9;
}
</style>
