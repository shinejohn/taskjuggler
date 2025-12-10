export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  timezone: string;
  plan: 'free' | 'starter' | 'pro' | 'business';
  settings: Record<string, any>;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  requestor_id: string;
  owner_id?: string;
  team_member_id?: string;
  marketplace_vendor_id?: string;
  source_type?: 'phone' | 'email' | 'sms' | 'web' | 'api';
  extracted_data?: ExtractedData;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  location_address?: string;
  due_date?: string;
  completed_at?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  requestor?: User;
  owner?: User;
}

export interface ExtractedData {
  summary: string;
  category: string;
  keywords: string[];
  sentiment: string;
  contact: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export interface InboxItem {
  id: string;
  user_id: string;
  source_type: 'phone' | 'email' | 'sms';
  source_id?: string;
  channel_id?: string;
  from_identifier: string;
  from_name?: string;
  subject?: string;
  body: string;
  attachments?: any[];
  extracted_data?: any;
  processing_status?: string;
  processing_error?: string;
  routed_to_task_id?: string;
  routing_rule_id?: string;
  auto_response_sent: boolean;
  auto_response_text?: string;
  status: 'unprocessed' | 'processing' | 'processed' | 'failed' | 'dismissed';
  received_at: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  channel?: Channel;
  task?: Task;
}

export interface Channel {
  id: string;
  user_id: string;
  channel_type: 'phone' | 'email' | 'sms';
  phone_number?: string;
  twilio_sid?: string;
  email_address?: string;
  is_active: boolean;
  greeting_message?: string;
  voicemail_greeting?: string;
  created_at: string;
  updated_at: string;
}
