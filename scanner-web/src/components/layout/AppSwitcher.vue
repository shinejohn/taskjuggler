<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="app-trigger">
        <ScanIcon class="app-icon" />
        <span>Scanner</span>
        <ChevronDownIcon class="chevron" />
      </Button>
    </DropdownMenuTrigger>
    
    <DropdownMenuContent class="app-list">
      <DropdownMenuItem as-child>
        <a href="/dashboard" class="app-item">
          <LayoutDashboardIcon />
          <span>Task Juggler</span>
        </a>
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <a href="/process" class="app-item">
          <WorkflowIcon />
          <span>4process.ai</span>
        </a>
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <a href="/projects" class="app-item">
          <FolderKanbanIcon />
          <span>4projects.ai</span>
        </a>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="app-item active">
        <ScanIcon />
        <span>Scanner</span>
        <CheckIcon class="check" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@taskjuggler/ui'
import { 
  ScanIcon, 
  ChevronDownIcon, 
  CheckIcon,
  LayoutDashboardIcon,
  WorkflowIcon,
  FolderKanbanIcon 
} from 'lucide-vue-next'
</script>

<style scoped>
.app-trigger {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.app-icon {
  width: 16px;
  height: 16px;
}

.chevron {
  width: 16px;
  height: 16px;
  transition: transform var(--duration-fast) var(--ease-out);
}

.app-list {
  min-width: 200px;
}

.app-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-primary);
  width: 100%;
}

.app-item:hover {
  background: var(--color-bg-secondary);
}

.app-item.active {
  background: var(--color-primary-light);
}

.check {
  width: 16px;
  height: 16px;
  margin-left: auto;
  color: var(--color-primary);
}
</style>

