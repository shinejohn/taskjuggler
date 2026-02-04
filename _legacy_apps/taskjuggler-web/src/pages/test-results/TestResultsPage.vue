<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Test Results Dashboard</h1>
        <p class="mt-2 text-sm text-gray-600">Comprehensive test suite results and analysis</p>
      </div>

      <!-- Action Buttons -->
      <div class="mb-6 flex gap-4">
        <button
          @click="runTests"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Running Tests...' : 'Run All Tests' }}
        </button>
        <button
          @click="analyzeResults"
          :disabled="!latestResults"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          Analyze & Suggest Fixes
        </button>
        <button
          @click="applyFixes"
          :disabled="fixes.length === 0"
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          Apply Fixes ({{ fixes.length }})
        </button>
      </div>

      <!-- Latest Results Summary -->
      <div v-if="latestResults" class="mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Latest Test Run</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="p-4 bg-gray-50 rounded">
              <div class="text-sm text-gray-600">Unit Tests</div>
              <div class="text-2xl font-bold" :class="latestResults.unit_tests?.passed ? 'text-green-600' : 'text-red-600'">
                {{ latestResults.unit_tests?.passed ? '✓ Passed' : '✗ Failed' }}
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded">
              <div class="text-sm text-gray-600">Feature Tests</div>
              <div class="text-2xl font-bold" :class="latestResults.feature_tests?.passed ? 'text-green-600' : 'text-red-600'">
                {{ latestResults.feature_tests?.passed ? '✓ Passed' : '✗ Failed' }}
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded">
              <div class="text-sm text-gray-600">Total Tests</div>
              <div class="text-2xl font-bold text-gray-900">
                {{ latestResults.summary?.total_tests || 0 }}
              </div>
            </div>
          </div>

          <div class="text-sm text-gray-500">
            Run at: {{ formatDate(latestResults.timestamp) }}
          </div>
        </div>
      </div>

      <!-- Suggested Fixes -->
      <div v-if="fixes.length > 0" class="mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Suggested Fixes ({{ fixes.length }})</h2>
          
          <div class="space-y-4">
            <div
              v-for="fix in fixes"
              :key="fix.id"
              class="p-4 border rounded-lg"
              :class="{
                'border-red-200 bg-red-50': fix.severity === 'high',
                'border-yellow-200 bg-yellow-50': fix.severity === 'medium',
                'border-blue-200 bg-blue-50': fix.severity === 'low',
              }"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-semibold">{{ fix.description }}</div>
                  <div class="text-sm text-gray-600 mt-1">{{ fix.suggestion }}</div>
                  <div class="text-xs text-gray-500 mt-2">Type: {{ fix.type }}</div>
                </div>
                <span
                  class="px-2 py-1 text-xs rounded"
                  :class="{
                    'bg-red-100 text-red-800': fix.severity === 'high',
                    'bg-yellow-100 text-yellow-800': fix.severity === 'medium',
                    'bg-blue-100 text-blue-800': fix.severity === 'low',
                  }"
                >
                  {{ fix.severity }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Test Results History -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Test History</h2>
        
        <div v-if="allResults.length === 0" class="text-center py-8 text-gray-500">
          No test results found. Run tests to see results.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Filename</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="result in allResults" :key="result.filename">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ result.filename }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(result.timestamp) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs rounded"
                    :class="result.summary?.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ result.summary?.passed ? 'Passed' : 'Failed' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="viewResult(result.filename)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detailed Result Modal -->
      <div v-if="selectedResult" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">Test Result Details</h3>
            <button @click="selectedResult = null" class="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <pre class="bg-gray-50 p-4 rounded text-sm overflow-x-auto">{{ JSON.stringify(selectedResult, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const loading = ref(false);
const latestResults = ref<any>(null);
const allResults = ref<any[]>([]);
const fixes = ref<any[]>([]);
const selectedResult = ref<any>(null);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

onMounted(async () => {
  await loadResults();
});

const loadResults = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.warn('No auth token found');
      return;
    }

    const [latestRes, allRes] = await Promise.all([
      api.get('/api/test-results/latest', {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => ({ data: null })),
      api.get('/api/test-results/all', {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    latestResults.value = latestRes.data;
    allResults.value = allRes.data;
  } catch (error) {
    console.error('Failed to load results:', error);
  }
};

const runTests = async () => {
  loading.value = true;
  try {
    const token = getAuthToken();
    const response = await api.post('/api/test-results/run', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    latestResults.value = response.data;
    await loadResults();
  } catch (error) {
    console.error('Failed to run tests:', error);
    alert('Failed to run tests. Check console for details.');
  } finally {
    loading.value = false;
  }
};

const analyzeResults = async () => {
  if (!latestResults.value) return;

  try {
    const token = getAuthToken();
    const response = await api.post('/api/test-fix/analyze', {
      results: latestResults.value,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fixes.value = response.data.fixes || [];
  } catch (error) {
    console.error('Failed to analyze results:', error);
  }
};

const applyFixes = async () => {
  if (fixes.value.length === 0) return;

  try {
    const token = getAuthToken();
    const response = await api.post('/api/test-fix/apply', {
      fixes: fixes.value,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert(`Applied ${response.data.total_applied} fixes. ${response.data.total_failed} failed.`);
    fixes.value = [];
    await runTests(); // Re-run tests after fixes
  } catch (error) {
    console.error('Failed to apply fixes:', error);
  }
};

const viewResult = async (filename: string) => {
  try {
    const token = getAuthToken();
    const response = await api.get(`/api/test-results/${filename}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    selectedResult.value = response.data;
  } catch (error) {
    console.error('Failed to load result:', error);
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};
</script>
