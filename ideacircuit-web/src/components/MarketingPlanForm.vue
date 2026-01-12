<template>
  <div class="h-full flex flex-col bg-white">
    <Card class="rounded-none border-b">
      <CardHeader class="p-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <CardTitle class="text-xl">AI-Generated Marketing Plan</CardTitle>
            <Badge variant="default" class="ml-3 bg-blue-100 text-blue-800">
              Auto-generating
            </Badge>
          </div>
          <div class="flex space-x-2">
            <Button variant="ghost" size="icon" class="rounded-full">
              <RefreshCwIcon :size="18" />
            </Button>
            <Button variant="ghost" size="icon" class="rounded-full">
              <EditIcon :size="18" />
            </Button>
            <Button variant="ghost" size="icon" class="rounded-full">
              <SaveIcon :size="18" />
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
        <!-- Client Info -->
        <Card>
          <CardContent class="bg-gray-50 p-4">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-lg font-medium text-gray-800">Acme Corporation</h2>
              <p class="text-sm text-gray-600">Industry: Software as a Service (SaaS)</p>
              <p class="text-sm text-gray-600">Target Market: Mid-size businesses (100-500 employees)</p>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg">
              <p class="text-sm font-medium text-blue-700">Analysis based on:</p>
              <ul class="text-xs text-blue-600 mt-1">
                <li>• 3 years of historical data</li>
                <li>• 1,245 customer records</li>
                <li>• 14 market research reports</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <!-- Executive Summary -->
        <Card>
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon('completed')" />
                <CardTitle class="font-medium ml-2">Executive Summary</CardTitle>
              </div>
              <Badge 
                :variant="getConfidenceBadgeVariant(confidenceLevels.executiveSummary)"
                class="flex items-center"
              >
                <BarChart4Icon :size="12" class="mr-1" />
                {{ confidenceLevels.executiveSummary }}% confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white">
            <p class="text-gray-700">
              Analysis of Acme Corporation's current market position indicates
              significant growth opportunity in the mid-size business segment,
              particularly within the technology and financial services
              verticals. Current customer acquisition cost (CAC) of $1,250 is
              15% above industry average, while customer lifetime value (CLV)
              of $8,750 creates a healthy CLV:CAC ratio of 7:1.
            </p>
            <p class="text-gray-700 mt-3">
              Recommend focusing marketing efforts on digital channels with
              targeted messaging around cost reduction and operational
              efficiency, which aligns with primary customer pain points
              identified in recent surveys. Competitive analysis suggests
              emphasizing your platform's integration capabilities and
              superior customer support (NPS score of 72 vs. industry average
              of 45).
            </p>
          </CardContent>
        </Card>

        <!-- Target Market Analysis -->
        <Card>
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon('completed')" />
                <CardTitle class="font-medium ml-2">Target Market Analysis</CardTitle>
              </div>
              <Badge 
                :variant="getConfidenceBadgeVariant(confidenceLevels.targetMarket)"
                class="flex items-center"
              >
                <BarChart4Icon :size="12" class="mr-1" />
                {{ confidenceLevels.targetMarket }}% confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <UsersIcon :size="16" class="mr-1" /> Primary Audience
                </h3>
                <ul class="text-gray-700 space-y-2">
                  <li><span class="font-medium">Demographics:</span> Mid-size businesses (100-500 employees)</li>
                  <li><span class="font-medium">Key Industries:</span> Technology (42%), Financial Services (28%), Healthcare (15%)</li>
                  <li><span class="font-medium">Decision Makers:</span> IT Directors (37%), CTOs (32%), Operations Managers (24%)</li>
                </ul>
              </div>
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <TargetIcon :size="16" class="mr-1" /> Key Pain Points
                </h3>
                <ul class="text-gray-700 space-y-2">
                  <li><span class="font-medium">Primary:</span> Cost management (87% of survey respondents)</li>
                  <li><span class="font-medium">Secondary:</span> System integration difficulties (72%)</li>
                  <li><span class="font-medium">Tertiary:</span> Reporting and analytics capabilities (65%)</li>
                </ul>
              </div>
            </div>
            <div class="mt-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <div class="flex items-start">
                <AlertTriangleIcon :size="18" class="text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <p class="text-sm font-medium text-yellow-800">Market Opportunity Alert</p>
                  <p class="text-sm text-yellow-700">
                    Data indicates an underserved segment within healthcare
                    industry (15% of current customers but 27% of total market
                    opportunity). Consider developing targeted messaging for
                    healthcare-specific use cases.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Competitive Analysis -->
        <Card>
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.competitiveAnalysis)" />
                <CardTitle class="font-medium ml-2">Competitive Analysis</CardTitle>
              </div>
              <div class="flex items-center space-x-2">
                <Badge 
                  v-if="completionStatus.competitiveAnalysis === 'completed'"
                  :variant="getConfidenceBadgeVariant(confidenceLevels.competitiveAnalysis)"
                  class="flex items-center"
                >
                  <BarChart4Icon :size="12" class="mr-1" />
                  {{ confidenceLevels.competitiveAnalysis }}% confidence
                </Badge>
                <Badge v-if="completionStatus.competitiveAnalysis === 'in-progress'" variant="default" class="bg-blue-600 text-white animate-pulse flex items-center">
                  <PenToolIcon :size="12" class="mr-1" />
                  AI analyzing data...
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white">
            <p v-if="completionStatus.competitiveAnalysis === 'completed'" class="text-gray-700">{{ aiTyping.fullText }}</p>
            <div v-else>
              <p class="text-gray-700">{{ aiTyping.section === 'competitiveAnalysis' ? aiTyping.text : '' }}</p>
              <span v-if="aiTyping.section === 'competitiveAnalysis' && aiTyping.isTyping" class="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
          </CardContent>
        </Card>

        <!-- Marketing Strategy -->
        <Card>
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.marketingStrategy)" />
                <CardTitle class="font-medium ml-2">Marketing Strategy</CardTitle>
              </div>
              <div class="flex items-center space-x-2">
                <Badge 
                  v-if="completionStatus.marketingStrategy === 'completed'"
                  :variant="getConfidenceBadgeVariant(confidenceLevels.marketingStrategy)"
                  class="flex items-center"
                >
                  <BarChart4Icon :size="12" class="mr-1" />
                  {{ confidenceLevels.marketingStrategy }}% confidence
                </Badge>
                <Badge v-if="completionStatus.marketingStrategy === 'in-progress'" variant="default" class="bg-blue-600 text-white animate-pulse flex items-center">
                  <PenToolIcon :size="12" class="mr-1" />
                  AI generating recommendations...
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white">
            <p v-if="completionStatus.marketingStrategy === 'completed'" class="text-gray-700">
              {{ aiTyping.section === 'marketingStrategy' ? aiTyping.fullText : '' }}
            </p>
            <div v-else-if="completionStatus.marketingStrategy === 'in-progress'">
              <p class="text-gray-700">{{ aiTyping.section === 'marketingStrategy' ? aiTyping.text : '' }}</p>
              <span v-if="aiTyping.section === 'marketingStrategy' && aiTyping.isTyping" class="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
            <div v-else class="flex items-center justify-center h-20 text-gray-400">
              <ClockIcon :size="18" class="mr-2" />
              <span>Waiting to analyze data...</span>
            </div>
          </CardContent>
        </Card>

        <!-- Budget and Resources -->
        <Card>
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.budget)" />
                <CardTitle class="font-medium ml-2">Budget and Resources</CardTitle>
              </div>
              <div class="flex items-center space-x-2">
                <Badge 
                  v-if="completionStatus.budget === 'completed'"
                  :variant="getConfidenceBadgeVariant(confidenceLevels.budget)"
                  class="flex items-center"
                >
                  <BarChart4Icon :size="12" class="mr-1" />
                  {{ confidenceLevels.budget }}% confidence
                </Badge>
                <Badge v-if="completionStatus.budget === 'in-progress'" variant="default" class="bg-blue-600 text-white animate-pulse flex items-center">
                  <PenToolIcon :size="12" class="mr-1" />
                  AI calculating budget...
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white">
            <p v-if="completionStatus.budget === 'completed'" class="text-gray-700">
              {{ aiTyping.section === 'budget' ? aiTyping.fullText : '' }}
            </p>
            <div v-else-if="completionStatus.budget === 'in-progress'">
              <p class="text-gray-700">{{ aiTyping.section === 'budget' ? aiTyping.text : '' }}</p>
              <span v-if="aiTyping.section === 'budget' && aiTyping.isTyping" class="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
            <div v-else class="flex items-center justify-center h-20 text-gray-400">
              <ClockIcon :size="18" class="mr-2" />
              <span>Waiting to analyze data...</span>
            </div>
          </CardContent>
        </Card>

        <!-- Timeline and Implementation -->
        <Card class="opacity-60">
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.timeline)" />
                <CardTitle class="font-medium ml-2">Timeline and Implementation</CardTitle>
              </div>
              <Badge 
                v-if="completionStatus.timeline === 'completed'"
                :variant="getConfidenceBadgeVariant(confidenceLevels.timeline)"
                class="flex items-center"
              >
                <BarChart4Icon :size="12" class="mr-1" />
                {{ confidenceLevels.timeline }}% confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white flex items-center justify-center h-20 text-gray-400">
            <ClockIcon :size="18" class="mr-2" />
            <span>Waiting to analyze data...</span>
          </CardContent>
        </Card>

        <!-- Performance Metrics -->
        <Card class="opacity-60">
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.metrics)" />
                <CardTitle class="font-medium ml-2">Performance Metrics</CardTitle>
              </div>
              <Badge 
                v-if="completionStatus.metrics === 'completed'"
                :variant="getConfidenceBadgeVariant(confidenceLevels.metrics)"
                class="flex items-center"
              >
                <BarChart4Icon :size="12" class="mr-1" />
                {{ confidenceLevels.metrics }}% confidence
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
  AlertCircleIcon,
  BarChart4Icon,
  UsersIcon,
  TrendingUpIcon,
  DollarSignIcon,
  CalendarIcon,
  TargetIcon,
  AlertTriangleIcon,
  PenToolIcon,
  EditIcon,
  SaveIcon,
  RefreshCwIcon,
  DownloadIcon
} from 'lucide-vue-next';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';

const completionStatus = ref({
  executiveSummary: 'completed',
  targetMarket: 'completed',
  competitiveAnalysis: 'in-progress',
  marketingStrategy: 'in-progress',
  budget: 'pending',
  timeline: 'pending',
  metrics: 'pending'
});

const aiTyping = ref({
  section: 'competitiveAnalysis',
  isTyping: false,
  text: '',
  fullText: 'Based on market data analysis, three primary competitors have been identified: CompanyX (42% market share), CompanyY (27% market share), and CompanyZ (15% market share). Your company currently holds 8% of the market. CompanyX leads in product quality but has higher pricing, while CompanyY offers competitive pricing but lower customer satisfaction ratings (67% vs. your 82%).'
});

const confidenceLevels = ref({
  executiveSummary: 92,
  targetMarket: 88,
  competitiveAnalysis: 76,
  marketingStrategy: 84,
  budget: 70,
  timeline: 65,
  metrics: 80
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
      
      if (aiTyping.value.section === 'competitiveAnalysis') {
        completionStatus.value.competitiveAnalysis = 'completed';
        setTimeout(() => {
          aiTyping.value = {
            section: 'marketingStrategy',
            isTyping: true,
            text: '',
            fullText: 'Recommend a multi-channel approach focusing on digital marketing (60%) and targeted industry events (40%). Key digital channels should include LinkedIn for B2B engagement (estimated 3.2% conversion rate), Google Ads with industry-specific keywords (projected 2.8% CTR), and email marketing campaigns to existing clients (expected 22% open rate, 4.1% conversion).'
          };
        }, 2000);
      } else if (aiTyping.value.section === 'marketingStrategy') {
        completionStatus.value.marketingStrategy = 'completed';
        completionStatus.value.budget = 'in-progress';
        setTimeout(() => {
          aiTyping.value = {
            section: 'budget',
            isTyping: true,
            text: '',
            fullText: 'Based on industry benchmarks and projected ROI analysis, recommend allocating $125,000 quarterly with the following distribution: Digital Marketing (60%): $75,000, Industry Events (25%): $31,250, Content Creation (10%): $12,500, Contingency (5%): $6,250.'
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

