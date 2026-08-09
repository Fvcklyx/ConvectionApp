# FRNDLY UI/UX & Feature Revision Prompt

## Role

You are a senior full-stack engineer, UI/UX designer, and code reviewer working on the existing **ConvectionApp FRNDLY** project.

The application is already partially implemented. **Do not rebuild the application from scratch.** First inspect and understand the existing codebase, then make targeted improvements while preserving working functionality.

---

# 1. Primary Objective

Upgrade and refine the existing FRNDLY application in three areas:

1. **UI/UX modernization and visual consistency**
2. **Edit functionality across master/transaction data**
3. **Professional PDF invoice generation and download**
4. **Improve layout density and eliminate excessive empty space**

The final result should feel like a polished, production-ready business management application for a convection/garment business.

---

# 2. Reference UI

Use the uploaded/reference screenshot as the visual direction.

The screenshot shows a modern dashboard style with:

- Clean light background
- Rounded cards
- Left sidebar navigation
- Compact top navigation/header
- Search bar
- Consistent iconography
- Large but controlled page titles
- Clear spacing hierarchy
- Soft card borders/radius
- Simple status colors
- Responsive layout
- Minimal visual clutter

## Important

The reference image is a **visual reference only**.

Do NOT copy the MyData branding, text, business identity, or exact content.

Keep the application identity as:

**FRNDLY — ConvectionApp**

The existing FRNDLY business functionality and terminology must remain.

---

# 3. Existing UI Direction

The existing project already contains a dashboard/sidebar/navigation system and uses Poppins typography and a light/dark theme structure.

The current CSS includes:

- Poppins
- Sidebar navigation
- Collapsible sidebar
- Sticky top navigation
- Search bar
- Notification/profile controls
- Theme toggle
- Dashboard cards
- Responsive breakpoints

The existing JavaScript also controls sidebar collapse, responsive behavior, search behavior, and theme switching.

Therefore:

**Do not replace the existing layout blindly.**

Inspect the current implementation first and improve it incrementally.

---

# 4. UI/UX Requirements

## 4.1 Typography

Standardize typography throughout FRNDLY.

Use a consistent font hierarchy:

- Page title
- Section title
- Card title
- Table heading
- Body text
- Supporting text
- Button text
- Form labels`
- Status labels

Maintain Poppins if it is already part of the project unless there is a strong technical reason to change it.

Avoid excessive font sizes and excessive font weights.

---

## 4.2 Navigation

Improve the existing sidebar and top navigation.

Requirements:

- Consistent icon style
- Consistent icon sizing
- Clear active navigation state
- Better spacing
- Proper alignment between icons and text
- Responsive collapse behavior
- Sidebar should not consume excessive horizontal space
- Top navigation should remain compact
- Search should remain usable on desktop and mobile
- Theme toggle should remain functional
- Profile/notification controls should be visually consistent

Do not remove existing navigation functionality.

---

## 4.3 Icons

Standardize iconography across the application.

Use one consistent icon library/style where possible.

Avoid mixing unrelated icon styles.

Icons must communicate the action clearly.

Examples:

- Dashboard
- Customers
- Products
- Orders
- Invoice
- Payment
- Production
- Shipping
- Review
- Settings
- Add
- Edit
- Delete
- Download
- Search
- Filter
- More actions

---

# 5. Fix Excessive Empty Space

This is a high-priority issue.

Several pages currently have excessive unused whitespace, especially around:

- Product lists
- Customer lists
- Tables
- Forms
- Cards
- Content columns
- Left/right layout areas

The layout should use the available viewport more efficiently.

## Requirements

- Reduce unnecessary margins and padding.
- Avoid oversized empty containers.
- Use responsive grid/flex layouts correctly.
- Allow tables and cards to expand into available space.
- Avoid fixed heights unless functionally necessary.
- Do not leave large blank areas beside lists/forms.
- Make two-column layouts proportionally balanced.
- Ensure content grows naturally with the viewport.
- Maintain adequate breathing room; do NOT make the interface cramped.

The goal is:

**compact but comfortable**, not dense or cluttered.

---

# 6. Responsive Layout

Verify the application at:

- Desktop
- Laptop
- Tablet
- Mobile

Check:

- Sidebar
- Navbar
- Tables
- Forms
- Cards
- Buttons
- Modals
- Dropdowns
- Search
- Action menus

No horizontal overflow should occur unless a wide data table genuinely requires horizontal scrolling.

---

# 7. Add EDIT Functionality

Add an **Edit** action wherever records can currently be created and/or deleted.

At minimum inspect:

- Customers
- Products
- Orders
- Invoice-related records
- Other master data
- Other editable business records

The user should NOT need to delete and recreate a record just because information changed.

## Edit workflow

Preferred flow:

```text
List
 ↓
Action menu
 ↓
Edit
 ↓
Pre-filled form
 ↓
Modify data
 ↓
Validate
 ↓
Save
 ↓
Success feedback
 ↓
Updated list
```

## Requirements

- Existing values must be pre-filled.
- Validation must remain active.
- Do not create duplicate records accidentally.
- Preserve relationships with related records.
- Do not break foreign-key relationships.
- Show clear success/error feedback.
- Preserve existing styling.
- Use the same form component where practical.
- Avoid unnecessary duplicate UI/code.

If the project uses CRUD controllers/services/components, follow the existing architecture.

---

# 8. Edit Action UI

For list/table actions, use a clean action pattern.

Example:

```text
[ View ] [ Edit ] [ Delete ]
```

or a three-dot menu:

```text
⋮
├── View
├── Edit
└── Delete
```

Use a confirmation step for destructive deletion.

Do not make Edit visually subordinate or difficult to discover.

---

# 9. Invoice PDF Feature

Add a professional **Download Invoice PDF** feature.

The invoice must be generated from the actual invoice/order data in the database.

Do NOT generate a static or fake PDF.

---

## 9.1 Invoice PDF structure

The PDF should contain:

### Header

- FRNDLY logo/branding if available
- FRNDLY / ConvectionApp name
- Business contact information if available
- Invoice title
- Invoice number
- Invoice date

### Customer information

- Customer name
- Phone number
- Email
- Address
- City
- Province

Only display fields that actually exist in the project.

### Order information

- Order number/reference
- Order date
- Current order status
- Payment status

### Item table

Use a professional table containing at least:

| No | Product | Detail | Qty | Unit Price | Discount | Subtotal |
|---|---|---|---:|---:|---:|---:|

Adapt the columns to the actual database/business model.

If product details include:

- Size
- Color
- Design notes
- Customization
- Other specifications

display them clearly in the item/detail section.

### Totals

Show:

- Subtotal
- Discount
- DP/payment received
- Remaining balance
- Grand total

Only include calculations supported by the existing business logic.

### Footer

Include appropriate:

- Payment information
- Notes
- Thank-you message
- FRNDLY contact information

Do not invent business information.

---

# 10. Invoice PDF Quality

The PDF should look like a real professional business invoice.

Requirements:

- A4 format
- Clean margins
- Clear typography
- Structured header
- Proper table alignment
- Currency formatting
- Page-break handling
- Multiple invoice items supported
- Long product names handled correctly
- Long customer information handled correctly
- No text overlapping
- No clipped content
- Header/footer consistency
- Professional spacing

If the invoice has many items, the table must continue correctly onto additional pages.

---

# 11. Download Behavior

Add a clear action:

**Download Invoice PDF**

Possible locations:

- Invoice detail page
- Invoice/order action menu
- Invoice list

Prefer the existing application action pattern.

The user should be able to download the generated PDF without manually printing the page.

---

# 12. Data Integrity

When implementing Edit and Invoice PDF:

- Inspect existing database schema first.
- Inspect existing migrations.
- Inspect models and relationships.
- Inspect controllers/services.
- Inspect routes.
- Inspect frontend components/forms.
- Do not create duplicate tables unnecessarily.
- Do not change business rules without explicit justification.
- Do not perform destructive migrations.
- Preserve existing records.

If the current schema is insufficient for a requested feature, explain the required schema change before making destructive changes.

---

# 13. Existing Architecture

Respect the architecture already used by FRNDLY.

Before changing code, identify:

- Backend framework
- Frontend framework
- Routing approach
- Database
- Authentication
- Existing component system
- Existing CSS/Tailwind setup
- Existing icon library
- Existing PDF library, if any

Prefer existing dependencies.

Do not install a new library when the existing project already provides an appropriate solution.

---

# 14. Code Quality Rules

Do not perform an unnecessary rewrite.

Follow:

```text
Inspect
 ↓
Understand
 ↓
Plan
 ↓
Implement
 ↓
Test
 ↓
Review
```

Rules:

1. Preserve working functionality.
2. Make changes incrementally.
3. Avoid unrelated refactoring.
4. Reuse existing components.
5. Keep naming conventions consistent.
6. Avoid duplicated logic.
7. Validate user input.
8. Handle errors properly.
9. Keep responsive behavior intact.
10. Do not silently change business logic.

---

# 15. Testing Requirements

After implementation, test:

## UI

- Sidebar
- Navbar
- Dashboard
- Customer page
- Product page
- Order page
- Invoice page
- Forms
- Action menus
- Responsive layout

## Edit

Test:

- Open edit
- Existing data appears
- Modify data
- Validation
- Save
- Updated data appears
- Relationships remain intact

## Invoice

Test:

- Open invoice
- Correct invoice number
- Correct customer
- Correct products
- Correct quantity
- Correct unit price
- Correct subtotal
- Correct discount
- Correct payment/DP
- Correct remaining balance
- Correct grand total
- Download PDF
- Open PDF
- Check multiple items
- Check long item names
- Check multi-page invoices

---

# 16. Important AI Workflow

Because this project is already partially built:

### FIRST

Audit the current implementation.

### SECOND

Identify exactly which files/components/routes/controllers/models are involved.

### THIRD

Create an implementation plan.

### FOURTH

Implement the smallest appropriate changes.

### FIFTH

Run tests/build/lint where applicable.

### SIXTH

Review for regressions.

### SEVENTH

Report:

- Files changed
- Features added
- UI changes
- Database changes
- Tests performed
- Remaining issues

---

# 17. Do NOT Do These Things

Never:

- Rebuild FRNDLY from scratch
- Replace the entire frontend unnecessarily
- Delete working features
- Delete database records
- Replace business logic without approval
- Introduce unnecessary dependencies
- Hardcode invoice data
- Create fake PDF data
- Hardcode customer/product information
- Use placeholder data in production functionality
- Remove responsive behavior
- Make destructive migrations without approval
- Change the FRNDLY business identity to the reference screenshot's identity

---

# 18. Expected Final Result

The final FRNDLY application should:

- Look visually consistent with the provided reference
- Maintain FRNDLY branding and business content
- Have a clean modern dashboard
- Have consistent typography
- Have consistent icons
- Have compact navigation
- Use screen space efficiently
- Have responsive layouts
- Allow editing existing records
- Generate professional invoice PDFs
- Support detailed invoice item tables
- Preserve existing functionality
- Have no unnecessary UI clutter
- Have no excessive empty space

---

# 19. Implementation Priority

Work in this order:

### Phase 1 — Audit

Do not modify code.

### Phase 2 — Global UI/UX

Fix:

- typography
- navigation
- icons
- spacing
- cards
- tables
- responsive layout
- excessive whitespace

### Phase 3 — CRUD Edit

Implement Edit functionality for relevant entities.

### Phase 4 — Invoice PDF

Implement structured invoice generation and download.

### Phase 5 — Testing

Test all changed functionality.

### Phase 6 — Final UI polish

Fix inconsistencies discovered during testing.

---

# 20. First Instruction

Before modifying anything, perform an audit of the existing FRNDLY project based on this specification.

Do NOT immediately start coding.

Return:

1. Current architecture
2. Relevant files
3. Current UI structure
4. Current CRUD capabilities
5. Current invoice implementation
6. Existing PDF capability/library
7. Problems found
8. Recommended implementation plan
9. Potential risks
10. Estimated implementation phases

Then wait for approval before making large architectural changes.
