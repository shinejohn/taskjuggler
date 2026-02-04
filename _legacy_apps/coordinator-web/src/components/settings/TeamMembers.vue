<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">Team Members</h1>
        <p class="text-slate-500 mt-1">
          Manage who has access to your Coordinator account
        </p>
      </div>
      <button
        @click="showInviteModal = true"
        class="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
      >
        <Plus :size="18" />
        Invite Team Member
      </button>
    </div>

    <!-- Team Members Table -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-slate-100">
        <h2 class="text-lg font-bold text-slate-900">Team Members</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th class="px-6 py-3">Member</th>
              <th class="px-6 py-3">Email</th>
              <th class="px-6 py-3">Role</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3">Last Active</th>
              <th class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="member in teamMembers"
              :key="member.email"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold">
                    {{ member.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-medium text-slate-900">
                      {{ member.name }}
                      <span v-if="member.isYou" class="text-slate-400">(You)</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-slate-600">{{ member.email }}</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
                    getRoleBadge(member.role),
                  ]"
                >
                  {{ member.role }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  v-if="member.status === 'active'"
                  class="inline-flex items-center gap-1.5 text-green-600 text-xs font-medium"
                >
                  <CheckCircle :size="14" />
                  Active
                </span>
                <span v-else class="inline-flex items-center gap-1.5 text-amber-600 text-xs font-medium">
                  <Clock :size="14" />
                  Invited
                </span>
              </td>
              <td class="px-6 py-4 text-slate-500">{{ member.lastActive }}</td>
              <td class="px-6 py-4 text-right">
                <button
                  v-if="!member.isYou"
                  class="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100"
                >
                  <MoreVertical :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, MoreVertical, CheckCircle, Clock } from 'lucide-vue-next';

const showInviteModal = ref(false);

const teamMembers = ref([
  {
    name: 'Jane Doe',
    email: 'jane@abc.com',
    role: 'owner',
    status: 'active',
    lastActive: 'Now',
    isYou: true,
  },
  {
    name: 'John Smith',
    email: 'john@abc.com',
    role: 'admin',
    status: 'active',
    lastActive: '2 hours ago',
    isYou: false,
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@abc.com',
    role: 'member',
    status: 'active',
    lastActive: 'Yesterday',
    isYou: false,
  },
]);

function getRoleBadge(role: string): string {
  const styles: Record<string, string> = {
    owner: 'bg-purple-50 text-purple-700 border-purple-200',
    admin: 'bg-blue-50 text-blue-700 border-blue-200',
    member: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  return styles[role] || styles.member;
}
</script>




