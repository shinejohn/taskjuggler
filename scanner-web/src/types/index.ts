// SiteHealth Scanner TypeScript Types

export type IssueSeverity = 'critical' | 'serious' | 'moderate' | 'minor'
export type IssueCategory = 'accessibility' | 'seo' | 'performance' | 'security' | 'functionality' | 'best-practice'
export type IssueStatus = 'open' | 'ignored' | 'fixed' | 'resolved'
export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed'
export type AuthType = 'none' | 'basic' | 'cookie' | 'header'

export interface Site {
  id: number
  name: string
  url: string
  auth_type: AuthType
  auth_config?: AuthConfig
  max_pages?: number
  checks?: string[]
  created_at: string
  updated_at: string
  last_scan_at?: string
  health_score?: number
  issue_count?: number
}

export interface AuthConfig {
  type: AuthType
  username?: string
  password?: string
  cookie_name?: string
  cookie_value?: string
  header_name?: string
  header_value?: string
}

export interface Scan {
  id: number
  site_id: number
  status: ScanStatus
  started_at: string
  completed_at?: string
  pages_scanned: number
  total_pages?: number
  health_score: number
  category_scores: CategoryScores
  issue_count: number
  error?: string
  created_at: string
  updated_at: string
  site?: Site
  issues?: Issue[]
}

export interface CategoryScores {
  accessibility: number
  seo: number
  performance: number
  security: number
  functionality: number
  'best-practice': number
}

export interface Issue {
  id: number
  scan_id: number
  site_id: number
  category: IssueCategory
  severity: IssueSeverity
  status: IssueStatus
  title: string
  message: string
  page_url: string
  selector?: string
  html_context?: string
  wcag_criteria?: string[]
  fix_code?: string
  fix_explanation?: string
  fix_confidence?: number
  screenshot_url?: string
  created_at: string
  updated_at: string
  scan?: Scan
  site?: Site
}

export interface ScheduledScan {
  id: number
  site_id: number
  frequency: 'daily' | 'weekly' | 'monthly'
  day_of_week?: number
  day_of_month?: number
  time: string
  enabled: boolean
  created_at: string
  updated_at: string
  site?: Site
}

export interface DashboardStats {
  total_sites: number
  total_scans: number
  total_issues: number
  average_health_score: number
  sites_needing_attention: number
  recent_scans: Scan[]
  sites: Site[]
}

export interface CreateSiteRequest {
  name: string
  url: string
  auth_type?: AuthType
  auth_config?: AuthConfig
  max_pages?: number
  checks?: string[]
}

export interface UpdateSiteRequest {
  name?: string
  url?: string
  auth_type?: AuthType
  auth_config?: AuthConfig
  max_pages?: number
  checks?: string[]
}

export interface CreateScanRequest {
  site_id: number
  max_pages?: number
  checks?: string[]
}

export interface UpdateIssueRequest {
  status?: IssueStatus
}

export interface BulkUpdateIssuesRequest {
  issue_ids: number[]
  status: IssueStatus
}

export interface GenerateFixRequest {
  issue_id: number
}

export interface GenerateFixResponse {
  fix_code: string
  explanation: string
  confidence: number
}

export interface User {
  id: number
  name: string
  email: string
  plan?: string
}
