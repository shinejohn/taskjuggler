<template>
  <div class="space-y-6">
    <header class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold text-slate-900">User Management</h1>
            <p class="text-slate-500">Manage access and roles for your practice.</p>
        </div>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">+ Add User</button>
    </header>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200">
        <DataTable :columns="columns" :data="users">
            <template #cell-role="{ row }">
                <Badge :variant="getRoleVariant(row.role)">{{ row.role }}</Badge>
            </template>
            <template #cell-status="{ row }">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full" :class="row.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'"></span>
                    <span class="capitalize text-slate-600">{{ row.status }}</span>
                </div>
            </template>
            <template #actions>
                <button class="text-slate-400 hover:text-blue-600 text-sm font-medium">Edit</button>
            </template>
        </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataTable from '@/components/ui/DataTable.vue';
import Badge from '@/components/ui/Badge.vue';
import api from '@/utils/api';
import type { User } from '@/types/user';

const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'location', label: 'Primary Location' }, // Assuming location is in profile or we map it
    { key: 'status', label: 'Status' },
];

const users = ref<User[]>([]);
const loading = ref(false);

const fetchUsers = async () => {
    loading.value = true;
    try {
        const response = await api.get('/admin/users');
        users.value = response.data.data; // Paginated response usually in data.data
    } catch (error) {
        console.error('Failed to fetch users', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchUsers();
});

const getRoleVariant = (role: string) => {
    switch(role) {
        case 'admin': return 'purple';
        case 'nurse': return 'success';
        case 'staff': return 'info';
        case 'provider': return 'info';
        default: return 'default';
    }
}
</script>
