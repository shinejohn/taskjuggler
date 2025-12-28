<template>
  <Teleport to="body">
    <Transition name="modal-backdrop">
      <div
        v-if="isOpen"
        class="modal-backdrop"
        @click.self="handleBackdropClick"
      >
        <Transition name="modal-content">
          <div
            v-if="isOpen"
            :class="[
              'modal',
              size === 'sm' && 'max-w-md',
              size === 'md' && 'max-w-lg',
              size === 'lg' && 'max-w-2xl',
              size === 'xl' && 'max-w-4xl',
              size === 'full' && 'max-w-full mx-4',
              className
            ]"
            @click.stop
          >
            <div v-if="title || showClose" class="modal-header">
              <h2 v-if="title" class="modal-title">{{ title }}</h2>
              <button
                v-if="showClose"
                class="modal-close"
                @click="handleClose"
                aria-label="Close modal"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <slot />
            </div>
            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose?: boolean
  closeOnBackdrop?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showClose: true,
  closeOnBackdrop: true,
  className: ''
})

const emit = defineEmits<{
  close: []
}>()

const handleClose = () => {
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleClose()
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-4);
}

.modal {
  background: var(--color-surface-glass-hover);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  width: calc(100% - var(--space-8));
  max-height: calc(100vh - var(--space-16));
  overflow-y: auto;
  box-shadow: var(--shadow-4);
}

.dark .modal {
  background: rgba(58, 58, 60, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
}

.modal-title {
  font-size: var(--font-headline);
  font-weight: 600;
  line-height: 1.25;
  color: var(--color-text-primary);
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.modal-close:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.modal-body {
  color: var(--color-text-primary);
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
}

/* Transitions */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity var(--duration-normal) var(--ease-out);
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-content-enter-active {
  transition: all var(--duration-normal) var(--ease-out-expo);
}

.modal-content-leave-active {
  transition: all var(--duration-normal) var(--ease-out);
}

.modal-content-enter-from {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

.modal-content-leave-to {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
