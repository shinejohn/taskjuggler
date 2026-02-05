<template>
  <div class="clinical-tasks-widget">
    <div class="widget-header">
      <h3 class="widget-title">
        <ClipboardCheck class="title-icon" />
        Clinical Tasks
      </h3>
      <span class="task-count">{{ pendingCount }} pending</span>
    </div>
    
    <div class="tasks-list">
      <div 
        class="task-item" 
        v-for="task in prioritizedTasks" 
        :key="task.id"
        :class="{ completed: task.completed }"
      >
        <button 
          class="task-checkbox"
          :class="{ checked: task.completed }"
          @click="toggleTask(task.id)"
        >
          <Check v-if="task.completed" class="check-icon" />
        </button>
        <div class="task-content">
          <div class="task-label">
            <span class="task-priority" :class="task.priority"></span>
            <span class="task-title">{{ task.title }}</span>
          </div>
          <div class="task-meta">
            <span class="task-patient" v-if="task.patient">{{ task.patient }}</span>
            <span class="task-due">Due: {{ task.due }}</span>
          </div>
        </div>
        <ModeBadge mode="practice" class="task-badge" />
      </div>
    </div>
    
    <button class="view-all-btn">
      View All Clinical Tasks →
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ClipboardCheck, Check } from 'lucide-vue-next';
import ModeBadge from '@/components/core/ModeBadge.vue';

const tasks = ref([
  { id: 1, title: 'Sign lab results for Johnson', patient: 'Sarah Johnson', due: 'Today', priority: 'high', completed: false },
  { id: 2, title: 'Review MRI report', patient: 'John Smith', due: 'Today', priority: 'high', completed: false },
  { id: 3, title: 'Complete prior auth', patient: 'Maria Garcia', due: 'Today', priority: 'medium', completed: true },
  { id: 4, title: 'Call pharmacy about Rx', patient: 'Robert Chen', due: 'Today', priority: 'medium', completed: false },
  { id: 5, title: 'Update treatment plan', patient: 'Lisa Williams', due: 'Tomorrow', priority: 'low', completed: false },
]);

const prioritizedTasks = computed(() => {
  const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  return [...tasks.value].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99);
  });
});

const pendingCount = computed(() => tasks.value.filter(t => !t.completed).length);

const toggleTask = (id: number) => {
  const task = tasks.value.find(t => t.id === id);
  if (task) task.completed = !task.completed;
};
</script>

<style scoped>
.clinical-tasks-widget {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.widget-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.title-icon {
  width: 20px;
  height: 20px;
  color: #8b5cf6;
}

.task-count {
  font-size: 13px;
  font-weight: 600;
  color: #8b5cf6;
  background: #ede9fe;
  padding: 4px 12px;
  border-radius: 20px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.15s;
}

.task-item:hover {
  background: #f8fafc;
}

.task-item.completed {
  opacity: 0.6;
}

.task-item.completed .task-title {
  text-decoration: line-through;
}

.task-checkbox {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid #d1d5db;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
  margin-top: 2px;
}

.task-checkbox:hover {
  border-color: #8b5cf6;
}

.task-checkbox.checked {
  background: #8b5cf6;
  border-color: #8b5cf6;
}

.check-icon {
  width: 14px;
  height: 14px;
  color: white;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-priority {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.task-priority.high { background: #ef4444; }
.task-priority.medium { background: #f59e0b; }
.task-priority.low { background: #a3e635; }

.task-title {
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
}

.task-meta {
  display: flex;
  gap: 16px;
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}

.task-patient {
  color: #8b5cf6;
  font-weight: 500;
}

.task-badge {
  flex-shrink: 0;
}

.view-all-btn {
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #8b5cf6;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.view-all-btn:hover {
  background: #ede9fe;
  border-color: #8b5cf6;
}
</style>
