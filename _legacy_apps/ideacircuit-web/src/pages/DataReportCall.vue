<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 p-4">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Data Reports</h1>
          <p class="text-sm text-gray-600">AI-powered analytics and insights</p>
        </div>
        <div class="flex items-center space-x-4">
          <NavigationMenu />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden">
      <ReportsView
        v-if="currentView === 'reports'"
        :reports="reports"
        @generate-report="generateReport"
        @ai-setup="currentView = 'ai-setup'"
      />
      
      <AISetupView
        v-else-if="currentView === 'ai-setup'"
        @solution-complete="handleAISetup"
        @back-to-reports="currentView = 'reports'"
      />
      
      <GeneratingView
        v-else-if="currentView === 'generating'"
        :report-type="selectedReport"
        :report-name="getReportName(selectedReport)"
        :config="reportConfig"
        @back-to-reports="currentView = 'reports'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavigationMenu from '@/components/NavigationMenu.vue';
import ReportsView from './DataReportCall/ReportsView.vue';
import AISetupView from './DataReportCall/AISetupView.vue';
import GeneratingView from './DataReportCall/GeneratingView.vue';

const currentView = ref<'reports' | 'ai-setup' | 'generating'>('reports');
const reportConfig = ref<any>(null);
const selectedReport = ref<string | null>(null);

const reports = [
  { id: 'sales', name: 'Sales Performance', description: 'Revenue, conversions, and sales metrics' },
  { id: 'marketing', name: 'Marketing Analytics', description: 'Campaign performance and ROI' },
  { id: 'customer', name: 'Customer Insights', description: 'Behavior patterns and satisfaction' },
  { id: 'financial', name: 'Financial Summary', description: 'P&L, cash flow, and budget analysis' },
  { id: 'operational', name: 'Operational Metrics', description: 'Efficiency and productivity data' },
  { id: 'custom', name: 'Custom Report', description: 'Define your own report requirements' }
];

const handleAISetup = (solution: any) => {
  reportConfig.value = solution;
  currentView.value = 'generating';
};

const generateReport = (reportType: string) => {
  selectedReport.value = reportType;
  currentView.value = 'generating';
};

const getReportName = (reportType: string | null): string => {
  if (!reportType) return 'Custom Report';
  const report = reports.find(r => r.id === reportType);
  return report?.name || 'Custom Report';
};
</script>

