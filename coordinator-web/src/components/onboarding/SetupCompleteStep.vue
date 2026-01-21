<template>
  <div class="w-full py-4">
    <!-- Top Section -->
    <div class="text-center mb-10 relative">
      <div class="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
      <div class="absolute top-4 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>
      <div class="absolute -top-2 left-1/2 w-2 h-2 bg-green-400 rounded-full animate-bounce delay-500"></div>

      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-[#10B981] mb-6">
        <CheckCircle2 :size="48" :stroke-width="3" />
      </div>

      <h1 class="text-4xl md:text-5xl font-heading font-bold text-[#1B4F72] mb-3">
        You're All Set!
      </h1>
      <p class="text-xl text-slate-600">Meet your new 4 Call</p>
    </div>

    <!-- Center Section - Persona Card -->
    <Card class="max-w-md mx-auto mb-10 transform transition-all hover:-translate-y-1 duration-300 overflow-hidden">
      <div class="bg-[#1B4F72] p-6 text-center relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full bg-white/5 opacity-30">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        </div>

        <div class="relative z-10">
          <div class="w-24 h-24 mx-auto bg-white rounded-full border-4 border-white/20 shadow-xl flex items-center justify-center mb-4">
            <User :size="40" class="text-[#1B4F72]" />
          </div>
          <h2 class="text-2xl font-bold text-white mb-1">
            Hi, I'm {{ coordinatorName }}!
          </h2>
          <p class="text-blue-100 mb-3">
            Your new Receptionist for {{ businessName }}
          </p>
          <Badge class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10B981] text-white text-xs font-bold uppercase tracking-wide shadow-sm">
            <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Active
          </Badge>
        </div>
      </div>
    </Card>

    <!-- Info Cards Row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <!-- Card 1: Phone Number -->
      <Card class="bg-slate-50">
        <CardHeader>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-100 text-[#1B4F72] rounded-lg">
              <Phone :size="20" />
            </div>
            <CardTitle class="font-semibold text-slate-800">Your Phone Number</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Card class="bg-white mb-2">
            <CardContent class="p-3 flex justify-between items-center">
              <span class="font-mono font-medium text-lg text-slate-700">
                {{ phoneNumber || '(555) 123-4567' }}
              </span>
              <Button
                variant="ghost"
                size="sm"
                @click="copyPhoneNumber"
                class="text-slate-400 hover:text-[#1B4F72] h-auto p-1"
                title="Copy number"
              >
                <Copy :size="16" />
              </Button>
            </CardContent>
          </Card>
          <p class="text-xs text-slate-500">
            Forward your business line to this number
          </p>
        </CardContent>
      </Card>

      <!-- Card 2: First Steps -->
      <Card class="bg-slate-50">
        <CardHeader>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-amber-100 text-[#F59E0B] rounded-lg">
              <CheckCircle2 :size="20" />
            </div>
            <CardTitle class="font-semibold text-slate-800">First Steps</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul class="space-y-3">
            <li
              v-for="(step, i) in firstSteps"
              :key="i"
              class="flex items-center gap-3 text-sm"
            >
              <div
                :class="[
                  'w-5 h-5 rounded-full flex items-center justify-center text-[10px]',
                  step.done ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'
                ]"
              >
                <Check v-if="step.done" :size="12" />
                <span v-else>{{ i + 1 }}</span>
              </div>
              <span :class="step.done ? 'text-slate-500 line-through' : 'text-slate-700'">
                {{ step.text }}
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <!-- Card 3: Trial -->
      <Card class="bg-slate-50">
        <CardHeader>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <LayoutDashboard :size="20" />
            </div>
            <CardTitle class="font-semibold text-slate-800">Your Trial</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div class="mb-4">
            <div class="flex justify-between text-sm mb-1">
              <span class="font-medium text-slate-700">14 days free</span>
              <span class="text-slate-500">14 days left</span>
            </div>
            <Progress :model-value="100" class="h-2" />
          </div>
          <p class="text-xs text-slate-500 flex items-center gap-1">
            <Shield :size="12" />
            No credit card required
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Bottom Actions -->
    <CardFooter class="flex flex-col sm:flex-row items-center justify-center gap-4 px-0">
      <Button
        as-child
        class="w-full sm:w-auto bg-[#1B4F72] hover:bg-[#153e5a] hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <router-link to="/dashboard" class="flex items-center justify-center gap-2">
          Go to Dashboard
          <ArrowRight :size="18" />
        </router-link>
      </Button>
      <Button variant="ghost" class="text-slate-500 hover:text-[#1B4F72]">
        Make a test call first
      </Button>
    </CardFooter>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  CheckCircle2,
  Phone,
  Copy,
  Check,
  ArrowRight,
  LayoutDashboard,
  Shield,
  User,
} from 'lucide-vue-next';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Badge,
  Progress,
} from '@taskjuggler/ui';

const coordinatorName = ref('Sally');
const businessName = ref('Your Business');
const phoneNumber = ref('(555) 123-4567');

const firstSteps = ref([
  { text: 'Forward your phone', done: false },
  { text: 'Make a test call', done: false },
  { text: 'Review your FAQ', done: true },
]);

function copyPhoneNumber() {
  navigator.clipboard.writeText(phoneNumber.value);
  // Would show toast notification
}
</script>

