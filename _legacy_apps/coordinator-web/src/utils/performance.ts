/**
 * Performance monitoring and metrics utilities
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

export interface ApiCallMetric {
  url: string;
  method: string;
  duration: number;
  status: number | null;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private apiCalls: ApiCallMetric[] = [];
  private readonly MAX_METRICS = 1000;
  private readonly MAX_API_CALLS = 500;

  /**
   * Record a performance metric
   */
  recordMetric(name: string, value: number, unit: string = 'ms'): void {
    this.metrics.push({
      name,
      value,
      unit,
      timestamp: Date.now(),
    });

    // Keep only recent metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift();
    }
  }

  /**
   * Record an API call
   */
  recordApiCall(url: string, method: string, duration: number, status: number | null): void {
    this.apiCalls.push({
      url,
      method,
      duration,
      status,
      timestamp: Date.now(),
    });

    // Keep only recent API calls
    if (this.apiCalls.length > this.MAX_API_CALLS) {
      this.apiCalls.shift();
    }
  }

  /**
   * Get metrics by name
   */
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter((m) => m.name === name);
    }
    return [...this.metrics];
  }

  /**
   * Get API call metrics
   */
  getApiCalls(url?: string): ApiCallMetric[] {
    if (url) {
      return this.apiCalls.filter((call) => call.url.includes(url));
    }
    return [...this.apiCalls];
  }

  /**
   * Get average API call duration
   */
  getAverageApiDuration(url?: string): number {
    const calls = url ? this.getApiCalls(url) : this.apiCalls;
    if (calls.length === 0) return 0;
    
    const total = calls.reduce((sum, call) => sum + call.duration, 0);
    return total / calls.length;
  }

  /**
   * Get slowest API calls
   */
  getSlowestApiCalls(limit: number = 10): ApiCallMetric[] {
    return [...this.apiCalls]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Get API call error rate
   */
  getApiErrorRate(url?: string): number {
    const calls = url ? this.getApiCalls(url) : this.apiCalls;
    if (calls.length === 0) return 0;

    const errors = calls.filter((call) => call.status === null || call.status >= 400).length;
    return errors / calls.length;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.apiCalls = [];
  }

  /**
   * Export metrics for analysis
   */
  export(): {
    metrics: PerformanceMetric[];
    apiCalls: ApiCallMetric[];
    summary: {
      totalMetrics: number;
      totalApiCalls: number;
      averageApiDuration: number;
      errorRate: number;
    };
  } {
    return {
      metrics: [...this.metrics],
      apiCalls: [...this.apiCalls],
      summary: {
        totalMetrics: this.metrics.length,
        totalApiCalls: this.apiCalls.length,
        averageApiDuration: this.getAverageApiDuration(),
        errorRate: this.getApiErrorRate(),
      },
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * Measure function execution time
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now();
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const duration = performance.now() - start;
      performanceMonitor.recordMetric(name, duration);
    });
  }

  const duration = performance.now() - start;
  performanceMonitor.recordMetric(name, duration);
  return result;
}

/**
 * Track API call performance
 */
export function trackApiCall(
  url: string,
  method: string,
  startTime: number,
  status: number | null
): void {
  const duration = performance.now() - startTime;
  performanceMonitor.recordApiCall(url, method, duration, status);
}

/**
 * Get Web Vitals metrics
 */
export function trackWebVitals(): void {
  if (typeof window === 'undefined') return;

  // Track Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          performanceMonitor.recordMetric('LCP', lastEntry.renderTime || lastEntry.loadTime, 'ms');
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // PerformanceObserver not supported
    }

    // Track First Input Delay (FID)
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          performanceMonitor.recordMetric('FID', entry.processingStart - entry.startTime, 'ms');
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // PerformanceObserver not supported
    }

    // Track Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        performanceMonitor.recordMetric('CLS', clsValue, 'score');
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // PerformanceObserver not supported
    }
  }
}

