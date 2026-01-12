<template>
  <div class="h-full flex flex-col bg-white">
    <Card class="rounded-none border-b">
      <CardHeader class="p-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <CardTitle class="text-xl">AI-Generated Business Profile</CardTitle>
            <Badge variant="default" class="ml-3 bg-blue-100 text-blue-800">
              Auto-generating
            </Badge>
          </div>
          <div class="flex space-x-2">
            <Button variant="ghost" size="icon" class="rounded-full">
              <RefreshCwIcon :size="18" />
            </Button>
            <Button variant="ghost" size="icon" class="rounded-full">
              <PrinterIcon :size="18" />
            </Button>
            <Button variant="ghost" size="icon" class="rounded-full">
              <Share2Icon :size="18" />
            </Button>
            <Button variant="ghost" size="icon" class="rounded-full">
              <DownloadIcon :size="18" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
    <div class="flex-1 overflow-y-auto p-6">
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Company Header -->
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
            TS
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">TechSolutions Inc.</h1>
            <p class="text-gray-500">Enterprise Software | Founded 2015 | San Francisco, CA</p>
          </div>
        </div>

        <!-- Data Sources -->
        <Card>
          <CardContent class="p-4 bg-gray-50">
            <div class="flex items-start">
              <div class="flex-1">
                <h2 class="text-sm font-medium text-gray-500">PROFILE GENERATED USING</h2>
                <div class="mt-2 flex flex-wrap gap-2">
                  <Badge variant="default" class="bg-blue-100 text-blue-800 flex items-center">
                    <FileTextIcon :size="12" class="mr-1" /> SEC Filings
                  </Badge>
                  <Badge variant="default" class="bg-blue-100 text-blue-800 flex items-center">
                    <GlobeIcon :size="12" class="mr-1" /> Company Website
                  </Badge>
                  <Badge variant="default" class="bg-blue-100 text-blue-800 flex items-center">
                    <UsersIcon :size="12" class="mr-1" /> LinkedIn Data
                  </Badge>
                  <Badge variant="default" class="bg-blue-100 text-blue-800 flex items-center">
                    <BarChart4Icon :size="12" class="mr-1" /> Industry Reports
                  </Badge>
                </div>
              </div>
              <div class="flex-1">
                <h2 class="text-sm font-medium text-gray-500">LAST UPDATED</h2>
                <p class="mt-2 text-sm text-gray-700">June 12, 2023 (2 days ago)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Company Information -->
        <Card>
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.companyInfo)" />
                <CardTitle class="font-medium ml-2">Company Information</CardTitle>
              </div>
              <Badge 
                :variant="getConfidenceBadgeVariant(confidenceLevels.companyInfo)"
                class="flex items-center"
              >
                <BarChart4Icon :size="12" class="mr-1" />
                {{ confidenceLevels.companyInfo }}% confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">COMPANY OVERVIEW</h3>
                <p class="text-gray-700">
                  TechSolutions Inc. is a B2B software company specializing in
                  enterprise workflow automation, data security, and cloud
                  management solutions. Founded in 2015 by former Google
                  engineers, the company has grown to 187 employees across
                  offices in San Francisco (HQ), Boston, and London.
                </p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">COMPANY DETAILS</h3>
                <div class="space-y-2">
                  <div class="flex">
                    <span class="text-gray-500 w-32">Legal Name:</span>
                    <span class="text-gray-700 font-medium">TechSolutions, Inc.</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-500 w-32">Founded:</span>
                    <span class="text-gray-700 font-medium">March 2015</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-500 w-32">Headquarters:</span>
                    <span class="text-gray-700 font-medium">San Francisco, CA</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-500 w-32">Employees:</span>
                    <span class="text-gray-700 font-medium">187 (23% YoY growth)</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-500 w-32">Funding:</span>
                    <span class="text-gray-700 font-medium">$42M (Series B)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Leadership Team -->
        <Card>
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.leadership)" />
                <CardTitle class="font-medium ml-2">Leadership Team</CardTitle>
              </div>
              <Badge 
                :variant="getConfidenceBadgeVariant(confidenceLevels.leadership)"
                class="flex items-center"
              >
                <BarChart4Icon :size="12" class="mr-1" />
                {{ confidenceLevels.leadership }}% confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white">
            <div class="grid grid-cols-2 gap-6">
              <div class="flex items-start space-x-3">
                <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  <UsersIcon :size="20" />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Sarah Chen</h3>
                  <p class="text-sm text-gray-500">Co-Founder & CEO</p>
                  <p class="text-xs text-gray-500 mt-1">
                    Former Engineering Director at Google Cloud (2010-2015)
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  <UsersIcon :size="20" />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Michael Rodriguez</h3>
                  <p class="text-sm text-gray-500">Co-Founder & CTO</p>
                  <p class="text-xs text-gray-500 mt-1">
                    Former Senior Software Engineer at Google (2008-2015)
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  <UsersIcon :size="20" />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">David Wilson</h3>
                  <p class="text-sm text-gray-500">Chief Financial Officer</p>
                  <p class="text-xs text-gray-500 mt-1">
                    Former VP of Finance at Salesforce (2012-2019)
                  </p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  <UsersIcon :size="20" />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Jennifer Park</h3>
                  <p class="text-sm text-gray-500">VP of Sales</p>
                  <p class="text-xs text-gray-500 mt-1">
                    Former Sales Director at Oracle (2014-2020)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Financial Overview -->
        <Card>
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.financials)" />
                <CardTitle class="font-medium ml-2">Financial Overview</CardTitle>
              </div>
              <div class="flex items-center space-x-2">
                <Badge 
                  v-if="completionStatus.financials === 'completed'"
                  :variant="getConfidenceBadgeVariant(confidenceLevels.financials)"
                  class="flex items-center"
                >
                  <BarChart4Icon :size="12" class="mr-1" />
                  {{ confidenceLevels.financials }}% confidence
                </Badge>
                <Badge v-if="completionStatus.financials === 'in-progress'" variant="default" class="bg-blue-600 text-white animate-pulse flex items-center">
                  <PenToolIcon :size="12" class="mr-1" />
                  AI analyzing financial data...
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white">
            <p v-if="completionStatus.financials === 'completed'" class="text-gray-700">{{ aiTyping.fullText }}</p>
            <div v-else>
              <p class="text-gray-700">{{ aiTyping.section === 'financials' ? aiTyping.text : '' }}</p>
              <span v-if="aiTyping.section === 'financials' && aiTyping.isTyping" class="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
          </CardContent>
        </Card>

        <!-- Products & Services -->
        <Card>
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.products)" />
                <CardTitle class="font-medium ml-2">Products & Services</CardTitle>
              </div>
              <div class="flex items-center space-x-2">
                <Badge 
                  v-if="completionStatus.products === 'completed'"
                  :variant="getConfidenceBadgeVariant(confidenceLevels.products)"
                  class="flex items-center"
                >
                  <BarChart4Icon :size="12" class="mr-1" />
                  {{ confidenceLevels.products }}% confidence
                </Badge>
                <Badge v-if="completionStatus.products === 'in-progress'" variant="default" class="bg-blue-600 text-white animate-pulse flex items-center">
                  <PenToolIcon :size="12" class="mr-1" />
                  AI analyzing product data...
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white">
            <p v-if="completionStatus.products === 'completed'" class="text-gray-700">{{ aiTyping.fullText }}</p>
            <div v-else-if="completionStatus.products === 'in-progress'">
              <p class="text-gray-700">{{ aiTyping.section === 'products' ? aiTyping.text : '' }}</p>
              <span v-if="aiTyping.section === 'products' && aiTyping.isTyping" class="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
            <div v-else class="flex items-center justify-center h-20 text-gray-400">
              <ClockIcon :size="18" class="mr-2" />
              <span>Waiting to analyze data...</span>
            </div>
          </CardContent>
        </Card>

        <!-- Market Position -->
        <Card>
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.marketPosition)" />
                <CardTitle class="font-medium ml-2">Market Position</CardTitle>
              </div>
              <div class="flex items-center space-x-2">
                <Badge 
                  v-if="completionStatus.marketPosition === 'completed'"
                  :variant="getConfidenceBadgeVariant(confidenceLevels.marketPosition)"
                  class="flex items-center"
                >
                  <BarChart4Icon :size="12" class="mr-1" />
                  {{ confidenceLevels.marketPosition }}% confidence
                </Badge>
                <Badge v-if="completionStatus.marketPosition === 'in-progress'" variant="default" class="bg-blue-600 text-white animate-pulse flex items-center">
                  <PenToolIcon :size="12" class="mr-1" />
                  AI analyzing market data...
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white">
            <p v-if="completionStatus.marketPosition === 'completed'" class="text-gray-700">{{ aiTyping.fullText }}</p>
            <div v-else-if="completionStatus.marketPosition === 'in-progress'">
              <p class="text-gray-700">{{ aiTyping.section === 'marketPosition' ? aiTyping.text : '' }}</p>
              <span v-if="aiTyping.section === 'marketPosition' && aiTyping.isTyping" class="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
            <div v-else class="flex items-center justify-center h-20 text-gray-400">
              <ClockIcon :size="18" class="mr-2" />
              <span>Waiting to analyze data...</span>
            </div>
          </CardContent>
        </Card>

        <!-- Growth Opportunities -->
        <Card class="opacity-60">
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.growthOpportunities)" />
                <CardTitle class="font-medium ml-2">Growth Opportunities</CardTitle>
              </div>
              <Badge 
                v-if="completionStatus.growthOpportunities === 'completed'"
                :variant="getConfidenceBadgeVariant(confidenceLevels.growthOpportunities)"
                class="flex items-center"
              >
                <BarChart4Icon :size="12" class="mr-1" />
                {{ confidenceLevels.growthOpportunities }}% confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white flex items-center justify-center h-20 text-gray-400">
            <ClockIcon :size="18" class="mr-2" />
            <span>Waiting to analyze data...</span>
          </CardContent>
        </Card>

        <!-- Risk Assessment -->
        <Card class="opacity-60">
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.riskAssessment)" />
                <CardTitle class="font-medium ml-2">Risk Assessment</CardTitle>
              </div>
              <Badge 
                v-if="completionStatus.riskAssessment === 'completed'"
                :variant="getConfidenceBadgeVariant(confidenceLevels.riskAssessment)"
                class="flex items-center"
              >
                <BarChart4Icon :size="12" class="mr-1" />
                {{ confidenceLevels.riskAssessment }}% confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white flex items-center justify-center h-20 text-gray-400">
            <ClockIcon :size="18" class="mr-2" />
            <span>Waiting to analyze data...</span>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import {
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  BarChart4Icon,
  FileTextIcon,
  GlobeIcon,
  PenToolIcon,
  RefreshCwIcon,
  DownloadIcon,
  Share2Icon,
  PrinterIcon
} from 'lucide-vue-next';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';

const completionStatus = ref({
  companyInfo: 'completed',
  leadership: 'completed',
  financials: 'in-progress',
  products: 'pending',
  marketPosition: 'pending',
  growthOpportunities: 'pending',
  riskAssessment: 'pending'
});

const aiTyping = ref({
  section: 'financials',
  isTyping: false,
  text: '',
  fullText: 'Based on the last 3 fiscal years, revenue has grown at a CAGR of 18.7%, from $4.2M in FY2020 to $5.9M in FY2022. Gross margin has improved from 62% to 68% during this period. EBITDA margin stands at 22.4%, which is 3.2 percentage points above industry average. Current ratio is healthy at 2.3, with a debt-to-equity ratio of 0.4, indicating strong financial stability and room for additional leverage if needed for expansion.'
});

const confidenceLevels = ref({
  companyInfo: 95,
  leadership: 90,
  financials: 87,
  products: 82,
  marketPosition: 78,
  growthOpportunities: 73,
  riskAssessment: 68
});

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

const getConfidenceColor = (level: number) => {
  if (level > 85) return 'green';
  if (level > 70) return 'blue';
  if (level > 50) return 'yellow';
  return 'red';
};

const getConfidenceBadgeVariant = (level: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (level > 85) return 'default';
  if (level > 70) return 'default';
  if (level > 50) return 'secondary';
  return 'destructive';
};

// Simulate AI typing effect
watch(() => aiTyping.value.isTyping, (isTyping) => {
  if (isTyping && aiTyping.value.text.length < aiTyping.value.fullText.length) {
    const typingSpeed = Math.floor(Math.random() * 30) + 20;
    const timer = setTimeout(() => {
      aiTyping.value.text = aiTyping.value.fullText.substring(0, aiTyping.value.text.length + 1);
    }, typingSpeed);
    return () => clearTimeout(timer);
  } else if (isTyping && aiTyping.value.text.length === aiTyping.value.fullText.length) {
    const timer = setTimeout(() => {
      aiTyping.value.isTyping = false;
      
      if (aiTyping.value.section === 'financials') {
        completionStatus.value.financials = 'completed';
        completionStatus.value.products = 'in-progress';
        setTimeout(() => {
          aiTyping.value = {
            section: 'products',
            isTyping: true,
            text: '',
            fullText: 'The company offers 3 core product lines: TechFlow (enterprise workflow automation), SecureConnect (data security suite), and CloudManage (cloud resource optimization). TechFlow is the flagship product, contributing 62% of revenue with 24% YoY growth. SecureConnect (23% of revenue) is growing at 31% YoY, while CloudManage (15% of revenue) was launched 18 months ago and is gaining traction in the mid-market segment.'
          };
        }, 2000);
      } else if (aiTyping.value.section === 'products') {
        completionStatus.value.products = 'completed';
        completionStatus.value.marketPosition = 'in-progress';
        setTimeout(() => {
          aiTyping.value = {
            section: 'marketPosition',
            isTyping: true,
            text: '',
            fullText: 'Current market position analysis indicates the company holds approximately 8.5% market share in the workflow automation segment (ranked 4th), 3.2% in security solutions (ranked 7th), and is an emerging player in cloud management. Primary competitors include EnterpriseFlow (22% market share), SecureTech (15%), and CloudSystems (12%). Key competitive advantages include superior customer support (NPS of 72 vs. industry average of 48) and product integration capabilities.'
          };
        }, 2000);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }
}, { deep: true });

onMounted(() => {
  const timer = setTimeout(() => {
    aiTyping.value.isTyping = true;
  }, 1500);
  return () => clearTimeout(timer);
});
</script>

