<template>
  <div class="glass-standard rounded-lg overflow-hidden shadow-1">
    <div class="p-6 border-b border-border">
      <h2 class="text-headline font-semibold text-text-primary">My Files</h2>
    </div>
    <div class="p-6">
      <FileExplorer />
    </div>
  </div>
</template>

<script setup lang="ts">
import FileExplorer from '@/components/FileExplorer.vue';
</script>

