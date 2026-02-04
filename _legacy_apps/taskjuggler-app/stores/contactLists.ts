import { create } from 'zustand';
import api from '../utils/api';
import type { ContactList, ContactListMember } from '../types';

interface ContactListsState {
  contactLists: ContactList[];
  loading: boolean;
  error: string | null;
  fetchContactLists: () => Promise<void>;
  fetchContactList: (id: string) => Promise<ContactList | null>;
  createContactList: (data: { name: string; description?: string }) => Promise<ContactList>;
  updateContactList: (id: string, data: { name?: string; description?: string }) => Promise<ContactList>;
  deleteContactList: (id: string) => Promise<void>;
  addMember: (listId: string, data: { name: string; phone?: string; email?: string }) => Promise<ContactListMember>;
  removeMember: (listId: string, memberId: string) => Promise<void>;
  importContacts: (listId: string, file: File) => Promise<any>;
}

export const useContactListsStore = create<ContactListsState>((set, get) => ({
  contactLists: [],
  loading: false,
  error: null,

  fetchContactLists: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/contact-lists');
      set({ contactLists: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch contact lists', loading: false });
      throw error;
    }
  },

  fetchContactList: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/contact-lists/${id}`);
      const lists = get().contactLists;
      const index = lists.findIndex(cl => cl.id === id);
      if (index >= 0) {
        lists[index] = response.data;
      } else {
        lists.push(response.data);
      }
      set({ contactLists: lists, loading: false });
      return response.data;
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch contact list', loading: false });
      throw error;
    }
  },

  createContactList: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/contact-lists', data);
      const lists = get().contactLists;
      lists.push(response.data);
      set({ contactLists: lists, loading: false });
      return response.data;
    } catch (error: any) {
      set({ error: error.message || 'Failed to create contact list', loading: false });
      throw error;
    }
  },

  updateContactList: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/contact-lists/${id}`, data);
      const lists = get().contactLists;
      const index = lists.findIndex(cl => cl.id === id);
      if (index >= 0) {
        lists[index] = response.data;
      }
      set({ contactLists: lists, loading: false });
      return response.data;
    } catch (error: any) {
      set({ error: error.message || 'Failed to update contact list', loading: false });
      throw error;
    }
  },

  deleteContactList: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/contact-lists/${id}`);
      const lists = get().contactLists.filter(cl => cl.id !== id);
      set({ contactLists: lists, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete contact list', loading: false });
      throw error;
    }
  },

  addMember: async (listId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/contact-lists/${listId}/members`, data);
      const lists = get().contactLists;
      const list = lists.find(cl => cl.id === listId);
      if (list && list.members) {
        list.members.push(response.data);
      }
      set({ contactLists: lists, loading: false });
      return response.data;
    } catch (error: any) {
      set({ error: error.message || 'Failed to add member', loading: false });
      throw error;
    }
  },

  removeMember: async (listId, memberId) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/contact-lists/${listId}/members/${memberId}`);
      const lists = get().contactLists;
      const list = lists.find(cl => cl.id === listId);
      if (list && list.members) {
        list.members = list.members.filter(m => m.id !== memberId);
      }
      set({ contactLists: lists, loading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to remove member', loading: false });
      throw error;
    }
  },

  importContacts: async (listId, file) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('file', file as any);
      formData.append('list_id', listId);
      
      const response = await api.post('/contact-lists/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Refresh the list
      await get().fetchContactList(listId);
      
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      set({ error: error.message || 'Failed to import contacts', loading: false });
      throw error;
    }
  },
}));
