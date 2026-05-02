import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Define the type for our lead
export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  priority: number;
  interested_car_model?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  preferred_contact_time?: string | null;
  financing_needed: boolean;
  trade_in_vehicle?: string | null;
  assigned_to?: {
    id: string;
    full_name: string;
    email: string;
  } | null;
  assigned_at?: string | null;
  lead_score: number;
  tags: string[];
  notes?: string | null;
  first_contacted_at?: string | null;
  last_contacted_at?: string | null;
  converted_at?: string | null;
  expected_close_date?: string | null;
  created_at: string;
  updated_at: string;
}

// Define the initial state
interface LeadsState {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    status: string[];
    source: string[];
    assignedTo: string | null;
    search: string;
  };
}

const initialState: LeadsState = {
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

// Async thunks
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (
    { page, limit, status, source, assignedTo, search, sortBy, sortOrder }: {
      page?: number;
      limit?: number;
      status?: string[];
      source?: string[];
      assignedTo?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      if (status && status.length > 0) status.forEach(s => params.append('status', s));
      if (source && source.length > 0) source.forEach(s => params.append('source', s));
      if (assignedTo) params.append('assignedTo', assignedTo);
      if (search) params.append('search', search);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/v1/leads?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      const data = await response.json();
      // Assuming the API returns { leads: [], total: number }
      return { leads: data.leads, total: data.total };
    } catch (err: any) {
      return rejectWithValue(err.message || 'An error occurred');
    }
  }
);

export const createLead = createAsyncThunk(
  'leads/createLead',
  async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      if (!response.ok) {
        throw new Error('Failed to create lead');
      }
      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message || 'An error occurred');
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ id, leadData }: { id: string; leadData: Partial<Lead> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      if (!response.ok) {
        throw new Error('Failed to update lead');
      }
      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message || 'An error occurred');
    }
  }
);

export const deleteLead = createAsyncThunk(
  'leads/deleteLead',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/leads/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete lead');
      }
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'An error occurred');
    }
  }
);

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeadsFilters: (state, action: PayloadAction<Partial<LeadsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset pagination when filters change
      state.pagination.page = 1;
    },
    setLeadsPagination: (state, action: PayloadAction<Partial<LeadsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearLeadsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchLeads
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.leads;
        state.pagination.total = action.payload.total;
        state.pagination.totalPages = Math.ceil(action.payload.total / state.pagination.limit);
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createLead
      .addCase(createLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.loading = false;
        state.leads.unshift(action.payload);
        // Update total count
        state.pagination.total += 1;
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
      })
      .addCase(createLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateLead
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.leads.findIndex(lead => lead.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // deleteLead
      .addCase(deleteLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = state.leads.filter(lead => lead.id !== action.payload);
        // Update total count
        state.pagination.total -= 1;
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLeadsFilters, setLeadsPagination, clearLeadsError } = leadsSlice.actions;

export const selectLeads = (state: RootState) => state.leads.leads;
export const selectLeadsLoading = (state: RootState) => state.leads.loading;
export const selectLeadsError = (state: RootState) => state.leads.error;
export const selectLeadsPagination = (state: RootState) => state.leads.pagination;
export const selectLeadsFilters = (state: RootState) => state.leads.filters;

export default leadsSlice.reducer;