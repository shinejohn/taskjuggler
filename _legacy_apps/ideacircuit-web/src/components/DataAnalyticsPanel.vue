<template>
  <div class="h-full flex flex-col bg-white">
    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
      <div class="flex items-center">
        <h1 class="text-xl font-bold">AI-Generated Business Analytics</h1>
        <span v-if="isGenerating" class="ml-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center">
          <PenToolIcon :size="12" class="mr-1 animate-pulse" />
          Generating insights...
        </span>
      </div>
      <div class="flex space-x-2">
        <div class="relative">
          <select v-model="timeRange" class="appearance-none bg-white border border-gray-300 rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
            <option value="ytd">Year to Date</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <FilterIcon :size="14" />
          </div>
        </div>
        <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <RefreshCwIcon :size="18" />
        </button>
        <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <DownloadIcon :size="18" />
        </button>
      </div>
    </div>
    <!-- Tabs -->
    <div class="border-b border-gray-200">
      <div class="flex">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="`px-4 py-3 text-sm font-medium flex items-center space-x-1 ${
            activeTab === tab.id
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" :size="16" />
          <span>{{ tab.label }}</span>
          <span class="ml-1">
            <component :is="getStatusIcon(generationProgress[tab.id])" />
          </span>
        </button>
      </div>
    </div>
    <!-- Tab content -->
    <div class="flex-1 overflow-y-auto p-6 bg-gray-50">
      <RevenueAnalysis v-if="activeTab === 'revenue'" :confidence-level="confidenceLevels.revenue" />
      <CustomerSegmentation v-else-if="activeTab === 'customers'" :confidence-level="confidenceLevels.customers" />
      <SalesPerformance v-else-if="activeTab === 'sales'" :generation-progress="generationProgress.sales" :confidence-level="confidenceLevels.sales" />
      <MarketingEffectiveness v-else-if="activeTab === 'marketing'" :generation-progress="generationProgress.marketing" />
      <OperationsEfficiency v-else-if="activeTab === 'operations'" :generation-progress="generationProgress.operations" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  BarChart4Icon,
  PieChartIcon,
  TrendingUpIcon,
  UsersIcon,
  DollarSignIcon,
  FilterIcon,
  CheckCircleIcon,
  ClockIcon,
  PenToolIcon,
  RefreshCwIcon,
  DownloadIcon
} from 'lucide-vue-next';
import RevenueAnalysis from './DataAnalyticsTabs/RevenueAnalysis.vue';
import CustomerSegmentation from './DataAnalyticsTabs/CustomerSegmentation.vue';
import SalesPerformance from './DataAnalyticsTabs/SalesPerformance.vue';
import MarketingEffectiveness from './DataAnalyticsTabs/MarketingEffectiveness.vue';
import OperationsEfficiency from './DataAnalyticsTabs/OperationsEfficiency.vue';

const activeTab = ref('revenue');
const timeRange = ref('quarter');
const isGenerating = ref(true);
const generationProgress = ref({
  revenue: 'completed',
  customers: 'completed',
  sales: 'in-progress',
  marketing: 'pending',
  operations: 'pending'
});

const confidenceLevels = ref({
  revenue: 92,
  customers: 88,
  sales: 84,
  marketing: 79,
  operations: 76
});

const tabs = [
  { id: 'revenue', label: 'Revenue Analysis', icon: TrendingUpIcon },
  { id: 'customers', label: 'Customer Segmentation', icon: UsersIcon },
  { id: 'sales', label: 'Sales Performance', icon: DollarSignIcon },
  { id: 'marketing', label: 'Marketing Effectiveness', icon: BarChart4Icon },
  { id: 'operations', label: 'Operations Efficiency', icon: PieChartIcon }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircleIcon;
    case 'in-progress':
      return ClockIcon;
    case 'pending':
      return ClockIcon;
    default:
      return null;
  }
};

// Simulating AI generating analytics data
watch([isGenerating, generationProgress], () => {
  if (isGenerating.value) {
    const timer = setTimeout(() => {
      if (generationProgress.value.sales === 'in-progress') {
        generationProgress.value.sales = 'completed';
        generationProgress.value.marketing = 'in-progress';
        setTimeout(() => {
          generationProgress.value.marketing = 'completed';
          generationProgress.value.operations = 'in-progress';
          setTimeout(() => {
            generationProgress.value.operations = 'completed';
            isGenerating.value = false;
          }, 8000);
        }, 6000);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }
}, { deep: true });
</script>
