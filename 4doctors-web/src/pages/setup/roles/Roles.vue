<template>
  <div class="space-y-6">
    <header class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900">Roles & Permissions</h1>
            <p class="text-slate-500">Define what users can see and do.</p>
        </div>
        <button class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">+ New Role</button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card v-for="role in roles" :key="role.id" :title="role.name">
            <template #header>
                <div class="flex items-center gap-2">
                    <ShieldCheck class="w-5 h-5 text-purple-600" />
                    <span class="font-semibold text-slate-900">{{ role.name }}</span>
                </div>
            </template>
            
            <p class="text-slate-500 text-sm mb-4 min-h-[40px]">{{ role.description }}</p>
            
            <div class="space-y-2 mb-6">
                <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Users Assigned</span>
                    <Badge variant="default">{{ role.usersCount }}</Badge>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Access Level</span>
                    <span class="text-slate-900 font-medium">{{ role.level }}</span>
                </div>
            </div>

            <template #footer>
                <div class="flex gap-2">
                    <button class="flex-1 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Edit Access</button>
                    <button class="flex-1 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">Assign Users</button>
                </div>
            </template>
        </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ShieldCheck } from 'lucide-vue-next';
import Card from '@/components/ui/Card.vue';
import Badge from '@/components/ui/Badge.vue';

const roles = ref([
    { id: 1, name: 'Owner / Physician', description: 'Full access to all clinical and administrative features.', usersCount: 1, level: 'Super Admin' },
    { id: 2, name: 'Nurse Practitioner', description: 'Clinical charting, prescribing (with limits), and inbox access.', usersCount: 2, level: 'Clinical Admin' },
    { id: 3, name: 'Medical Assistant', description: 'Vitals, intake, and basic scheduling access.', usersCount: 4, level: 'Clinical Staff' },
    { id: 4, name: 'Front Desk', description: 'Scheduling, patient registration, and basic billing.', usersCount: 3, level: 'Admin Staff' },
    { id: 5, name: 'Biller', description: 'Claims, reports, and financial dashboards only.', usersCount: 1, level: 'Financial' },
]);
</script>
