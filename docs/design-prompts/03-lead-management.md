Lead Management Screen (Manager View) for LeadFlow Pro - Team oversight and pipeline management interface. Features Team Overview (workload, online status, performance per agent). Drag-and-drop lead assignment. Kanban pipeline by status (drag between stages, swimlanes by agent/source, WIP limits, aging indicators). Automation Rules Manager with visual rule builder (use json-canvas). Uses HSR Blue (#0066CC) as primary color, clean Inter font, professional automotive dashboard aesthetic.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first
- Palette: Primary Action (#0066CC), Secondary Action (#64748B), Success (#10B981), Warning (#F59E0B), Error (#EF4444), Background (#FFFFFF), Surface (#F8FAFC), Text Primary (#1E293B), Text Secondary (#64748B), Border (#E2E8F0)
- Styles: Softly rounded (8px), Whisper-soft shadow, Clean Inter typography

**PAGE STRUCTURE:**
1. **Header:** Page title "Team Pipeline Management", date range selector, export/print buttons, user avatar dropdown
2. **Main Content (Three-column layout):**
   - **Left Column (Team Overview & Controls):**
     * Team Status Panel: Grid of agent avatars with status indicators (online/offline/break), current load, today's metrics
     * Performance Summary: KPI cards for team conversion rate, response time, leads handled
     * Automation Controls: Button to open Automation Rule Builder, toggle for enabling/disabling automation
   - **Middle Column (Kanban Pipeline):**
     * Status Columns: New, Contacted, Qualified, Negotiation, Converted, Not Interested, Lost (each as a droppable column)
     * Swimlanes Option: Toggle to switch between status-based and agent-based swimlanes
     * Card Representation: Lead cards showing name, source badge, priority indicator, assigned agent avatar, age indicator
     * Drag-and-Drop: Smooth animation when moving leads between statuses, visual feedback for valid drops
     * WIP Limits: Visual indicator (yellow/red) when column exceeds work-in-progress limits
     * Aging Indicators: Gradual color shift from green to red based on lead age in column
   - **Right Column (Analytics & Automation):**
     * Pipeline Analytics: Funnel chart showing conversion rates between stages
     * Source Performance: Donut chart showing lead distribution by source with conversion rates
     * Automation Rule Builder: Visual interface (json-canvas) for creating if-then rules
       * Nodes: Trigger (lead source, score change, inactivity), Condition (budget range, car model, engagement), Action (assign, notify, score adjust)
       * Connection Lines: Drag to connect triggers to conditions to actions
       * Rule List: Collapsible panel showing active rules with toggle, edit, delete