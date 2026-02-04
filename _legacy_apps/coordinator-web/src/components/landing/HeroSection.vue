<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50 pt-20 pb-32">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 left-0 w-96 h-96 bg-[#1B4F72] rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-[#F59E0B] rounded-full blur-3xl"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left Side - Content -->
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#1B4F72] text-sm font-medium mb-6">
            <span class="w-2 h-2 rounded-full bg-[#1B4F72] animate-pulse"></span>
            AI Virtual Assistants for Small Business
          </div>

          <h1 class="text-5xl md:text-6xl font-heading font-bold text-[#1B4F72] mb-6 leading-tight">
            Hire a Role,
            <br />
            Not a Platform
          </h1>

          <p class="text-xl text-slate-600 mb-8 leading-relaxed">
            Meet Sally, Ed, and Marcus — AI assistants who answer your phones,
            book appointments, and follow up on invoices.
            <span class="font-semibold text-slate-900">
              Set up in 60 seconds.
            </span>
          </p>

          <div class="flex flex-col sm:flex-row gap-4 mb-8">
            <router-link
              to="/register"
              class="px-8 py-4 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-center text-lg"
            >
              Start Free Trial
            </router-link>
            <button class="px-8 py-4 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:border-[#1B4F72] hover:text-[#1B4F72] transition-all duration-200 flex items-center justify-center gap-2">
              <Play :size="20" fill="currentColor" />
              Watch Demo
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <div class="flex items-center gap-2">
              <CheckCircle :size="16" class="text-green-500" />
              No credit card required
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle :size="16" class="text-green-500" />
              14-day free trial
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle :size="16" class="text-green-500" />
              Cancel anytime
            </div>
          </div>
        </div>

        <!-- Right Side - Persona Cards -->
        <div class="relative">
          <div class="relative w-full max-w-md mx-auto">
            <!-- Card 1 - Sally -->
            <div class="absolute top-0 left-0 w-64 bg-white rounded-2xl shadow-2xl p-6 border-2 border-slate-100 transform rotate-[-8deg] hover:rotate-[-4deg] transition-transform duration-300">
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-3xl mb-3">
                👩‍💼
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-1">Sally</h3>
              <p class="text-sm text-slate-500 mb-2">
                Receptionist · $49/mo
              </p>
              <p class="text-xs text-slate-600">
                Answers calls 24/7 and routes inquiries
              </p>
            </div>

            <!-- Card 2 - Ed -->
            <div class="absolute top-12 right-0 w-64 bg-white rounded-2xl shadow-2xl p-6 border-2 border-slate-100 transform rotate-[4deg] hover:rotate-[2deg] transition-transform duration-300">
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-3xl mb-3">
                👨‍💼
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-1">Ed</h3>
              <p class="text-sm text-slate-500 mb-2">
                Scheduler · $59/mo
              </p>
              <p class="text-xs text-slate-600">
                Books appointments and manages calendar
              </p>
            </div>

            <!-- Card 3 - Marcus -->
            <div class="absolute bottom-0 left-8 w-64 bg-white rounded-2xl shadow-2xl p-6 border-2 border-slate-100 transform rotate-[0deg] hover:rotate-[2deg] transition-transform duration-300">
              <div class="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-3xl mb-3">
                👨‍💼
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-1">
                Marcus
              </h3>
              <p class="text-sm text-slate-500 mb-2">
                Collector · $69/mo
              </p>
              <p class="text-xs text-slate-600">
                Follows up on overdue invoices
              </p>
            </div>

            <!-- Spacer for absolute positioning -->
            <div class="h-96"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CheckCircle, Play } from 'lucide-vue-next';
</script>




