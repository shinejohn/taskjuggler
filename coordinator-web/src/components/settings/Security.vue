<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">Security</h1>
        <p class="text-slate-500 mt-1">Protect your account and customer data</p>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
        <Shield class="text-green-600" :size="20" />
        <div>
          <div class="text-xs text-green-600 font-medium">Security Score</div>
          <div class="text-lg font-bold text-green-700">85/100</div>
        </div>
      </div>
    </div>

    <!-- Account Security -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-6">Account Security</h2>

      <!-- Password -->
      <div class="pb-6 border-b border-slate-100">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="font-semibold text-slate-900 mb-1">Password</h3>
            <p class="text-sm text-slate-500">Last changed: 45 days ago</p>
          </div>
          <button class="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
            Change Password
          </button>
        </div>
      </div>

      <!-- Two-Factor Authentication -->
      <div class="py-6 border-b border-slate-100">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-start gap-3">
            <CheckCircle class="text-green-500 flex-shrink-0 mt-0.5" :size="20" />
            <div>
              <h3 class="font-semibold text-slate-900 mb-1">Two-Factor Authentication</h3>
              <p class="text-sm text-slate-500 mb-2">Using Authenticator App</p>
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-600">Recovery codes: 3 of 10 remaining</span>
                <button
                  @click="show2FARecovery = !show2FARecovery"
                  class="text-xs text-[#1B4F72] hover:underline font-medium"
                >
                  {{ show2FARecovery ? 'Hide' : 'View/Regenerate' }}
                </button>
              </div>
            </div>
          </div>
          <button class="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
            Manage 2FA
          </button>
        </div>

        <div v-if="show2FARecovery" class="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <p class="text-xs text-amber-800 font-medium mb-2">
            ⚠️ Keep these codes safe. Each can only be used once.
          </p>
          <div class="grid grid-cols-2 gap-2 font-mono text-xs">
            <code class="bg-white px-2 py-1 rounded">ABCD-1234</code>
            <code class="bg-white px-2 py-1 rounded">EFGH-5678</code>
            <code class="bg-white px-2 py-1 rounded">IJKL-9012</code>
          </div>
        </div>
      </div>

      <!-- Login Sessions -->
      <div class="pt-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-slate-900">Active Sessions</h3>
          <button class="text-sm text-red-600 hover:underline font-medium">
            Sign out all other sessions
          </button>
        </div>
        <div class="space-y-3">
          <div
            v-for="session in activeSessions"
            :key="session.device"
            class="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100"
          >
            <div class="flex items-center gap-3">
              <Monitor class="text-slate-400" :size="20" />
              <div>
                <div class="font-medium text-slate-900">
                  {{ session.device }}
                  <span v-if="session.current" class="text-green-600 text-xs">(current)</span>
                </div>
                <div class="text-xs text-slate-500">
                  {{ session.location }} • {{ session.lastActive }}
                </div>
              </div>
            </div>
            <button v-if="!session.current" class="text-sm text-red-600 hover:underline font-medium">
              Revoke
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Protection -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Data Protection</h2>
      <div class="space-y-4 mb-6">
        <div class="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle :size="16" />
          Data encrypted at rest (AES-256)
        </div>
        <div class="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle :size="16" />
          Data encrypted in transit (TLS 1.3)
        </div>
        <div class="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle :size="16" />
          Call recordings encrypted
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Shield, CheckCircle, Monitor } from 'lucide-vue-next';

const show2FARecovery = ref(false);

const activeSessions = ref([
  {
    device: 'Chrome on Mac',
    location: 'Tampa, FL',
    lastActive: 'Now',
    current: true,
  },
  {
    device: 'Safari on iPhone',
    location: 'Tampa, FL',
    lastActive: '3 hours ago',
    current: false,
  },
  {
    device: 'Edge on Windows',
    location: 'Miami, FL',
    lastActive: '2 days ago',
    current: false,
  },
]);
</script>




