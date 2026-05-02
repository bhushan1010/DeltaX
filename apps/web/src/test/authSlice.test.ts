import { describe, it, expect, beforeEach, vi } from 'vitest';
import authReducer, {
  setUser,
  setAccessToken,
  setRefreshToken,
  clearAuthError,
  User,
} from '../store/slices/authSlice';

describe('Auth Slice', () => {
  const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('reducers', () => {
    it('should return the initial state', () => {
      const result = authReducer(undefined, { type: 'unknown' });
      expect(result.user).toBeNull();
      expect(result.accessToken).toBeNull();
      expect(result.loading).toBe(false);
    });

    it('should handle setUser', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'sales_agent',
        is_active: true,
      };
      const result = authReducer(initialState, setUser(user));
      expect(result.user).toEqual(user);
    });

    it('should handle setAccessToken', () => {
      const token = 'test-token';
      const result = authReducer(initialState, setAccessToken(token));
      expect(result.accessToken).toBe(token);
    });

    it('should handle setRefreshToken', () => {
      const token = 'refresh-token';
      const result = authReducer(initialState, setRefreshToken(token));
      expect(result.refreshToken).toBe(token);
    });

    it('should clear auth error', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const result = authReducer(stateWithError, clearAuthError());
      expect(result.error).toBeNull();
    });
  });

  });