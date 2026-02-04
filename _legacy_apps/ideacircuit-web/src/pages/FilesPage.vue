<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Files & Documents</h1>
      <div class="flex space-x-2 items-center">
        <div class="relative">
          <input
            type="text"
            placeholder="Search files..."
            v-model="searchQuery"
            class="px-3 py-1 pl-8 bg-gray-700 rounded-md text-white placeholder-gray-400 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon :size="16" class="absolute left-2.5 top-2 text-gray-400" />
        </div>
        <NavigationMenu />
      </div>
    </div>
    <!-- Tabs -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <button
            :class="`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'my-files'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`"
            @click="activeTab = 'my-files'"
          >
            <div class="flex items-center">
              <FolderIcon :size="16" class="mr-2" />
              My Files
            </div>
          </button>
          <button
            :class="`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'shared'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`"
            @click="activeTab = 'shared'"
          >
            <div class="flex items-center">
              <FolderOpenIcon :size="16" class="mr-2" />
              Shared with Me
            </div>
          </button>
        </div>
      </div>
    </div>
    <!-- Main Content -->
    <div class="flex-1 overflow-hidden p-4 max-w-7xl mx-auto w-full">
      <!-- Filters and View Options -->
      <div class="mb-4 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <button class="flex items-center text-sm text-gray-600 px-3 py-1.5 bg-white border border-gray-300 rounded-md">
              <FilterIcon :size="14" class="mr-2" />
              Filter
            </button>
          </div>
          <div class="flex items-center">
            <button class="flex items-center text-sm text-gray-600 px-3 py-1.5 bg-white border border-gray-300 rounded-md">
              <SortAscIcon :size="14" class="mr-2" />
              Sort
            </button>
          </div>
        </div>
        <div class="flex space-x-2">
          <button class="p-2 text-gray-600 bg-white border border-gray-300 rounded-md">
            <GridIcon :size="16" />
          </button>
          <button class="p-2 text-gray-600 bg-white border border-gray-300 rounded-md">
            <ListIcon :size="16" />
          </button>
        </div>
      </div>
      <!-- File Explorer -->
      <div class="h-[calc(100vh-200px)]">
        <FileExplorer :is-personal="activeTab === 'my-files'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  FolderIcon,
  FolderOpenIcon,
  SearchIcon,
  FilterIcon,
  SortAscIcon,
  GridIcon,
  ListIcon
} from 'lucide-vue-next';
import FileExplorer from '@/components/FileExplorer.vue';
import NavigationMenu from '@/components/NavigationMenu.vue';

const activeTab = ref('my-files');
const searchQuery = ref('');
</script>

