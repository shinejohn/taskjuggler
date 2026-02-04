<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Marketplace</h1>
      <button @click="showCreateModal = true" class="btn btn-primary">
        Create Listing
      </button>
    </div>

    <div class="mb-4 flex gap-2">
      <select v-model="statusFilter" @change="handleFilterChange" class="input">
        <option value="">All Status</option>
        <option value="open">Open</option>
        <option value="assigned">Assigned</option>
        <option value="completed">Completed</option>
      </select>
      <input
        v-model="categoryFilter"
        type="text"
        placeholder="Filter by category"
        class="input"
        @input="handleFilterChange"
      />
    </div>

    <div v-if="loading" class="text-center py-8">Loading...</div>
    <div v-else-if="listings.length === 0" class="text-center py-8 text-gray-500">
      No marketplace listings found
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="listing in listings"
        :key="listing.id"
        class="card cursor-pointer hover:shadow-md transition-shadow"
        @click="selectedListing = listing"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="font-semibold">{{ listing.title }}</h3>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  listing.status === 'open' ? 'bg-green-100 text-green-800' : '',
                  listing.status === 'assigned' ? 'bg-blue-100 text-blue-800' : '',
                  listing.status === 'completed' ? 'bg-gray-100 text-gray-800' : '',
                ]"
              >
                {{ listing.status }}
              </span>
              <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                {{ listing.category }}
              </span>
            </div>
            <p v-if="listing.description" class="text-sm text-gray-600 mb-2">{{ listing.description }}</p>
            <div class="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Budget:</strong>
                <span v-if="listing.budget_type === 'fixed'">
                  ${{ listing.budget_min }}
                </span>
                <span v-else-if="listing.budget_type === 'hourly'">
                  ${{ listing.budget_min }}/hr - ${{ listing.budget_max }}/hr
                </span>
                <span v-else>Quote required</span>
              </p>
              <p v-if="listing.bids && listing.bids.length > 0">
                <strong>Bids:</strong> {{ listing.bids.length }}
              </p>
              <p v-if="listing.needed_by">
                <strong>Needed by:</strong> {{ new Date(listing.needed_by).toLocaleDateString() }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Listing Detail Modal -->
    <div
      v-if="selectedListing"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="selectedListing = null"
    >
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-bold">{{ selectedListing.title }}</h2>
            <button @click="selectedListing = null" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Description</label>
              <p class="text-gray-900">{{ selectedListing.description || 'No description' }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Category</label>
              <p class="text-gray-900">{{ selectedListing.category }}</p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-700">Budget</label>
              <p class="text-gray-900">
                <span v-if="selectedListing.budget_type === 'fixed'">
                  Fixed: ${{ selectedListing.budget_min }}
                </span>
                <span v-else-if="selectedListing.budget_type === 'hourly'">
                  Hourly: ${{ selectedListing.budget_min }}/hr - ${{ selectedListing.budget_max }}/hr
                </span>
                <span v-else>Quote required</span>
              </p>
            </div>

            <div v-if="selectedListing.bids && selectedListing.bids.length > 0">
              <label class="text-sm font-medium text-gray-700">Bids ({{ selectedListing.bids.length }})</label>
              <div class="mt-2 space-y-2">
                <div
                  v-for="bid in selectedListing.bids"
                  :key="bid.id"
                  class="p-3 bg-gray-50 rounded border"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium">${{ bid.amount }}</p>
                      <p v-if="bid.message" class="text-sm text-gray-600 mt-1">{{ bid.message }}</p>
                      <p v-if="bid.estimated_completion" class="text-xs text-gray-500 mt-1">
                        Est. completion: {{ new Date(bid.estimated_completion).toLocaleDateString() }}
                      </p>
                    </div>
                    <span
                      :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        bid.status === 'accepted' ? 'bg-green-100 text-green-800' : '',
                        bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : '',
                      ]"
                    >
                      {{ bid.status }}
                    </span>
                  </div>
                  <button
                    v-if="selectedListing.status === 'open' && bid.status === 'pending'"
                    @click="handleAssignVendor(selectedListing.id, bid.vendor_id)"
                    class="btn btn-primary btn-sm mt-2"
                  >
                    Accept Bid
                  </button>
                </div>
              </div>
            </div>

            <div v-if="selectedListing.status === 'open'" class="pt-4 border-t">
              <h3 class="font-semibold mb-2">Place a Bid</h3>
              <form @submit.prevent="handlePlaceBid" class="space-y-3">
                <div>
                  <label class="label">Amount *</label>
                  <input
                    v-model="bidForm.amount"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="input"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label class="label">Message</label>
                  <textarea
                    v-model="bidForm.message"
                    rows="2"
                    class="input"
                    placeholder="Optional message"
                  />
                </div>
                <div>
                  <label class="label">Estimated Completion</label>
                  <input
                    v-model="bidForm.estimated_completion"
                    type="date"
                    class="input"
                  />
                </div>
                <button type="submit" :disabled="loading" class="btn btn-primary">
                  {{ loading ? 'Placing bid...' : 'Place Bid' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Listing Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showCreateModal = false"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-bold">Create Marketplace Listing</h2>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleCreateListing" class="space-y-4">
          <div>
            <label class="label">Task *</label>
            <select v-model="listingForm.task_id" class="input" required>
              <option value="">Select a task</option>
              <option v-for="task in tasks" :key="task.id" :value="task.id">
                {{ task.title }}
              </option>
            </select>
          </div>

          <div>
            <label class="label">Title *</label>
            <input
              v-model="listingForm.title"
              type="text"
              required
              class="input"
              placeholder="Listing title"
            />
          </div>

          <div>
            <label class="label">Description</label>
            <textarea
              v-model="listingForm.description"
              rows="3"
              class="input"
              placeholder="Listing description"
            />
          </div>

          <div>
            <label class="label">Category *</label>
            <input
              v-model="listingForm.category"
              type="text"
              required
              class="input"
              placeholder="e.g., Development, Design, Writing"
            />
          </div>

          <div>
            <label class="label">Budget Type *</label>
            <select v-model="listingForm.budget_type" class="input" required>
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly Rate</option>
              <option value="quote">Request Quote</option>
            </select>
          </div>

          <div v-if="listingForm.budget_type !== 'quote'" class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Min Budget</label>
              <input
                v-model="listingForm.budget_min"
                type="number"
                step="0.01"
                min="0"
                class="input"
                placeholder="0.00"
              />
            </div>
            <div v-if="listingForm.budget_type === 'hourly'">
              <label class="label">Max Budget</label>
              <input
                v-model="listingForm.budget_max"
                type="number"
                step="0.01"
                min="0"
                class="input"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label class="label">Needed By</label>
            <input
              v-model="listingForm.needed_by"
              type="date"
              class="input"
            />
          </div>

          <div class="flex gap-2 pt-4 border-t">
            <button type="submit" :disabled="loading" class="btn btn-primary flex-1">
              {{ loading ? 'Creating...' : 'Create Listing' }}
            </button>
            <button type="button" @click="showCreateModal = false" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMarketplaceStore } from '@/stores/marketplace'
import { useTasksStore } from '@/stores/tasks'
import type { MarketplaceListing } from '@/types'

const marketplaceStore = useMarketplaceStore()
const tasksStore = useTasksStore()

const loading = computed(() => marketplaceStore.loading)
const listings = computed(() => marketplaceStore.listings)
const tasks = computed(() => tasksStore.tasks)

const statusFilter = ref('')
const categoryFilter = ref('')
const selectedListing = ref<MarketplaceListing | null>(null)
const showCreateModal = ref(false)

const listingForm = ref({
  task_id: '',
  title: '',
  description: '',
  category: '',
  budget_type: 'fixed' as 'fixed' | 'hourly' | 'quote',
  budget_min: '',
  budget_max: '',
  needed_by: '',
})

const bidForm = ref({
  amount: '',
  message: '',
  estimated_completion: '',
})

onMounted(async () => {
  await marketplaceStore.fetchListings()
  await tasksStore.fetchTasks()
})

function handleFilterChange() {
  const params: Record<string, any> = {}
  if (statusFilter.value) params.status = statusFilter.value
  if (categoryFilter.value) params.category = categoryFilter.value
  marketplaceStore.fetchListings(params)
}

async function handleCreateListing() {
  try {
    const data: any = {
      ...listingForm.value,
      budget_min: listingForm.value.budget_min ? parseFloat(listingForm.value.budget_min) : undefined,
      budget_max: listingForm.value.budget_max ? parseFloat(listingForm.value.budget_max) : undefined,
      needed_by: listingForm.value.needed_by || undefined,
    }
    await marketplaceStore.createListing(data)
    if ((window as any).$toast) {
      (window as any).$toast.success('Listing created successfully')
    }
    showCreateModal.value = false
    listingForm.value = {
      task_id: '',
      title: '',
      description: '',
      category: '',
      budget_type: 'fixed',
      budget_min: '',
      budget_max: '',
      needed_by: '',
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function handlePlaceBid() {
  if (!selectedListing.value) return
  
  try {
    const data: any = {
      amount: parseFloat(bidForm.value.amount),
      message: bidForm.value.message || undefined,
      estimated_completion: bidForm.value.estimated_completion || undefined,
    }
    await marketplaceStore.placeBid(selectedListing.value.id, data)
    if ((window as any).$toast) {
      (window as any).$toast.success('Bid placed successfully')
    }
    await marketplaceStore.fetchListing(selectedListing.value.id)
    bidForm.value = { amount: '', message: '', estimated_completion: '' }
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function handleAssignVendor(listingId: string, vendorId: string) {
  try {
    await marketplaceStore.assignVendor(listingId, vendorId)
    if ((window as any).$toast) {
      (window as any).$toast.success('Vendor assigned successfully')
    }
    await marketplaceStore.fetchListing(listingId)
  } catch (error) {
    // Error handled by API interceptor
  }
}
</script>
