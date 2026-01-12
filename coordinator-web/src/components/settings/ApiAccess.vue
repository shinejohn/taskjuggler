<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">API Access</h1>
        <p class="text-slate-500 mt-1">Integrate 4calls.ai with your applications</p>
      </div>
      <a
        href="#"
        target="_blank"
        class="px-5 py-2.5 border-2 border-[#1B4F72] text-[#1B4F72] hover:bg-[#1B4F72] hover:text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
      >
        <ExternalLink :size="18" />
        View API Documentation
      </a>
    </div>

    <!-- Quick Start -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Quick Start</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Base URL</label>
          <div class="flex items-center gap-2">
            <code class="flex-1 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-sm text-slate-900">
              https://api.4calls.ai/v1
            </code>
            <button
              @click="copyToClipboard('https://api.4calls.ai/v1')"
              class="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Copy :size="18" class="text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- API Keys -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-bold text-slate-900">API Keys</h2>
          <button
            @click="showKeys = !showKeys"
            class="text-sm text-[#1B4F72] hover:underline font-medium flex items-center gap-1"
          >
            <Eye v-if="!showKeys" :size="14" />
            <EyeOff v-else :size="14" />
            {{ showKeys ? 'Hide' : 'Show' }} keys
          </button>
        </div>
        <button
          @click="showCreateKey = true"
          class="px-4 py-2 bg-[#1B4F72] hover:bg-[#153e5a] text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus :size="18" />
          Create New Key
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="key in apiKeys"
          :key="key.name"
          class="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100"
        >
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="font-semibold text-slate-900">{{ key.name }}</h3>
              <span class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                {{ key.permissions }}
              </span>
            </div>
            <div class="text-sm text-slate-600">
              <code v-if="showKeys" class="font-mono bg-white px-2 py-1 rounded border border-slate-200">
                {{ key.key }}
              </code>
              <code v-else class="font-mono">••••••••••••</code>
              • Created {{ key.created }} • Last used: {{ key.lastUsed }}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="p-2 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-white transition-colors">
              <Copy :size="16" />
            </button>
            <button class="p-2 text-slate-400 hover:text-slate-600 rounded hover:bg-white transition-colors">
              <MoreVertical :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Rate Limits -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Rate Limits</h2>
      <div class="space-y-4">
        <div v-for="rate in rateLimits" :key="rate.category">
          <div class="flex justify-between text-sm mb-2">
            <span class="font-medium text-slate-700">{{ rate.category }}</span>
            <span class="text-slate-500">{{ rate.current }} / {{ rate.limit }}</span>
          </div>
          <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-green-500 rounded-full transition-all duration-500"
              :style="{ width: `${(rate.current / parseInt(rate.limit)) * 100}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ExternalLink, Copy, Plus, Eye, EyeOff, MoreVertical } from 'lucide-vue-next';

const showKeys = ref(false);
const showCreateKey = ref(false);

const apiKeys = ref([
  {
    name: 'Production',
    key: 'sk_live_****4f2a',
    created: 'Dec 1, 2025',
    lastUsed: '5 min ago',
    permissions: 'Full Access',
  },
  {
    name: 'Development',
    key: 'sk_test_****8b3c',
    created: 'Dec 15, 2025',
    lastUsed: 'Never',
    permissions: 'Read Only',
  },
]);

const rateLimits = ref([
  { category: 'Read Operations', limit: '1000', current: 234, status: 'ok' },
  { category: 'Write Operations', limit: '100', current: 12, status: 'ok' },
  { category: 'Bulk Operations', limit: '10', current: 0, status: 'ok' },
  { category: 'Webhooks Sent', limit: '10000', current: 1234, status: 'ok' },
]);

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
</script>




