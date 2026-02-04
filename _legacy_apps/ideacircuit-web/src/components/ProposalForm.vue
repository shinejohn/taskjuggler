<template>
  <div class="h-full flex flex-col bg-white">
    <Card class="rounded-none border-b">
      <CardHeader class="p-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <CardTitle class="text-xl">AI-Generated Client Proposal</CardTitle>
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
        <!-- Client Info -->
        <Card>
          <CardContent class="bg-gray-50 p-4">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-lg font-medium text-gray-800">Global Innovations Inc.</h2>
                <p class="text-sm text-gray-600">Industry: Financial Technology</p>
                <p class="text-sm text-gray-600">Project: AI-Powered Risk Assessment System</p>
              </div>
              <div class="bg-blue-50 p-3 rounded-lg">
                <p class="text-sm font-medium text-blue-700">Proposal based on:</p>
                <ul class="text-xs text-blue-600 mt-1">
                  <li>• Initial discovery meeting (June 5, 2023)</li>
                  <li>• Client requirements document</li>
                  <li>• Industry benchmarks from 8 similar projects</li>
                </ul>
              </div>
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
              Global Innovations Inc. seeks to develop an AI-powered risk
              assessment system to enhance their credit decisioning process.
              This proposal outlines our approach to building a custom machine
              learning solution that will analyze traditional and alternative
              data sources to improve risk prediction accuracy by an estimated
              28% while reducing false positives by approximately 35%.
            </p>
            <p class="text-gray-700 mt-3">
              Our team of data scientists and engineers will deliver a
              fully-integrated solution within 8 weeks, with ongoing support
              for 3 months post-implementation. The system will seamlessly
              integrate with your existing infrastructure and provide
              real-time insights through an intuitive dashboard. Based on
              similar implementations, we project a potential ROI of 215%
              within the first 12 months of deployment.
            </p>
          </CardContent>
        </Card>

        <!-- Project Scope -->
        <Card>
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon('completed')" />
                <CardTitle class="font-medium ml-2">Project Scope</CardTitle>
              </div>
              <Badge 
                :variant="getConfidenceBadgeVariant(confidenceLevels.projectScope)"
                class="flex items-center"
              >
                <BarChart4Icon :size="12" class="mr-1" />
                {{ confidenceLevels.projectScope }}% confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <CheckSquareIcon :size="16" class="mr-1" /> In Scope
                </h3>
                <ul class="text-gray-700 space-y-2">
                  <li class="flex items-start">
                    <span class="text-green-500 mr-2">✓</span>
                    Development of custom machine learning models for risk assessment
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-500 mr-2">✓</span>
                    Integration with existing CRM and financial systems
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-500 mr-2">✓</span>
                    Interactive dashboard with real-time risk scoring
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-500 mr-2">✓</span>
                    API development for third-party data sources
                  </li>
                  <li class="flex items-start">
                    <span class="text-green-500 mr-2">✓</span>
                    Staff training and comprehensive documentation
                  </li>
                </ul>
              </div>
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <ListIcon :size="16" class="mr-1" /> Out of Scope
                </h3>
                <ul class="text-gray-700 space-y-2">
                  <li class="flex items-start">
                    <span class="text-red-500 mr-2">✕</span>
                    Hardware provisioning or infrastructure upgrades
                  </li>
                  <li class="flex items-start">
                    <span class="text-red-500 mr-2">✕</span>
                    Modification of existing internal databases
                  </li>
                  <li class="flex items-start">
                    <span class="text-red-500 mr-2">✕</span>
                    End-user customer support systems
                  </li>
                  <li class="flex items-start">
                    <span class="text-red-500 mr-2">✕</span>
                    Regulatory compliance certifications
                  </li>
                  <li class="flex items-start">
                    <span class="text-red-500 mr-2">✕</span>
                    Data migration from legacy systems
                  </li>
                </ul>
              </div>
            </div>
            <div class="mt-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
              <div class="flex items-start">
                <AlertTriangleIcon :size="18" class="text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <p class="text-sm font-medium text-yellow-800">Key Assumptions</p>
                  <p class="text-sm text-yellow-700">
                    This proposal assumes: 1) Access to historical credit
                    decision data, 2) Availability of key stakeholders for
                    weekly review meetings, 3) Existing API documentation for
                    all systems requiring integration, and 4) Completion of
                    data privacy assessment prior to project kickoff.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Methodology -->
        <Card>
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.methodology)" />
                <CardTitle class="font-medium ml-2">Methodology & Approach</CardTitle>
              </div>
              <div class="flex items-center space-x-2">
                <Badge 
                  v-if="completionStatus.methodology === 'completed'"
                  :variant="getConfidenceBadgeVariant(confidenceLevels.methodology)"
                  class="flex items-center"
                >
                  <BarChart4Icon :size="12" class="mr-1" />
                  {{ confidenceLevels.methodology }}% confidence
                </Badge>
                <Badge v-if="completionStatus.methodology === 'in-progress'" variant="default" class="bg-blue-600 text-white animate-pulse flex items-center">
                  <PenToolIcon :size="12" class="mr-1" />
                  AI drafting content...
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white">
            <p v-if="completionStatus.methodology === 'completed'" class="text-gray-700">{{ aiTyping.fullText }}</p>
            <div v-else>
              <p class="text-gray-700">{{ aiTyping.section === 'methodology' ? aiTyping.text : '' }}</p>
              <span v-if="aiTyping.section === 'methodology' && aiTyping.isTyping" class="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
          </CardContent>
        </Card>

        <!-- Deliverables -->
        <Card>
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.deliverables)" />
                <CardTitle class="font-medium ml-2">Deliverables</CardTitle>
              </div>
              <div class="flex items-center space-x-2">
                <Badge 
                  v-if="completionStatus.deliverables === 'completed'"
                  :variant="getConfidenceBadgeVariant(confidenceLevels.deliverables)"
                  class="flex items-center"
                >
                  <BarChart4Icon :size="12" class="mr-1" />
                  {{ confidenceLevels.deliverables }}% confidence
                </Badge>
                <Badge v-if="completionStatus.deliverables === 'in-progress'" variant="default" class="bg-blue-600 text-white animate-pulse flex items-center">
                  <PenToolIcon :size="12" class="mr-1" />
                  AI generating list...
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white">
            <p v-if="completionStatus.deliverables === 'completed'" class="text-gray-700">
              {{ aiTyping.section === 'deliverables' ? aiTyping.fullText : '' }}
            </p>
            <div v-else-if="completionStatus.deliverables === 'in-progress'">
              <p class="text-gray-700">{{ aiTyping.section === 'deliverables' ? aiTyping.text : '' }}</p>
              <span v-if="aiTyping.section === 'deliverables' && aiTyping.isTyping" class="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
            <div v-else class="flex items-center justify-center h-20 text-gray-400">
              <ClockIcon :size="18" class="mr-2" />
              <span>Waiting to generate content...</span>
            </div>
          </CardContent>
        </Card>

        <!-- Timeline -->
        <Card>
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.timeline)" />
                <CardTitle class="font-medium ml-2">Project Timeline</CardTitle>
              </div>
              <div class="flex items-center space-x-2">
                <Badge 
                  v-if="completionStatus.timeline === 'completed'"
                  :variant="getConfidenceBadgeVariant(confidenceLevels.timeline)"
                  class="flex items-center"
                >
                  <BarChart4Icon :size="12" class="mr-1" />
                  {{ confidenceLevels.timeline }}% confidence
                </Badge>
                <Badge v-if="completionStatus.timeline === 'in-progress'" variant="default" class="bg-blue-600 text-white animate-pulse flex items-center">
                  <PenToolIcon :size="12" class="mr-1" />
                  AI calculating timeline...
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white">
            <p v-if="completionStatus.timeline === 'completed'" class="text-gray-700">
              {{ aiTyping.section === 'timeline' ? aiTyping.fullText : '' }}
            </p>
            <div v-else-if="completionStatus.timeline === 'in-progress'">
              <p class="text-gray-700">{{ aiTyping.section === 'timeline' ? aiTyping.text : '' }}</p>
              <span v-if="aiTyping.section === 'timeline' && aiTyping.isTyping" class="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
            </div>
            <div v-else class="flex items-center justify-center h-20 text-gray-400">
              <ClockIcon :size="18" class="mr-2" />
              <span>Waiting to generate content...</span>
            </div>
          </CardContent>
        </Card>

        <!-- Pricing -->
        <Card class="opacity-80">
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.pricing)" />
                <CardTitle class="font-medium ml-2">Investment & Pricing</CardTitle>
              </div>
              <Badge 
                v-if="completionStatus.pricing === 'completed'"
                :variant="getConfidenceBadgeVariant(confidenceLevels.pricing)"
                class="flex items-center"
              >
                <BarChart4Icon :size="12" class="mr-1" />
                {{ confidenceLevels.pricing }}% confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white flex items-center justify-center h-20 text-gray-400">
            <ClockIcon :size="18" class="mr-2" />
            <span>Waiting to generate pricing details...</span>
          </CardContent>
        </Card>

        <!-- Team -->
        <Card class="opacity-80">
          <CardHeader class="bg-gray-50 px-4 py-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <component :is="getStatusIcon(completionStatus.team)" />
                <CardTitle class="font-medium ml-2">Project Team</CardTitle>
              </div>
              <Badge 
                v-if="completionStatus.team === 'completed'"
                :variant="getConfidenceBadgeVariant(confidenceLevels.team)"
                class="flex items-center"
              >
                <BarChart4Icon :size="12" class="mr-1" />
                {{ confidenceLevels.team }}% confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="p-4 bg-white flex items-center justify-center h-20 text-gray-400">
            <ClockIcon :size="18" class="mr-2" />
            <span>Waiting to generate team profiles...</span>
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
  BarChart4Icon,
  CheckSquareIcon,
  ListIcon,
  AlertTriangleIcon,
  PenToolIcon,
  EditIcon,
  SaveIcon,
  RefreshCwIcon,
  DownloadIcon,
  Share2Icon
} from 'lucide-vue-next';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/components/ui';

const completionStatus = ref({
  executiveSummary: 'completed',
  projectScope: 'completed',
  methodology: 'in-progress',
  deliverables: 'in-progress',
  timeline: 'pending',
  pricing: 'pending',
  team: 'pending'
});

const aiTyping = ref({
  section: 'methodology',
  isTyping: false,
  text: '',
  fullText: 'Our proprietary AI-driven approach combines machine learning, natural language processing, and predictive analytics to deliver actionable insights. Phase 1 involves data collection and cleaning (2 weeks), Phase 2 focuses on model development and training (3 weeks), and Phase 3 centers on implementation and integration with your existing systems (2 weeks). Throughout the process, we employ agile methodologies with weekly sprints and stakeholder reviews to ensure alignment with business objectives.'
});

const confidenceLevels = ref({
  executiveSummary: 94,
  projectScope: 91,
  methodology: 87,
  deliverables: 85,
  timeline: 82,
  pricing: 89,
  team: 92
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
  if (level > 90) return 'green';
  if (level > 80) return 'blue';
  if (level > 70) return 'yellow';
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
      
      if (aiTyping.value.section === 'methodology') {
        completionStatus.value.methodology = 'completed';
        setTimeout(() => {
          aiTyping.value = {
            section: 'deliverables',
            isTyping: true,
            text: '',
            fullText: 'Our team will deliver: 1) Custom AI model tailored to your specific business needs, 2) Interactive dashboard with real-time data visualization, 3) API integration with your existing systems, 4) Comprehensive documentation and training materials, 5) 3 months of post-implementation support with weekly check-ins. Each deliverable includes quality assurance testing and will be provided according to the timeline outlined in section 5.'
          };
        }, 2000);
      } else if (aiTyping.value.section === 'deliverables') {
        completionStatus.value.deliverables = 'completed';
        completionStatus.value.timeline = 'in-progress';
        setTimeout(() => {
          aiTyping.value = {
            section: 'timeline',
            isTyping: true,
            text: '',
            fullText: 'Week 1-2: Discovery and data collection, Week 3-5: Model development and initial training, Week 6-7: System integration and testing, Week 8: Deployment and staff training, Week 9-20: Ongoing support and optimization. Key milestones include: Initial data assessment (Week 2), Model validation (Week 5), User acceptance testing (Week 7), and Go-live (Week 8). We estimate project completion within 8 weeks from contract signing.'
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

