import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export interface AppointmentType {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  color: string;
  is_active: boolean;
}

export interface Appointment {
  id: string;
  appointment_type_id: string;
  host_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  start_time: string;
  end_time: string;
  timezone: string;
  status: string;
  notes?: string;
  meeting_url?: string;
  meeting_id?: string;
  task_id?: string;
}

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref<Appointment[]>([]);
  const appointmentTypes = ref<AppointmentType[]>([]);
  const loading = ref(false);

  async function fetchAppointments(params: Record<string, any> = {}) {
    loading.value = true;
    try {
      const response = await api.get('/appointments', { params });
      const fetchedAppointments = response.data.data || response.data;
      appointments.value = Array.isArray(fetchedAppointments) ? fetchedAppointments : [];
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function fetchAppointmentTypes() {
    loading.value = true;
    try {
      const response = await api.get('/appointment-types');
      const types = response.data.data || response.data;
      appointmentTypes.value = Array.isArray(types) ? types : [];
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function createAppointment(data: Partial<Appointment>) {
    const response = await api.post('/appointments', data);
    const appointment = response.data.data || response.data;
    appointments.value = [appointment, ...appointments.value];
    return appointment;
  }

  async function createAppointmentForMeeting(meetingId: string, data: Partial<Appointment>) {
    const response = await api.post(`/ideacircuit/meetings/${meetingId}/appointments`, data);
    const appointment = response.data.data || response.data;
    appointments.value = [appointment, ...appointments.value];
    return appointment;
  }

  async function getMeetingAppointments(meetingId: string) {
    const response = await api.get(`/ideacircuit/meetings/${meetingId}/appointments`);
    const fetchedAppointments = response.data.data || response.data;
    return Array.isArray(fetchedAppointments) ? fetchedAppointments : [];
  }

  async function getAvailableSlots(slug: string, startDate: string, endDate: string, timezone = 'UTC') {
    const response = await api.get(`/public/booking/${slug}/slots`, {
      params: { start_date: startDate, end_date: endDate, timezone },
    });
    return response.data.slots || [];
  }

  async function cancelAppointment(id: string) {
    await api.delete(`/appointments/${id}`);
    appointments.value = appointments.value.filter((a) => a.id !== id);
  }

  return {
    appointments,
    appointmentTypes,
    loading,
    fetchAppointments,
    fetchAppointmentTypes,
    createAppointment,
    createAppointmentForMeeting,
    getMeetingAppointments,
    getAvailableSlots,
    cancelAppointment,
  };
});

