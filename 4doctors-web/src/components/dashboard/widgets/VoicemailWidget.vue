<template>
  <div class="widget-card voicemail">
    <div class="widget-header">
      <Phone class="widget-icon" />
      <h3 class="widget-title">{{ title }}</h3>
      <span class="widget-badge" :class="{ highlight: voicemails.some(v => !v.listened) }">
        {{ voicemails.filter(v => !v.listened).length }}
      </span>
    </div>
    
    <div class="widget-content">
      <div 
        v-for="vm in voicemails.slice(0, 4)" 
        :key="vm.id" 
        class="voicemail-item"
        :class="{ unlistened: !vm.listened }"
        @click="$emit('play', vm.id)"
      >
        <div class="vm-avatar">
          <User class="avatar-icon" />
        </div>
        <div class="vm-content">
          <div class="vm-header">
            <ModeBadge :mode="vm.mode" />
            <span class="vm-caller">{{ vm.callerName || vm.callerNumber }}</span>
          </div>
          <p class="vm-preview">{{ vm.transcription || 'No transcription available' }}</p>
          <div class="vm-meta">
            <span class="vm-duration">{{ formatDuration(vm.duration) }}</span>
            <span class="vm-time">{{ formatTime(vm.receivedAt) }}</span>
          </div>
        </div>
        <button class="play-btn" @click.stop="$emit('play', vm.id)">
          <Play class="play-icon" />
        </button>
      </div>
      
      <div v-if="voicemails.length === 0" class="empty-state">
        No voicemails
      </div>
    </div>
    
    <button class="widget-footer-btn" @click="$emit('viewAll')">
      View All Voicemails →
    </button>
  </div>
</template>

<script setup lang="ts">
import { Phone, User, Play } from 'lucide-vue-next';
import ModeBadge from '@/components/core/ModeBadge.vue';
import type { URPAMode } from '@/types/mode';

interface Voicemail {
  id: string;
  callerName?: string;
  callerNumber: string;
  mode: URPAMode;
  duration: number; // seconds
  transcription?: string;
  listened: boolean;
  receivedAt: Date;
}

defineProps<{
  title?: string;
  voicemails: Voicemail[];
}>();

defineEmits(['viewAll', 'play']);

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTime(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return d.toLocaleDateString();
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
  color: #8b5cf6;
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

.widget-badge.highlight {
  background: #ef4444;
  color: white;
}

.widget-content {
  flex: 1;
  padding: 8px;
}

.voicemail-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.voicemail-item:hover {
  background: #f8fafc;
}

.voicemail-item.unlistened {
  background: #faf5ff;
}

.vm-avatar {
  width: 36px;
  height: 36px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-icon {
  width: 18px;
  height: 18px;
  color: #64748b;
}

.vm-content {
  flex: 1;
  min-width: 0;
}

.vm-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.vm-caller {
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
}

.vm-preview {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vm-meta {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.vm-duration,
.vm-time {
  font-size: 11px;
  color: #94a3b8;
}

.play-btn {
  width: 32px;
  height: 32px;
  background: #8b5cf6;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.15s;
}

.play-btn:hover {
  transform: scale(1.1);
}

.play-icon {
  width: 14px;
  height: 14px;
  color: white;
  margin-left: 2px;
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
  color: #8b5cf6;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.widget-footer-btn:hover {
  background: #f1f5f9;
}
</style>
