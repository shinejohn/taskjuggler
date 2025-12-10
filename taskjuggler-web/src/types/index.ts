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

export interface RoutingRule {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  priority: number;
  is_active: boolean;
  conditions: RuleConditions;
  actions: RuleActions;
  times_matched: number;
}

export interface RuleConditions {
  match_type: 'all' | 'any';
  rules: RuleCondition[];
}

export interface RuleCondition {
  field: string;
  operator: string;
  value: any;
}

export interface RuleActions {
  create_task: boolean;
  assignee_type: 'self' | 'team_member' | 'marketplace_human' | 'marketplace_ai';
  assignee_id?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  notifications: RuleNotification[];
  auto_response?: string;
  tags: string[];
}

export interface RuleNotification {
  type: 'immediate' | 'digest';
  recipient: 'owner' | 'assignee';
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
  routingRule?: RoutingRule;
}

export interface TeamMember {
  id: string;
  owner_id: string;
  user_id?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  can_receive_tasks: boolean;
  notification_preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
  user?: User;
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

export interface MarketplaceListing {
  id: string;
  requestor_id: string;
  task_id?: string;
  title: string;
  description?: string;
  category: string;
  location_required: boolean;
  location?: any;
  location_radius_miles?: number;
  budget_type: 'fixed' | 'hourly' | 'quote';
  budget_min?: number;
  budget_max?: number;
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  assigned_vendor_id?: string;
  assigned_at?: string;
  needed_by?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  requestor?: User;
  task?: Task;
  assignedVendor?: MarketplaceVendor;
  bids?: MarketplaceBid[];
}

export interface MarketplaceBid {
  id: string;
  listing_id: string;
  vendor_id: string;
  amount: number;
  message?: string;
  estimated_completion?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  vendor?: MarketplaceVendor;
}

export interface MarketplaceVendor {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  vendor_type: 'human' | 'ai_tool';
  category?: string;
  is_active: boolean;
  rating?: number;
  total_jobs?: number;
  created_at: string;
  updated_at: string;
  ai_tool_config?: AiToolConfig;
}

export interface AiToolConfig {
  id: string;
  vendor_id: string;
  tool_name: string;
  tool_description?: string;
  api_endpoint: string;
  api_key?: string;
  parameters?: Record<string, any>;
  can_auto_execute: boolean;
  created_at: string;
  updated_at: string;
}
