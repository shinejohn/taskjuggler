<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">Phone Numbers</h1>
        <p class="text-slate-500 mt-1">
          Manage your Coordinator phone lines and call forwarding
        </p>
      </div>
      <button
        @click="showAddModal = true"
        class="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
      >
        <Plus :size="18" />
        Add Phone Number
      </button>
    </div>

    <!-- Your Phone Numbers -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100">
        <h2 class="text-lg font-bold text-slate-900">Your Phone Numbers</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th class="px-6 py-3">Number</th>
              <th class="px-6 py-3">Assigned To</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3">Type</th>
              <th class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="phone in phoneNumbers"
              :key="phone.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="px-6 py-4 font-mono font-medium text-slate-900">
                {{ phone.number }}
              </td>
              <td class="px-6 py-4 text-slate-600">{{ phone.assignedTo }}</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
                    phone.status === 'active'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-slate-100 text-slate-600',
                  ]"
                >
                  <span
                    :class="[
                      'w-1.5 h-1.5 rounded-full',
                      phone.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-slate-400',
                    ]"
                  />
                  {{ phone.status === 'active' ? 'Active' : 'Available' }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-600">{{ phone.type }}</td>
              <td class="px-6 py-4 text-right">
                <button class="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100">
                  <MoreVertical :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Call Forwarding Setup -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Call Forwarding Setup</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Forward calls to
          </label>
          <select class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] bg-white">
            <option>Coordinator (AI)</option>
            <option>Mobile Phone</option>
            <option>Office Phone</option>
            <option>Voicemail</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            Fallback (if Coordinator unavailable)
          </label>
          <input
            type="tel"
            placeholder="(555) 123-4567"
            class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          />
        </div>
        <button class="px-4 py-2 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-medium rounded-lg transition-colors">
          Save Forwarding Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, MoreVertical } from 'lucide-vue-next';

const showAddModal = ref(false);

const phoneNumbers = ref([
  {
    id: '1',
    number: '(555) 123-4567',
    assignedTo: 'Sally (Receptionist)',
    status: 'active',
    type: 'Local',
  },
  {
    id: '2',
    number: '(555) 234-5678',
    assignedTo: 'Ed (Scheduler)',
    status: 'active',
    type: 'Local',
  },
  {
    id: '3',
    number: '(555) 345-6789',
    assignedTo: 'Unassigned',
    status: 'available',
    type: 'Toll-Free',
  },
]);
</script>

