<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <span class="text-xl font-semibold text-gray-900">4Process</span>
          </div>
          
          <div class="hidden md:flex items-center space-x-6">
            <a href="#features" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#pricing" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <router-link
              to="/login"
              class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm"
            >
              Sign Up
            </router-link>
          </div>
          
          <!-- Mobile menu button -->
          <button
            class="md:hidden text-gray-600"
            @click="isMenuOpen = !isMenuOpen"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="isMenuOpen" class="md:hidden bg-white border-t border-gray-200">
        <div class="px-4 py-4 space-y-4">
          <a href="#features" class="block text-sm text-gray-600 hover:text-gray-900" @click="isMenuOpen = false">
            Features
          </a>
          <a href="#pricing" class="block text-sm text-gray-600 hover:text-gray-900" @click="isMenuOpen = false">
            Pricing
          </a>
          <router-link
            to="/login"
            class="block text-sm text-gray-600 hover:text-gray-900"
            @click="isMenuOpen = false"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm text-center"
            @click="isMenuOpen = false"
          >
            Sign Up
          </router-link>
        </div>
      </div>
    </nav>
    
    <!-- Hero Section -->
    <div class="pt-16 pb-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Stop Wasting Time on Repetitive Work
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Every day, your team loses hours to manual processes that should be automated. 
            <strong class="text-gray-900">4Process</strong> transforms your repetitive workflows into intelligent, 
            self-executing systems that work while you sleep.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/register"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Free
            </router-link>
            <router-link
              to="/login"
              class="bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-8 rounded-md text-lg border border-gray-300"
            >
              Sign In
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Problem Section: Why You Need It -->
    <div class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Are You Still Doing This Manually?
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Every organization has processes that drain productivity and create bottlenecks.
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-red-50 rounded-lg p-6 border border-red-100">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Human Error</h3>
            <p class="text-gray-600">
              Manual processes mean mistakes. One missed step, one forgotten email, one wrong click—and everything breaks.
            </p>
          </div>
          <div class="bg-orange-50 rounded-lg p-6 border border-orange-100">
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Time Wasted</h3>
            <p class="text-gray-600">
              Your team spends hours every week on tasks that could be automated. That's time they could spend on innovation and growth.
            </p>
          </div>
          <div class="bg-yellow-50 rounded-lg p-6 border border-yellow-100">
            <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Inconsistent Results</h3>
            <p class="text-gray-600">
              Without standardized processes, every person does things differently. Quality suffers, and so does your reputation.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Solution Section: What We Do For You -->
    <div class="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            We Automate Everything, So You Don't Have To
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            4Process turns your repetitive workflows into intelligent, self-running systems that execute flawlessly every single time.
          </p>
        </div>
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">Visual Process Builder</h3>
                  <p class="text-gray-600">
                    Design your workflows with our intuitive drag-and-drop builder. No coding required—just map out your process and we handle the rest.
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">Intelligent Automation</h3>
                  <p class="text-gray-600">
                    Set triggers, schedules, and conditions. Your processes run automatically—when a form is submitted, when a date arrives, when an event occurs.
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">Complete Visibility</h3>
                  <p class="text-gray-600">
                    Track every execution, monitor performance, and identify bottlenecks. See exactly what's happening and optimize continuously.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-xl p-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Example: Customer Onboarding</h3>
            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex items-center">
                <span class="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3">1</span>
                <span>New customer signs up → Process triggers automatically</span>
              </div>
              <div class="flex items-center">
                <span class="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3">2</span>
                <span>Welcome email sent, account created, database updated</span>
              </div>
              <div class="flex items-center">
                <span class="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3">3</span>
                <span>Team member assigned, onboarding checklist created</span>
              </div>
              <div class="flex items-center">
                <span class="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3">4</span>
                <span>Follow-up scheduled, analytics tracked</span>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-200">
                <p class="text-xs text-gray-500">
                  <strong class="text-gray-900">Result:</strong> What used to take 2 hours now happens in 30 seconds, 
                  with zero errors and complete documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Personal Benefits: How Your Life Gets Better -->
    <div class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Reclaim Your Time and Your Sanity
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Stop being a human robot. Start being a strategic thinker.
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Work Fewer Hours</h3>
            <p class="text-gray-600 leading-relaxed">
              Automate the repetitive tasks that eat up your day. Get home earlier, reduce weekend work, 
              and actually use your vacation time without coming back to chaos.
            </p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Focus on What Matters</h3>
            <p class="text-gray-600 leading-relaxed">
              Stop context-switching between mindless tasks. Spend your energy on strategy, creativity, 
              and the work that actually moves the needle.
            </p>
          </div>
          <div class="text-center">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Sleep Better at Night</h3>
            <p class="text-gray-600 leading-relaxed">
              No more worrying about forgotten steps or missed deadlines. Your processes run reliably 
              every time, so you can trust the system and rest easy.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Team & Corporate Benefits -->
    <div class="py-20 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Transform Your Team Into a High-Performance Machine
          </h2>
          <p class="text-xl text-blue-100 max-w-2xl mx-auto">
            When processes are automated, your organization moves faster, makes fewer mistakes, and scales effortlessly.
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div class="text-4xl font-bold text-blue-200 mb-2">10x</div>
            <h3 class="text-lg font-semibold mb-2">Faster Execution</h3>
            <p class="text-blue-100 text-sm">
              Processes that took hours now complete in minutes. Your team moves at the speed of automation.
            </p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div class="text-4xl font-bold text-blue-200 mb-2">99.9%</div>
            <h3 class="text-lg font-semibold mb-2">Accuracy Rate</h3>
            <p class="text-blue-100 text-sm">
              Eliminate human error. Automated processes execute perfectly every single time, without exception.
            </p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div class="text-4xl font-bold text-blue-200 mb-2">24/7</div>
            <h3 class="text-lg font-semibold mb-2">Always Running</h3>
            <p class="text-blue-100 text-sm">
              Your processes work around the clock. No breaks, no sick days, no overtime pay—just consistent execution.
            </p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div class="text-4xl font-bold text-blue-200 mb-2">∞</div>
            <h3 class="text-lg font-semibold mb-2">Unlimited Scale</h3>
            <p class="text-blue-100 text-sm">
              Handle 10 requests or 10,000 with the same process. Scale without hiring, without training, without limits.
            </p>
          </div>
        </div>
        <div class="mt-12 bg-white/10 backdrop-blur-sm rounded-lg p-8">
          <h3 class="text-2xl font-semibold mb-4 text-center">Real Results from Real Teams</h3>
          <div class="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p class="text-blue-100 mb-2">
                "We cut onboarding time from 3 days to 30 minutes. New hires are productive on day one."
              </p>
              <p class="text-blue-200 font-semibold">— Operations Director, Tech Startup</p>
            </div>
            <div>
              <p class="text-blue-100 mb-2">
                "Our error rate dropped to zero. Customer satisfaction scores increased by 40%."
              </p>
              <p class="text-blue-200 font-semibold">— Quality Manager, Manufacturing</p>
            </div>
            <div>
              <p class="text-blue-100 mb-2">
                "We're handling 5x more volume with the same team. Revenue is up, costs are down."
              </p>
              <p class="text-blue-200 font-semibold">— CEO, E-commerce Company</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Everything You Need to Succeed</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Visual Builder</h3>
            <p class="text-gray-600">Create complex workflows with our intuitive drag-and-drop interface. No technical skills required.</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Automated Execution</h3>
            <p class="text-gray-600">Run processes automatically based on triggers, schedules, and conditions. Set it and forget it.</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Analytics & Insights</h3>
            <p class="text-gray-600">Track performance, identify bottlenecks, and optimize your workflows with detailed analytics.</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Pricing Section -->
    <div id="pricing" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Simple Pricing</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-xl font-semibold mb-4">Free</h3>
            <p class="text-3xl font-bold mb-4">$0<span class="text-lg text-gray-600">/mo</span></p>
            <ul class="space-y-2 mb-6">
              <li>✓ 5 processes</li>
              <li>✓ Basic automation</li>
              <li>✓ Community support</li>
            </ul>
            <router-link
              to="/register"
              class="block text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-md"
            >
              Get Started
            </router-link>
          </div>
          <div class="bg-blue-600 rounded-lg shadow-lg p-6 text-white">
            <h3 class="text-xl font-semibold mb-4">Pro</h3>
            <p class="text-3xl font-bold mb-4">$29<span class="text-lg">/mo</span></p>
            <ul class="space-y-2 mb-6">
              <li>✓ Unlimited processes</li>
              <li>✓ Advanced automation</li>
              <li>✓ Priority support</li>
            </ul>
            <router-link
              to="/register"
              class="block text-center bg-white hover:bg-gray-100 text-blue-600 font-medium py-2 px-4 rounded-md"
            >
              Get Started
            </router-link>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-xl font-semibold mb-4">Enterprise</h3>
            <p class="text-3xl font-bold mb-4">Custom</p>
            <ul class="space-y-2 mb-6">
              <li>✓ Everything in Pro</li>
              <li>✓ Custom integrations</li>
              <li>✓ Dedicated support</li>
            </ul>
            <router-link
              to="/register"
              class="block text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-md"
            >
              Contact Sales
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)
</script>

