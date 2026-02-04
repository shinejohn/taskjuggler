/**
 * UI Components Index
 * Export scanner-specific UI components
 * 
 * Note: Common components (Button, Card, Badge, Avatar, etc.) should be imported
 * from @taskjuggler/ui (shared-ui package)
 */

// Scanner-specific components
export { default as Modal } from './Modal.vue'
export { default as LoadingSpinner } from './LoadingSpinner.vue'
export { default as AvatarWrapper } from './AvatarWrapper.vue'

// Legacy exports for backward compatibility (deprecated - use @taskjuggler/ui)
export { default as Badge } from './Badge.vue'
export { default as Avatar } from './Avatar.vue'
