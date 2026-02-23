/**
 * Base Mock Service
 * Provides common utilities for localStorage-based mock services
 */

export abstract class BaseMockService {
  private readonly storagePrefix = 'elan:';
  protected readonly isClient = typeof window !== 'undefined';

  /**
   * Simulate network delay with realistic jitter
   */
  protected async delay(ms: number = 40): Promise<void> {
    const jitter = Math.random() * 30;
    await new Promise(resolve => setTimeout(resolve, ms + jitter));
  }

  /**
   * Retrieve data from localStorage
   */
  protected getFromStorage<T>(key: string): T[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const fullKey = `${this.storagePrefix}${key}`;
    const data = localStorage.getItem(fullKey);

    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data) as T[];
    } catch {
      return [];
    }
  }

  /**
   * Persist data to localStorage
   */
  protected setInStorage<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    const fullKey = `${this.storagePrefix}${key}`;
    localStorage.setItem(fullKey, JSON.stringify(data));
  }

  /**
   * Generate a UUID v4
   */
  protected generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback for environments without crypto.randomUUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Get current timestamp in ISO 8601 format
   */
  protected now(): string {
    return new Date().toISOString();
  }
}
