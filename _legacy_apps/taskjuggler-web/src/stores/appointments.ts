import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';

export interface AppointmentType {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  color: string;
  is_active: boolean;
  buffer_before_minutes: number;
  buffer_after_minutes: number;
  advance_booking_days: number;
  cancellation_hours: number;
  price: number | null;
  currency: string;
  booking_slug: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface AvailabilitySlot {
  id: string;
  user_id: string;
  day_of_week: number | null;
  start_time: string;
  end_time: string;
  start_date: string | null;
  end_date: string | null;
  specific_date: string | null;
  timezone: string;
  is_active: boolean;
}

export interface Appointment {
  id: string;
  appointment_type_id: string;
  host_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  start_time: string;
  end_time: string;
  timezone: string;
  status: string;
  notes: string | null;
  meeting_location: string | null;
  meeting_url: string | null;
  task_id: string | null;
}

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointmentTypes = ref<AppointmentType[]>([]);
  const availabilitySlots = ref<AvailabilitySlot[]>([]);
  const appointments = ref<Appointment[]>([]);
  const loading = ref(false);

  // Appointment Types
  async function fetchAppointmentTypes() {
    loading.value = true;
    try {
      const response = await api.get('/appointment-types');
      appointmentTypes.value = response.data;
    } finally {
      loading.value = false;
    }
  }

  async function createAppointmentType(data: Partial<AppointmentType>) {
    const response = await api.post('/appointment-types', data);
    appointmentTypes.value.push(response.data);
    return response.data;
  }

  async function updateAppointmentType(id: string, data: Partial<AppointmentType>) {
    const response = await api.put(`/appointment-types/${id}`, data);
    const index = appointmentTypes.value.findIndex(at => at.id === id);
    if (index !== -1) {
      appointmentTypes.value[index] = response.data;
    }
    return response.data;
  }

  async function deleteAppointmentType(id: string) {
    await api.delete(`/appointment-types/${id}`);
    appointmentTypes.value = appointmentTypes.value.filter(at => at.id !== id);
  }

  // Availability Slots
  async function fetchAvailabilitySlots() {
    loading.value = true;
    try {
      const response = await api.get('/availability-slots');
      availabilitySlots.value = response.data;
    } finally {
      loading.value = false;
    }
  }

  async function createAvailabilitySlot(data: Partial<AvailabilitySlot>) {
    const response = await api.post('/availability-slots', data);
    availabilitySlots.value.push(response.data);
    return response.data;
  }

  async function updateAvailabilitySlot(id: string, data: Partial<AvailabilitySlot>) {
    const response = await api.put(`/availability-slots/${id}`, data);
    const index = availabilitySlots.value.findIndex(slot => slot.id === id);
    if (index !== -1) {
      availabilitySlots.value[index] = response.data;
    }
    return response.data;
  }

  async function deleteAvailabilitySlot(id: string) {
    await api.delete(`/availability-slots/${id}`);
    availabilitySlots.value = availabilitySlots.value.filter(slot => slot.id !== id);
  }

  // Appointments
  async function fetchAppointments(params: Record<string, any> = {}) {
    loading.value = true;
    try {
      const response = await api.get('/appointments', { params });
      appointments.value = response.data.data || response.data;
    } finally {
      loading.value = false;
    }
  }

  async function createAppointment(data: Partial<Appointment>) {
    const response = await api.post('/appointments', data);
    appointments.value.unshift(response.data);
    return response.data;
  }

  async function confirmAppointment(id: string) {
    const response = await api.post(`/appointments/${id}/confirm`);
    const index = appointments.value.findIndex(apt => apt.id === id);
    if (index !== -1) {
      appointments.value[index] = response.data;
    }
    return response.data;
  }

  async function cancelAppointment(id: string) {
    await api.delete(`/appointments/${id}`);
    appointments.value = appointments.value.filter(apt => apt.id !== id);
  }

  // Public booking
  async function getPublicAppointmentType(slug: string) {
    const response = await api.get(`/public/booking/${slug}`);
    return response.data;
  }

  async function getAvailableSlots(slug: string, startDate: string, endDate: string, timezone: string = 'UTC') {
    const response = await api.get(`/public/booking/${slug}/slots`, {
      params: { start_date: startDate, end_date: endDate, timezone },
    });
    return response.data.slots;
  }

  async function bookPublicAppointment(slug: string, data: any) {
    const response = await api.post(`/public/booking/${slug}/book`, data);
    return response.data;
  }

  return {
    appointmentTypes,
    availabilitySlots,
    appointments,
    loading,
    fetchAppointmentTypes,
    createAppointmentType,
    updateAppointmentType,
    deleteAppointmentType,
    fetchAvailabilitySlots,
    createAvailabilitySlot,
    updateAvailabilitySlot,
    deleteAvailabilitySlot,
    fetchAppointments,
    createAppointment,
    confirmAppointment,
    cancelAppointment,
    getPublicAppointmentType,
    getAvailableSlots,
    bookPublicAppointment,
  };
});
