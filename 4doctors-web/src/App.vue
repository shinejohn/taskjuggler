<template>
  <component :is="$route.meta.layout || 'div'">
    <router-view />
  </component>
</template>

<script setup lang="ts">
// Root App with Dynamic Layouts
</script>
