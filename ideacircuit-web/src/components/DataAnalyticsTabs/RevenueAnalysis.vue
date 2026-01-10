<template>
  <div class="space-y-6">
    <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Revenue Trends</h3>
        <div :class="`px-2 py-1 rounded-full text-xs font-medium bg-${getConfidenceColor(confidenceLevel)}-100 text-${getConfidenceColor(confidenceLevel)}-800 flex items-center`">
          <BarChart4Icon :size="12" class="mr-1" />
          {{ confidenceLevel }}% confidence
        </div>
      </div>
      <div class="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden">
        <div class="absolute inset-0 p-4">
          <div class="w-full h-full flex items-end">
            <div class="flex-1 h-[30%] bg-blue-500 opacity-20 rounded-sm"></div>
            <div class="flex-1 h-[45%] bg-blue-500 opacity-30 rounded-sm"></div>
            <div class="flex-1 h-[40%] bg-blue-500 opacity-40 rounded-sm"></div>
            <div class="flex-1 h-[60%] bg-blue-500 opacity-50 rounded-sm"></div>
            <div class="flex-1 h-[70%] bg-blue-500 opacity-60 rounded-sm"></div>
            <div class="flex-1 h-[65%] bg-blue-500 opacity-70 rounded-sm"></div>
            <div class="flex-1 h-[80%] bg-blue-500 opacity-80 rounded-sm"></div>
            <div class="flex-1 h-[90%] bg-blue-500 opacity-90 rounded-sm"></div>
          </div>
          <div class="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-gray-500">
            <span>Q1</span>
            <span>Q2</span>
            <span>Q3</span>
            <span>Q4</span>
            <span>Q1</span>
            <span>Q2</span>
            <span>Q3</span>
            <span>Q4</span>
          </div>
          <div class="absolute top-4 left-4 text-sm font-medium text-gray-700">
            Revenue Growth: +18.7% YoY
          </div>
        </div>
      </div>
      <div class="mt-4 grid grid-cols-4 gap-4">
        <div class="p-3 bg-blue-50 rounded-md">
          <div class="text-sm text-blue-800 font-medium">Total Revenue</div>
          <div class="text-xl font-bold text-blue-900">$5.9M</div>
          <div class="text-xs text-blue-700 flex items-center mt-1">
            <TrendingUpIcon :size="12" class="mr-1" /> +18.7% YoY
          </div>
        </div>
        <div class="p-3 bg-green-50 rounded-md">
          <div class="text-sm text-green-800 font-medium">Gross Margin</div>
          <div class="text-xl font-bold text-green-900">68%</div>
          <div class="text-xs text-green-700 flex items-center mt-1">
            <TrendingUpIcon :size="12" class="mr-1" /> +6% YoY
          </div>
        </div>
        <div class="p-3 bg-purple-50 rounded-md">
          <div class="text-sm text-purple-800 font-medium">EBITDA</div>
          <div class="text-xl font-bold text-purple-900">$1.32M</div>
          <div class="text-xs text-purple-700 flex items-center mt-1">
            <TrendingUpIcon :size="12" class="mr-1" /> +22.4% YoY
          </div>
        </div>
        <div class="p-3 bg-yellow-50 rounded-md">
          <div class="text-sm text-yellow-800 font-medium">ARR</div>
          <div class="text-xl font-bold text-yellow-900">$4.8M</div>
          <div class="text-xs text-yellow-700 flex items-center mt-1">
            <TrendingUpIcon :size="12" class="mr-1" /> +24.1% YoY
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Revenue Breakdown</h3>
      </div>
      <div class="grid grid-cols-2 gap-6">
        <div>
          <h4 class="text-sm font-medium text-gray-500 mb-3">BY PRODUCT LINE</h4>
          <div class="space-y-3">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>TechFlow</span>
                <span class="font-medium">$3.66M (62%)</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 62%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>SecureConnect</span>
                <span class="font-medium">$1.36M (23%)</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" style="width: 23%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>CloudManage</span>
                <span class="font-medium">$0.88M (15%)</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-purple-500 h-2 rounded-full" style="width: 15%"></div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500 mb-3">BY REGION</h4>
          <div class="space-y-3">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>North America</span>
                <span class="font-medium">$3.42M (58%)</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-indigo-500 h-2 rounded-full" style="width: 58%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Europe</span>
                <span class="font-medium">$1.71M (29%)</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-yellow-500 h-2 rounded-full" style="width: 29%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Asia Pacific</span>
                <span class="font-medium">$0.77M (13%)</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-red-500 h-2 rounded-full" style="width: 13%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Key Insights</h3>
      </div>
      <div class="space-y-3">
        <div class="p-3 border border-blue-200 rounded-md bg-blue-50">
          <div class="flex items-start">
            <TrendingUpIcon :size="18" class="text-blue-600 mr-2 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-blue-800">Strong Growth Trajectory</p>
              <p class="text-sm text-blue-700">
                Revenue CAGR of 18.7% over the past 3 years exceeds industry
                average of 12.3%, positioning the company in the top quartile
                of growth performers.
              </p>
            </div>
          </div>
        </div>
        <div class="p-3 border border-green-200 rounded-md bg-green-50">
          <div class="flex items-start">
            <DollarSignIcon :size="18" class="text-green-600 mr-2 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-green-800">Improving Margins</p>
              <p class="text-sm text-green-700">
                Gross margin improvement from 62% to 68% indicates successful
                product scaling and operational efficiency. Further
                improvements expected as CloudManage matures.
              </p>
            </div>
          </div>
        </div>
        <div class="p-3 border border-yellow-200 rounded-md bg-yellow-50">
          <div class="flex items-start">
            <AlertCircleIcon :size="18" class="text-yellow-600 mr-2 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-yellow-800">Geographic Expansion Opportunity</p>
              <p class="text-sm text-yellow-700">
                Asia Pacific region represents only 13% of revenue despite
                being 28% of global market. Significant growth opportunity
                with targeted expansion strategy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart4Icon, TrendingUpIcon, DollarSignIcon, AlertCircleIcon } from 'lucide-vue-next';

interface Props {
  confidenceLevel: number;
}

defineProps<Props>();

const getConfidenceColor = (level: number) => {
  if (level > 85) return 'green';
  if (level > 70) return 'blue';
  if (level > 50) return 'yellow';
  return 'red';
};
</script>

