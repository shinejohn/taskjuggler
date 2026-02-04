import type { UrpaModule } from '@/types/module';
import { Users, Stethoscope } from 'lucide-vue-next'; // Hypothetical icons
import DoctorScheduleWidget from './components/DoctorScheuleWidget.vue';

export const doctorModule: UrpaModule = {
    id: 'doctor',
    name: 'Doctor Assistant',
    description: 'AI-powered assistant for medical professionals.',

    routes: [
        {
            path: '/doctor/patients',
            name: 'doctor-patients',
            component: () => import('./views/PatientsView.vue'),
            meta: { requiresAuth: true }
        }
    ],

    navItems: [
        {
            id: 'doctor-patients',
            label: 'Patients',
            icon: Users,
            to: '/doctor/patients'
        },
        {
            id: 'doctor-appointments',
            label: 'Clinic Schedule',
            icon: Stethoscope, // Using Stethoscope as a proxy for clinic calendar
            to: '/doctor/patients' // Link to patients for MVP
        }
    ],

    dashboardWidgets: [
        {
            id: 'doctor-schedule',
            component: DoctorScheduleWidget,
            span: 6
        }
    ],

    systemPromptAdditions: `
You are a medical assistant for a doctor. 
Your goal is to help managing the clinic schedule and patient summaries.
When asked about patients, summarize their recent visits and upcoming appointments.
Always maintain patient confidentiality (HIPAA compliant).
  `,

    setup() {
        console.log('Doctor Module Initialized');
    }
};
