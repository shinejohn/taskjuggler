export interface ScanJob {
  scan_id: number
  site_id: number
  url: string
  auth_config?: {
    type: 'none' | 'basic' | 'cookie' | 'header'
    username?: string
    password?: string
    cookie_name?: string
    cookie_value?: string
    header_name?: string
    header_value?: string
  }
  max_pages?: number
}

export interface ScanResult {
  scan_id: number
  pages_scanned: number
  total_pages: number
  health_score: number
  category_scores: {
    accessibility: number
    seo: number
    performance: number
    security: number
    functionality: number
    'best-practice': number
  }
  issues: Issue[]
  error?: string
}

export interface Issue {
  scan_id: number
  site_id: number
  category: 'accessibility' | 'seo' | 'performance' | 'security' | 'functionality' | 'best-practice'
  severity: 'critical' | 'serious' | 'moderate' | 'minor'
  title: string
  message: string
  page_url: string
  selector?: string
  html_context?: string
  wcag_criteria?: string[]
  screenshot_url?: string
}

export interface PageResult {
  url: string
  accessibility_score: number
  seo_score: number
  performance_score: number
  security_score: number
  functionality_score: number
  best_practice_score: number
  issues: Issue[]
}
