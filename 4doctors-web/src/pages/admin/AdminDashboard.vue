<template>
  <div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-blue-50 p-2 rounded-lg">
            <Users class="w-6 h-6 text-blue-600" />
          </div>
          <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
        </div>
        <h3 class="text-2xl font-bold text-slate-800">24</h3>
        <p class="text-sm text-slate-500">Active Users</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-purple-50 p-2 rounded-lg">
            <Shield class="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <h3 class="text-2xl font-bold text-slate-800">5</h3>
        <p class="text-sm text-slate-500">Roles Defined</p>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-amber-50 p-2 rounded-lg">
            <Lock class="w-6 h-6 text-amber-600" />
          </div>
          <span class="text-xs font-medium text-slate-500">Basic</span>
        </div>
        <h3 class="text-2xl font-bold text-slate-800">Pro</h3>
        <p class="text-sm text-slate-500">Subscription Tier</p>
      </div>

       <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-green-50 p-2 rounded-lg">
            <Activity class="w-6 h-6 text-green-600" />
          </div>
        </div>
        <h3 class="text-2xl font-bold text-slate-800">Good</h3>
        <p class="text-sm text-slate-500">System Health</p>
      </div>
    </div>

    <!-- Recent Audit Activity -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h2 class="font-semibold text-slate-800">Recent Audit Activity</h2>
        <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
      </div>
      <div class="divide-y divide-slate-100">
        <div v-for="i in 5" :key="i" class="px-6 py-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
           <div class="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
           <div>
             <p class="text-sm font-medium text-slate-800">User updated settings</p>
             <p class="text-xs text-slate-500">Admin User • 2 mins ago</p>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, Shield, Lock, Activity } from 'lucide-vue-next';
// In real app, fetch stats from API
</script>
