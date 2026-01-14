<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="user-trigger">
        <Avatar 
          :name="user?.name || 'User'" 
          :src="user?.avatar_url"
          size="sm"
        />
        <ChevronDownIcon class="chevron" />
      </Button>
    </DropdownMenuTrigger>
    
    <DropdownMenuContent class="user-menu">
      <div class="user-info">
        <Avatar 
          :name="user?.name || 'User'" 
          :src="user?.avatar_url"
          size="md"
        />
        <div>
          <div class="user-name">{{ user?.name }}</div>
          <div class="user-email">{{ user?.email }}</div>
        </div>
      </div>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem as-child>
        <RouterLink to="/settings" class="menu-item">
          <SettingsIcon />
          <span>Settings</span>
        </RouterLink>
      </DropdownMenuItem>
      
      <DropdownMenuItem as-child>
        <RouterLink to="/settings/billing" class="menu-item">
          <CreditCardIcon />
          <span>Billing</span>
        </RouterLink>
      </DropdownMenuItem>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem class="menu-item logout" @click="handleLogout">
        <LogOutIcon />
        <span>Logout</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button, Avatar, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@taskjuggler/ui'
import { 
  ChevronDownIcon, 
  SettingsIcon, 
  CreditCardIcon, 
  LogOutIcon 
} from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.user-trigger {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.chevron {
  width: 16px;
  height: 16px;
}

.user-menu {
  min-width: 240px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
}

.user-name {
  font-weight: 600;
  margin-bottom: var(--space-1);
  font-size: var(--font-body-medium);
}

.user-email {
  font-size: var(--font-body-small);
  color: var(--color-text-secondary);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  width: 100%;
  text-align: left;
  text-decoration: none;
  color: var(--color-text-primary);
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-body-medium);
}

.menu-item:hover {
  background: var(--color-bg-secondary);
}

.menu-item.logout {
  color: var(--color-destructive);
}
</style>

