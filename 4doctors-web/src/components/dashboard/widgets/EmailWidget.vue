<template>
  <div class="widget-card">
    <div class="widget-header">
      <Mail class="widget-icon" />
      <h3 class="widget-title">{{ title }}</h3>
      <span class="widget-badge">{{ emails.length }}</span>
    </div>
    
    <div class="widget-content">
      <div 
        v-for="email in emails.slice(0, 5)" 
        :key="email.id" 
        class="email-item"
        :class="{ unread: !email.isRead }"
      >
        <ModeBadge :mode="email.mode" class="email-mode" />
        <div class="email-content">
          <p class="email-subject">{{ email.subject }}</p>
          <p class="email-from">{{ email.from }}</p>
        </div>
        <span class="email-time">{{ formatTime(email.receivedAt) }}</span>
      </div>
      
      <div v-if="emails.length === 0" class="empty-state">
        No emails to display
      </div>
    </div>
    
    <button class="widget-footer-btn" @click="$emit('viewAll')">
      View All Emails →
    </button>
  </div>
</template>

<script setup lang="ts">
import { Mail } from 'lucide-vue-next';
import ModeBadge from '@/components/core/ModeBadge.vue';
import type { URPAMode } from '@/types/mode';

interface Email {
  id: string;
  subject: string;
  from: string;
  mode: URPAMode;
  isRead: boolean;
  receivedAt: Date;
}

defineProps<{
  title?: string;
  emails: Email[];
}>();

defineEmits(['viewAll']);

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString();
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
  color: #6366f1;
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

.email-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.email-item:hover {
  background: #f8fafc;
}

.email-item.unread {
  background: #f0f9ff;
}

.email-mode {
  flex-shrink: 0;
  margin-top: 2px;
}

.email-content {
  flex: 1;
  min-width: 0;
}

.email-subject {
  font-weight: 500;
  font-size: 14px;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.email-from {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.email-time {
  font-size: 11px;
  color: #94a3b8;
  flex-shrink: 0;
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
  color: #6366f1;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.widget-footer-btn:hover {
  background: #f1f5f9;
}
</style>
