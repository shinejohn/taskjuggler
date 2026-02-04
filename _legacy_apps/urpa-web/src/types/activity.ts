export type ActivityType = 'email' | 'text' | 'task' | 'calendar' | 'social' | 'voicemail';

export interface ActivityItem {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  type: ActivityType; // Alias for activity_type
  source: string;
  title: string;
  description?: string;
  time?: string;
  status?: 'pending' | 'completed' | 'urgent' | 'archived';
  activity_timestamp?: string;
  is_read?: boolean;
  is_starred?: boolean;
  contact_id?: string;
  external_id?: string;
  raw_content?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityTypeConfig {
  type: ActivityType;
  label: string;
  icon: string; // Component name
  colorDark: string;
  colorLight: string;
  bgColorDark: string;
  bgColorLight: string;
}

