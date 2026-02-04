<template>
  <DashboardLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">
          Billing
        </h1>
        <p class="text-slate-500 mt-1">
          Manage your subscription and payment methods
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Current Plan Card -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="bg-gradient-to-r from-[#1B4F72] to-[#2563EB] p-6 text-white">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <div class="text-sm opacity-90 mb-1">Current Plan</div>
                  <h2 class="text-2xl font-bold">
                    {{ activeCoordinators.length }} Coordinator{{ activeCoordinators.length !== 1 ? 's' : '' }} Active
                  </h2>
                </div>
                <span class="px-3 py-1 rounded-full bg-white/20 text-xs font-medium flex items-center gap-1">
                  <CheckCircle :size="12" />
                  Active
                </span>
              </div>
              <div class="text-3xl font-bold mb-1">
                ${{ totalMonthlyCost }}
                <span class="text-lg font-normal opacity-90">/month</span>
              </div>
              <div class="text-sm opacity-90">
                Next charge: {{ nextChargeDate }}
              </div>
              <div v-if="billingInfo?.subscription.status" class="text-xs opacity-75 mt-1">
                Status: {{ billingInfo.subscription.status }}
              </div>
            </div>

            <div class="p-6">
              <h3 class="font-semibold text-slate-900 mb-4">
                Coordinator Breakdown
              </h3>
              <div class="space-y-3 mb-6">
                <div
                  v-for="coord in activeCoordinators"
                  :key="coord.id"
                  class="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-100 text-[#1B4F72] flex items-center justify-center font-bold text-xs">
                      {{ (coord.display_name || coord.role_template?.name || 'C').charAt(0) }}
                    </div>
                    <div>
                      <div class="font-medium text-slate-900">
                        {{ coord.display_name || coord.role_template?.name || 'Coordinator' }}
                      </div>
                      <div class="text-xs text-slate-500">
                        {{ coord.role_template?.name || 'Unknown Role' }}
                      </div>
                    </div>
                  </div>
                  <div class="font-semibold text-slate-900">
                    ${{ coord.monthly_price }}/mo
                  </div>
                </div>
              </div>

              <div class="flex gap-3">
                <router-link
                  to="/coordinators"
                  class="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-center"
                >
                  Manage Coordinators
                </router-link>
                <button
                  @click="showCancelModal = true"
                  class="flex-1 py-2.5 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>

          <!-- Cancel Modal -->
          <div
            v-if="showCancelModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click="showCancelModal = false"
          >
            <div
              class="bg-white rounded-xl p-8 max-w-md w-full mx-4"
              @click.stop
            >
              <h3 class="text-2xl font-bold text-slate-900 mb-4">Cancel Subscription</h3>
              <p class="text-slate-600 mb-6">
                Are you sure you want to cancel your subscription? You'll continue to have access until the end of your billing period.
              </p>
              <div class="flex gap-3">
                <button
                  @click="showCancelModal = false"
                  class="flex-1 px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
                >
                  Keep Subscription
                </button>
                <button
                  @click="cancelSubscription"
                  class="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-4">
              Payment Method
            </h3>
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div class="flex items-center gap-3">
                <CreditCard :size="24" class="text-slate-400" />
                <div v-if="billingInfo?.payment_method">
                  <div class="font-medium text-slate-900">
                    •••• •••• •••• {{ billingInfo.payment_method.last4 }}
                  </div>
                  <div class="text-xs text-slate-500">
                    Expires {{ billingInfo.payment_method.exp_month }}/{{ billingInfo.payment_method.exp_year }}
                  </div>
                </div>
                <div v-else>
                  <div class="font-medium text-slate-900">No payment method</div>
                  <div class="text-xs text-slate-500">Add a payment method</div>
                </div>
              </div>
              <button class="text-sm text-[#1B4F72] font-medium hover:underline">
                Update
              </button>
            </div>
          </div>

          <!-- Billing History -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-slate-100">
              <h3 class="text-lg font-bold text-slate-900">Billing History</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead class="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th class="px-6 py-3">Date</th>
                    <th class="px-6 py-3">Description</th>
                    <th class="px-6 py-3">Amount</th>
                    <th class="px-6 py-3 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr
                    v-for="invoice in billingHistory"
                    :key="invoice.id"
                    class="hover:bg-slate-50 transition-colors"
                  >
                    <td class="px-6 py-4 text-slate-600">
                      {{ new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
                    </td>
                    <td class="px-6 py-4 font-medium text-slate-900">{{ invoice.description }}</td>
                    <td class="px-6 py-4 font-semibold text-slate-900">${{ invoice.amount.toFixed(2) }}</td>
                    <td class="px-6 py-4 text-right">
                      <button
                        @click="downloadInvoice(invoice)"
                        class="text-[#1B4F72] hover:underline text-sm font-medium"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                  <tr v-if="billingHistory.length === 0 && !loading">
                    <td colspan="4" class="px-6 py-8 text-center text-slate-500">
                      No billing history
                    </td>
                  </tr>
                  <tr v-if="loading">
                    <td colspan="4" class="px-6 py-8 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Column - Add-ons -->
        <div class="space-y-6">
          <!-- Add-ons Section -->
          <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 class="text-lg font-bold text-slate-900 mb-4">Add-ons</h3>
            <div class="space-y-4">
              <div
                v-for="addon in addOns"
                :key="addon.id"
                class="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
              >
                <div class="flex-1">
                  <div class="font-semibold text-slate-900">{{ addon.name }}</div>
                  <div class="text-sm text-slate-500">{{ addon.description }}</div>
                  <div class="text-sm font-medium text-[#1B4F72] mt-1">{{ addon.price }}</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="addon.enabled"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1B4F72]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B4F72]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { CreditCard, CheckCircle } from 'lucide-vue-next';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import { useCoordinatorsStore } from '@/stores/coordinators';
import { useOrganizationsStore } from '@/stores/organizations';
import { billingApi, type BillingInfo, type BillingHistoryItem } from '@/api/billing';

const coordinatorsStore = useCoordinatorsStore();
const organizationsStore = useOrganizationsStore();

const showCancelModal = ref(false);
const billingInfo = ref<BillingInfo | null>(null);
const billingHistory = ref<BillingHistoryItem[]>([]);
const loading = ref(false);

const activeCoordinators = computed(() => {
  return coordinatorsStore.coordinators.filter(c => c.status === 'active');
});

const totalMonthlyCost = computed(() => {
  return billingInfo.value?.usage.monthly_cost || 
    activeCoordinators.value.reduce((sum, coord) => sum + (coord.monthly_price || 0), 0);
});

const nextChargeDate = computed(() => {
  if (billingInfo.value?.subscription.current_period_end) {
    return new Date(billingInfo.value.subscription.current_period_end).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  return nextMonth.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
});

const addOns = ref([
  {
    id: 'recording',
    name: 'Call Recording',
    description: 'Record all calls for quality assurance',
    price: '$10/mo',
    enabled: true,
  },
  {
    id: 'analytics',
    name: 'Advanced Analytics',
    description: 'Detailed reports and insights',
    price: '$15/mo',
    enabled: false,
  },
  {
    id: 'support',
    name: 'Priority Support',
    description: '24/7 priority customer support',
    price: '$25/mo',
    enabled: false,
  },
]);

function downloadInvoice(_invoice: BillingHistoryItem) {
  // TODO: Implement invoice download
  // await billingApi.downloadInvoice(invoice.id);
}

async function cancelSubscription() {
  if (!organizationsStore.currentOrganization) return;
  try {
    await billingApi.cancelSubscription(organizationsStore.currentOrganization.id);
    showCancelModal.value = false;
    // Refresh billing info
    await fetchBillingInfo();
  } catch (error: any) {
    console.error('Failed to cancel subscription:', error);
    alert(error.response?.data?.message || 'Failed to cancel subscription');
  }
}

async function fetchBillingInfo() {
  if (!organizationsStore.currentOrganization) return;
  loading.value = true;
  try {
    const [infoResponse, historyResponse] = await Promise.all([
      billingApi.getBillingInfo(organizationsStore.currentOrganization.id),
      billingApi.getHistory(organizationsStore.currentOrganization.id),
    ]);
    billingInfo.value = infoResponse.data;
    billingHistory.value = historyResponse.data.data;
  } catch (error: any) {
    console.error('Failed to fetch billing info:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  if (!organizationsStore.currentOrganization) {
    await organizationsStore.fetchOrganizations();
    if (organizationsStore.organizations.length > 0) {
      organizationsStore.setCurrentOrganization(organizationsStore.organizations[0]);
    }
  }
  if (organizationsStore.currentOrganization) {
    await coordinatorsStore.fetchCoordinators(organizationsStore.currentOrganization.id);
    await fetchBillingInfo();
  }
});
</script>

