import { chromium, Browser, Page } from 'playwright'
import { injectAxe, getViolations } from '@axe-core/playwright'
import type { ScanJob, ScanResult, PageResult, Issue } from '../types/index.js'

export class Scanner {
  private browser: Browser | null = null
  private visitedUrls = new Set<string>()
  private maxPages: number
  private authConfig?: ScanJob['auth_config']

  constructor(job: ScanJob) {
    this.maxPages = job.max_pages || 50
    this.authConfig = job.auth_config
  }

  async scan(job: ScanJob): Promise<ScanResult> {
    try {
      this.browser = await chromium.launch({
        headless: true,
      })

      const context = await this.browser.newContext()

      // Apply authentication if configured
      if (this.authConfig) {
        await this.applyAuth(context)
      }

      const results: PageResult[] = []
      const urlsToScan = [job.url]
      this.visitedUrls.add(job.url)

      while (urlsToScan.length > 0 && results.length < this.maxPages) {
        const url = urlsToScan.shift()!
        const pageResult = await this.scanPage(context, url, job)
        results.push(pageResult)

        // Extract links for crawling
        if (results.length < this.maxPages) {
          const links = await this.extractLinks(context, url)
          for (const link of links) {
            if (!this.visitedUrls.has(link) && this.isSameDomain(link, job.url)) {
              this.visitedUrls.add(link)
              urlsToScan.push(link)
            }
          }
        }
      }

      await this.browser.close()

      return this.aggregateResults(job, results)
    } catch (error: any) {
      await this.browser?.close()
      throw error
    }
  }

  private async applyAuth(context: any): Promise<void> {
    if (!this.authConfig) return

    switch (this.authConfig.type) {
      case 'basic':
        if (this.authConfig.username && this.authConfig.password) {
          await context.setHTTPCredentials({
            username: this.authConfig.username,
            password: this.authConfig.password,
          })
        }
        break
      case 'cookie':
        if (this.authConfig.cookie_name && this.authConfig.cookie_value) {
          try {
            const urlObj = new URL(this.authConfig.cookie_value.includes('http') ? this.authConfig.cookie_value : `https://${this.authConfig.cookie_value}`)
            await context.addCookies([{
              name: this.authConfig.cookie_name,
              value: this.authConfig.cookie_value,
              domain: urlObj.hostname,
              path: '/',
            }])
          } catch {
            // Invalid URL, skip cookie auth
          }
        }
        break
      case 'header':
        // Headers are set per request
        break
    }
  }

  private async scanPage(context: any, url: string, job: ScanJob): Promise<PageResult> {
    const page = await context.newPage()

    try {
      // Set headers if configured
      if (this.authConfig?.type === 'header' && this.authConfig.header_name && this.authConfig.header_value) {
        await page.setExtraHTTPHeaders({
          [this.authConfig.header_name]: this.authConfig.header_value,
        })
      }

      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
      await injectAxe(page)

      // Accessibility testing
      const violations = await getViolations(page, null, {
        detailedReport: true,
      })

      const accessibilityIssues: Issue[] = violations.map((violation: any) => ({
        scan_id: job.scan_id,
        site_id: job.site_id,
        category: 'accessibility',
        severity: this.mapSeverity(violation.impact),
        title: violation.id,
        message: violation.description,
        page_url: url,
        selector: violation.nodes?.[0]?.target?.[0],
        html_context: violation.nodes?.[0]?.html,
        wcag_criteria: violation.tags?.filter((tag: string) => tag.startsWith('wcag')),
      }))

      // Performance testing (simplified - using Playwright metrics)
      const performanceMetrics = await page.evaluate(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        return {
          loadTime: perfData.loadEventEnd - perfData.fetchStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
        }
      })
      const performanceScore = Math.max(0, Math.min(100, Math.round(100 - (performanceMetrics.loadTime / 100))))

      // Security checks
      const securityIssues: Issue[] = []
      if (!url.startsWith('https://')) {
        securityIssues.push({
          scan_id: job.scan_id,
          site_id: job.site_id,
          category: 'security',
          severity: 'serious',
          title: 'HTTPS Not Enforced',
          message: 'Site is not using HTTPS',
          page_url: url,
        })
      }

      // SEO checks
      const seoIssues: Issue[] = []
      const title = await page.title()
      if (!title || title.length < 30 || title.length > 60) {
        seoIssues.push({
          scan_id: job.scan_id,
          site_id: job.site_id,
          category: 'seo',
          severity: 'moderate',
          title: 'Title Tag Issues',
          message: `Title tag is ${title.length} characters (recommended: 30-60)`,
          page_url: url,
        })
      }

      const metaDescription = await page.$eval('meta[name="description"]', (el: HTMLMetaElement) => el.getAttribute('content')).catch(() => null)
      if (!metaDescription) {
        seoIssues.push({
          scan_id: job.scan_id,
          site_id: job.site_id,
          category: 'seo',
          severity: 'minor',
          title: 'Missing Meta Description',
          message: 'Page is missing a meta description tag',
          page_url: url,
        })
      }

      // Calculate SEO score
      const seoChecks = {
        hasTitle: !!title,
        titleLength: title?.length || 0,
        hasMetaDescription: !!metaDescription,
        hasH1: (await page.$('h1')) !== null,
        hasH2: (await page.$('h2')) !== null,
        hasAltImages: (await page.$$eval('img[alt]', (imgs: NodeListOf<HTMLImageElement>) => Array.from(imgs).length)) > 0,
      }
      const seoScore = Math.round(
        (seoChecks.hasTitle && seoChecks.titleLength >= 30 && seoChecks.titleLength <= 60 ? 20 : 0) +
        (seoChecks.hasMetaDescription ? 20 : 0) +
        (seoChecks.hasH1 ? 20 : 0) +
        (seoChecks.hasH2 ? 20 : 0) +
        (seoChecks.hasAltImages ? 20 : 0)
      )

      const bestPracticeScore = 85 // Default score, can be enhanced

      // Functionality checks
      const functionalityIssues: Issue[] = []
      const brokenLinks = await this.checkBrokenLinks(page, url)
      functionalityIssues.push(...brokenLinks.map(link => ({
        scan_id: job.scan_id,
        site_id: job.site_id,
        category: 'functionality',
        severity: 'serious',
        title: 'Broken Link',
        message: `Link returns ${link.status}`,
        page_url: url,
        selector: link.selector,
      })))

      await page.close()

      return {
        url,
        accessibility_score: Math.max(0, 100 - (accessibilityIssues.length * 10)),
        seo_score: seoScore,
        performance_score: performanceScore,
        security_score: securityIssues.length === 0 ? 100 : 50,
        functionality_score: functionalityIssues.length === 0 ? 100 : Math.max(0, 100 - (functionalityIssues.length * 20)),
        best_practice_score: bestPracticeScore,
        issues: [
          ...accessibilityIssues,
          ...seoIssues,
          ...securityIssues,
          ...functionalityIssues,
        ],
      }
    } catch (error: any) {
      await page.close()
      throw error
    }
  }

  private async extractLinks(context: any, url: string): Promise<string[]> {
    const page = await context.newPage()
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 })
      const links = await page.$$eval('a[href]', (anchors: NodeListOf<HTMLAnchorElement>) =>
        Array.from(anchors).map((a) => a.href)
      )
      await page.close()
      return links.filter(link => link.startsWith('http'))
    } catch {
      await page.close()
      return []
    }
  }

  private async checkBrokenLinks(page: Page, baseUrl: string): Promise<Array<{ selector: string; status: number }>> {
    const links = await page.$$eval('a[href]', (anchors: NodeListOf<HTMLAnchorElement>) =>
      Array.from(anchors).slice(0, 10).map((a) => ({
        href: a.href,
      }))
    )

    const broken: Array<{ selector: string; status: number }> = []

    for (const link of links) {
      try {
        const response = await page.goto(link.href, { waitUntil: 'networkidle', timeout: 5000 })
        if (response && response.status() >= 400) {
          broken.push({
            selector: `a[href="${link.href}"]`,
            status: response.status(),
          })
        }
      } catch {
        broken.push({
          selector: `a[href="${link.href}"]`,
          status: 0,
        })
      }
    }

    return broken
  }

  private mapSeverity(impact: string): 'critical' | 'serious' | 'moderate' | 'minor' {
    switch (impact) {
      case 'critical': return 'critical'
      case 'serious': return 'serious'
      case 'moderate': return 'moderate'
      default: return 'minor'
    }
  }

  private isSameDomain(url1: string, url2: string): boolean {
    try {
      return new URL(url1).hostname === new URL(url2).hostname
    } catch {
      return false
    }
  }

  private aggregateResults(job: ScanJob, results: PageResult[]): ScanResult {
    const allIssues: Issue[] = results.flatMap(r => r.issues)

    const avgAccessibility = results.reduce((sum, r) => sum + r.accessibility_score, 0) / results.length
    const avgSeo = results.reduce((sum, r) => sum + r.seo_score, 0) / results.length
    const avgPerformance = results.reduce((sum, r) => sum + r.performance_score, 0) / results.length
    const avgSecurity = results.reduce((sum, r) => sum + r.security_score, 0) / results.length
    const avgFunctionality = results.reduce((sum, r) => sum + r.functionality_score, 0) / results.length
    const avgBestPractice = results.reduce((sum, r) => sum + r.best_practice_score, 0) / results.length

    const overallScore = Math.round(
      (avgAccessibility + avgSeo + avgPerformance + avgSecurity + avgFunctionality + avgBestPractice) / 6
    )

    return {
      scan_id: job.scan_id,
      pages_scanned: results.length,
      total_pages: results.length,
      health_score: overallScore,
      category_scores: {
        accessibility: Math.round(avgAccessibility),
        seo: Math.round(avgSeo),
        performance: Math.round(avgPerformance),
        security: Math.round(avgSecurity),
        functionality: Math.round(avgFunctionality),
        'best-practice': Math.round(avgBestPractice),
      },
      issues: allIssues,
    }
  }
}
