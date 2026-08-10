# FRNDLY Frontend Modernization & Design System Revision Prompt

## Document Type

**Frontend Design System + UI/UX Redesign Prompt**

This document is a **new revision layer** for the FRNDLY project.

It does **not replace, rewrite, or modify any existing FRNDLY `.md` document**.

---

# 1. Critical Document Governance

## 1.1 Existing FRNDLY documentation is preserved

The following existing documentation must remain unchanged:

- `SRS.md`
- `PRD.md`
- `UIUX.md`
- `Business-Rules.md`
- `Architecture.md`
- `Coding-Rules.md`
- `master-rules.md`
- Previous UI/UX and feature revision prompts
- Any other existing FRNDLY `.md` documentation

**DO NOT edit, rewrite, delete, rename, merge, or replace those files as part of this task.**

This document exists specifically to define a new frontend modernization layer while remaining compatible with the existing FRNDLY documentation.

If a conflict appears:

1. Detect the conflict.
2. Report it.
3. Identify which document contains the conflicting rule.
4. Do not silently overwrite the existing rule.
5. Ask for approval before changing any existing specification.

---

# 2. Role

You are a senior:

- Product Designer
- UI/UX Designer
- Design System Architect
- Frontend Engineer
- Accessibility specialist
- Responsive web application engineer

working on the existing **FRNDLY / ConvectionApp**.

Your task is to modernize the frontend substantially while preserving the application's existing business functionality, data model, workflows, and previously documented requirements.

The application is already partially built.

**Do not rebuild FRNDLY from zero.**

---

# 3. Primary Objective

Transform the existing FRNDLY frontend into a:

> **modern, polished, highly usable, responsive business management application with a distinctive FRNDLY identity.**

The visual direction should be inspired by the provided reference screenshot and the additional FRNDLY files supplied with the project.

The target is **not a copy of the reference application**.

Instead:

```text
Reference visual language
        +
Existing FRNDLY frontend
        +
Existing FRNDLY documentation
        +
FRNDLY business identity
        ↓
Modern FRNDLY Design System
```

The result should feel like a purpose-built SaaS/business management product rather than a generic HTML dashboard template.

---

# 4. User-Selected Design Direction

The following decisions are intentional and must be respected.

## 4.1 Overall style

Selected:

**D — Modern dashboard with its own FRNDLY brand identity**

The reference is inspiration, not a template to copy.

FRNDLY should have its own:

- visual identity
- color system
- spacing system
- typography hierarchy
- navigation behavior
- component language
- interaction patterns

---

## 4.2 Color direction

Selected:

**A — Blue as the primary FRNDLY color**

Create a complete semantic color system around blue.

Do not scatter arbitrary hex values throughout individual components.

Use centralized design tokens.

Example conceptual structure:

```text
Primary
Primary Hover
Primary Active
Primary Soft
Primary Subtle
Primary Foreground

Background
Surface
Surface Elevated
Surface Muted

Text Primary
Text Secondary
Text Muted
Text Disabled

Border
Border Strong
Border Subtle

Success
Warning
Danger
Info
```

The exact values must be determined after auditing the existing frontend and reference materials.

Do not invent colors independently for each page.

---

# 5. Typography

The current frontend already uses Poppins in parts of the existing design.

Selected direction:

**A — Keep Poppins**

Continue using Poppins as the primary FRNDLY UI typeface unless an audit reveals a strong technical or usability reason not to.

Create a coherent typography scale.

Example:

```text
Display
Page Title
Section Title
Card Title
Body Large
Body
Body Small
Caption
Label
Button
Table Header
Status
```

Typography must have:

- predictable hierarchy
- controlled font weights
- consistent line heights
- consistent letter spacing
- readable contrast
- responsive sizing where appropriate

Avoid:

- excessive bold text
- oversized headings
- inconsistent font sizes
- random inline font sizes
- typography defined separately for every page

---

# 6. Icon System

Selected:

**A — Lucide**

Use Lucide as the preferred icon system **if compatible with the current stack**.

However:

> Do not force a large migration merely to install Lucide.

First inspect the current icon implementation.

If a compatible existing icon system already exists, determine whether it can be standardized.

If Lucide is introduced:

- use it consistently
- avoid mixing multiple unrelated icon styles
- use appropriate semantic icons
- maintain consistent stroke weight
- maintain consistent sizing
- maintain consistent alignment

Important icon categories include:

```text
Dashboard
Customers
Products
Orders
Invoices
Payments
Production
Shipping
Reviews
Reports
Settings

Add
Edit
Delete
View
Download
Search
Filter
Sort
More
Close
Back
Next
Save
Refresh
Warning
Success
Error
Info
```

Do not use icons merely for decoration.

---

# 7. Component Library

Selected approach:

> Use the most compatible component approach for the existing stack, with **shadcn/ui as the preferred option when technically appropriate**.

Before installing anything:

1. Inspect the existing frontend stack.
2. Inspect package dependencies.
3. Determine whether Tailwind is already used.
4. Determine whether React/Vue/Blade or another frontend architecture is present.
5. Determine whether a component system already exists.
6. Avoid unnecessary migrations.

If shadcn/ui fits naturally:

```text
Existing stack
      ↓
shadcn/ui
      ↓
FRNDLY design tokens
      ↓
FRNDLY components
```

Do not blindly replace existing components.

---

# 8. Design System Architecture

Create a reusable frontend design system rather than styling each page independently.

The design system should define:

## Foundations

- Colors
- Typography
- Spacing
- Radius
- Shadows
- Borders
- Icon sizing
- Motion
- Breakpoints

## Components

- Button
- Icon button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Search
- Badge
- Avatar
- Card
- Table
- Dropdown
- Tooltip
- Modal/Dialog
- Drawer
- Tabs
- Breadcrumb
- Pagination
- Toast
- Alert
- Empty state
- Loading state
- Skeleton
- Date input
- Currency input
- File upload
- Status indicator

## Layout patterns

- App shell
- Sidebar
- Header
- Page header
- Content area
- Two-column layout
- Dashboard grid
- Table layout
- Form layout
- Detail layout

---

# 9. Layout Philosophy

The frontend must follow:

> **Compact but comfortable.**

The previous UI revision identified excessive unused whitespace as a high-priority problem.

Do not solve this by making everything cramped.

Instead:

```text
Poor:
Huge padding
+
Fixed-height cards
+
Large empty containers

Better:
Responsive grid
+
Content-driven height
+
Balanced padding
+
Efficient viewport usage
```

Use the available viewport intelligently.

---

# 10. Application Shell

Redesign the overall application shell.

Target structure:

```text
┌─────────────────────────────────────────────────────────┐
│ Sidebar │ Header / Search / Notifications / Profile    │
│         ├───────────────────────────────────────────────┤
│         │ Page Header                                   │
│         │ Breadcrumb / Context                          │
│         ├───────────────────────────────────────────────┤
│         │                                               │
│         │ Main Content                                  │
│         │                                               │
│         └───────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────┘
```

The shell should feel visually unified.

Avoid:

- disconnected cards
- excessive borders
- excessive shadows
- giant empty header areas
- unnecessary nested containers

---

# 11. Sidebar

Selected:

**E — Modern sidebar with expanded/collapsed/mobile behavior**

The sidebar should support:

### Desktop expanded

```text
[ FRNDLY ]
────────────────
Dashboard

SALES
Customers
Orders
Invoices
Payments

CATALOG
Products

OPERATIONS
Production
Shipping

INSIGHTS
Reports
Analytics

ENGAGEMENT
Reviews
Testimonials

SYSTEM
Settings
```

The exact navigation items must follow the existing FRNDLY application and documentation.

Do not invent business modules that do not exist.

### Desktop collapsed

Show:

- icons
- tooltips
- active state

Hide:

- navigation labels

### Mobile

Use:

- drawer
- overlay
- clear close action

The sidebar must never consume excessive screen space.

---

# 12. Navigation Information Architecture

Selected:

**C — Redesign information architecture if beneficial without changing business functionality**

The frontend may regroup navigation items for better discoverability.

This is a UX reorganization only.

It must NOT silently:

- rename business entities
- remove functionality
- change business rules
- change database relationships
- alter workflows

Example conceptual grouping:

```text
MAIN
└── Dashboard

SALES
├── Customers
├── Orders
├── Invoices
└── Payments

CATALOG
└── Products

OPERATIONS
├── Production
└── Shipping

INSIGHTS
├── Reports
└── Analytics

ENGAGEMENT
├── Reviews
└── Testimonials

SYSTEM
└── Settings
```

Before implementing this structure, compare it with the actual current routes/modules and existing documentation.

---

# 13. Header

Create a compact, useful header.

Possible elements:

- Mobile menu
- Page title/context
- Breadcrumb
- Global search
- Notifications
- Theme control
- User/profile menu

Do not put every possible control in the header.

Prioritize:

> discoverability + speed + clarity.

---

# 14. Breadcrumbs

Use breadcrumbs where they help users understand hierarchy.

Example:

```text
Dashboard / Customers
```

or:

```text
Sales / Orders / INV-20260810-001
```

Do not use breadcrumbs merely for decoration.

---

# 15. Dashboard

The dashboard should become a polished operational overview.

Target:

```text
Page Header
────────────────────────────────────────

KPI Cards
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Orders   │ │ DP       │ │ Paid     │ │ Profit   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

Analytics
┌───────────────────────────────┐
│ Revenue / Orders Trend        │
│                               │
│             Chart             │
└───────────────────────────────┘

Operational Overview
┌───────────────────┐ ┌────────────────────┐
│ Order Status      │ │ Recent Activity    │
└───────────────────┘ └────────────────────┘

Recent Orders
┌───────────────────────────────────────────┐
│ Table                                     │
└───────────────────────────────────────────┘
```

Do not add fake metrics.

All displayed data must come from actual application data.

---

# 16. KPI Cards

Cards should communicate information quickly.

Each card should have:

- clear label
- primary metric
- contextual information
- appropriate icon
- optional trend/change indicator
- consistent spacing

Avoid:

- giant icons
- excessive decoration
- random colors
- too many gradients
- excessive shadows

---

# 17. Tables

Tables are critical to FRNDLY.

Create a consistent table system.

Requirements:

- readable headers
- aligned numeric values
- clear row spacing
- hover state
- selected state where applicable
- status badges
- action column
- pagination
- search/filter
- responsive behavior
- empty state
- loading state

For wide tables:

```text
Desktop:
Full table

Mobile:
Horizontal scrolling OR responsive row/card transformation
```

Do not force a desktop table into a tiny mobile viewport.

---

# 18. Forms

Forms should feel consistent across:

- Customers
- Products
- Orders
- Invoices
- Payments
- Production
- Shipping
- Settings

Use:

```text
Label
Input
Supporting text / validation
```

Maintain:

- consistent label spacing
- consistent field height
- consistent border
- clear focus state
- clear error state
- clear disabled state

Do not use excessive vertical spacing.

---

# 19. Buttons

Create a clear hierarchy.

Example:

```text
Primary
Secondary
Outline
Ghost
Destructive
Link
Icon-only
```

Use primary actions sparingly.

Example:

```text
[ + Tambah Customer ]
```

rather than making every button visually primary.

---

# 20. Action Menus

Standardize record actions.

Preferred:

```text
⋮
├── Lihat
├── Edit
├── Duplikat
└── Hapus
```

Only show actions that actually exist.

Delete must remain visually distinct and require confirmation where appropriate.

Edit must be easy to discover.

---

# 21. Cards

Use cards to establish hierarchy, not to wrap every piece of content.

Good:

```text
Card
 ├── Header
 ├── Content
 └── Optional footer
```

Avoid:

```text
Card
  └── Card
       └── Card
            └── Card
```

Reduce unnecessary nesting.

---

# 22. Status System

FRNDLY has business states such as order/payment statuses.

Create a unified semantic status system.

Example:

```text
Draft
Menunggu DP
DP Masuk
Proses
Lunas
```

Use semantic visual treatment consistently.

Example:

```text
Neutral
Warning
Info
Processing
Success
Danger
```

Do not assign colors randomly to individual pages.

The same status must look the same throughout the application.

---

# 23. Dark / Light Theme

Selected:

**D — Redesign both light and dark themes as one coherent system**

Do not treat dark mode as:

```text
Light mode
+
background: black
```

Instead define semantic tokens for both themes.

Example:

```text
--background
--surface
--surface-elevated
--surface-muted
--border
--text-primary
--text-secondary
--text-muted
--primary
--primary-hover
--success
--warning
--danger
```

### Light theme

Target:

- clean
- bright
- professional
- low visual noise

### Dark theme

Target:

- sophisticated
- comfortable
- readable
- not pure-black by default
- controlled contrast
- clear surfaces

Avoid excessive use of:

- pure white
- pure black
- saturated neon colors

---

# 24. Theme Switching

The current frontend already contains theme switching behavior.

Preserve the functionality while improving its implementation and visual quality.

Requirements:

- smooth but subtle transition
- persisted preference
- correct initial state
- no flash of incorrect theme if technically avoidable
- all components respond correctly
- charts respond correctly
- tables respond correctly
- modals respond correctly
- dropdowns respond correctly

Test both themes across every major page.

---

# 25. Search

The global search should be visually compact.

The design should distinguish:

```text
Global search
```

from:

```text
Page-specific filter
```

Do not make the search bar excessively wide when screen space is limited.

On mobile, adapt it intelligently.

---

# 26. Filters

Create a consistent filter system.

Possible controls:

- Search
- Status
- Date
- Customer
- Product
- Payment
- Category

Use:

```text
[ Search ] [ Status ] [ Date ] [ Filter ] [ Reset ]
```

Avoid making every filter permanently visible if the page does not require it.

---

# 27. Empty States

Every major data page should have a useful empty state.

Example:

```text
        [ Icon ]

Belum ada customer

Tambahkan customer pertama untuk mulai
mengelola data pelanggan FRNDLY.

[ + Tambah Customer ]
```

Avoid empty pages that simply look broken.

Do not use fake records merely to fill empty space.

---

# 28. Loading States

Use appropriate loading states.

Prefer:

- skeleton
- spinner for short actions
- disabled button during submission

Avoid blocking the entire page unnecessarily.

---

# 29. Toast / Feedback

Use consistent feedback.

Examples:

```text
✓ Customer berhasil disimpan
✓ Produk berhasil diperbarui
✓ Invoice berhasil dibuat
✓ PDF berhasil diunduh
```

Error:

```text
! Data gagal disimpan
Periksa kembali informasi yang dimasukkan.
```

Feedback should be:

- concise
- contextual
- dismissible when appropriate
- non-blocking when possible

---

# 30. Modal / Dialog / Drawer

Use dialogs for:

- confirmations
- short forms
- destructive actions
- focused workflows

Use drawers where appropriate for:

- filters
- detail panels
- mobile navigation

Do not turn every interaction into a modal.

---

# 31. Micro-interactions

Selected:

**C — Modern micro-interactions**

Use subtle motion for:

- hover
- focus
- button press
- sidebar collapse
- drawer
- modal
- dropdown
- toast
- theme transition
- skeleton/loading

Motion must be:

- short
- subtle
- functional

Avoid:

- excessive page transitions
- bouncing elements
- decorative animations
- slow animations
- animations that interfere with data entry

Respect reduced-motion preferences where possible.

---

# 32. Responsive Design

The frontend must be designed deliberately for:

- large desktop
- desktop
- laptop
- tablet
- mobile

Do not treat responsive design as an afterthought.

Check:

- sidebar
- header
- dashboard cards
- tables
- forms
- buttons
- dialogs
- dropdowns
- search
- filters
- charts
- invoice screens

No accidental horizontal overflow.

---

# 33. Accessibility

The redesigned frontend should improve accessibility.

Requirements:

- sufficient color contrast
- visible keyboard focus
- semantic HTML
- accessible buttons
- accessible form labels
- useful aria labels for icon-only buttons
- keyboard-accessible menus
- keyboard-accessible dialogs
- clear error states
- do not communicate status through color alone

---

# 34. Visual Density

FRNDLY should feel:

> information-rich without feeling crowded.

Target principles:

```text
Less empty space
+
Better hierarchy
+
Consistent spacing
+
Content-driven sizing
=
Professional density
```

Do not use arbitrary fixed heights merely to make a section visually large.

---

# 35. Spacing System

Create a spacing scale.

For example:

```text
4
8
12
16
20
24
32
40
48
64
```

Use the smallest reasonable spacing that maintains readability.

Avoid arbitrary values unless there is a clear reason.

---

# 36. Border Radius

Create a consistent radius system.

Example:

```text
Small
Medium
Large
Full
```

Use radius consistently across:

- buttons
- inputs
- cards
- modals
- dropdowns
- badges
- avatars

Avoid making every component excessively rounded.

---

# 37. Shadows

Use shadows sparingly.

Preferred hierarchy:

```text
No shadow
Subtle
Medium
Elevated
```

Do not use heavy shadows everywhere.

The UI should rely primarily on:

- spacing
- surfaces
- borders
- typography

to establish hierarchy.

---

# 38. Color Usage

Primary blue should communicate:

- primary actions
- active states
- selected states
- important navigation
- key links

Do not color every component blue.

Semantic colors should communicate meaning.

---

# 39. FRNDLY Branding

FRNDLY does not currently have a finalized logo/brand asset.

Therefore:

- Do not invent a permanent logo.
- Do not copy the logo from the reference screenshot.
- Do not use another company's branding.
- Create a temporary but clearly replaceable brand mark if needed.
- Keep branding tokens centralized.

The implementation should make it easy to replace later:

```text
Brand logo
Brand name
Primary color
Accent color
Favicon
```

---

# 40. Reference Screenshot Rules

The supplied screenshot is the **primary visual reference**.

Additional supplied files are also visual/structural references.

Study:

- spacing
- hierarchy
- navigation
- card proportions
- typography
- icon treatment
- surface treatment
- interaction patterns
- density

Do NOT copy:

- MyData branding
- MyData text
- unrelated business modules
- exact content
- proprietary identity

Translate the visual language into FRNDLY.

---

# 41. Existing Frontend Reality

The current project already contains frontend concepts such as:

- FRNDLY branding
- sidebar
- collapsible navigation
- page header
- breadcrumb
- notifications
- profile controls
- dashboard
- theme switching
- responsive behavior
- data tables
- exports
- icon system

The supplied existing frontend implementation also contains an application shell with sidebar/header structure and uses inline SVG icons in places.

Therefore:

> Audit first. Reuse what works. Replace only what should actually be replaced.

---

# 42. Existing Business Functionality Must Remain

The redesign must not remove or alter existing business functionality.

Preserve the existing FRNDLY concepts and workflows, including where applicable:

- Customer management
- Product management
- Orders
- Invoice
- Payment / DP
- Production
- Shipping
- Reviews
- Testimonials
- Reports
- Analytics
- Settings
- Search
- Filtering
- Export
- Existing CRUD behavior

The frontend redesign must not silently change business rules.

---

# 43. Previous Feature Revision Must Remain Relevant

The earlier frontend/feature revision already established:

- Edit functionality
- Invoice PDF download
- Detailed invoice table
- Responsive layout
- Excessive whitespace reduction
- Preservation of existing architecture
- Audit-first workflow
- No destructive changes

This document **extends** those requirements.

It does not replace them.

---

# 44. Invoice UI

The previous invoice requirements remain valid.

The frontend redesign should make invoice workflows visually consistent with the new design system.

Invoice pages should support:

- invoice information
- customer information
- item table
- totals
- payment/DP
- remaining balance
- status
- actions
- Download PDF

The invoice PDF itself must remain a formal document and should not simply mirror the dashboard UI.

---

# 45. Customer UI

Modernize:

- customer list
- customer detail
- customer creation
- customer editing
- customer search
- filters
- customer segmentation
- purchase information
- outstanding balance where supported
- action menus

Keep the data and business meaning intact.

---

# 46. Product UI

Modernize:

- product list
- product detail
- product creation
- product editing
- category
- price
- stock/inventory-related information where applicable
- product search/filter
- action menu

Use compact but readable tables/cards.

---

# 47. Order UI

Order management should prioritize:

```text
Customer
Order
Products
Quantity
Price
Status
Payment
Actions
```

Use clear status progression.

Do not make users search through decorative UI to find operational information.

---

# 48. Settings UI

Settings should be grouped logically.

Possible groups:

```text
Appearance
Business
Pricing
Order Rules
Customer
Notifications
Data / Export
System
```

Only expose settings that actually exist in FRNDLY.

Do not invent configuration that has no corresponding functionality.

---

# 49. Frontend Architecture Rules

Before making major frontend changes:

1. Inspect current framework.
2. Inspect package.json.
3. Inspect current component structure.
4. Inspect CSS architecture.
5. Inspect theme implementation.
6. Inspect icon implementation.
7. Inspect routing.
8. Inspect existing responsive behavior.
9. Inspect current data flow.
10. Inspect existing UI patterns.

Then create a migration/design plan.

---

# 50. Avoid CSS Fragmentation

Do not respond to the redesign by creating hundreds of one-off CSS rules.

Prefer:

```text
Design tokens
    ↓
Base styles
    ↓
Reusable components
    ↓
Page layouts
```

Avoid:

```text
Page A custom color
Page B slightly different blue
Page C different radius
Page D different button
Page E different table
```

The system must become more consistent as the redesign progresses.

---

# 51. Avoid Inline Styling Where Practical

Move repeated visual rules into:

- design tokens
- reusable classes
- components
- theme variables

Inline styles may remain for truly dynamic values, but should not be the primary design system.

---

# 52. Performance

Do not sacrifice application performance for visual effects.

Avoid:

- unnecessary animation
- excessive JavaScript
- duplicated components
- huge icon bundles
- unnecessary dependencies
- excessive DOM nesting

Use lazy loading/code splitting only when appropriate to the existing architecture.

---

# 53. User Experience Principles

Every redesign decision should follow:

### 1. Clarity

The user should immediately understand:

> Where am I?

> What can I do?

> What happened?

### 2. Efficiency

Common tasks should require minimal unnecessary clicks.

### 3. Consistency

The same action should look and behave the same everywhere.

### 4. Feedback

Every important action should have visible feedback.

### 5. Forgiveness

Destructive actions should be reversible or confirmed where appropriate.

### 6. Responsiveness

The interface should adapt to the user's screen.

---

# 54. AI/Vibe Coding Workflow

Do not immediately modify the entire frontend.

Use this workflow:

```text
AUDIT
  ↓
DESIGN SYSTEM PLAN
  ↓
APP SHELL
  ↓
FOUNDATION
  ↓
CORE COMPONENTS
  ↓
DASHBOARD
  ↓
DATA PAGES
  ↓
FORMS
  ↓
DETAIL PAGES
  ↓
RESPONSIVE POLISH
  ↓
ACCESSIBILITY
  ↓
TEST
  ↓
FINAL REVIEW
```

---

# 55. Phase 1 — Audit Only

At the beginning:

**DO NOT MODIFY CODE.**

Inspect:

- existing frontend files
- routes
- layouts
- components
- CSS
- JS
- theme implementation
- icon implementation
- current dependencies
- current responsive behavior
- supplied reference files
- existing FRNDLY documentation

Return:

1. Current frontend architecture
2. Current design system
3. Current color system
4. Current typography
5. Current icon system
6. Current navigation
7. Current theme system
8. Current responsive implementation
9. Existing reusable components
10. UI inconsistencies
11. Excessive whitespace issues
12. Recommended redesign architecture
13. Recommended files to modify
14. Recommended files to create
15. Dependencies that may be needed
16. Dependencies that should NOT be added
17. Risks
18. Migration plan

Then stop and wait for approval.

---

# 56. Phase 2 — Design System Foundation

After approval:

Implement:

- colors
- typography
- spacing
- radius
- shadows
- borders
- icon rules
- motion
- theme tokens
- responsive breakpoints

Do not redesign every page yet.

First establish the foundation.

---

# 57. Phase 3 — Application Shell

Redesign:

- sidebar
- mobile drawer
- top header
- search
- notification
- profile
- theme switcher
- breadcrumb
- page header
- main content container

Then verify all pages still load.

---

# 58. Phase 4 — Core Components

Standardize:

- buttons
- inputs
- select
- badges
- cards
- tables
- dropdowns
- dialogs
- toast
- empty state
- loading state
- pagination
- filters

---

# 59. Phase 5 — Page-by-Page Modernization

Recommended order:

```text
Dashboard
 ↓
Customers
 ↓
Products
 ↓
Orders
 ↓
Invoices
 ↓
Payments
 ↓
Production
 ↓
Shipping
 ↓
Reviews / Testimonials
 ↓
Reports / Analytics
 ↓
Settings
```

Adjust the order based on the actual existing application structure.

---

# 60. Phase 6 — Responsive & Accessibility Review

Test:

### Desktop

- 1440px
- 1280px

### Laptop

- 1024px

### Tablet

- 768px

### Mobile

- 430px
- 390px
- 375px

These are test targets, not necessarily hard-coded breakpoints.

---

# 61. Phase 7 — Final Visual QA

Compare all pages against the new design system.

Check:

```text
Typography
Colors
Spacing
Icons
Buttons
Tables
Forms
Cards
Status
Navigation
Dark mode
Light mode
Responsive
Accessibility
```

No page should look like it belongs to a different application.

---

# 62. No Destructive Changes

Never:

- delete working functionality
- delete data
- delete business rules
- rewrite the entire application unnecessarily
- change database structure just for visual reasons
- remove existing modules
- replace working backend logic for frontend styling
- modify existing `.md` documentation
- copy another application's branding
- hardcode production data
- introduce unnecessary dependencies

---

# 63. Change Management

For each implementation phase, report:

```text
Files changed:
-

Components changed:
-

Design changes:
-

Functional changes:
-

Dependencies added:
-

Dependencies removed:
-

Tests:
-

Potential regressions:
-

Remaining work:
-
```

---

# 64. Definition of Done

The frontend redesign is complete when:

## Visual

- FRNDLY has a coherent modern visual identity.
- The reference visual language has been successfully adapted.
- The UI no longer feels like a generic dashboard template.
- Typography is consistent.
- Icons are consistent.
- Colors are centralized.
- Light and dark themes are coherent.
- Spacing is consistent.
- Excessive whitespace is resolved.

## Navigation

- Sidebar works on desktop.
- Sidebar collapses correctly.
- Mobile drawer works.
- Header is compact and useful.
- Active navigation is obvious.

## Components

- Buttons are standardized.
- Forms are standardized.
- Tables are standardized.
- Cards are standardized.
- Status badges are standardized.
- Dialogs/dropdowns are standardized.
- Loading and empty states are standardized.

## UX

- Common tasks are easy to discover.
- Actions have clear feedback.
- Destructive actions are protected.
- Search and filtering are intuitive.
- Information hierarchy is clear.

## Responsive

- Desktop works.
- Laptop works.
- Tablet works.
- Mobile works.
- No accidental overflow.

## Accessibility

- Keyboard focus is visible.
- Icon-only actions have accessible labels.
- Forms have labels.
- Contrast is sufficient.
- Status is not communicated by color alone.

## Compatibility

- Existing FRNDLY functionality remains operational.
- Existing business rules remain unchanged.
- Existing data remains intact.
- Existing documentation remains unchanged.

---

# 65. Final Instruction to the AI Agent

Before writing or changing frontend code:

> **STOP AND AUDIT FIRST.**

Do not assume the current stack.

Do not assume the current component architecture.

Do not assume a dependency should be installed.

Do not assume a page should be rebuilt.

Inspect the actual FRNDLY project and supplied reference materials first.

Then produce a concrete modernization plan.

Only after approval should implementation begin.

The goal is not:

> "Make the dashboard prettier."

The goal is:

> **Build a coherent FRNDLY frontend design system and apply it consistently across the existing application while preserving the existing product, business rules, functionality, and documentation.**
