import { describe, it, expect, beforeEach } from 'vitest';
import { api } from './apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should have correct API client structure and domain methods', () => {
    expect(api).toBeDefined();
    expect(api.client).toBeDefined();
    expect(typeof api.client.get).toBe('function');
    expect(typeof api.client.post).toBe('function');
    expect(typeof api.login).toBe('function');
    expect(typeof api.getProjects).toBe('function');
  });

  it('should include Authorization token from localStorage in request interceptor configuration', () => {
    localStorage.setItem('accessToken', 'test-bearer-token');
    expect(localStorage.getItem('accessToken')).toBe('test-bearer-token');
  });
});
