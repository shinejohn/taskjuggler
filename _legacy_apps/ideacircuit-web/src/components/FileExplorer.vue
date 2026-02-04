<template>
  <div class="h-full flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
    <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
      <h2 class="text-lg font-medium">
        {{ isPersonal ? 'My Files' : 'Shared Files' }}
      </h2>
      <div class="flex space-x-2">
        <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-md flex items-center text-sm">
          <FolderPlusIcon :size="16" class="mr-1" />
          New Folder
        </button>
        <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-md flex items-center text-sm">
          <PlusIcon :size="16" class="mr-1" />
          Upload
        </button>
      </div>
    </div>
    <div class="flex flex-1 overflow-hidden">
      <!-- Folders sidebar -->
      <div class="w-1/4 border-r border-gray-200 overflow-y-auto p-2 bg-gray-50">
        <div class="space-y-1">
          <div
            v-for="folder in Object.keys(fileStructure)"
            :key="folder"
            class="select-none"
          >
            <div
              class="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
              @click="toggleFolder(folder)"
            >
              <ChevronDownIcon
                v-if="expandedFolders[folder]"
                :size="16"
                class="text-gray-500 mr-1"
              />
              <ChevronRightIcon
                v-else
                :size="16"
                class="text-gray-500 mr-1"
              />
              <FolderIcon
                :size="16"
                :class="`mr-2 ${expandedFolders[folder] ? 'text-blue-500' : 'text-gray-500'}`"
              />
              <span class="text-sm capitalize">{{ folder }}</span>
              <span class="ml-auto text-xs text-gray-500">
                {{ fileStructure[folder].length }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- Files list -->
      <div class="flex-1 overflow-y-auto">
        <div class="p-4">
          <div
            v-for="folder in Object.keys(fileStructure)"
            :key="folder"
            :class="`mb-4 ${!expandedFolders[folder] && 'hidden'}`"
          >
            <h3 class="text-sm font-medium text-gray-700 mb-2 capitalize">
              {{ folder }}
            </h3>
            <div class="bg-white border border-gray-200 rounded-md overflow-hidden">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50 text-left">
                    <th class="px-4 py-2 text-xs font-medium text-gray-500">Name</th>
                    <th class="px-4 py-2 text-xs font-medium text-gray-500">Size</th>
                    <th class="px-4 py-2 text-xs font-medium text-gray-500">Date</th>
                    <th class="px-4 py-2 text-xs font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="file in fileStructure[folder]"
                    :key="file.id"
                    :class="`border-t border-gray-100 hover:bg-gray-50 ${selectedFile?.id === file.id ? 'bg-blue-50' : ''}`"
                    @click="handleFileClick(file)"
                  >
                    <td class="px-4 py-3 flex items-center">
                      <component :is="getFileIcon(file.name)" />
                      <span class="ml-2 text-sm">{{ file.name }}</span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-600">{{ file.size }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600">{{ file.date }}</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center space-x-2 relative">
                        <button
                          class="p-1 text-gray-500 hover:bg-gray-100 rounded"
                          @click.stop="handleFileAction(file, 'download')"
                        >
                          <DownloadIcon :size="16" />
                        </button>
                        <button
                          class="p-1 text-gray-500 hover:bg-gray-100 rounded"
                          @click.stop="toggleDropdown(file.id)"
                        >
                          <MoreHorizontalIcon :size="16" />
                        </button>
                        <div
                          v-if="showDropdown === file.id"
                          class="absolute right-0 top-8 bg-white shadow-lg rounded-md z-10 w-40 py-1 border border-gray-200"
                        >
                          <button
                            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                            @click.stop="handleFileAction(file, 'star')"
                          >
                            <StarIcon :size="14" class="mr-2" />
                            Add to favorites
                          </button>
                          <button
                            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                            @click.stop="handleFileAction(file, 'delete')"
                          >
                            <TrashIcon :size="14" class="mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- File preview -->
      <div v-if="selectedFile" class="w-1/3 border-l border-gray-200 p-4 bg-gray-50">
        <div class="h-full flex flex-col">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium">File Details</h3>
            <button class="text-gray-500 hover:text-gray-700" @click="selectedFile = null">
              <XIcon :size="18" />
            </button>
          </div>
          <div class="bg-white p-4 rounded-lg border border-gray-200 flex-1">
            <div class="flex justify-center mb-4 p-8 bg-gray-50 rounded-md">
              <FileVideoIcon
                v-if="selectedFile.type === 'video'"
                :size="64"
                class="text-red-500"
              />
              <FileTextIcon
                v-else-if="selectedFile.type === 'text'"
                :size="64"
                class="text-blue-500"
              />
              <FileIcon v-else :size="64" class="text-gray-500" />
            </div>
            <div class="space-y-3">
              <div>
                <h4 class="text-sm font-medium text-gray-500">Name</h4>
                <p class="text-sm">{{ selectedFile.name }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500">Size</h4>
                <p class="text-sm">{{ selectedFile.size }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500">Date</h4>
                <p class="text-sm">{{ selectedFile.date }}</p>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500">Type</h4>
                <p class="text-sm capitalize">{{ selectedFile.type }}</p>
              </div>
            </div>
            <div class="mt-6 flex space-x-2">
              <button
                class="px-3 py-2 bg-blue-500 text-white rounded-md text-sm flex items-center"
                @click="handleFileAction(selectedFile, 'download')"
              >
                <DownloadIcon :size="14" class="mr-2" />
                Download
              </button>
              <button
                class="px-3 py-2 bg-red-500 text-white rounded-md text-sm flex items-center"
                @click="handleFileAction(selectedFile, 'delete')"
              >
                <TrashIcon :size="14" class="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  FolderIcon,
  FileIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DownloadIcon,
  PlusIcon,
  TrashIcon,
  FileTextIcon,
  FileImageIcon,
  FileAudioIcon,
  FileVideoIcon,
  StarIcon,
  MoreHorizontalIcon,
  FolderPlusIcon,
  XIcon
} from 'lucide-vue-next';

interface File {
  id: number;
  name: string;
  size: string;
  date: string;
  type: string;
}

interface Props {
  isPersonal?: boolean;
}

withDefaults(defineProps<Props>(), {
  isPersonal: false
});

const expandedFolders = ref({
  recordings: true,
  transcripts: true,
  presentations: false,
  reports: false
});

const selectedFile = ref<File | null>(null);
const showDropdown = ref<number | null>(null);

const fileStructure = {
  recordings: [
    { id: 1, name: 'team-meeting-2023-06-15.mp4', size: '45.2 MB', date: '2023-06-15', type: 'video' },
    { id: 2, name: 'client-presentation-2023-06-10.mp4', size: '32.7 MB', date: '2023-06-10', type: 'video' },
    { id: 3, name: 'product-demo-2023-06-05.mp4', size: '28.4 MB', date: '2023-06-05', type: 'video' }
  ],
  transcripts: [
    { id: 4, name: 'team-meeting-transcript-2023-06-15.txt', size: '24 KB', date: '2023-06-15', type: 'text' },
    { id: 5, name: 'client-presentation-transcript-2023-06-10.txt', size: '18 KB', date: '2023-06-10', type: 'text' },
    { id: 6, name: 'product-demo-transcript-2023-06-05.txt', size: '15 KB', date: '2023-06-05', type: 'text' }
  ],
  presentations: [
    { id: 7, name: 'quarterly-review.pdf', size: '3.2 MB', date: '2023-06-01', type: 'document' },
    { id: 8, name: 'marketing-strategy.pdf', size: '2.8 MB', date: '2023-05-20', type: 'document' }
  ],
  reports: [
    { id: 9, name: 'analytics-report-may.pdf', size: '1.8 MB', date: '2023-06-02', type: 'document' },
    { id: 10, name: 'user-feedback-summary.txt', size: '45 KB', date: '2023-05-28', type: 'text' }
  ]
};

const getFileIcon = (fileName: string) => {
  if (fileName.endsWith('.txt') || fileName.endsWith('.pdf')) {
    return FileTextIcon;
  } else if (fileName.endsWith('.jpg') || fileName.endsWith('.png')) {
    return FileImageIcon;
  } else if (fileName.endsWith('.mp3') || fileName.endsWith('.wav')) {
    return FileAudioIcon;
  } else if (fileName.endsWith('.mp4') || fileName.endsWith('.avi')) {
    return FileVideoIcon;
  } else {
    return FileIcon;
  }
};

const toggleFolder = (folder: string) => {
  expandedFolders.value = {
    ...expandedFolders.value,
    [folder]: !expandedFolders.value[folder as keyof typeof expandedFolders.value]
  };
};

const handleFileClick = (file: File) => {
  selectedFile.value = file;
};

const handleFileAction = (file: File, action: string) => {
  showDropdown.value = null;
  if (action === 'download') {
    alert(`Downloading ${file.name}`);
  } else if (action === 'delete') {
    alert(`Deleting ${file.name}`);
  } else if (action === 'star') {
    alert(`Marking ${file.name} as favorite`);
  }
};

const toggleDropdown = (fileId: number) => {
  if (showDropdown.value === fileId) {
    showDropdown.value = null;
  } else {
    showDropdown.value = fileId;
  }
};
</script>

