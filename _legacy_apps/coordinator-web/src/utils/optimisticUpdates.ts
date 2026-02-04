/**
 * Optimistic update utilities for better perceived performance
 */

export interface OptimisticUpdate<T> {
  id: string;
  data: T;
  timestamp: number;
  rollback: () => void;
}

class OptimisticUpdateManager {
  private updates = new Map<string, OptimisticUpdate<any>>();

  /**
   * Register an optimistic update
   */
  register<T>(id: string, data: T, rollback: () => void): void {
    this.updates.set(id, {
      id,
      data,
      timestamp: Date.now(),
      rollback,
    });
  }

  /**
   * Confirm an optimistic update (remove from tracking)
   */
  confirm(id: string): void {
    this.updates.delete(id);
  }

  /**
   * Rollback an optimistic update
   */
  rollback(id: string): void {
    const update = this.updates.get(id);
    if (update) {
      update.rollback();
      this.updates.delete(id);
    }
  }

  /**
   * Rollback all optimistic updates
   */
  rollbackAll(): void {
    this.updates.forEach((update) => {
      update.rollback();
    });
    this.updates.clear();
  }

  /**
   * Get an optimistic update
   */
  get<T>(id: string): OptimisticUpdate<T> | undefined {
    return this.updates.get(id);
  }

  /**
   * Check if an update exists
   */
  has(id: string): boolean {
    return this.updates.has(id);
  }

  /**
   * Clear all updates
   */
  clear(): void {
    this.updates.clear();
  }
}

export const optimisticUpdateManager = new OptimisticUpdateManager();

/**
 * Create an optimistic update helper
 */
export function createOptimisticUpdate<T>(
  id: string,
  optimisticData: T,
  rollback: () => void
): () => void {
  optimisticUpdateManager.register(id, optimisticData, rollback);
  
  // Return a function to confirm the update
  return () => {
    optimisticUpdateManager.confirm(id);
  };
}

/**
 * Handle async operation with optimistic update
 */
export async function withOptimisticUpdate<T, R>(
  id: string,
  optimisticData: T,
  rollback: () => void,
  asyncOperation: () => Promise<R>
): Promise<R> {
  const confirm = createOptimisticUpdate(id, optimisticData, rollback);

  try {
    const result = await asyncOperation();
    confirm();
    return result;
  } catch (error) {
    optimisticUpdateManager.rollback(id);
    throw error;
  }
}

