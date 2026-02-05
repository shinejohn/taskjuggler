<template>
  <div class="space-y-6">
    <header class="flex justify-between items-center mb-2">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Clinical Ledger</h1>
        <p class="text-slate-500">Financial performance and transaction history.</p>
      </div>
      <div class="flex gap-2">
         <button class="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-700">Export Report</button>
         <button class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">+ Record Payment</button>
      </div>
    </header>

    <!-- Financial Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Gross Revenue (MTD)</p>
            <div class="flex items-end justify-between mt-2">
                <span class="text-2xl font-bold text-slate-900">$142,500</span>
                <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
            </div>
        </div>
        <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Collections Rate</p>
            <div class="flex items-end justify-between mt-2">
                <span class="text-2xl font-bold text-slate-900">94.2%</span>
                <span class="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-full">Target: 95%</span>
            </div>
        </div>
        <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Accounts Receivable</p>
             <div class="flex items-end justify-between mt-2">
                <span class="text-2xl font-bold text-amber-600">$28,450</span>
                <span class="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">12 Days Sales</span>
            </div>
        </div>
         <div class="p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-900 shadow-sm text-white">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Projected (EOM)</p>
             <div class="flex items-end justify-between mt-2">
                <span class="text-2xl font-bold">$185,000</span>
                <TrendingUp class="w-5 h-5 text-emerald-400" />
            </div>
        </div>
    </div>

    <!-- Ledger Table -->
    <Card title="Recent Transactions">
        <template #header>
            <div class="flex gap-2">
                <div class="relative">
                    <Search class="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input type="text" placeholder="Search transactions..." class="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 hover:border-slate-300 transition-colors">
                </div>
                <button class="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500"><Filter class="w-4 h-4" /></button>
            </div>
        </template>
        
        <DataTable :columns="columns" :data="transactions">
            <template #cell-amount="{ row }">
                <span :class="row.type === 'payment' ? 'text-emerald-600 font-bold' : 'text-slate-900'">
                    {{ row.type === 'payment' ? '+' : '' }}{{ row.amount }}
                </span>
            </template>
            <template #cell-status="{ row }">
                <Badge :variant="getStatusVariant(row.status)">{{ row.status }}</Badge>
            </template>
            <template #cell-date="{ row }">
                <div class="flex flex-col">
                    <span class="text-slate-900 font-medium">{{ row.date }}</span>
                    <span class="text-[10px] text-slate-400">{{ row.time }}</span>
                </div>
            </template>
             <template #actions>
                <button class="text-slate-400 hover:text-blue-600 text-sm font-medium">Details</button>
            </template>
        </DataTable>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TrendingUp, Search, Filter } from 'lucide-vue-next';
import Card from '@/components/ui/Card.vue';
import DataTable from '@/components/ui/DataTable.vue';
import Badge from '@/components/ui/Badge.vue';

const columns = [
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    { key: 'patient', label: 'Patient / Payer' },
    { key: 'type', label: 'Type' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' },
];

const transactions = ref([
    { id: 1, date: 'Jan 25, 2026', time: '10:42 AM', description: 'Insurance Payment (ERA #8921)', patient: 'Blue Cross Blue Shield', type: 'payment', amount: '$450.00', status: 'posted' },
    { id: 2, date: 'Jan 25, 2026', time: '09:15 AM', description: 'Copay Collection', patient: 'Sarah Johnson', type: 'payment', amount: '$35.00', status: 'posted' },
    { id: 3, date: 'Jan 24, 2026', time: '04:20 PM', description: 'Claim Submission (99214)', patient: 'Michael Ross', type: 'claim', amount: '$185.00', status: 'pending' },
    { id: 4, date: 'Jan 24, 2026', time: '02:00 PM', description: 'Patient Payment', patient: 'Harvey Specter', type: 'payment', amount: '$150.00', status: 'posted' },
    { id: 5, date: 'Jan 23, 2026', time: '11:00 AM', description: 'Claim Denial (Need Info)', patient: 'United Healthcare', type: 'adjustment', amount: '-$120.00', status: 'denied' },
]);

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'posted': return 'success';
        case 'pending': return 'warning';
        case 'denied': return 'danger';
        default: return 'default';
    }
}
</script>
