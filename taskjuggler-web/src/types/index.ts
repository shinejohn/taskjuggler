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
