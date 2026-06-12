export interface Integration {
  id: string;
  user_id: string;
  integration_type: 'email' | 'calendar' | 'messaging' | 'social' | 'voicemail' | 'tasks' | 'storage';
  provider: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  connected_at?: string;
  last_sync_at?: string;
  sync_error?: string;
  config?: Record<string, any>;
}

export interface TaskJugglerLink {
  urpa_user_id: string;
  taskjuggler_user_id?: string;
  sync_tasks: boolean;
  sync_projects: boolean;
  auto_create_tasks: boolean;
  urpa_originated: boolean;
  tj_originated: boolean;
}

export interface FibonaccoLink {
  urpa_user_id: string;
  fibonacco_business_id?: string;
  fibonacco_team_id?: string;
  crm_linked: boolean;
  publishing_linked: boolean;
}

