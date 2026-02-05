<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div class="relative max-w-sm w-full">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                   type="text" 
                   placeholder="Search activity..." 
                   class="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                >
            </div>
            <div class="flex items-center gap-2">
                 <button class="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                    <Filter class="w-4 h-4" />
                    Filters
                 </button>
                 <button class="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                    <Download class="w-4 h-4" />
                    Export
                 </button>
            </div>
        </div>
        
        <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th class="px-6 py-3 font-medium text-slate-500">Time</th>
                    <th class="px-6 py-3 font-medium text-slate-500">User</th>
                    <th class="px-6 py-3 font-medium text-slate-500">Action</th>
                    <th class="px-6 py-3 font-medium text-slate-500">Description</th>
                    <th class="px-6 py-3 font-medium text-slate-500">IP Address</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                <tr v-for="i in 10" :key="i" class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-3 text-slate-500 whitespace-nowrap">Feb 02, 10:30 AM</td>
                    <td class="px-6 py-3 font-medium text-slate-800">Admin User</td>
                    <td class="px-6 py-3">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">user.update</span>
                    </td>
                    <td class="px-6 py-3 text-slate-600">Updated profile for Dr. Smith</td>
                    <td class="px-6 py-3 text-slate-500 font-mono text-xs">192.168.1.1</td>
                </tr>
            </tbody>
        </table>
        
        <div class="p-4 border-t border-slate-200 flex items-center justify-between">
            <p class="text-sm text-slate-500">Showing 1-10 of 124 events</p>
            <div class="flex gap-2">
                <button class="px-3 py-1 border border-slate-200 rounded text-sm disabled:opacity-50">Previous</button>
                <button class="px-3 py-1 border border-slate-200 rounded text-sm disabled:opacity-50">Next</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Filter, Download } from 'lucide-vue-next';
</script>
