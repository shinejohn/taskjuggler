<template>
  <div class="app-layout">
    <!-- Platform Header -->
    <header class="platform-header">
      <div class="header-left">
        <RouterLink to="/" class="logo">
          <span class="logo-text">TaskJuggler</span>
        </RouterLink>
        
        <!-- App Switcher -->
        <AppSwitcher />
        
        <TeamSwitcher />
      </div>
      
      <div class="header-center">
        <!-- Scanner-specific nav -->
        <nav class="scanner-nav">
          <RouterLink to="/" class="nav-link">Dashboard</RouterLink>
          <RouterLink to="/sites" class="nav-link">Sites</RouterLink>
        </nav>
      </div>
      
      <div class="header-right">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppSwitcher from '@/components/layout/AppSwitcher.vue'
import TeamSwitcher from '@/components/layout/TeamSwitcher.vue'
import NotificationBell from '@/components/layout/NotificationBell.vue'
import UserMenu from '@/components/layout/UserMenu.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.platform-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--color-surface-glass);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-primary);
}

.logo-text {
  font-size: var(--font-headline);
  font-weight: 700;
  color: var(--color-primary);
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.scanner-nav {
  display: flex;
  gap: var(--space-2);
}

.nav-link {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: all var(--duration-fast) var(--ease-out);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.main-content {
  padding: var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
}
</style>
