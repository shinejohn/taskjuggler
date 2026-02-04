import { defineStore } from 'pinia';
import { ref } from 'vue';
import { appointmentsApi, type Appointment, type AppointmentFilters } from '@/api/appointments';
import { useOrganizationsStore } from './organizations';
import { withOptimisticUpdate } from '@/utils/optimisticUpdates';

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref<Appointment[]>([]);
  const todayAppointments = ref<Appointment[]>([]);
  const currentAppointment = ref<Appointment | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const page = ref(1);
  const perPage = ref(15);

  async function fetchAppointments(filters?: AppointmentFilters) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      const response = await appointmentsApi.getAll(orgStore.currentOrganization.id, {
        ...filters,
        page: filters?.page || page.value,
        per_page: filters?.per_page || perPage.value,
      });
      const data = (response.data as any).data || response.data;
      appointments.value = Array.isArray(data) ? data : data.data;
      total.value = (response.data as any).total || (data.meta ? data.meta.total : data.length);
      page.value = (response.data as any).page || (data.meta ? data.meta.current_page : page.value);
      perPage.value = (response.data as any).per_page || (data.meta ? data.meta.per_page : perPage.value);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load appointments';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchTodayAppointments() {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      const response = await appointmentsApi.getToday(orgStore.currentOrganization.id);
      todayAppointments.value = (response.data as any).data || response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load today\'s appointments';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchAppointment(id: string) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      const response = await appointmentsApi.getById(orgStore.currentOrganization.id, id);
      const data = (response.data as any).data || response.data;
      currentAppointment.value = data;
      return data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load appointment';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createAppointment(data: Partial<Appointment>) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;

    // Create optimistic appointment
    const optimisticId = `temp-${Date.now()}`;
    const optimisticAppointment: Appointment = {
      id: optimisticId,
      organization_id: orgStore.currentOrganization.id,
      contact_id: data.contact_id || '',
      title: data.title || '',
      description: data.description,
      starts_at: data.starts_at || new Date().toISOString(),
      ends_at: data.ends_at || new Date().toISOString(),
      status: 'pending',
      location_type: data.location_type || 'in-person',
      location: data.location,
      notes: data.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    } as Appointment;

    // Rollback function
    const rollback = () => {
      const index = appointments.value.findIndex(a => a.id === optimisticId);
      if (index !== -1) {
        appointments.value.splice(index, 1);
      }
    };

    try {
      // Optimistically add appointment
      appointments.value.push(optimisticAppointment);

      // Perform actual API call with optimistic update handling
      const response = await withOptimisticUpdate(
        optimisticId,
        optimisticAppointment,
        rollback,
        async () => {
          return await appointmentsApi.create(orgStore.currentOrganization!.id, data);
        }
      );

      // Replace optimistic appointment with real one
      const result = (response.data as any).data || response.data;
      // Replace optimistic appointment with real one
      const index = appointments.value.findIndex(a => a.id === optimisticId);
      if (index !== -1) {
        appointments.value[index] = result;
      } else {
        appointments.value.push(result);
      }

      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create appointment';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateAppointment(id: string, data: Partial<Appointment>) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      const response = await appointmentsApi.update(orgStore.currentOrganization.id, id, data);
      const result = (response.data as any).data || response.data;
      const index = appointments.value.findIndex(a => a.id === id);
      if (index !== -1) {
        appointments.value[index] = result;
      }
      if (currentAppointment.value?.id === id) {
        currentAppointment.value = result;
      }
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update appointment';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function cancelAppointment(id: string, reason?: string) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      const response = await appointmentsApi.cancel(orgStore.currentOrganization.id, id, reason);
      const result = (response.data as any).data || response.data;
      const index = appointments.value.findIndex(a => a.id === id);
      if (index !== -1) {
        appointments.value[index] = result;
      }
      if (currentAppointment.value?.id === id) {
        currentAppointment.value = result;
      }
      return result;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to cancel appointment';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteAppointment(id: string) {
    const orgStore = useOrganizationsStore();
    if (!orgStore.currentOrganization?.id) {
      throw new Error('No organization selected');
    }

    loading.value = true;
    error.value = null;
    try {
      await appointmentsApi.delete(orgStore.currentOrganization.id, id);
      appointments.value = appointments.value.filter(a => a.id !== id);
      if (currentAppointment.value?.id === id) {
        currentAppointment.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete appointment';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    appointments,
    todayAppointments,
    currentAppointment,
    loading,
    error,
    total,
    page,
    perPage,
    fetchAppointments,
    fetchTodayAppointments,
    fetchAppointment,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
  };
});

