<template>
  <div class="files-page">
    <header class="page-header">
      <div class="header-content">
        <FolderOpen class="header-icon" />
        <div>
          <h1 class="page-title">Files</h1>
          <p class="page-subtitle">Personal documents, photos, and storage</p>
        </div>
      </div>
      <button class="add-btn">
        <Upload class="add-icon" />
        Upload
      </button>
    </header>

    <ModeBadge mode="personal" :show-label="true" class="mode-indicator" />

    <div class="files-grid">
      <div class="folder-card" v-for="folder in folders" :key="folder.id">
        <div class="folder-icon">{{ folder.emoji }}</div>
        <div class="folder-info">
          <span class="folder-name">{{ folder.name }}</span>
          <span class="folder-count">{{ folder.count }} items</span>
        </div>
      </div>
    </div>

    <div class="recent-files">
      <h2 class="section-title">Recent Files</h2>
      <div class="file-list">
        <div class="file-item" v-for="file in files" :key="file.id">
          <span class="file-icon">{{ file.emoji }}</span>
          <div class="file-info">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-meta">{{ file.size }} • {{ file.date }}</span>
          </div>
          <button class="file-action">•••</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FolderOpen, Upload } from 'lucide-vue-next';
import ModeBadge from '@/components/core/ModeBadge.vue';

const folders = ref([
  { id: 1, name: 'Documents', count: 124, emoji: '📄' },
  { id: 2, name: 'Photos', count: 2847, emoji: '📷' },
  { id: 3, name: 'Tax Returns', count: 15, emoji: '🧾' },
  { id: 4, name: 'Travel', count: 38, emoji: '✈️' },
  { id: 5, name: 'Investments', count: 22, emoji: '📈' },
  { id: 6, name: 'Insurance', count: 8, emoji: '🛡️' },
]);

const files = ref([
  { id: 1, name: 'Tax_2025_Return.pdf', size: '2.4 MB', date: 'Jan 28', emoji: '📄' },
  { id: 2, name: 'Family_Photo_2025.jpg', size: '3.1 MB', date: 'Jan 25', emoji: '🖼️' },
  { id: 3, name: 'Home_Insurance_Policy.pdf', size: '1.8 MB', date: 'Jan 20', emoji: '📋' },
]);
</script>

<style scoped>
.files-page {
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

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.folder-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.folder-card:hover {
  border-color: #10b981;
  background: #f0fdf4;
}

.folder-icon {
  font-size: 40px;
}

.folder-info {
  text-align: center;
}

.folder-name {
  display: block;
  font-weight: 600;
  color: #1e293b;
}

.folder-count {
  font-size: 12px;
  color: #64748b;
}

.recent-files {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  transition: background 0.15s;
}

.file-item:hover {
  background: #f8fafc;
}

.file-icon {
  font-size: 28px;
}

.file-info {
  flex: 1;
}

.file-name {
  display: block;
  font-weight: 600;
  color: #1e293b;
}

.file-meta {
  font-size: 13px;
  color: #64748b;
}

.file-action {
  padding: 8px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 16px;
}
</style>
