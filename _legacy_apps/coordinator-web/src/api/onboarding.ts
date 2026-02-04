import api from '@/utils/api';
import type { AxiosResponse } from 'axios';

export interface RoleTemplate {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  is_active: boolean;
  display_order: number;
}

export interface PersonaTemplate {
  id: string;
  name: string;
  description?: string;
  personality_traits?: string[];
  is_active: boolean;
  display_order: number;
}

export interface OnboardingData {
  organization: {
    name: string;
    industry: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    timezone?: string;
    business_hours?: Record<string, any>;
  };
  role_template_id: string;
  persona_template_id: string;
  coordinator?: {
    display_name?: string;
    custom_greeting?: string;
    custom_prompts?: Record<string, any>;
  };
  business_info?: {
    services?: string[];
    description?: string;
  };
}

export interface OnboardingCompleteResponse {
  organization: any;
  coordinator: any;
  message: string;
}

export const onboardingApi = {
  getRoleTemplates(): Promise<AxiosResponse<RoleTemplate[]>> {
    return api.get('/coordinator/onboarding/role-templates');
  },
  getPersonaTemplates(): Promise<AxiosResponse<PersonaTemplate[]>> {
    return api.get('/coordinator/onboarding/persona-templates');
  },
  complete(data: OnboardingData): Promise<AxiosResponse<OnboardingCompleteResponse>> {
    return api.post('/coordinator/onboarding/complete', data);
  },
};




