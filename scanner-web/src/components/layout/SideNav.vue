<template>
  <nav class="side-nav">
    <div class="side-nav-header">
      <h2 class="side-nav-logo">SiteHealth</h2>
    </div>
    <ul class="side-nav-menu">
      <li>
        <RouterLink to="/" class="side-nav-link" active-class="active">
          Dashboard
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/sites" class="side-nav-link" active-class="active">
          Sites
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/settings" class="side-nav-link" active-class="active">
          Settings
        </RouterLink>
      </li>
    </ul>
    <div class="side-nav-footer">
      <Button variant="ghost" size="sm" @click="handleLogout">Logout</Button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { Button } from '@taskjuggler/ui'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.side-nav {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: var(--color-surface-glass);
  backdrop-filter: blur(20px);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.side-nav-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.side-nav-logo {
  font-size: var(--font-headline);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.side-nav-menu {
  flex: 1;
  list-style: none;
  margin: 0;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.side-nav-link {
  display: block;
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-out);
}

.side-nav-link:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.side-nav-link.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
}

.side-nav-footer {
  padding: var(--space-4);
  border-top: 1px solid var(--color-border);
}
</style>
