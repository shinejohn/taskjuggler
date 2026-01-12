import api from '@/utils/api';

export interface VapiCallConfig {
  assistantId: string;
  customerNumber: string;
  phoneNumberId?: string;
  metadata?: Record<string, any>;
}

export interface VapiCallResponse {
  id: string;
  status: string;
  direction: string;
  customer: {
    number: string;
  };
  assistantId: string;
}

class VapiService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_VAPI_API_KEY || '';
    this.apiUrl = import.meta.env.VITE_VAPI_API_URL || 'https://api.vapi.ai';
  }

  /**
   * Start a Vapi call
   */
  async startCall(config: VapiCallConfig): Promise<VapiCallResponse> {
    // Use backend endpoint instead of direct Vapi API
    const response = await api.post('/urpa/voice/vapi/call', {
      assistant_id: config.assistantId,
      customer_number: config.customerNumber,
      phone_number_id: config.phoneNumberId,
      metadata: config.metadata,
    });

    return response.data;
  }

  /**
   * End a Vapi call
   */
  async endCall(callId: string): Promise<void> {
    await api.post(`/urpa/voice/vapi/call/${callId}/end`);
  }

  /**
   * Get call status
   */
  async getCallStatus(callId: string): Promise<any> {
    const response = await api.get(`/urpa/voice/vapi/call/${callId}`);
    return response.data;
  }
}

export const vapiService = new VapiService();

