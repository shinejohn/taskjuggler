<template>
  <nav
    :class="[
      'top-nav',
      scrolled && 'top-nav--scrolled'
    ]"
  >
    <div class="top-nav__container">
      <!-- Logo -->
      <router-link to="/" class="top-nav__logo">
        <span class="top-nav__logo-text">Task Juggler</span>
      </router-link>

      <!-- Desktop Navigation -->
      <div class="top-nav__links">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="top-nav__link"
          :class="{ 'top-nav__link--active': $route.path === item.path }"
        >
          {{ item.label }}
        </router-link>
      </div>

      <!-- Right Side Actions -->
      <div class="top-nav__actions">
        <!-- Notifications -->
        <button class="top-nav__action" aria-label="Notifications">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span v-if="notificationCount > 0" class="top-nav__badge">{{ notificationCount }}</span>
        </button>

        <!-- User Menu -->
        <div class="top-nav__user-menu" ref="userMenuRef">
          <button class="top-nav__user-button" @click="toggleUserMenu">
            <Avatar :name="user?.name || 'User'" size="sm" />
            <span class="top-nav__user-name">{{ user?.name || 'User' }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <Transition name="dropdown">
            <div v-if="showUserMenu" class="top-nav__dropdown">
              <router-link to="/settings" class="top-nav__dropdown-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </router-link>
              <button @click="handleLogout" class="top-nav__dropdown-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Avatar from '@/components/ui/Avatar.vue'

const router = useRouter()
const authStore = useAuthStore()

const scrolled = ref(false)
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)
const notificationCount = ref(0)

const user = computed(() => authStore.user)

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/tasks', label: 'Tasks' },
  { path: '/inbox', label: 'Inbox' },
  { path: '/routing', label: 'Routing' },
  { path: '/marketplace', label: 'Marketplace' },
  { path: '/team', label: 'Team' },
]

const handleScroll = () => {
  scrolled.value = window.scrollY > 10
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.top-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-6);
  transition: all var(--duration-normal) var(--ease-out);
  background: transparent;
}

.top-nav--scrolled {
  background: var(--color-surface-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
}

.top-nav__container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
}

.top-nav__logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: var(--font-title-large);
  font-weight: 600;
  color: var(--color-text-primary);
}

.top-nav__logo-text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.top-nav__links {
  display: none;
  align-items: center;
  gap: var(--space-2);
}

@media (min-width: 1024px) {
  .top-nav__links {
    display: flex;
  }
}

.top-nav__link {
  display: flex;
  align-items: center;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: var(--font-body-medium);
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all var(--duration-fast) var(--ease-out);
}

.top-nav__link:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}

.top-nav__link--active {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.top-nav__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.top-nav__action {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.top-nav__action:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}

.top-nav__badge {
  position: absolute;
  top: -2px;
  right: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: var(--radius-full);
  background: var(--color-destructive);
  color: white;
  font-size: 10px;
  font-weight: 600;
}

.top-nav__user-menu {
  position: relative;
}

.top-nav__user-button {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.top-nav__user-button:hover {
  background: var(--color-bg-secondary);
}

.top-nav__user-name {
  display: none;
  font-size: var(--font-body-medium);
  font-weight: 500;
  color: var(--color-text-primary);
}

@media (min-width: 768px) {
  .top-nav__user-name {
    display: block;
  }
}

.top-nav__dropdown {
  position: absolute;
  top: calc(100% + var(--space-2));
  right: 0;
  min-width: 200px;
  background: var(--color-surface-glass-hover);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-3);
  padding: var(--space-2);
  z-index: 1000;
}

.dark .top-nav__dropdown {
  background: rgba(58, 58, 60, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.top-nav__dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: var(--font-body-medium);
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.top-nav__dropdown-item:hover {
  background: var(--color-bg-secondary);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all var(--duration-fast) var(--ease-out);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
