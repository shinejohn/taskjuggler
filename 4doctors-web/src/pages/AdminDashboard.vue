<template>
  <div class="min-h-screen bg-slate-50 font-sans">
    <header class="bg-white border-b border-slate-200 h-16 flex items-center px-6">
      <div class="flex items-center gap-2">
        <div class="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold">
          AD
        </div>
        <span class="text-xl font-bold text-slate-900">Admin Console</span>
      </div>
      <div class="ml-auto flex items-center gap-4">
        <button class="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
          Global Settings
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-slate-900">
            System Overview
        </h1>
        <div class="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <span>{{ new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) }}</span>
        </div>
      </div>
      
      <!-- Admin Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div class="p-3 bg-green-50 rounded-lg text-green-600">
                <DollarSign class="w-6 h-6" />
            </div>
            <div>
                <p class="text-sm font-medium text-slate-500">Total Revenue (MTD)</p>
                <p class="text-2xl font-bold text-slate-900">$124,592</p>
                <p class="text-xs text-green-600 flex items-center gap-1"><TrendingUp class="w-3 h-3" /> +12% vs last month</p>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div class="p-3 bg-blue-50 rounded-lg text-blue-600">
                <Users class="w-6 h-6" />
            </div>
            <div>
                <p class="text-sm font-medium text-slate-500">Active Users</p>
                <p class="text-2xl font-bold text-slate-900">42</p>
                <p class="text-xs text-blue-600">12 currently online</p>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div class="p-3 bg-purple-50 rounded-lg text-purple-600">
                <Building2 class="w-6 h-6" />
            </div>
            <div>
                <p class="text-sm font-medium text-slate-500">Departments</p>
                <p class="text-2xl font-bold text-slate-900">8</p>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div class="p-3 bg-orange-50 rounded-lg text-orange-600">
                <AlertTriangle class="w-6 h-6" />
            </div>
            <div>
                <p class="text-sm font-medium text-slate-500">System Alerts</p>
                <p class="text-2xl font-bold text-slate-900">3</p>
                <p class="text-xs text-orange-600">Attention required</p>
            </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Revenue / Activity Chart -->
        <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 class="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity class="w-5 h-5 text-blue-500" /> Platform Activity
                </h2>
                <div class="h-64 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                    [Chart Placeholder: Revenue & Usage Trends]
                </div>
            </div>

            <!-- Recent Audit Logs -->
             <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 class="font-bold text-slate-900 flex items-center gap-2">
                        <Shield class="w-5 h-5 text-purple-500" /> Recent Security Events
                    </h2>
                </div>
                <div class="divide-y divide-slate-50">
                    <div class="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-slate-100 rounded text-slate-500"><Lock class="w-4 h-4"/></div>
                            <div>
                                <p class="text-sm font-bold text-slate-900">Failed Login Attempt</p>
                                <p class="text-xs text-slate-500">IP: 192.168.1.45 • User: unknown</p>
                            </div>
                        </div>
                        <span class="text-xs text-slate-400">2 mins ago</span>
                    </div>
                    <div class="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-blue-100 rounded text-blue-600"><UserCog class="w-4 h-4"/></div>
                            <div>
                                <p class="text-sm font-bold text-slate-900">Role Modified</p>
                                <p class="text-xs text-slate-500">Admin updated Nancy Nurse permissions</p>
                            </div>
                        </div>
                        <span class="text-xs text-slate-400">45 mins ago</span>
                    </div>
                    <div class="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-emerald-100 rounded text-emerald-600"><CheckCircle class="w-4 h-4"/></div>
                            <div>
                                <p class="text-sm font-bold text-slate-900">System Backup Completed</p>
                                <p class="text-xs text-slate-500">Daily snapshot successful</p>
                            </div>
                        </div>
                        <span class="text-xs text-slate-400">4 hours ago</span>
                    </div>
                </div>
             </div>
        </div>

        <!-- Admin Actions -->
        <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 class="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Settings class="w-5 h-5 text-slate-500" /> Quick Management
                </h3>
                <div class="space-y-3">
                    <button class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition-all text-left group">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-white text-blue-600 rounded-lg shadow-sm">
                                <UserPlus class="w-5 h-5" />
                            </div>
                            <div>
                                <p class="text-sm font-bold">Add Staff Member</p>
                                <p class="text-[10px] text-slate-500">Create account & assign role</p>
                            </div>
                        </div>
                        <ChevronRight class="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                    </button>
                    <button class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition-all text-left group">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-white text-green-600 rounded-lg shadow-sm">
                                <FileText class="w-5 h-5" />
                            </div>
                            <div>
                                <p class="text-sm font-bold">Billing Reports</p>
                                <p class="text-[10px] text-slate-500">Generate EOM statements</p>
                            </div>
                        </div>
                        <ChevronRight class="w-4 h-4 text-slate-300 group-hover:text-green-500" />
                    </button>
                </div>
            </div>

            <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-6 text-white">
                <h3 class="font-bold mb-2 flex items-center gap-2">
                    <Radio class="w-5 h-5 text-emerald-400" /> System Status: Healthy
                </h3>
                <div class="space-y-2 text-sm text-slate-300 mt-4">
                    <div class="flex justify-between">
                        <span>API Latency</span>
                        <span class="font-mono text-emerald-400">45ms</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Database Load</span>
                        <span class="font-mono text-emerald-400">12%</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Storage Used</span>
                        <span class="font-mono text-blue-400">45%</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { 
    DollarSign, Users, Building2, AlertTriangle, 
    Activity, Shield, Lock, UserCog, CheckCircle,
    Settings, UserPlus, FileText, ChevronRight, Radio, TrendingUp
} from 'lucide-vue-next';
</script>
