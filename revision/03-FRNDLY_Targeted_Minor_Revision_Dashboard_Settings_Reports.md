# FRNDLY — Targeted Minor Revision Prompt

## Purpose

This document defines a **strictly scoped minor revision** for the existing FRNDLY / ConvectionApp.

This is NOT a redesign, refactoring, or general improvement task.

Only these three areas may be changed:

1. Dashboard revenue chart
2. Settings: business logo + admin profile
3. Reports: fix typography to Poppins

Everything else must remain unchanged.

---

## 1. Critical Constraint

> **Do not change anything that is not explicitly requested in this document.**

Do not use this task to redesign or refactor unrelated parts of FRNDLY.

### Forbidden

- Global frontend redesign
- Sidebar/navbar/navigation redesign
- Global color changes
- Global typography changes
- Dark/light theme redesign
- Spacing/layout redesign
- Customer/Product/Order redesign
- Invoice redesign or business-logic changes
- Payment/Production/Shipping/Review redesign
- Authentication redesign
- Multi-admin or role system
- Username authentication
- Unrelated database changes
- Unrelated migrations
- Unrelated dependencies
- Unrelated refactoring
- Modification of existing `.md` files

This task is **patch, don't rebuild**.

---

## 2. Existing Documentation

Do not modify, rename, delete, merge, or replace any existing FRNDLY `.md` files, including:

- `SRS.md`
- `PRD.md`
- `UIUX.md`
- `Business-Rules.md`
- `Architecture.md`
- `Coding-Rules.md`
- `master-rules.md`
- Previous UI/UX revision prompts
- Previous feature revision prompts
- Any other FRNDLY documentation

If a conflict is discovered, report it instead of silently changing existing documentation.

---

# 3. Workflow

Follow:

```text
Targeted Audit
      ↓
Targeted Plan
      ↓
Implement Only Requested Scope
      ↓
Test Affected Areas
      ↓
Regression Check
      ↓
Final Report
```

Do not perform a broad project audit.

---

# 4. Phase 1 — Targeted Audit

Inspect only what is necessary for the three requested changes.

### Dashboard

Inspect:

- Current revenue chart
- Chart component
- Chart library
- Revenue data source
- Existing revenue calculation
- Existing currency formatter

### Settings

Inspect:

- Current Settings page
- Business/company identity implementation
- Existing logo handling
- Admin/user model
- Authentication implementation
- Admin profile
- Existing avatar/profile handling
- Existing file/storage mechanism

### Reports

Inspect:

- Reports page
- Report components
- Typography implementation
- Table text
- Filters
- Buttons
- Chart title
- Chart axis labels
- Chart legend
- Chart tooltip
- Chart data labels
- Any text that currently does not use Poppins

Before implementation, report:

1. Existing revenue chart implementation
2. Existing chart library
3. Existing revenue data source
4. Existing currency formatter
5. Existing Settings structure
6. Existing business identity structure
7. Existing admin/account structure
8. Existing authentication method
9. Existing storage/upload mechanism
10. Reports typography implementation
11. Exact files to modify
12. Files to create, if necessary
13. Whether database changes are required
14. Whether storage changes are required
15. Whether dependencies are required
16. Potential risks

---

# 5. Change 1 — Dashboard Revenue Chart

## Objective

Convert the existing revenue chart into a:

> **Point + Line Chart with Gradient Area Fill**

The underlying data and business logic must remain exactly the same.

### Do not change

- Revenue source
- Database query
- Revenue calculation
- Aggregation
- Date range
- Existing filters
- Period logic
- Currency calculation
- Currency formatter

Only the visualization may change.

Do not create fake or hardcoded data.

---

## 5.1 Visual Requirements

Conceptually:

```text
Revenue
  │
  │                     ●
  │                  ╱     ╲
  │              ●──╯       ●
  │           ╱
  │       ●──╯
  │
  └────────────────────────────
       Jan  Feb  Mar  Apr
```

With a gradient-filled area underneath:

```text
              ●
           ╱     ╲
        ●╯         ●
      ╱              ╲
   ●╯                  ╲
   ░░░░░░░░░░░░░░░░░░░░░
   ░░░ gradient area ░░░
   ░░░░░░░░░░░░░░░░░░░░░
```

---

## 5.2 Line

Use the existing FRNDLY primary blue.

Do not change the global color system.

Use an appropriate line thickness and clean line rendering.

---

## 5.3 Points

Required behavior:

> Small points are always visible and become larger/emphasized on hover.

Requirements:

- Subtle default point
- Clear hover state
- No layout shift
- Points represent actual data only

---

## 5.4 Gradient

Use a theme-aware gradient.

Light theme:

```text
FRNDLY Blue
↓
Low-opacity Blue
↓
Transparent
```

Dark theme:

Use an appropriate low-opacity version of the same semantic blue.

Do not introduce unrelated colors.

The gradient must remain visually attractive in both themes.

---

## 5.5 Tooltip

Tooltip is required.

It must display actual existing data, for example:

```text
August 2026

Pendapatan
Rp 12.500.000
```

Use the **existing FRNDLY currency format exactly as it currently exists**.

Do not create a second currency formatter.

---

## 5.6 Trend Indicator

Do not add a new trend percentage.

If a trend indicator already exists, preserve it exactly.

If it does not exist, do not add one.

---

## 5.7 Chart Library

First detect the chart library already used.

If the existing library supports:

- line chart
- points
- gradient fill
- tooltip
- theme adaptation

use the existing library.

Do not install a new chart library or migrate the chart system unnecessarily.

If a new dependency is genuinely unavoidable:

1. Report it.
2. Explain why.
3. Use the smallest possible change.

---

# 6. Change 2 — Settings: Business Logo

Add a business logo management section to the existing Settings page.

The user must be able to:

- View current logo
- Upload logo
- Preview logo
- Replace/edit logo
- Delete logo

Do not redesign Settings.

Only add the requested functionality using the existing Settings design.

---

## 6.1 Business Identity

The logo is a centralized business identity asset.

Conceptually:

```text
Business Identity
        │
        ├── Application
        ├── Settings
        ├── Invoice PDF
        └── Other EXISTING business identity locations
```

Do not create duplicate logo storage.

Reuse existing business/company identity infrastructure where possible.

---

## 6.2 Invoice Integration

The logo should be available to existing business identity locations, including the invoice PDF where applicable.

Do not redesign the invoice.

Do not change:

- invoice calculations
- invoice business logic
- invoice item structure
- payment logic
- existing invoice behavior

Only integrate the saved business logo where the existing invoice implementation supports business branding.

---

## 6.3 Logo UI

Use the existing FRNDLY Settings styling.

Conceptually:

```text
Business Logo

┌──────────────────────────────┐
│                              │
│        Logo Preview          │
│                              │
└──────────────────────────────┘

[ Upload Logo ]

[ Ganti Logo ] [ Hapus Logo ]

[ Simpan Perubahan ]
```

Preview is required.

Do not distort the image.

Support different aspect ratios appropriately.

---

## 6.4 Delete Logo

Delete/reset is required.

After deletion:

> Return to the default FRNDLY placeholder/brand mark.

Never show a broken image.

Do not delete unrelated business data.

---

## 6.5 Upload Security

Use the existing FRNDLY storage/upload architecture if available.

Validate:

- MIME type
- extension
- file size
- safe filename handling
- valid image content
- upload errors

Do not trust the original client filename.

Do not create a duplicate storage architecture.

Audit existing upload limits before creating new ones.

---

# 7. Change 2B — Settings: Admin Profile

Add administrator identity management.

Required fields:

```text
Admin Profile

Profile Photo
Name
Email
Phone Number
Other existing admin identity fields
```

---

## 7.1 Explicitly Excluded

Do NOT add:

- Username
- Role/Jabatan

FRNDLY uses:

> **Email + Password**

for login.

Do not introduce username authentication.

---

## 7.2 Admin Email

The profile email and login email are the **same canonical account email**.

Do not create separate profile and login email fields.

Conceptually:

```text
Admin Account
│
├── Email ← login identity
└── Password

Admin Profile
│
├── Photo
├── Name
└── Phone / existing identity information
```

If the email is changed, the account/login email changes accordingly using the existing authentication architecture.

Do not create a duplicate `profile_email`.

---

## 7.3 Admin Profile Photo

Allow:

- View current photo
- Upload
- Preview
- Replace
- Remove

Use existing avatar/profile infrastructure where available.

The photo should appear in existing locations that already display the administrator identity.

Do not create a new activity/audit system just for this feature.

---

## 7.4 Admin Name

Allow the administrator to edit the display name using the existing authenticated admin/account structure.

Do not create duplicate identity fields unnecessarily.

---

## 7.5 Admin Phone

Allow editing of the phone number if supported by the existing model/specification.

Do not invent unrelated contact fields.

---

## 7.6 Other Identity Fields

"Other admin identity fields" means only fields already supported by the current FRNDLY implementation or existing FRNDLY documentation.

Do not invent:

- employee ID
- role
- department
- job title
- username
- internal code

---

# 8. Password Scope

Password functionality is a future requirement.

Future behavior:

```text
Change / Reset Password
        ↓
Verification
        ↓
Password Update
```

However:

> **Password change/reset is OUT OF SCOPE for this revision.**

Do not implement it now.

Do not redesign authentication.

Do not change login behavior.

Verification requirements should remain for the future password feature.

---

# 9. Admin Count

Current FRNDLY setup:

> **Single administrator**

Do not implement:

- multi-admin
- roles
- permissions management
- RBAC

unless already present and required by existing FRNDLY implementation.

---

# 10. Database Rules

Before changing the database:

1. Inspect existing schema.
2. Inspect admin/user model.
3. Inspect business/company settings model.
4. Inspect existing fields.
5. Reuse existing structure whenever possible.

If a required structure already exists:

> **Reuse it.**

Do not create duplicate fields.

---

## 10.1 Migration Rule

If a schema change is genuinely required:

Do NOT immediately create a migration.

First report:

```text
Database change required:
Yes

Reason:
...

Existing structure:
...

Required field/table:
...

Impact:
...

Migration proposal:
...
```

Wait for approval before structural changes.

Never perform destructive migrations.

Never delete existing data.

---

# 11. Change 3 — Reports Typography

## Objective

Fix the Reports page so all relevant typography uses:

> **Poppins**

This is a **Reports-only typography correction**.

Do not change global typography.

---

## 11.1 Required Poppins Areas

Where applicable:

- Page title
- Section title
- Body text
- Labels
- Filters
- Buttons
- Table headers
- Table content
- Badges
- Status text
- Chart title
- Chart axis labels
- Chart legend
- Chart tooltip
- Chart data labels
- Supporting text

---

## 11.2 Chart Typography

If Reports contains charts, ensure chart-generated text uses Poppins:

- Axis
- Legend
- Tooltip
- Labels
- Title
- Data labels

If the chart library has its own default font:

> Override it locally for Reports only.

Do not alter global chart configuration unnecessarily.

---

# 12. Reports Protection

Do NOT redesign Reports.

Do not change:

- Layout
- Colors
- Spacing
- Chart types
- Filters
- Tables
- Report calculations
- Business logic

Only correct font inconsistency.

---

# 13. Settings Protection

Allowed:

```text
Existing Settings
+
Business Logo section
+
Admin Profile section
```

Not allowed:

- Complete Settings redesign
- New navigation
- New global cards
- New theme
- New colors
- Unrelated settings
- Unrelated refactoring

---

# 14. Dashboard Protection

The only allowed Dashboard modification is:

> **Revenue chart visual enhancement.**

Do not change:

- KPI cards
- Dashboard layout
- Dashboard colors
- Sidebar
- Navbar
- Recent activity
- Other charts
- Dashboard data
- Dashboard filters

unless a tiny supporting change is technically required by the revenue chart.

---

# 15. Dependency Protection

Before installing anything:

1. Inspect current dependencies.
2. Reuse existing libraries.
3. Avoid duplicate functionality.

Do not install:

- Unrelated UI libraries
- A new chart library unnecessarily
- Duplicate icon libraries
- New CSS frameworks
- Alternative frontend frameworks

---

# 16. Design System Protection

All previous FRNDLY frontend/design decisions remain intact.

Do not modify:

- Primary color
- Typography system
- Spacing system
- Radius
- Shadows
- Icons
- Dark/light theme
- Navigation
- Sidebar
- Navbar
- Component system

except for direct local integration required by these three tasks.

---

# 17. Existing Functionality Protection

Do not modify:

- Customer functionality
- Product functionality
- Order functionality
- Invoice business logic
- Payment logic
- Production
- Shipping
- Reviews
- Testimonials
- Report calculations
- Dashboard calculations
- Authentication
- Business rules

unless a direct and unavoidable dependency exists for one of the three requested changes.

---

# 18. Regression Testing

## Dashboard

Verify:

- Revenue values are unchanged
- Existing filters remain functional
- Existing currency format is unchanged
- Chart uses real data
- Points work
- Gradient works
- Tooltip works
- Light theme works
- Dark theme works
- No other dashboard component changed

## Settings

Verify:

- Existing Settings still work
- Logo upload works
- Logo preview works
- Logo replacement works
- Logo deletion works
- Default placeholder works
- Admin photo works
- Admin name works
- Admin email works
- Admin phone works
- Login email remains canonical
- Username is not introduced
- Role/Jabatan is not introduced
- Password functionality remains untouched

## Reports

Verify:

- Report calculations unchanged
- Filters unchanged
- Tables unchanged
- Chart behavior unchanged
- Poppins is applied
- Chart typography uses Poppins

---

# 19. Exact Scope Matrix

## ALLOWED

### Dashboard

- Revenue chart
- Point rendering
- Line rendering
- Gradient area
- Hover point
- Tooltip
- Theme-aware gradient
- Existing currency formatter integration

### Settings

- Business logo
- Logo preview
- Logo replace
- Logo delete/reset
- Business logo persistence
- Admin profile photo
- Admin name
- Admin email
- Admin phone
- Existing admin identity fields
- Existing identity locations
- Existing business identity locations

### Reports

- Poppins typography
- Poppins chart typography
- Local font configuration required for Reports

---

## FORBIDDEN

- Global redesign
- New design system
- New color system
- New theme
- Dark/light redesign
- Sidebar redesign
- Navbar redesign
- Navigation redesign
- Dashboard redesign
- Customer redesign
- Product redesign
- Order redesign
- Invoice redesign
- Payment redesign
- Production redesign
- Shipping redesign
- Review redesign
- Testimonial redesign
- Authentication redesign
- Multi-admin
- Role system
- Username authentication
- Password implementation
- Password reset implementation
- Unrelated database changes
- Unrelated migrations
- Unrelated refactoring
- Unrelated dependencies
- Existing `.md` modification
- Business rule modification

---

# 20. Implementation Principle

The correct approach is:

```text
Existing FRNDLY
      │
      ├── Dashboard revenue chart
      │       └── targeted visual upgrade
      │
      ├── Settings
      │       ├── Business logo
      │       └── Admin profile
      │
      └── Reports
              └── Poppins correction
```

NOT:

```text
Existing FRNDLY
      ↓
Full frontend rewrite
      ↓
Unrelated changes
```

---

# 21. Out-of-Scope Rule

If you discover an issue outside the requested scope:

> **Do not fix it.**

Report it instead:

```text
Out-of-scope issue detected:
...

Why it was not changed:
Outside current revision scope.
```

---

# 22. Final Completion Report

Return:

```text
## FRNDLY Targeted Revision Completed

### 1. Dashboard Revenue Chart
- Changed:
- Data logic preserved:
- Existing chart library:
- Gradient:
- Tooltip:
- Currency formatting:

### 2. Business Logo
- Upload:
- Preview:
- Replace:
- Delete:
- Storage:
- Invoice integration:

### 3. Admin Profile
- Photo:
- Name:
- Email:
- Phone:
- Login email:
- Password scope:

### 4. Reports
- Poppins applied:
- Chart typography:
- Other typography:

### 5. Database
- Changes:
- Migration:

### 6. Dependencies
- Added:
- Removed:

### 7. Tests
- Dashboard:
- Settings:
- Reports:
- Regression:

### 8. Out-of-Scope Issues
- ...
```

---

# 23. Definition of Done

The task is complete when:

- Revenue chart is point + line.
- Revenue chart has gradient area beneath the line.
- Gradient adapts to light/dark theme.
- Points are visible and react on hover.
- Tooltip displays actual data.
- Existing currency format is preserved.
- Existing revenue calculations are unchanged.
- Business logo can be uploaded.
- Logo can be previewed.
- Logo can be replaced.
- Logo can be deleted/reset.
- Default FRNDLY placeholder appears after deletion.
- Logo is available to existing business identity locations, including invoice PDF where applicable.
- Admin can edit profile photo.
- Admin can edit name.
- Admin can edit email.
- Admin can edit phone.
- Admin profile email and login email remain the same canonical account email.
- Username is NOT introduced.
- Role/Jabatan is NOT introduced.
- Password change/reset is NOT implemented in this task.
- Reports typography uses Poppins.
- Reports chart typography uses Poppins.
- No unrelated frontend changes are made.
- No unrelated business logic changes are made.
- No unrelated database changes are made.
- No unrelated dependencies are installed.
- No existing `.md` files are modified.
- Existing FRNDLY functionality continues to work.

---

# 24. Final Reminder

**This is a minor targeted revision.**

If it is not explicitly listed under:

1. Dashboard revenue chart
2. Business logo/admin profile in Settings
3. Poppins correction in Reports

then:

> **LEAVE IT ALONE.**
