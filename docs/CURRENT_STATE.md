# Current State - LeadFlow Pro Frontend

## Project Structure
```
apps/web/src/
├── main.tsx              # React entry point
├── App.tsx              # Main app with routing (BrowserRouter)
├── theme.ts             # MUI theme (blue #0066CC primary)
├── style.css            # Empty/inline styles
├── pages/
│   ├── Login.tsx        # Login page
│   ├── Register.tsx    # Registration page
│   ├── Dashboard.tsx   # Dashboard (main container)
│   ├── LeadListing.tsx # Leads table with filters
│   ├── LeadDetails.tsx # Single lead view
│   ├── LeadManagement.tsx # Kanban + Team view
│   └── AutomationBuilder.tsx
├── store/
│   ├── index.ts        # Redux store config
│   └── slices/
│       ├── authSlice.ts
│       └── leadsSlice.ts
├── services/
│   ├── api.ts         # Axios instance
│   └── socket.ts      # Socket.io client
└── test/              # Vitest tests (19 passing)
```

## Routes
- `/login` → Login page
- `/register` → Registration page
- `/` → Redirects to `/dashboard` if logged in, else `/login`
- `/dashboard` → Dashboard (parent route)
  - `/dashboard/leads/:id` → LeadDetails
  - `/dashboard/lead-management` → LeadManagement (Kanban)
  - `/dashboard/automation-builder` → AutomationBuilder

## Current Tech Stack
- **UI Framework**: MUI v9 (Material UI)
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Charts**: Recharts
- **Real-time**: Socket.io-client
- **Testing**: Vitest (19 tests passing)

## Visual Assessment

### Working Well
- ✅ Basic navigation works
- ✅ Auth flow works (login/register/logout)
- ✅ Leads table renders with mock data
- ✅ Kanban columns render
- ✅ Basic theme with consistent colors

### Weak Areas
- ❌ Plain blue AppBar only (no sidebar)
- ❌ No responsive layout shell
- ❌ No dark mode support
- ❌ Placeholder charts (no Recharts integration)
- ❌ Flat activity feed (just colored circles)
- ❌ No loading skeletons
- ❌ No empty states with illustrations
- ❌ No micro-animations
- ❌ No keyboard shortcuts
- ❌ No toast notifications
- ❌ No global search
- ❌ Kanban is static (no drag-and-drop)
- ❌ No user avatar dropdown menu
- ❌ No breadcrumbs

## Data Shapes

### User (from authSlice)
```typescript
{
  id: string;
  email: string;
  full_name: string;
  role: 'sales_agent' | 'business_manager' | 'admin';
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
}
```

### Lead (from leadsSlice)
```typescript
{
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'negotiation' | 'converted' | 'not_interested' | 'lost';
  priority: number; // 1-5
  interested_car_model?: string;
  budget_min?: number;
  budget_max?: number;
  financing_needed: boolean;
  trade_in_vehicle?: string;
  assigned_to?: { id: string; full_name: string; email: string } | null;
  lead_score: number; // 0-100
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

### LeadsState
```typescript
{
  leads: Lead[];
  loading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  filters: { status: string[]; source: string[]; assignedTo: string | null; search: string };
}
```

## Current Components to Preserve

### App.tsx (DO NOT CHANGE)
- Routes structure: `/dashboard`, `/dashboard/leads/:id`, `/dashboard/lead-management`, `/dashboard/automation-builder`
- BrowserRouter wrapper
- ThemeProvider + CssBaseline
- Auth check logic for protected routes

### Store Slices (DO NOT CHANGE)
- `authSlice.ts` - user, token, login/logout actions
- `leadsSlice.ts` - leads, loading, error, pagination, filters, CRUD thunks

### API Service (DO NOT CHANGE)
- `/api/v1/auth/*` endpoints
- `/api/v1/leads` endpoints

### Page Props (DO NOT CHANGE)
- Dashboard: no props
- LeadListing: no props (uses Redux hooks)
- LeadManagement: no props
- LeadDetails: uses `useParams()` for lead ID