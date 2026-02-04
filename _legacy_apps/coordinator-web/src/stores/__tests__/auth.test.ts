import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../auth';
import api from '@/utils/api';

vi.mock('@/utils/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('AuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('should initialize with token from localStorage', () => {
    localStorage.setItem('coordinator_token', 'test-token');
    const store = useAuthStore();
    expect(store.token).toBe('test-token');
  });

  it('should login successfully', async () => {
    const mockResponse = {
      data: {
        token: 'new-token',
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
      },
    };

    vi.mocked(api.post).mockResolvedValue(mockResponse);

    const store = useAuthStore();
    const result = await store.login('test@example.com', 'password');

    expect(store.token).toBe('new-token');
    expect(store.user).toEqual(mockResponse.data.user);
    expect(localStorage.getItem('coordinator_token')).toBe('new-token');
    expect(result).toEqual(mockResponse.data);
  });

  it('should logout successfully', async () => {
    localStorage.setItem('coordinator_token', 'test-token');
    const store = useAuthStore();
    store.user = { id: '1', name: 'Test', email: 'test@example.com' };
    store.token = 'test-token';

    await store.logout();

    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(localStorage.getItem('coordinator_token')).toBeNull();
  });

  it('should compute isAuthenticated correctly', () => {
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);

    store.token = 'test-token';
    store.user = { id: '1', name: 'Test', email: 'test@example.com' };
    expect(store.isAuthenticated).toBe(true);
  });
});

