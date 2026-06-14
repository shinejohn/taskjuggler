<template>
  <component :is="$route.meta.layout || 'div'">
    <router-view />
  </component>
  <ToastContainer />
  <ConfirmDialog />
</template>

<script setup lang="ts">
// Root App with Dynamic Layouts
import ToastContainer from '@/components/ui/ToastContainer.vue';
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue';
</script>
