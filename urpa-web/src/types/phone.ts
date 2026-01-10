export interface PhoneCall {
  id: string;
  user_id: string;
  contact_id?: string;
  direction: 'inbound' | 'outbound';
  caller_number?: string;
  recipient_number?: string;
  status: 'initiated' | 'ringing' | 'answered' | 'completed' | 'failed' | 'missed';
  duration_seconds?: number;
  started_at?: string;
  ended_at?: string;
  transcript?: string;
  recording_url?: string;
  actions_taken?: string[];
  vapi_call_id?: string;
  contact?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
}

