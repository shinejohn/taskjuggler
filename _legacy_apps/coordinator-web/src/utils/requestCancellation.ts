/**
 * Request cancellation utilities for managing stale requests
 */

import type { AxiosRequestConfig, Canceler } from 'axios';
import axios from 'axios';

interface PendingRequest {
  cancel: Canceler;
  timestamp: number;
}

class RequestCancellationManager {
  private pendingRequests = new Map<string, PendingRequest>();
  private readonly REQUEST_TIMEOUT = 30000; // 30 seconds


  /**
   * Cancel a specific request by key
   */
  cancelRequest(key: string): boolean {
    const request = this.pendingRequests.get(key);
    if (request) {
      request.cancel('Request cancelled');
      this.pendingRequests.delete(key);
      return true;
    }
    return false;
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    this.pendingRequests.forEach((request) => {
      request.cancel('All requests cancelled');
    });
    this.pendingRequests.clear();
  }

  /**
   * Cancel stale requests (older than timeout)
   */
  cancelStaleRequests(): void {
    const now = Date.now();
    const staleKeys: string[] = [];

    this.pendingRequests.forEach((request, key) => {
      if (now - request.timestamp > this.REQUEST_TIMEOUT) {
        staleKeys.push(key);
        request.cancel('Request timeout');
      }
    });

    staleKeys.forEach((key) => {
      this.pendingRequests.delete(key);
    });
  }

  /**
   * Add a request to tracking
   */
  addRequest(key: string, cancel: Canceler): void {
    // Cancel any existing request with the same key
    this.cancelRequest(key);

    this.pendingRequests.set(key, {
      cancel,
      timestamp: Date.now(),
    });
  }

  /**
   * Remove a request from tracking (when completed)
   */
  removeRequest(key: string): void {
    this.pendingRequests.delete(key);
  }

  /**
   * Get count of pending requests
   */
  getPendingCount(): number {
    return this.pendingRequests.size;
  }
}

export const requestCancellationManager = new RequestCancellationManager();

/**
 * Create an axios cancel token and track the request
 */
export function createCancelToken(config: AxiosRequestConfig): {
  cancelToken: any;
  cancelKey: string;
} {
  const cancelKey = `${config.method?.toUpperCase() || 'GET'}:${config.url}:${config.params ? JSON.stringify(config.params) : ''}`;
  
  const cancelToken = new axios.CancelToken((cancel) => {
    requestCancellationManager.addRequest(cancelKey, cancel);
  });

  return { cancelToken, cancelKey };
}

/**
 * Setup automatic cleanup of stale requests
 */
let staleCleanupInterval: ReturnType<typeof setInterval> | null = null;

export function startStaleRequestCleanup(intervalMs: number = 5000): void {
  if (staleCleanupInterval) {
    return;
  }

  staleCleanupInterval = setInterval(() => {
    requestCancellationManager.cancelStaleRequests();
  }, intervalMs);
}

export function stopStaleRequestCleanup(): void {
  if (staleCleanupInterval) {
    clearInterval(staleCleanupInterval);
    staleCleanupInterval = null;
  }
}

