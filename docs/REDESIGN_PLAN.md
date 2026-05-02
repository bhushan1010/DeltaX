# Redesign Plan - LeadFlow Pro

## Phase 0: Audit & Plan ✅ COMPLETE
- [x] Created CURRENT_STATE.md documenting folder structure, routes, data shapes
- [x] Identified weak areas: no sidebar, no dark mode, placeholder charts, no animations, no loading states

---

## Phase 1: Design System Foundation

### Tasks
1. [ ] Install Tailwind CSS (additive to existing MUI)
2. [ ] Install lucide-react (icons)
3. [ ] Install framer-motion (animations)
4. [ ] Install sonner (toast notifications)
5. [ ] Create `src/styles/theme.css` with CSS variables
6. [ ] Create `src/styles/design-tokens.ts`
7. [ ] Update theme.ts to support dark mode
8. [ ] Create `src/components/layout/AppShell.tsx`
9. [ ] Create `src/components/layout/PageHeader.tsx`
10. [ ] Create `src/components/layout/PageContent.tsx`
11. [ ] Run tests - all must pass

### Non-Breaking Rules
- Keep MUI theme as base
- Add Tailwind as utility layer only
- All new components are additive

---

## Phase 2: App Shell (Sidebar + Topbar)

### Tasks
1. [ ] Replace AppBar in App.tsx with AppShell component
2. [ ] Build collapsible sidebar with icons: Dashboard, Leads, Pipeline (lead-management), Team (lead-management), Automation, Reports, Settings
3. [ ] Build slim topbar: breadcrumbs, global search (⌘K), notification bell, "+ New Lead" button, user avatar dropdown
4. [ ] Add user card at bottom of sidebar with avatar, name, role
5. [ ] Add collapse toggle for sidebar
6. [ ] Ensure routes still work: /dashboard, /dashboard/lead-management, etc.
7. [ ] Run tests - all must pass

### Acceptance Criteria
- Sidebar shows on all dashboard pages
- Clicking nav items navigates correctly
- Logout works from dropdown
- Dark mode toggle works
- Mobile: sidebar collapses to drawer

---

## Phase 3: Dashboard Redesign

### Tasks
1. [ ] Update KPI cards: glass-morphism, large JetBrains Mono metrics, trend pills with arrows, sparklines (Recharts)
2. [ ] Replace funnel placeholder with Recharts FunnelChart
3. [ ] Replace pie placeholder with Recharts donut chart
4. [ ] Add 2 new cards: Lead Trends (area chart), Team Leaderboard
5. [ ] Upgrade activity feed: avatar + colored icon, action verb, relative time, activity type badge
6. [ ] Add skeleton loaders while fetching
7. [ ] Run tests - all must pass

### Acceptance Criteria
- 4 KPI cards visible with trends
- Funnel chart shows 5 stages
- Donut chart shows lead sources
- Activity feed shows real/meaningful data
- Loading states show skeletons

---

## Phase 4: Lead Listing Redesign

### Tasks
1. [ ] Add chip-style filter bar: Status, Source, Priority, Assigned, saved views, date range
2. [ ] Upgrade table: zebra rows, sticky header, sortable columns, inline status badges
3. [ ] Add row actions: kebab menu + quick-call icon
4. [ ] Add bulk action bar (slides up when rows selected)
5. [ ] Add empty state with illustration + "Create first lead" CTA
6. [ ] Add pagination with page size selector
7. [ ] Add skeleton loading
8. [ ] Run tests - all must pass

### Acceptance Criteria
- Filters apply and update table
- Clicking lead row navigates to lead details
- Bulk selection works
- Empty state shows when no leads

---

## Phase 5: Lead Details Redesign

### Tasks
1. [ ] Two-column layout: main (8/12) + sidebar (4/12)
2. [ ] Header card: avatar, status pill, priority flag, source badge, lead score gauge
3. [ ] Tabs: Overview, Activity, Notes, Files, Related
4. [ ] Inline-editable fields with pencil icon on hover
5. [ ] Activity timeline: vertical, colored dots, expandable cards
6. [ ] Quick actions sidebar: Call, Email, SMS, Schedule, Convert, Mark Lost
7. [ ] Status workflow stepper
8. [ ] Run tests - all must pass

### Acceptance Criteria
- All tabs render correctly
- Activity timeline shows lead history
- Quick actions are clickable

---

## Phase 6: Lead Management (Kanban) Redesign

### Tasks
1. [ ] 6 columns by status with count badge + WIP limit
2. [ ] Lead cards: name, source icon, priority dot, assigned avatar, days-in-stage
3. [ ] Drag-and-drop with Framer Motion (smooth transitions)
4. [ ] Column header colors match status palette
5. [ ] Team overview cards (already exists, style upgrade)
6. [ ] Automation rules panel with visual builder
7. [ ] Run tests - all must pass

### Acceptance Criteria
- Kanban columns render
- Cards show lead info
- Drag-and-drop moves cards between columns

---

## Phase 7: Micro-Interactions & Polish

### Tasks
1. [ ] Page transitions: fade + 4px slide-up (200ms)
2. [ ] Card hover: lift 2px + shadow grow
3. [ ] List mount stagger animation (40ms delay each)
4. [ ] Modal scale-in spring animation
5. [ ] Toast slide-in from top-right (sonner)
6. [ ] Add empty state illustrations everywhere
7. [ ] Add keyboard shortcuts: ⌘K (search), C (new lead), /, G+D, G+L
8. [ ] Run tests - all must pass

---

## Phase 8: Accessibility & Responsiveness

### Tasks
1. [ ] Ensure all interactive elements keyboard-navigable
2. [ ] Add ARIA labels on icon-only buttons
3. [ ] Color not sole status indicator (pair with icon/text)
4. [ ] Sidebar collapses to drawer on <lg
5. [ ] Tables transform to card lists on <md
6. [ ] Min font 14px body, 12px metadata
7. [ ] Lighthouse a11y score ≥ 95
8. [ ] Run tests - all must pass

---

## Phase 9: Non-Breaking Verification

### Tasks
1. [ ] Run existing unit tests - all pass
2. [ ] Type check: tsc --noEmit clean
3. [ ] Manual smoke test: login → dashboard → leads → lead details → logout
4. [ ] Check console for errors/warnings

---

## Phase 10: Git Hygiene

### Tasks
1. [ ] Create worktree branch: `redesign/design-system`
2. [ ] Commit Phase 1 changes
3. [ ] Create PR with screenshots

---

## Phase 11: Documentation

### Tasks
1. [ ] Add DESIGN_SYSTEM.md documenting tokens, components
2. [ ] Update README with new screenshots
3. [ ] Create before/after comparison

---

## Non-Breaking Constraints Summary

| Item | Constraint |
|------|-------------|
| Routes | `/dashboard`, `/dashboard/lead-management`, `/dashboard/automation-builder`, `/dashboard/leads/:id` |
| Redux | authSlice, leadsSlice - actions, selectors unchanged |
| API | `/api/v1/auth/*`, `/api/v1/leads` - same endpoints |
| Props | Dashboard, LeadListing, LeadManagement - no prop changes |
| App.tsx | Keep BrowserRouter, ThemeProvider, route structure |

---

## Execution Order

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8 → Phase 9 → Phase 10 → Phase 11
```

Each phase: write code → run tests → verify → commit