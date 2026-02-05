<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
    <div class="flex justify-between items-center mb-4">
        <h3 class="font-semibold text-slate-900 flex items-center gap-2">
            <FileText class="w-4 h-4 text-slate-400"/> Documents & Labs
        </h3>
        <button class="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded">
            Upload
        </button>
    </div>

    <ul class="space-y-3">
        <li v-for="doc in documents" :key="doc.id" class="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg group cursor-pointer transition-colors">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-slate-100 rounded text-slate-500">
                    <File class="w-4 h-4" />
                </div>
                <div>
                    <div class="text-sm font-medium text-slate-900">{{ doc.name }}</div>
                    <div class="text-xs text-slate-500">{{ doc.date }} • {{ doc.type }}</div>
                </div>
            </div>
            <button class="text-slate-400 hover:text-blue-600">
                <Download class="w-4 h-4" />
            </button>
        </li>
        <li v-if="documents.length === 0" class="text-xs text-slate-400 italic text-center py-4">
            No documents on file.
        </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FileText, File, Download } from 'lucide-vue-next';

const documents = ref([
    { id: '1', name: 'Comprehensive Metabolic Panel', date: 'Jan 20, 2026', type: 'Lab Result' },
    { id: '2', name: ' chest_xray_ap.jpg', date: 'Jan 20, 2026', type: 'Imaging' },
    { id: '3', name: 'Cardiology Referral.pdf', date: 'Dec 15, 2025', type: 'Referral' },
]);
</script>
