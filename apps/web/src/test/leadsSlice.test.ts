import { describe, it, expect } from 'vitest';
import leadsReducer, {
  setLeadsFilters,
  setLeadsPagination,
  clearLeadsError,
} from '../store/slices/leadsSlice';

describe('Leads Slice', () => {
  const initialState = {
    leads: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    filters: {
      status: [],
      source: [],
      assignedTo: null,
      search: '',
    },
  };

  describe('reducers', () => {
    it('should return the initial state', () => {
      const result = leadsReducer(undefined, { type: 'unknown' });
      expect(result.leads).toEqual([]);
      expect(result.loading).toBe(false);
      expect(result.pagination.page).toBe(1);
    });

    it('should handle setLeadsFilters', () => {
      const result = leadsReducer(initialState, setLeadsFilters({ status: ['new', 'contacted'] }));
      expect(result.filters.status).toEqual(['new', 'contacted']);
      expect(result.pagination.page).toBe(1);
    });

    it('should handle setLeadsFilters with search', () => {
      const result = leadsReducer(initialState, setLeadsFilters({ search: 'john' }));
      expect(result.filters.search).toBe('john');
    });

    it('should handle setLeadsPagination', () => {
      const result = leadsReducer(initialState, setLeadsPagination({ page: 2, limit: 20 }));
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(20);
    });

    it('should clear leads error', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const result = leadsReducer(stateWithError, clearLeadsError());
      expect(result.error).toBeNull();
    });
  });

  describe('initial state', () => {
    it('should have correct default values', () => {
      const result = leadsReducer(undefined, { type: 'unknown' });
      expect(result.pagination.limit).toBe(10);
      expect(result.filters.status).toEqual([]);
      expect(result.filters.source).toEqual([]);
      expect(result.filters.assignedTo).toBeNull();
    });
  });
});
