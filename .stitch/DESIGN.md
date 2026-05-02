# Design System: LeadFlow Pro
**Project ID:** leadflow-pro-001

## 1. Visual Theme & Atmosphere
Professional, clean, and trustworthy with automotive industry sophistication. The design emphasizes clarity, efficiency, and data-driven decision making. Uses a restrained premium palette with strategic accent colors for actionability and visual hierarchy.

## 2. Color Palette & Roles
- **Primary Action**: HSR Blue (#0066CC) - For primary buttons, links, and active states
- **Secondary Action**: Slate Gray (#64748B) - For secondary buttons and less prominent actions
- **Success**: Emerald Green (#10B981) - For positive actions, conversions, and completed statuses
- **Warning**: Amber Yellow (#F59E0B) - For attention-required items, follow-ups, and medium priority
- **Error**: Red (#EF4444) - For errors, failed actions, and lost leads
- **Background**: White (#FFFFFF) - Main canvas color
- **Surface**: Light Gray (#F8FAFC) - For cards, containers, and elevated surfaces
- **Text Primary**: Dark Slate (#1E293B) - For headings and primary text
- **Text Secondary**: Gray (#64748B) - For body text and secondary information
- **Border**: Light Border (#E2E8F0) - For dividers and subtle separators
- **Hover Overlay**: Blue 5% (#0066CC0D) - For interactive element hover states

## 3. Typography Rules
- **Font Family**: Inter (sans-serif) for all UI elements
- **Heading 1 (H1)**: 32px, 600 weight - Page titles and major sections
- **Heading 2 (H2)**: 24px, 600 weight - Section headers and card titles
- **Heading 3 (H3)**: 20px, 600 weight - Subsection headers and important labels
- **Body Large**: 16px, 400 weight - Primary body text
- **Body Medium**: 14px, 400 weight - Secondary body text and helper text
- **Body Small**: 12px, 400 weight - Captions, timestamps, and metadata
- **Font Weights**: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- **Line Height**: 1.5 for body text, 1.2 for headings
- **Letter Spacing**: -0.02em for headings, 0 for body text

## 4. Component Stylings
* **Buttons:** 
  - Primary: HSR Blue background, white text, 8px border radius, 4px height padding, 12px horizontal padding, hover: Blue 5% overlay
  - Secondary: Transparent background, HSR Blue text, 1px border HSR Blue, 8px border radius, hover: HSR Blue 5% background
  - Success: Emerald Green background, white text, 8px border radius
  - Warning: Amber Yellow background, white text, 8px border radius
  - Error: Red background, white text, 8px border radius
  - Icon-only: 36x36px, circular, hover: Light Gray background

* **Containers:** 
  - Cards: White background, 8px border radius, 1px Light Border, Whisper-soft shadow (0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06))
  - Elevated Cards: Same as cards with Floating shadow (0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06))
  - Input Containers: White background, 1px Light Border, 8px border radius, 12px vertical padding, 16px horizontal padding
  - Focus Ring: 2px solid HSR Blue, 2px offset from element edge

* **Badges & Tags:**
  - Status Badges: 8px border radius, 10px horizontal padding, 6px vertical padding, text 12px
  - New Lead: Blue background (#DBEAFE), Blue text (#1E40AF)
  - Contacted: Purple background (#EEE2FF), Purple text (#5B21B6)
  - Qualified: Green background (#DCFCE7), Green text (#166534)
  - Negotiation: Amber background (#FEF3C7), Amber text (#92400E)
  - Converted: Emerald background (#D1FAE5), Emerald text (#059669)
  - Not Interested: Gray background (#F3F4F6), Gray text (#6B7280)
  - Lost: Red background (#FEE2E2), Red text (#991B1B)

* **Tables & Data Grids:**
  - Header: Background Light Gray (#F8FAFC), text Dark SemiBold, bottom border 1px Solid Light Border
  - Rows: White background, hover: Light Blue 2% (#BFDBFE), selected: Blue 5% (#BFDBFE33)
  - Cell padding: 12px vertical, 16px horizontal
  - Border: 1px Solid Light Border between rows

* **Modals & Overlays:**
  - Background: Black 40% opacity (#00000066)
  - Container: White background, 12px border radius, Max-width 560px, Floating shadow
  - Close Button: Top-right, 36x36px, hover: Light Gray background

* **Toasts & Notifications:**
  - Container: Fixed top-right, 16px spacing
  - Toast: White background, 8px border radius, Floating shadow, 1px Solid Light Border on left (4px wide) indicating type
  - Success Toast: Left border Emerald Green
  - Warning Toast: Left border Amber Yellow
  - Error Toast: Left border Red
  - Info Toast: Left border HSR Blue

## 5. Layout Principles
- **Grid System**: 12-column grid with 24px gutter (16px on mobile)
- **Whitespace Strategy**: Consistent 8px spacing unit (multiples of 8px for all spacing)
- **Content Width**: Max-width 1440px for large screens, centered with 24px side padding
- **Breakpoints**: 
  - Mobile: <640px
  - Tablet: 640px-1024px
  - Desktop: >1024px
- **Navigation**: 
  - Top navigation bar: 64px height, White background, 1px Light Border bottom
  - Sidebar (optional): 240px width, Light Gray background, 1px Light Border right
- **Card Elevation**: Use whisper-soft shadows for standard cards, floating for elevated interaction areas
- **Interactive States**: 
  - Hover: Subtle background change or overlay (5% opacity of primary color)
  - Pressed: 7% opacity overlay
  - Disabled: 40% opacity, cursor: not-allowed
- **Focus Visible**: 2px solid HSR Blue outline with 2px offset for keyboard accessibility
- **Motion**: 
  - Transitions: 150ms ease-out for color/opacity, 200ms ease-in-out for position/scale
  - Loading Smooth: 800ms ease-in-out pulse for skeleton loaders