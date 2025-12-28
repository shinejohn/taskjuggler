<template>
  <AppLayout>
    <div class="settings-page">
      <h1 class="settings-title">Settings</h1>
      <Card :padding="'lg'">
        <h2 class="section-title">Account Settings</h2>
        <p class="settings-description">Manage your account preferences and API keys.</p>
        <!-- Settings content here -->
      </Card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import Card from '@/components/ui/Card.vue'
</script>

<style scoped>
.settings-page {
  padding: var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
}

.settings-title {
  font-size: var(--font-display-medium);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-8) 0;
}

.section-title {
  font-size: var(--font-headline);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
}

.settings-description {
  font-size: var(--font-body-medium);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-6) 0;
}
</style>
