Lead Details Screen for LeadFlow Pro - Comprehensive lead profile with editable information, activity timeline, and quick actions. Features inline-editable info panel, click-to-call/email, source badge, priority indicator, tags, assignment dropdown, status workflow stepper. Activity Timeline (filterable, attach files, edit/delete, complete scheduled). Lead Score widget (0-100 with breakdown). Quick Actions sidebar (call/email/SMS/schedule callback/convert/lost). Related leads + duplicate detection. Uses HSR Blue (#0066CC) as primary color, clean Inter font, professional automotive dashboard aesthetic.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first
- Palette: Primary Action (#0066CC), Secondary Action (#64748B), Success (#10B981), Warning (#F59E0B), Error (#EF4444), Background (#FFFFFF), Surface (#F8FAFC), Text Primary (#1E293B), Text Secondary (#64748B), Border (#E2E8F0)
- Styles: Softly rounded (8px), Whisper-soft shadow, Clean Inter typography

**PAGE STRUCTURE:**
1. **Header:** Page title with lead name, back to listing button, action menu (duplicate, convert to customer, archive)
2. **Main Content (Two-column layout):**
   - **Left Column (Info Panel):**
     * Lead identification: Avatar, full name, source badge, priority indicator
     * Contact information: Inline-editable fields (phone, email, best contact time)
     * Car interest: Interested car model, budget range, financing needed, trade-in vehicle
     * Assignment: Dropdown to assign to agent, assigned at timestamp
     * Status: Workflow stepper showing current status with ability to change
     * Tags: Editable tag chips with add/remove functionality
     * Lead Score: Prominent 0-100 score display with breakdown bars (source, budget, engagement, responsiveness)
     * Notes: Inline-editable notes section with formatting toolbar
   - **Right Column (Quick Actions & Timeline):**
     * Quick Actions Vertical Sidebar: Large touch-friendly buttons for Call, Email, SMS, Schedule Callback, Convert, Mark as Lost
     * Activity Timeline: Chronological feed of all interactions with filters (type, date range)
       * Each activity: Type icon, user avatar, description, outcome, timestamp
       * Scheduled activities: Calendar view integration, completion checkbox
       * File attachments: Preview thumbnails with download capability
       * Inline editing: Click to edit activity details, delete option
       * Completion: Mark as complete with visual confirmation
3. **Related Section:** "Similar Leads" panel with duplicate detection alerts and merge suggestions