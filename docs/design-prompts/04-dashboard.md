Dashboard Screen for LeadFlow Pro - Executive overview and analytics interface. Features KPI cards (Total Leads, Conversion Rate, Active, Today, Pipeline Revenue, Avg Response Time). Conversion Funnel (click-to-filter). Source Performance (donut + ROI table). Trends (line chart, period comparison). Team Leaderboard with drill-down. Live activity feed. Uses HSR Blue (#0066CC) as primary color, clean Inter font, professional automotive dashboard aesthetic.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first
- Palette: Primary Action (#0066CC), Secondary Action (#64748B), Success (#10B981), Warning (#F59E0B), Error (#EF4444), Background (#FFFFFF), Surface (#F8FAFC), Text Primary (#1E293B), Text Secondary (#64748B), Border (#E2E8F0)
- Styles: Softly rounded (8px), Whisper-soft shadow, Clean Inter typography

**PAGE STRUCTURE:**
1. **Header:** Page title "LeadFlow Pro Dashboard", date range picker (today, week, month, quarter, custom), export/print buttons, user avatar dropdown
2. **KPIs Row:** Responsive grid of 6 KPI cards (2 on mobile, 3 on tablet, 6 on desktop)
   * Each card: Icon, label, value (large), trend indicator (small arrow with color), subtle background color based on metric type
   * Total Leads: Blue background tint
   * Conversion Rate: Green background tint
   * Active Leads: Purple background tint
   * Today's Leads: Teal background tint
   * Pipeline Revenue: Green background tint (currency)
   * Avg Response Time: Orange background tint
3. **Charts Row:** Two-column layout (each taking 50% width)
   * Left Column: Conversion Funnel (horizontal or vertical funnel chart) with clickable segments to filter leads
   * Right Column: Source Performance (donut chart showing lead distribution by source) + small table below showing ROI metrics per source
4. **Trends & Leaderboard Row:** Two-column layout
   * Left Column: Trends (line chart comparing selected metric over time, with period-over-period comparison toggle)
   * Right Column: Team Leaderboard (table ranking agents by conversion rate, with drill-down to individual agent performance)
5. **Live Activity Feed:** Full-width card at bottom showing real-time stream of recent activities (lead assignments, status changes, calls logged, etc.)
   * Each activity: Type icon, user avatar, brief description, timestamp
   * Visual distinction: Different colors/icons for activity types
   * Auto-scroll: Newest activities appear at top, smooth animation
   * Filter controls: Toggle for activity types, pause live feed button