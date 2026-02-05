<template>
  <div class="marketing-page">
    <header class="page-header">
      <div class="header-content">
        <Megaphone class="header-icon" />
        <div>
          <h1 class="page-title">Marketing & Social</h1>
          <p class="page-subtitle">Manage practice online presence and patient outreach</p>
        </div>
      </div>
    </header>

    <ModeBadge mode="business" :show-label="true" class="mode-indicator" />

    <div class="stats-grid">
      <div class="stat-card">
        <Star class="stat-icon gold" />
        <div>
          <span class="stat-value">4.8</span>
          <span class="stat-label">Google Rating (142 reviews)</span>
        </div>
      </div>
      <div class="stat-card">
        <Users class="stat-icon blue" />
        <div>
          <span class="stat-value">1,247</span>
          <span class="stat-label">Social Followers</span>
        </div>
      </div>
      <div class="stat-card">
        <TrendingUp class="stat-icon green" />
        <div>
          <span class="stat-value">+18%</span>
          <span class="stat-label">Website Traffic (30d)</span>
        </div>
      </div>
      <div class="stat-card">
        <Mail class="stat-icon purple" />
        <div>
          <span class="stat-value">32%</span>
          <span class="stat-label">Email Open Rate</span>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <!-- Recent Reviews -->
      <div class="panel">
        <h2 class="panel-title">
          <MessageSquare class="panel-icon" />
          Recent Patient Reviews
        </h2>
        <div class="review-item" v-for="review in reviews" :key="review.id">
          <div class="review-header">
            <div class="review-stars">
              <Star v-for="n in review.rating" :key="n" class="star filled" />
              <Star v-for="n in (5 - review.rating)" :key="'e'+n" class="star empty" />
            </div>
            <span class="review-source">{{ review.source }}</span>
          </div>
          <p class="review-text">"{{ review.text }}"</p>
          <div class="review-footer">
            <span class="review-author">— {{ review.author }}</span>
            <span class="review-date">{{ review.date }}</span>
          </div>
          <div class="review-actions" v-if="!review.responded">
            <button class="respond-btn">Respond</button>
          </div>
        </div>
      </div>

      <!-- Social Posts -->
      <div class="panel">
        <h2 class="panel-title">
          <Share2 class="panel-icon" />
          Scheduled Social Posts
        </h2>
        <div class="post-item" v-for="post in scheduledPosts" :key="post.id">
          <div class="post-content">
            <span class="post-platform" :class="post.platform">{{ post.platform }}</span>
            <p class="post-preview">{{ post.content }}</p>
          </div>
          <div class="post-schedule">
            <Calendar class="schedule-icon" />
            <span>{{ post.scheduledFor }}</span>
          </div>
        </div>
        <button class="add-post-btn">
          <Plus class="add-icon" />
          Schedule New Post
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Megaphone, Star, Users, TrendingUp, Mail, MessageSquare, Share2, Calendar, Plus } from 'lucide-vue-next';
import ModeBadge from '@/components/core/ModeBadge.vue';

const reviews = ref([
  { id: 1, rating: 5, source: 'Google', text: 'Dr. Shine is incredibly thorough and caring. Best doctor I have ever had!', author: 'M. Thompson', date: 'Jan 28', responded: false },
  { id: 2, rating: 5, source: 'Healthgrades', text: 'The staff is so friendly and the wait times are minimal.', author: 'J. Williams', date: 'Jan 25', responded: true },
  { id: 3, rating: 4, source: 'Yelp', text: 'Great experience overall. Parking can be tricky.', author: 'S. Garcia', date: 'Jan 20', responded: false },
]);

const scheduledPosts = ref([
  { id: 1, platform: 'instagram', content: 'February is Heart Health Month! ❤️ Schedule your cardiac checkup today...', scheduledFor: 'Feb 1, 9am' },
  { id: 2, platform: 'facebook', content: 'Flu season is still here! Make sure you and your family are protected...', scheduledFor: 'Feb 3, 10am' },
  { id: 3, platform: 'linkedin', content: 'We are excited to welcome Dr. Patel to our cardiology team...', scheduledFor: 'Feb 5, 12pm' },
]);
</script>

<style scoped>
.marketing-page {
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

.stat-icon { width: 32px; height: 32px; }
.stat-icon.gold { color: #f59e0b; }
.stat-icon.blue { color: #3b82f6; }
.stat-icon.green { color: #10b981; }
.stat-icon.purple { color: #8b5cf6; }

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

.review-item {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 12px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.review-stars {
  display: flex;
  gap: 2px;
}

.star {
  width: 16px;
  height: 16px;
}

.star.filled {
  color: #f59e0b;
  fill: #f59e0b;
}

.star.empty {
  color: #e2e8f0;
}

.review-source {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.review-text {
  font-size: 14px;
  color: #475569;
  margin: 0 0 10px 0;
  font-style: italic;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #94a3b8;
}

.respond-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
}

.post-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 12px;
}

.post-platform {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
  margin-bottom: 8px;
}

.post-platform.instagram { background: #fce7f3; color: #db2777; }
.post-platform.facebook { background: #dbeafe; color: #2563eb; }
.post-platform.linkedin { background: #dbeafe; color: #0369a1; }

.post-preview {
  font-size: 14px;
  color: #475569;
  margin: 0;
  line-height: 1.5;
}

.post-schedule {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
}

.schedule-icon {
  width: 16px;
  height: 16px;
}

.add-post-btn {
  width: 100%;
  padding: 14px;
  background: #f0f9ff;
  border: 2px dashed #0ea5e9;
  border-radius: 12px;
  color: #0ea5e9;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-icon {
  width: 18px;
  height: 18px;
}
</style>
