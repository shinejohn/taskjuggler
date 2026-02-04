<template>
  <div class="min-h-screen bg-slate-50 font-sans p-6">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">Settings</h1>
      <p class="text-slate-500">Manage your practice configuration</p>
    </header>

    <div class="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
      <!-- Sidebar Nav -->
      <nav class="w-full md:w-64 space-y-1">
          <button 
            @click="activeTab = 'practice'" 
            class="w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="[activeTab === 'practice' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100']"
          >
            Practice Profile
          </button>
          <button 
             @click="activeTab = 'users'"
            class="w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="[activeTab === 'users' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100']"
          >
            Users & Roles
          </button>
           <button 
             @click="activeTab = 'billing'"
            class="w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="[activeTab === 'billing' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100']"
          >
            Billing & Invoices
          </button>
           <button 
             @click="activeTab = 'notifications'"
            class="w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="[activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100']"
          >
            Notifications
          </button>
      </nav>

      <!-- Content Area -->
      <div class="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[500px]">
          
          <!-- Practice Profile -->
          <div v-if="activeTab === 'practice'" class="space-y-6">
              <h2 class="text-xl font-bold text-slate-900 border-b pb-4">Practice Details</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1">Practice Name</label>
                      <input type="text" value="Downtown Medical Group" class="w-full p-2 border border-slate-300 rounded-lg">
                  </div>
                   <div>
                      <label class="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                      <input type="text" value="Family Medicine" class="w-full p-2 border border-slate-300 rounded-lg">
                  </div>
                  <div class="md:col-span-2">
                       <label class="block text-sm font-medium text-slate-700 mb-1">Address</label>
                      <input type="text" value="123 Main St, Suite 400, New York, NY 10001" class="w-full p-2 border border-slate-300 rounded-lg">
                  </div>
              </div>
              <div class="pt-4">
                  <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Changes</button>
              </div>
          </div>

          <!-- Users -->
          <div v-if="activeTab === 'users'" class="space-y-6">
              <div class="flex justify-between items-center border-b pb-4">
                  <h2 class="text-xl font-bold text-slate-900">Use Management</h2>
                  <button class="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium">Invite User</button>
              </div>
              <table class="min-w-full">
                  <thead>
                      <tr class="text-left text-xs font-medium text-slate-500 uppercase">
                          <th class="pb-3">Name</th>
                          <th class="pb-3">Role</th>
                          <th class="pb-3">Status</th>
                          <th class="pb-3 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 text-sm">
                      <tr>
                          <td class="py-3 font-medium text-slate-900">Dr. Sarah Connor</td>
                          <td class="py-3 text-slate-600">Administrator</td>
                          <td class="py-3"><span class="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">Active</span></td>
                          <td class="py-3 text-right text-blue-600 hover:underline cursor-pointer">Edit</td>
                      </tr>
                       <tr>
                          <td class="py-3 font-medium text-slate-900">Nurse Jackie</td>
                          <td class="py-3 text-slate-600">Nurse</td>
                          <td class="py-3"><span class="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">Active</span></td>
                          <td class="py-3 text-right text-blue-600 hover:underline cursor-pointer">Edit</td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <!-- Billing -->
          <div v-if="activeTab === 'billing'" class="text-center py-12 text-slate-400">
              <p>Billing settings coming soon.</p>
          </div>

           <!-- Notifications -->
          <div v-if="activeTab === 'notifications'" class="space-y-6">
              <h2 class="text-xl font-bold text-slate-900 border-b pb-4">Preferences</h2>
              <div class="space-y-4">
                  <div class="flex items-center justify-between">
                      <div>
                          <p class="font-medium text-slate-900">Email Notifications</p>
                          <p class="text-sm text-slate-500">Receive daily digest of appointments</p>
                      </div>
                      <div class="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer"><div class="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div></div>
                  </div>
                   <div class="flex items-center justify-between">
                      <div>
                          <p class="font-medium text-slate-900">SMS Alerts</p>
                          <p class="text-sm text-slate-500">Get notified for urgent lab results</p>
                      </div>
                      <div class="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer"><div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div></div>
                  </div>
              </div>
          </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('practice');
</script>
