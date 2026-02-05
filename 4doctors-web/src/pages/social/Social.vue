<template>
  <div class="social-page">
    <header class="page-header">
      <div class="header-content">
        <MessageCircle class="header-icon" />
        <div>
          <h1 class="page-title">Social</h1>
          <p class="page-subtitle">Personal messages, networks, and connections</p>
        </div>
      </div>
    </header>

    <ModeBadge mode="personal" :show-label="true" class="mode-indicator" />

    <div class="social-grid">
      <div class="messages-panel">
        <h2 class="section-title">Recent Messages</h2>
        <div class="message-item" v-for="msg in messages" :key="msg.id">
          <div class="message-avatar">{{ msg.initials }}</div>
          <div class="message-content">
            <span class="message-name">{{ msg.name }}</span>
            <span class="message-preview">{{ msg.preview }}</span>
          </div>
          <span class="message-time">{{ msg.time }}</span>
        </div>
      </div>
      
      <div class="networks-panel">
        <h2 class="section-title">Connected Accounts</h2>
        <div class="network-item" v-for="network in networks" :key="network.id">
          <span class="network-icon">{{ network.emoji }}</span>
          <span class="network-name">{{ network.name }}</span>
          <span class="network-status" :class="network.status">{{ network.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MessageCircle } from 'lucide-vue-next';
import ModeBadge from '@/components/core/ModeBadge.vue';

const messages = ref([
  { id: 1, name: 'John (Brother)', preview: 'Are we still on for dinner tomorrow?', initials: 'JB', time: '2h' },
  { id: 2, name: 'Mom', preview: 'Called to check in. Call back when free!', initials: 'M', time: '5h' },
  { id: 3, name: 'College Friends Group', preview: 'Dave: Reunion in June confirmed!', initials: 'CF', time: '1d' },
]);

const networks = ref([
  { id: 1, name: 'LinkedIn', emoji: '💼', status: 'connected' },
  { id: 2, name: 'Facebook', emoji: '📘', status: 'connected' },
  { id: 3, name: 'Google', emoji: '🔴', status: 'connected' },
  { id: 4, name: 'Twitter/X', emoji: '🐦', status: 'disconnected' },
]);
</script>

<style scoped>
.social-page {
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

.mode-indicator {
  width: fit-content;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}

.social-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.messages-panel, .networks-panel {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  transition: background 0.15s;
  cursor: pointer;
}

.message-item:hover {
  background: #f8fafc;
}

.message-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-content {
  flex: 1;
}

.message-name {
  display: block;
  font-weight: 600;
  color: #1e293b;
}

.message-preview {
  font-size: 14px;
  color: #64748b;
}

.message-time {
  font-size: 12px;
  color: #94a3b8;
}

.network-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: #f8fafc;
  margin-bottom: 8px;
}

.network-icon {
  font-size: 24px;
}

.network-name {
  flex: 1;
  font-weight: 600;
  color: #1e293b;
}

.network-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.network-status.connected {
  background: #d1fae5;
  color: #059669;
}

.network-status.disconnected {
  background: #fee2e2;
  color: #dc2626;
}
</style>
