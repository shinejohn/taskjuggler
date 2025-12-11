import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'
import type { ContactList } from '@/types'

export const useContactListsStore = defineStore('contactLists', () => {
  const contactLists = ref<ContactList[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchContactLists() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/contact-lists')
      contactLists.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch contact lists'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchContactList(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/contact-lists/${id}`)
      const index = contactLists.value.findIndex(cl => cl.id === id)
      if (index >= 0) {
        contactLists.value[index] = response.data
      } else {
        contactLists.value.push(response.data)
      }
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch contact list'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createContactList(data: { name: string; description?: string }) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/contact-lists', data)
      contactLists.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to create contact list'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateContactList(id: string, data: { name?: string; description?: string }) {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`/contact-lists/${id}`, data)
      const index = contactLists.value.findIndex(cl => cl.id === id)
      if (index >= 0) {
        contactLists.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to update contact list'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteContactList(id: string) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/contact-lists/${id}`)
      contactLists.value = contactLists.value.filter(cl => cl.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete contact list'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addMember(listId: string, data: { name: string; phone?: string; email?: string; metadata?: any }) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/contact-lists/${listId}/members`, data)
      const list = contactLists.value.find(cl => cl.id === listId)
      if (list && list.members) {
        list.members.push(response.data)
      }
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to add member'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function removeMember(listId: string, memberId: string) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/contact-lists/${listId}/members/${memberId}`)
      const list = contactLists.value.find(cl => cl.id === listId)
      if (list && list.members) {
        list.members = list.members.filter(m => m.id !== memberId)
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to remove member'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    contactLists,
    loading,
    error,
    fetchContactLists,
    fetchContactList,
    createContactList,
    updateContactList,
    deleteContactList,
    addMember,
    removeMember,
  }
})
