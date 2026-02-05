<template>
  <div class="widget-card">
    <div class="widget-header">
      <Calendar class="widget-icon" />
      <h3 class="widget-title">{{ title }}</h3>
      <span class="widget-date">{{ formattedDate }}</span>
    </div>
    
    <div class="widget-content">
      <div 
        v-for="event in events.slice(0, 6)" 
        :key="event.id" 
        class="event-item"
        :class="{ current: isCurrentEvent(event), past: isPastEvent(event) }"
      >
        <div class="event-time">
          <span class="time-hour">{{ formatHour(event.startTime) }}</span>
          <span class="time-period">{{ formatPeriod(event.startTime) }}</span>
        </div>
        <div class="event-indicator" :style="{ background: getModeColor(event.mode) }"></div>
        <div class="event-content">
          <p class="event-title">{{ event.title }}</p>
          <p class="event-subtitle">{{ event.subtitle }}</p>
        </div>
        <ModeBadge :mode="event.mode" />
      </div>
      
      <div v-if="events.length === 0" class="empty-state">
        No events scheduled
      </div>
    </div>
    
    <button class="widget-footer-btn" @click="$emit('viewAll')">
      View Full Schedule →
    </button>
  </div>
</template>

<script setup lang="ts">
import { Calendar } from 'lucide-vue-next';
import ModeBadge from '@/components/core/ModeBadge.vue';
import type { URPAMode } from '@/types/mode';
import { computed } from 'vue';

interface CalendarEvent {
  id: string;
  title: string;
  subtitle?: string;
  mode: URPAMode;
  startTime: Date;
  endTime: Date;
}

const props = defineProps<{
  title?: string;
  events: CalendarEvent[];
  date?: Date;
}>();

defineEmits(['viewAll']);

const formattedDate = computed(() => {
  const d = props.date || new Date();
  return new Date(d).toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
});

function formatHour(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', { 
    hour: 'numeric',
    hour12: true 
  }).replace(/\s*(AM|PM)/, '');
}

function formatPeriod(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', { 
    hour: 'numeric',
    hour12: true 
  }).includes('PM') ? 'PM' : 'AM';
}

function isCurrentEvent(event: CalendarEvent): boolean {
  const now = new Date();
  return new Date(event.startTime) <= now && new Date(event.endTime) >= now;
}

function isPastEvent(event: CalendarEvent): boolean {
  return new Date(event.endTime) < new Date();
}

function getModeColor(mode: URPAMode): string {
  switch (mode) {
    case 'practice': return '#7c3aed';
    case 'business': return '#0ea5e9';
    case 'personal': return '#10b981';
    default: return '#6366f1';
  }
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
  color: #f59e0b;
}

.widget-title {
  flex: 1;
  font-weight: 600;
  font-size: 15px;
  color: #1e293b;
}

.widget-date {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.widget-content {
  flex: 1;
  padding: 8px;
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 8px;
  border-radius: 8px;
  transition: background 0.15s;
}

.event-item:hover {
  background: #f8fafc;
}

.event-item.current {
  background: #fef3c7;
  border-left: 3px solid #f59e0b;
}

.event-item.past {
  opacity: 0.5;
}

.event-time {
  width: 40px;
  text-align: center;
  flex-shrink: 0;
}

.time-hour {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.time-period {
  display: block;
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.event-indicator {
  width: 3px;
  height: 36px;
  border-radius: 2px;
  flex-shrink: 0;
}

.event-content {
  flex: 1;
  min-width: 0;
}

.event-title {
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-subtitle {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
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
  color: #f59e0b;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.widget-footer-btn:hover {
  background: #f1f5f9;
}
</style>
