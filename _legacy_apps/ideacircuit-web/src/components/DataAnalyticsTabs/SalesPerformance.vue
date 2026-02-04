<template>
  <div v-if="generationProgress !== 'completed'" class="h-96 flex items-center justify-center">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p class="text-lg font-medium text-gray-700">Analyzing sales performance data...</p>
      <p class="text-sm text-gray-500 mt-2">This may take a few moments</p>
    </div>
  </div>
  <div v-else class="space-y-6">
    <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Sales Overview</h3>
        <div :class="`px-2 py-1 rounded-full text-xs font-medium bg-${getConfidenceColor(confidenceLevel)}-100 text-${getConfidenceColor(confidenceLevel)}-800 flex items-center`">
          <BarChart4Icon :size="12" class="mr-1" />
          {{ confidenceLevel }}% confidence
        </div>
      </div>
      <div class="grid grid-cols-4 gap-4">
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
          <div class="text-sm text-gray-500">New Deals</div>
          <div class="text-3xl font-bold text-gray-900 mt-1">142</div>
          <div class="text-xs text-green-600 flex items-center justify-center mt-1">
            <TrendingUpIcon :size="12" class="mr-1" /> +18% QoQ
          </div>
        </div>
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
          <div class="text-sm text-gray-500">Win Rate</div>
          <div class="text-3xl font-bold text-gray-900 mt-1">28%</div>
          <div class="text-xs text-green-600 flex items-center justify-center mt-1">
            <TrendingUpIcon :size="12" class="mr-1" /> +3% QoQ
          </div>
        </div>
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
          <div class="text-sm text-gray-500">Avg. Deal Size</div>
          <div class="text-3xl font-bold text-gray-900 mt-1">$32K</div>
          <div class="text-xs text-green-600 flex items-center justify-center mt-1">
            <TrendingUpIcon :size="12" class="mr-1" /> +7% QoQ
          </div>
        </div>
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
          <div class="text-sm text-gray-500">Sales Cycle</div>
          <div class="text-3xl font-bold text-gray-900 mt-1">42d</div>
          <div class="text-xs text-red-600 flex items-center justify-center mt-1">
            <TrendingUpIcon :size="12" class="mr-1" /> +4d QoQ
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-6">
      <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Pipeline Analysis</h3>
        </div>
        <div class="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden">
          <div class="w-full px-12">
            <div class="h-10 bg-blue-500 w-full rounded-t-lg"></div>
            <div class="h-10 bg-blue-500 w-[85%] mx-auto"></div>
            <div class="h-10 bg-blue-500 w-[65%] mx-auto"></div>
            <div class="h-10 bg-blue-500 w-[40%] mx-auto"></div>
            <div class="h-10 bg-blue-500 w-[28%] mx-auto rounded-b-lg"></div>
          </div>
          <div class="absolute top-0 bottom-0 left-4 flex flex-col justify-between py-2">
            <div class="text-xs">Lead (312)</div>
            <div class="text-xs">MQL (265)</div>
            <div class="text-xs">SQL (202)</div>
            <div class="text-xs">Proposal (125)</div>
            <div class="text-xs">Won (87)</div>
          </div>
          <div class="absolute top-0 bottom-0 right-4 flex flex-col justify-between py-2">
            <div class="text-xs">100%</div>
            <div class="text-xs">85%</div>
            <div class="text-xs">65%</div>
            <div class="text-xs">40%</div>
            <div class="text-xs">28%</div>
          </div>
        </div>
        <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div class="flex items-start">
            <AlertCircleIcon :size="16" class="text-yellow-600 mr-2 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-yellow-800">Pipeline Analysis</p>
              <p class="text-xs text-yellow-700">
                Significant drop-off between SQL and Proposal stages (37%
                conversion vs. 52% benchmark). Recommend sales enablement
                focus on proposal preparation and competitive
                differentiation.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Sales Rep Performance</h3>
        </div>
        <div class="space-y-3">
          <div v-for="rep in salesReps" :key="rep.name">
            <div class="flex justify-between text-sm mb-1">
              <span>{{ rep.name }}</span>
              <span class="font-medium">{{ rep.value }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div :class="`${rep.color} h-2 rounded-full`" :style="`width: ${rep.width}%`"></div>
            </div>
          </div>
        </div>
        <div class="mt-6">
          <h4 class="text-sm font-medium text-gray-500 mb-3">TOP PERFORMER ANALYSIS</h4>
          <div class="p-3 bg-green-50 border border-green-200 rounded-md">
            <div class="flex items-start">
              <UsersIcon :size="16" class="text-green-600 mr-2 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-green-800">Success Patterns</p>
                <p class="text-xs text-green-700">
                  Top performers spend 38% more time on discovery calls and
                  send 2.4x more personalized content to prospects. They
                  also involve solution architects 27% earlier in the sales
                  process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Recommendations</h3>
      </div>
      <div class="space-y-3">
        <div class="p-3 border border-blue-200 rounded-md bg-blue-50">
          <div class="flex items-start">
            <TrendingUpIcon :size="18" class="text-blue-600 mr-2 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-blue-800">Sales Enablement Focus</p>
              <p class="text-sm text-blue-700">
                Implement structured discovery call framework based on top
                performer practices. Create battle cards addressing key
                competitor differentiators at proposal stage.
              </p>
            </div>
          </div>
        </div>
        <div class="p-3 border border-green-200 rounded-md bg-green-50">
          <div class="flex items-start">
            <DollarSignIcon :size="18" class="text-green-600 mr-2 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-green-800">Territory Optimization</p>
              <p class="text-sm text-green-700">
                Northeast territory shows 32% higher win rates but is
                understaffed by 2 reps. Recommend rebalancing territories to
                capitalize on this opportunity.
              </p>
            </div>
          </div>
        </div>
        <div class="p-3 border border-purple-200 rounded-md bg-purple-50">
          <div class="flex items-start">
            <ShoppingCartIcon :size="18" class="text-purple-600 mr-2 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-purple-800">Product Focus</p>
              <p class="text-sm text-purple-700">
                SecureConnect shows highest win rate (34%) and fastest sales
                cycle (36 days). Recommend increasing pipeline generation
                activities for this product line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart4Icon, TrendingUpIcon, DollarSignIcon, UsersIcon, ShoppingCartIcon, AlertCircleIcon } from 'lucide-vue-next';

interface Props {
  generationProgress: string;
  confidenceLevel: number;
}

defineProps<Props>();

const salesReps = [
  { name: 'Jennifer Park', value: '$1.24M (147% of quota)', width: 147, color: 'bg-green-500' },
  { name: 'Robert Chen', value: '$0.92M (108% of quota)', width: 108, color: 'bg-green-500' },
  { name: 'Sarah Johnson', value: '$0.86M (101% of quota)', width: 101, color: 'bg-green-500' },
  { name: 'Michael Brown', value: '$0.79M (93% of quota)', width: 93, color: 'bg-yellow-500' },
  { name: 'David Wilson', value: '$0.68M (80% of quota)', width: 80, color: 'bg-red-500' }
];

const getConfidenceColor = (level: number) => {
  if (level > 85) return 'green';
  if (level > 70) return 'blue';
  if (level > 50) return 'yellow';
  return 'red';
};
</script>

