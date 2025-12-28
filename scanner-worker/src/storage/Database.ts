import { Pool } from 'pg'
import type { ScanResult, Issue } from '../types/index.js'

export class Database {
  private pool: Pool

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_DATABASE,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    })
  }

  async updateScanStatus(
    scanId: number,
    status: 'pending' | 'running' | 'completed' | 'failed',
    data?: {
      pages_scanned?: number
      total_pages?: number
      health_score?: number
      category_scores?: any
      issue_count?: number
      error?: string
    }
  ): Promise<void> {
    const updates: string[] = ['status = $1']
    const values: any[] = [status]
    let paramIndex = 2

    if (data?.pages_scanned !== undefined) {
      updates.push(`pages_scanned = $${paramIndex++}`)
      values.push(data.pages_scanned)
    }

    if (data?.total_pages !== undefined) {
      updates.push(`total_pages = $${paramIndex++}`)
      values.push(data.total_pages)
    }

    if (data?.health_score !== undefined) {
      updates.push(`health_score = $${paramIndex++}`)
      values.push(data.health_score)
    }

    if (data?.category_scores) {
      updates.push(`category_scores = $${paramIndex++}`)
      values.push(JSON.stringify(data.category_scores))
    }

    if (data?.issue_count !== undefined) {
      updates.push(`issue_count = $${paramIndex++}`)
      values.push(data.issue_count)
    }

    if (data?.error !== undefined) {
      updates.push(`error = $${paramIndex++}`)
      values.push(data.error)
    }

    if (status === 'completed') {
      updates.push(`completed_at = NOW()`)
    }

    values.push(scanId)

    await this.pool.query(
      `UPDATE scans SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex}`,
      values
    )
  }

  async saveScanResult(result: ScanResult): Promise<void> {
    // Scan result is saved via updateScanStatus
    // This method can be extended for additional data
  }

  async saveIssues(issues: Issue[]): Promise<void> {
    if (issues.length === 0) return

    const values: any[] = []
    const placeholders: string[] = []
    let paramIndex = 1

    for (const issue of issues) {
      placeholders.push(
        `($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`
      )
      values.push(
        issue.scan_id,
        issue.site_id,
        issue.category,
        issue.severity,
        issue.title,
        issue.message,
        issue.page_url,
        issue.selector || null,
        issue.html_context || null,
        issue.wcag_criteria ? JSON.stringify(issue.wcag_criteria) : null,
        issue.screenshot_url || null,
      )
    }

    await this.pool.query(
      `INSERT INTO issues (scan_id, site_id, category, severity, title, message, page_url, selector, html_context, wcag_criteria, screenshot_url, status, created_at, updated_at)
       VALUES ${placeholders.join(', ')}, 'open', NOW(), NOW()`,
      values
    )
  }
}
