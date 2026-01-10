import { defineStore } from 'pinia';
import { ref } from 'vue';
import { contactsApi, type Contact, type ContactFilters } from '@/api/contacts';
import { useOrganizationsStore } from './organizations';

export const useContactsStore = defineStore('contacts', () => {
  const contacts = ref<Contact[]>([]);
  const currentContact = ref<Contact | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const page = ref(1);
  const perPage = ref(15);

  async function fetchContacts(filters?: ContactFilters) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      const response = await contactsApi.getAll(orgStore.currentOrganization.id, {
        ...filters,
        page: filters?.page || page.value,
        per_page: filters?.per_page || perPage.value,
      });
      contacts.value = response.data.data;
      total.value = response.data.total;
      page.value = response.data.page;
      perPage.value = response.data.per_page;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load contacts';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchContact(id: string) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      const response = await contactsApi.getById(orgStore.currentOrganization.id, id);
      currentContact.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load contact';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createContact(data: Partial<Contact>) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      const response = await contactsApi.create(orgStore.currentOrganization.id, data);
      contacts.value.unshift(response.data);
      total.value += 1;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create contact';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateContact(id: string, data: Partial<Contact>) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      const response = await contactsApi.update(orgStore.currentOrganization.id, id, data);
      const index = contacts.value.findIndex(c => c.id === id);
      if (index !== -1) {
        contacts.value[index] = response.data;
      }
      if (currentContact.value?.id === id) {
        currentContact.value = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update contact';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteContact(id: string) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      await contactsApi.delete(orgStore.currentOrganization.id, id);
      contacts.value = contacts.value.filter(c => c.id !== id);
      total.value -= 1;
      if (currentContact.value?.id === id) {
        currentContact.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete contact';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function bulkDelete(ids: string[]) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      await contactsApi.bulkDelete(orgStore.currentOrganization.id, ids);
      contacts.value = contacts.value.filter(c => !ids.includes(c.id));
      total.value -= ids.length;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete contacts';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function bulkTag(ids: string[], tags: string[]) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      await contactsApi.bulkTag(orgStore.currentOrganization.id, ids, tags);
      // Update local state
      contacts.value.forEach(contact => {
        if (ids.includes(contact.id)) {
          const existingTags = contact.tags || [];
          contact.tags = [...new Set([...existingTags, ...tags])];
        }
      });
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to tag contacts';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    contacts,
    currentContact,
    loading,
    error,
    total,
    page,
    perPage,
    fetchContacts,
    fetchContact,
    createContact,
    updateContact,
    deleteContact,
    bulkDelete,
    bulkTag,
  };
});




