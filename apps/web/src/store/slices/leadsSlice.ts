import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Negotiation' | 'Converted' | 'Not Interested' | 'Lost';
export type LeadSource = 'Website' | 'Referral' | 'Showroom' | 'Phone';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  source: LeadSource;
  status: LeadStatus;
  assignedTo: string;
  assignedToName: string;
  vehicleInterest?: string;
  budget?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'note' | 'status_change';
  description: string;
  createdAt: string;
  createdBy: string;
}

interface LeadsState {
  leads: Lead[];
  activities: Activity[];
  selectedLead: Lead | null;
  filters: {
    search: string;
    status: LeadStatus | 'All';
    dateRange: { start: string; end: string } | null;
  };
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1 (555) 123-4567',
    email: 'john.smith@email.com',
    address: '123 Main St, Springfield, IL 62701',
    source: 'Website',
    status: 'New',
    assignedTo: '1',
    assignedToName: 'Sarah Johnson',
    vehicleInterest: '2024 Honda Accord',
    budget: 35000,
    notes: 'Interested in hybrid model',
    createdAt: '2026-05-01T10:30:00Z',
    updatedAt: '2026-05-01T10:30:00Z',
  },
  {
    id: '2',
    name: 'Emily Davis',
    phone: '+1 (555) 234-5678',
    email: 'emily.davis@email.com',
    source: 'Referral',
    status: 'Contacted',
    assignedTo: '2',
    assignedToName: 'Mike Chen',
    vehicleInterest: '2024 Toyota RAV4',
    budget: 42000,
    createdAt: '2026-04-30T14:20:00Z',
    updatedAt: '2026-05-01T09:15:00Z',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    phone: '+1 (555) 345-6789',
    email: 'robert.j@email.com',
    source: 'Showroom',
    status: 'Qualified',
    assignedTo: '1',
    assignedToName: 'Sarah Johnson',
    vehicleInterest: '2024 Ford F-150',
    budget: 55000,
    createdAt: '2026-04-28T11:00:00Z',
    updatedAt: '2026-05-01T16:45:00Z',
  },
  {
    id: '4',
    name: 'Lisa Martinez',
    phone: '+1 (555) 456-7890',
    email: 'lisa.m@email.com',
    source: 'Phone',
    status: 'Negotiation',
    assignedTo: '2',
    assignedToName: 'Mike Chen',
    vehicleInterest: '2024 Chevrolet Equinox',
    budget: 38000,
    createdAt: '2026-04-25T09:30:00Z',
    updatedAt: '2026-05-02T08:20:00Z',
  },
  {
    id: '5',
    name: 'David Williams',
    phone: '+1 (555) 567-8901',
    email: 'david.w@email.com',
    source: 'Website',
    status: 'Converted',
    assignedTo: '1',
    assignedToName: 'Sarah Johnson',
    vehicleInterest: '2024 Mazda CX-5',
    budget: 33000,
    createdAt: '2026-04-20T13:15:00Z',
    updatedAt: '2026-04-28T10:00:00Z',
  },
];

const initialState: LeadsState = {
  leads: mockLeads,
  activities: [],
  selectedLead: null,
  filters: {
    search: '',
    status: 'All',
    dateRange: null,
  },
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeads: (state, action: PayloadAction<Lead[]>) => {
      state.leads = action.payload;
    },
    addLead: (state, action: PayloadAction<Lead>) => {
      state.leads.unshift(action.payload);
    },
    updateLead: (state, action: PayloadAction<Lead>) => {
      const index = state.leads.findIndex(lead => lead.id === action.payload.id);
      if (index !== -1) {
        state.leads[index] = action.payload;
      }
      if (state.selectedLead?.id === action.payload.id) {
        state.selectedLead = action.payload;
      }
    },
    deleteLead: (state, action: PayloadAction<string>) => {
      state.leads = state.leads.filter(lead => lead.id !== action.payload);
      if (state.selectedLead?.id === action.payload) {
        state.selectedLead = null;
      }
    },
    setSelectedLead: (state, action: PayloadAction<Lead | null>) => {
      state.selectedLead = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<LeadsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.activities.push(action.payload);
    },
  },
});

export const { setLeads, addLead, updateLead, deleteLead, setSelectedLead, setFilters, addActivity } = leadsSlice.actions;
export default leadsSlice.reducer;
