<template>
  <DashboardLayout>
    <div class="space-y-6 relative min-h-screen pb-20">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-heading font-bold text-[#1B4F72]">
            Contacts
          </h1>
          <p class="text-slate-500 mt-1">{{ contactsStore.total }} total contacts</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="showImportModal = true"
            class="px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Upload :size="18" />
            Import
          </button>
          <button
            @click="showCreateModal = true"
            class="px-4 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
          >
            <Plus :size="18" />
            Add Contact
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div class="relative">
          <Search class="absolute left-3 top-3 text-slate-400" :size="20" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search contacts by name, phone, email..."
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
            @input="handleSearch"
          />
        </div>

        <div class="flex flex-wrap gap-3 items-center">
          <div class="relative">
            <select
              v-model="filterStatus"
              class="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] cursor-pointer hover:bg-slate-50"
              @change="handleFilter"
            >
              <option value="">Status: All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Filter class="absolute right-2.5 top-2 text-slate-400 pointer-events-none" :size="12" />
          </div>
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="text-sm text-slate-400 hover:text-[#1B4F72]"
          >
            Clear filters
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="contactsStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4F72]"></div>
        <p class="mt-4 text-slate-500">Loading contacts...</p>
      </div>

      <!-- Table -->
      <div v-else class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th class="px-6 py-3 w-10">
                  <input
                    type="checkbox"
                    class="rounded border-slate-300 text-[#1B4F72] focus:ring-[#1B4F72]"
                    :checked="selectedContacts.length === contactsStore.contacts.length && contactsStore.contacts.length > 0"
                    @change="toggleSelectAll"
                  />
                </th>
                <th class="px-6 py-3 cursor-pointer hover:text-[#1B4F72] group">
                  <div class="flex items-center gap-1">
                    Name
                    <ArrowUpDown :size="12" class="opacity-0 group-hover:opacity-100" />
                  </div>
                </th>
                <th class="px-6 py-3">Phone</th>
                <th class="px-6 py-3">Email</th>
                <th class="px-6 py-3">Tags</th>
                <th class="px-6 py-3">Last Contact</th>
                <th class="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="contact in contactsStore.contacts"
                :key="contact.id"
                :class="[
                  'hover:bg-slate-50 transition-colors cursor-pointer',
                  selectedContacts.includes(contact.id) ? 'bg-blue-50/30' : ''
                ]"
                @click="viewContact(contact)"
              >
                <td class="px-6 py-4" @click.stop>
                  <input
                    type="checkbox"
                    class="rounded border-slate-300 text-[#1B4F72] focus:ring-[#1B4F72]"
                    :checked="selectedContacts.includes(contact.id)"
                    @change="toggleSelect(contact.id)"
                  />
                </td>
                <td class="px-6 py-4 font-medium text-slate-900">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      {{ contact.first_name.charAt(0) }}
                    </div>
                    {{ contact.first_name }} {{ contact.last_name || '' }}
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-500 font-mono text-xs">
                  {{ contact.phone || '-' }}
                </td>
                <td class="px-6 py-4 text-slate-500">{{ contact.email || '-' }}</td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="tag in (contact.tags || [])"
                      :key="tag"
                      class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-500">
                  {{ formatLastContact(contact.last_contacted_at) }}
                </td>
                <td class="px-6 py-4 text-right" @click.stop>
                  <button
                    @click.stop="viewContact(contact)"
                    class="p-1 text-slate-400 hover:text-[#1B4F72] rounded hover:bg-slate-100"
                  >
                    <MoreVertical :size="16" />
                  </button>
                </td>
              </tr>
              <tr v-if="contactsStore.contacts.length === 0">
                <td colspan="7" class="px-6 py-8 text-center text-slate-500">
                  No contacts found
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span class="text-sm text-slate-500">
            Showing {{ (contactsStore.page - 1) * contactsStore.perPage + 1 }}-
            {{ Math.min(contactsStore.page * contactsStore.perPage, contactsStore.total) }}
            of {{ contactsStore.total }}
          </span>
          <div class="flex gap-2">
            <button
              :disabled="contactsStore.page === 1"
              @click="goToPage(contactsStore.page - 1)"
              class="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft :size="16" />
            </button>
            <button
              :disabled="contactsStore.page * contactsStore.perPage >= contactsStore.total"
              @click="goToPage(contactsStore.page + 1)"
              class="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              <ChevronRight :size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- Bulk Actions Bar -->
      <div
        v-if="selectedContacts.length > 0"
        class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1B4F72] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-6 z-30"
      >
        <span class="font-medium">
          {{ selectedContacts.length }} contacts selected
        </span>
        <div class="h-4 w-px bg-white/20"></div>
        <div class="flex gap-2">
          <button
            @click="handleBulkDelete"
            class="px-3 py-1.5 hover:bg-white/10 rounded-md transition-colors flex items-center gap-2 text-sm"
          >
            <Trash2 :size="16" /> Delete
          </button>
          <button
            @click="showBulkTagModal = true"
            class="px-3 py-1.5 hover:bg-white/10 rounded-md transition-colors flex items-center gap-2 text-sm"
          >
            <Tag :size="16" /> Add Tag
          </button>
        </div>
        <button @click="selectedContacts = []" class="ml-2 p-1 hover:bg-white/10 rounded-full">
          <X :size="16" />
        </button>
      </div>
    </div>

    <!-- Contact Sidebar -->
    <ContactSidebar
      :contact="selectedContact"
      :is-open="showContactSidebar"
      @close="showContactSidebar = false"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Search,
  Filter,
  Plus,
  Upload,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Trash2,
  Tag,
  X,
} from 'lucide-vue-next';
import DashboardLayout from '@/components/layout/DashboardLayout.vue';
import ContactSidebar from '@/components/contacts/ContactSidebar.vue';
import { useContactsStore } from '@/stores/contacts';
import { useOrganizationsStore } from '@/stores/organizations';
import type { Contact } from '@/api/contacts';
import { createDebounced } from '@/utils/request';

const contactsStore = useContactsStore();
const organizationsStore = useOrganizationsStore();

const searchQuery = ref('');
const filterStatus = ref('');
const selectedContacts = ref<string[]>([]);
const showCreateModal = ref(false);
const showImportModal = ref(false);
const showBulkTagModal = ref(false);

const hasActiveFilters = computed(() => {
  return searchQuery.value || filterStatus.value;
});

function formatLastContact(date?: string): string {
  if (!date) return 'Never';
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function toggleSelectAll() {
  if (selectedContacts.value.length === contactsStore.contacts.length) {
    selectedContacts.value = [];
  } else {
    selectedContacts.value = contactsStore.contacts.map(c => c.id);
  }
}

function toggleSelect(id: string) {
  const index = selectedContacts.value.indexOf(id);
  if (index > -1) {
    selectedContacts.value.splice(index, 1);
  } else {
    selectedContacts.value.push(id);
  }
}

const selectedContact = ref<Contact | null>(null);
const showContactSidebar = ref(false);

function viewContact(contact: Contact) {
  selectedContact.value = contact;
  showContactSidebar.value = true;
}

// Debounced search to reduce API calls
const handleSearch = createDebounced(() => {
  fetchContacts();
}, 300);

function handleFilter() {
  fetchContacts();
}

function clearFilters() {
  searchQuery.value = '';
  filterStatus.value = '';
  fetchContacts();
}

function goToPage(page: number) {
  fetchContacts({ page });
}

async function fetchContacts(filters?: any) {
  try {
    await contactsStore.fetchContacts({
      search: searchQuery.value || undefined,
      status: filterStatus.value || undefined,
      ...filters,
    });
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
  }
}

async function handleBulkDelete() {
  if (confirm(`Delete ${selectedContacts.value.length} contacts?`)) {
    try {
      await contactsStore.bulkDelete(selectedContacts.value);
      selectedContacts.value = [];
      await fetchContacts();
    } catch (error) {
      console.error('Failed to delete contacts:', error);
    }
  }
}

onMounted(async () => {
  try {
    if (!organizationsStore.currentOrganization) {
      await organizationsStore.fetchOrganizations();
      if (organizationsStore.organizations.length > 0) {
        organizationsStore.setCurrentOrganization(organizationsStore.organizations[0]);
      }
    }
    if (organizationsStore.currentOrganization?.id) {
      await fetchContacts();
    }
  } catch (error) {
    console.error('Failed to load contacts:', error);
  }
});
</script>
