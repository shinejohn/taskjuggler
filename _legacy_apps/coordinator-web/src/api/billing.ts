import api from '@/utils/api';
import type { AxiosResponse } from 'axios';

export interface BillingInfo {
  subscription: {
    plan: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
  };
  usage: {
    coordinators: number;
    monthly_cost: number;
  };
  payment_method: {
    type: string;
    last4: string;
    brand: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface BillingHistoryItem {
  id: string;
  date: string;
  amount: number;
  status: string;
  description: string;
}

export const billingApi = {
  getBillingInfo(orgId: string): Promise<AxiosResponse<BillingInfo>> {
    return api.get(`/coordinator/organizations/${orgId}/billing`);
  },
  getHistory(orgId: string): Promise<AxiosResponse<{ data: BillingHistoryItem[] }>> {
    return api.get(`/coordinator/organizations/${orgId}/billing/history`);
  },
  updatePaymentMethod(orgId: string, paymentMethodId: string): Promise<AxiosResponse<void>> {
    return api.put(`/coordinator/organizations/${orgId}/billing/payment-method`, {
      payment_method_id: paymentMethodId,
    });
  },
  cancelSubscription(orgId: string): Promise<AxiosResponse<void>> {
    return api.post(`/coordinator/organizations/${orgId}/billing/cancel`);
  },
  subscribe(orgId: string, plan: string): Promise<AxiosResponse<void>> {
    return api.post(`/coordinator/organizations/${orgId}/billing/subscribe`, { plan });
  },
  updateAddons(orgId: string, addons: Record<string, boolean>): Promise<AxiosResponse<void>> {
    return api.post(`/coordinator/organizations/${orgId}/billing/addons`, { addons });
  },
};

