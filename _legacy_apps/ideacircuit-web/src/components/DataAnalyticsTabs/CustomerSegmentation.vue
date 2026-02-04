<template>
  <div class="space-y-6">
    <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Customer Distribution</h3>
        <div :class="`px-2 py-1 rounded-full text-xs font-medium bg-${getConfidenceColor(confidenceLevel)}-100 text-${getConfidenceColor(confidenceLevel)}-800 flex items-center`">
          <BarChart4Icon :size="12" class="mr-1" />
          {{ confidenceLevel }}% confidence
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
          <div class="text-sm text-gray-500">Total Customers</div>
          <div class="text-3xl font-bold text-gray-900 mt-1">487</div>
          <div class="text-xs text-green-600 flex items-center justify-center mt-1">
            <TrendingUpIcon :size="12" class="mr-1" /> +32% YoY
          </div>
        </div>
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
          <div class="text-sm text-gray-500">Avg. Contract Value</div>
          <div class="text-3xl font-bold text-gray-900 mt-1">$12,100</div>
          <div class="text-xs text-green-600 flex items-center justify-center mt-1">
            <TrendingUpIcon :size="12" class="mr-1" /> +8% YoY
          </div>
        </div>
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
          <div class="text-sm text-gray-500">Customer Retention</div>
          <div class="text-3xl font-bold text-gray-900 mt-1">94.3%</div>
          <div class="text-xs text-green-600 flex items-center justify-center mt-1">
            <TrendingUpIcon :size="12" class="mr-1" /> +2.1% YoY
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Customer Insights</h3>
      </div>
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h4 class="text-sm font-medium text-gray-500 mb-3">INDUSTRY DISTRIBUTION</h4>
          <div class="space-y-3">
            <div v-for="industry in industries" :key="industry.name">
              <div class="flex justify-between text-sm mb-1">
                <span>{{ industry.name }}</span>
                <span class="font-medium">{{ industry.value }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div :class="`${industry.color} h-2 rounded-full`" :style="`width: ${industry.percent}%`"></div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500 mb-3">CUSTOMER LIFETIME VALUE</h4>
          <div class="space-y-3">
            <div v-for="segment in segments" :key="segment.name">
              <div class="flex justify-between text-sm mb-1">
                <span>{{ segment.name }}</span>
                <span class="font-medium">{{ segment.value }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div :class="`${segment.color} h-2 rounded-full`" :style="`width: ${segment.width}%`"></div>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-500 mb-2">CUSTOMER SATISFACTION</h4>
            <div class="flex items-center">
              <span class="text-3xl font-bold text-gray-900">72</span>
              <span class="ml-1 text-sm text-gray-500">NPS Score</span>
              <span class="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Industry Top Quartile
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Key Opportunities</h3>
      </div>
      <div class="space-y-3">
        <div class="p-3 border border-blue-200 rounded-md bg-blue-50">
          <div class="flex items-start">
            <UsersIcon :size="18" class="text-blue-600 mr-2 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-blue-800">Enterprise Customer Expansion</p>
              <p class="text-sm text-blue-700">
                Enterprise segment shows 42% higher upsell rate than other
                segments. Recommend focusing account management resources on
                the 38 enterprise accounts with highest growth potential.
              </p>
            </div>
          </div>
        </div>
        <div class="p-3 border border-green-200 rounded-md bg-green-50">
          <div class="flex items-start">
            <TrendingUpIcon :size="18" class="text-green-600 mr-2 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-green-800">Healthcare Vertical Growth</p>
              <p class="text-sm text-green-700">
                Healthcare customers show 31% higher retention and 24% higher
                LTV than average. Recommend developing healthcare-specific
                features and marketing campaigns.
              </p>
            </div>
          </div>
        </div>
        <div class="p-3 border border-yellow-200 rounded-md bg-yellow-50">
          <div class="flex items-start">
            <AlertCircleIcon :size="18" class="text-yellow-600 mr-2 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-yellow-800">SMB Churn Risk</p>
              <p class="text-sm text-yellow-700">
                SMB segment shows 2.3x higher churn risk in first 90 days.
                Recommend enhancing onboarding process and creating SMB
                success team to address specific needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart4Icon, TrendingUpIcon, UsersIcon, AlertCircleIcon } from 'lucide-vue-next';

interface Props {
  confidenceLevel: number;
}

defineProps<Props>();

const industries = [
  { name: 'Technology', value: '186 (38%)', percent: 38, color: 'bg-blue-600' },
  { name: 'Financial Services', value: '121 (25%)', percent: 25, color: 'bg-green-500' },
  { name: 'Healthcare', value: '78 (16%)', percent: 16, color: 'bg-purple-500' },
  { name: 'Manufacturing', value: '53 (11%)', percent: 11, color: 'bg-yellow-500' },
  { name: 'Other', value: '49 (10%)', percent: 10, color: 'bg-red-500' }
];

const segments = [
  { name: 'Enterprise', value: '$86,400', width: 90, color: 'bg-indigo-500' },
  { name: 'Mid-Market', value: '$42,300', width: 45, color: 'bg-blue-500' },
  { name: 'SMB', value: '$18,500', width: 20, color: 'bg-teal-500' }
];

const getConfidenceColor = (level: number) => {
  if (level > 85) return 'green';
  if (level > 70) return 'blue';
  if (level > 50) return 'yellow';
  return 'red';
};
</script>

