import { create } from 'zustand';
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

interface AppointmentsState {
  appointments: Appointment[];
  appointmentTypes: AppointmentType[];
  loading: boolean;
  fetchAppointments: (params?: Record<string, any>) => Promise<void>;
  fetchAppointmentTypes: () => Promise<void>;
  createAppointment: (data: Partial<Appointment>) => Promise<Appointment>;
  createAppointmentForMeeting: (meetingId: string, data: Partial<Appointment>) => Promise<Appointment>;
  getMeetingAppointments: (meetingId: string) => Promise<Appointment[]>;
  getAvailableSlots: (slug: string, startDate: string, endDate: string, timezone?: string) => Promise<any[]>;
  cancelAppointment: (id: string) => Promise<void>;
}

export const useAppointmentsStore = create<AppointmentsState>((set) => ({
  appointments: [],
  appointmentTypes: [],
  loading: false,

  fetchAppointments: async (params = {}) => {
    set({ loading: true });
    try {
      const response = await api.get('/appointments', { params });
      const appointments = response.data.data || response.data;
      set({ appointments: Array.isArray(appointments) ? appointments : [], loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchAppointmentTypes: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/appointment-types');
      const types = response.data.data || response.data;
      set({ appointmentTypes: Array.isArray(types) ? types : [], loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  createAppointment: async (data) => {
    const response = await api.post('/appointments', data);
    const appointment = response.data.data || response.data;
    set((state) => ({ appointments: [appointment, ...state.appointments] }));
    return appointment;
  },

  createAppointmentForMeeting: async (meetingId: string, data: Partial<Appointment>) => {
    const response = await api.post(`/ideacircuit/meetings/${meetingId}/appointments`, data);
    const appointment = response.data.data || response.data;
    set((state) => ({ appointments: [appointment, ...state.appointments] }));
    return appointment;
  },

  getMeetingAppointments: async (meetingId: string) => {
    const response = await api.get(`/ideacircuit/meetings/${meetingId}/appointments`);
    const appointments = response.data.data || response.data;
    return Array.isArray(appointments) ? appointments : [];
  },

  getAvailableSlots: async (slug: string, startDate: string, endDate: string, timezone = 'UTC') => {
    const response = await api.get(`/public/booking/${slug}/slots`, {
      params: { start_date: startDate, end_date: endDate, timezone },
    });
    return response.data.slots || [];
  },

  cancelAppointment: async (id: string) => {
    await api.delete(`/appointments/${id}`);
    set((state) => ({ appointments: state.appointments.filter((a) => a.id !== id) }));
  },
}));

