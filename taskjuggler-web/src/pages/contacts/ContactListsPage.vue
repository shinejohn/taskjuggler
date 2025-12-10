<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Contact Lists</h1>
      <button @click="showCreateModal = true" class="btn btn-primary">New Contact List</button>
    </div>

    <div v-if="loading && contactLists.length === 0" class="text-center py-8">
      <p class="text-gray-500">Loading contact lists...</p>
    </div>

    <div v-else-if="contactLists.length === 0" class="text-center py-8">
      <p class="text-gray-500 mb-4">No contact lists yet</p>
      <button @click="showCreateModal = true" class="btn btn-primary">Create Your First Contact List</button>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="list in contactLists"
        :key="list.id"
        class="card cursor-pointer hover:shadow-md transition-shadow"
        @click="selectedList = list"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="text-lg font-semibold mb-1">{{ list.name }}</h3>
            <p v-if="list.description" class="text-gray-600 text-sm mb-2">{{ list.description }}</p>
            <p class="text-sm text-gray-500">
              {{ list.members?.length || 0 }} {{ (list.members?.length || 0) === 1 ? 'member' : 'members' }}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              @click.stop="editList(list)"
              class="btn btn-secondary text-sm"
            >
              Edit
            </button>
            <button
              @click.stop="deleteList(list.id)"
              class="btn btn-danger text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || editingList"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md" @click.stop>
        <h2 class="text-xl font-bold mb-4">
          {{ editingList ? 'Edit Contact List' : 'New Contact List' }}
        </h2>
        <form @submit.prevent="saveList">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Name *</label>
            <input
              v-model="listForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Contact list name"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea
              v-model="listForm.description"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="3"
              placeholder="Optional description"
            />
          </div>
          <div class="flex gap-2">
            <button type="submit" class="btn btn-primary flex-1">Save</button>
            <button type="button" @click="closeModal" class="btn btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- List Detail Modal -->
    <div
      v-if="selectedList"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="selectedList = null"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">{{ selectedList.name }}</h2>
          <button @click="selectedList = null" class="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <p v-if="selectedList.description" class="text-gray-600 mb-4">{{ selectedList.description }}</p>

        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold">Members ({{ selectedList.members?.length || 0 }})</h3>
          <button @click="showAddMemberModal = true" class="btn btn-primary text-sm">Add Member</button>
        </div>

        <div v-if="selectedList.members && selectedList.members.length > 0" class="space-y-2">
          <div
            v-for="member in selectedList.members"
            :key="member.id"
            class="border rounded-lg p-3 flex justify-between items-center"
          >
            <div>
              <p class="font-medium">{{ member.name }}</p>
              <div class="text-sm text-gray-600 space-x-3">
                <span v-if="member.email">📧 {{ member.email }}</span>
                <span v-if="member.phone">📞 {{ member.phone }}</span>
              </div>
            </div>
            <button
              @click="removeMember(selectedList!.id, member.id)"
              class="btn btn-danger text-sm"
            >
              Remove
            </button>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          <p>No members yet. Add your first member!</p>
        </div>
      </div>
    </div>

    <!-- Add Member Modal -->
    <div
      v-if="showAddMemberModal && selectedList"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showAddMemberModal = false"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md" @click.stop>
        <h2 class="text-xl font-bold mb-4">Add Member</h2>
        <form @submit.prevent="addMember">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Name *</label>
            <input
              v-model="memberForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Member name"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              v-model="memberForm.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="member@example.com"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Phone</label>
            <input
              v-model="memberForm.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="+1234567890"
            />
          </div>
          <div class="flex gap-2">
            <button type="submit" class="btn btn-primary flex-1">Add</button>
            <button type="button" @click="showAddMemberModal = false" class="btn btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useContactListsStore } from '@/stores/contactLists'
import type { ContactList } from '@/types'

const contactListsStore = useContactListsStore()
const contactLists = computed(() => contactListsStore.contactLists)
const loading = computed(() => contactListsStore.loading)

const showCreateModal = ref(false)
const showAddMemberModal = ref(false)
const selectedList = ref<ContactList | null>(null)
const editingList = ref<ContactList | null>(null)

const listForm = ref({
  name: '',
  description: '',
})

const memberForm = ref({
  name: '',
  email: '',
  phone: '',
})

onMounted(() => {
  contactListsStore.fetchContactLists()
})

function editList(list: ContactList) {
  editingList.value = list
  listForm.value = {
    name: list.name,
    description: list.description || '',
  }
}

function closeModal() {
  showCreateModal.value = false
  editingList.value = null
  listForm.value = { name: '', description: '' }
}

async function saveList() {
  try {
    if (editingList.value) {
      await contactListsStore.updateContactList(editingList.value.id, listForm.value)
      if ((window as any).$toast) {
        (window as any).$toast.success('Contact list updated')
      }
    } else {
      await contactListsStore.createContactList(listForm.value)
      if ((window as any).$toast) {
        (window as any).$toast.success('Contact list created')
      }
    }
    closeModal()
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function deleteList(id: string) {
  if (!confirm('Are you sure you want to delete this contact list?')) return
  
  try {
    await contactListsStore.deleteContactList(id)
    if ((window as any).$toast) {
      (window as any).$toast.success('Contact list deleted')
    }
    if (selectedList.value?.id === id) {
      selectedList.value = null
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function addMember() {
  if (!selectedList.value) return
  
  try {
    await contactListsStore.addMember(selectedList.value.id, memberForm.value)
    if ((window as any).$toast) {
      (window as any).$toast.success('Member added')
    }
    // Refresh the list to get updated members
    await contactListsStore.fetchContactList(selectedList.value.id)
    showAddMemberModal.value = false
    memberForm.value = { name: '', email: '', phone: '' }
  } catch (error) {
    // Error handled by API interceptor
  }
}

async function removeMember(listId: string, memberId: string) {
  if (!confirm('Remove this member from the list?')) return
  
  try {
    await contactListsStore.removeMember(listId, memberId)
    if ((window as any).$toast) {
      (window as any).$toast.success('Member removed')
    }
    // Refresh the list
    if (selectedList.value) {
      await contactListsStore.fetchContactList(selectedList.value.id)
    }
  } catch (error) {
    // Error handled by API interceptor
  }
}
</script>
