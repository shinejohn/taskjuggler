<template>
  <div class="team-switcher">
    <div class="team-trigger" @click="toggleDropdown">
      <AvatarWrapper :name="currentTeam?.name || 'Team'" size="sm" />
      <span class="team-name">{{ currentTeam?.name || 'Select Team' }}</span>
      <svg 
        class="chevron" 
        :class="{ open: isOpen }"
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M4 6L8 10L12 6" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        />
      </svg>
    </div>
    
    <div v-if="isOpen" class="team-dropdown">
      <div class="team-list">
        <div
          v-for="team in teams"
          :key="team.id"
          class="team-item"
          :class="{ active: team.id === currentTeam?.id }"
          @click="switchTeam(team)"
        >
          <AvatarWrapper :name="team.name" size="sm" />
          <span class="team-item-name">{{ team.name }}</span>
          <svg 
            v-if="team.id === currentTeam?.id"
            class="check-icon"
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M13 4L6 11L3 8" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSitesStore } from '@/stores/sites'
import AvatarWrapper from '@/components/ui/AvatarWrapper.vue'
import type { Team } from '@/types'

const authStore = useAuthStore()
const sitesStore = useSitesStore()

const isOpen = ref(false)

const teams = computed(() => authStore.user?.teams ?? [])
const currentTeam = computed(() => authStore.currentTeam)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

async function switchTeam(team: Team) {
  authStore.setCurrentTeam(team)
  closeDropdown()
  // Refresh sites store after team switch
  try {
    await sitesStore.fetchSites()
  } catch (error) {
    console.error('Failed to fetch sites after team switch:', error)
  }
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.team-switcher')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.team-switcher {
  position: relative;
  display: inline-block;
}

.team-trigger {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  user-select: none;
}

.team-trigger:hover {
  background: var(--color-surface-hover);
  border-color: var(--color-border-hover);
}

.team-name {
  font-size: var(--font-body-medium);
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.chevron {
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary);
  transition: transform var(--duration-fast) var(--ease-out);
  flex-shrink: 0;
}

.chevron.open {
  transform: rotate(180deg);
}

.team-dropdown {
  position: absolute;
  top: calc(100% + var(--space-2));
  left: 0;
  right: 0;
  min-width: 200px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-3);
  z-index: 1000;
  overflow: hidden;
}

.team-list {
  padding: var(--space-1);
}

.team-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}

.team-item:hover {
  background: var(--color-surface-hover);
}

.team-item.active {
  background: var(--color-primary-light);
}

.team-item-name {
  flex: 1;
  font-size: var(--font-body-medium);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.check-icon {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.team-item.active .team-item-name {
  font-weight: 600;
  color: var(--color-primary);
}
</style>

