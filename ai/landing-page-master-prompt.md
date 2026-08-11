# FRNDLY — Immersive Public Landing Page Master Prompt

## 1. Purpose

Build a premium, public-facing marketing landing page inside the existing FRNDLY / ConvectionApp ecosystem.

This is an **addition to the existing application**, not a rebuild.

The landing page must:

- Market the convection business.
- Introduce the business.
- Showcase products.
- Build trust through reviews and ratings.
- Display approved testimonials.
- Explain the ordering process.
- Show About Us and contact information.
- Provide WhatsApp consultation.
- Prepare a clean integration point for the future customer portal.

---

# 2. Core Architecture

Use the existing FRNDLY project and existing database.

Target concept:

```text
FRNDLY
├── Public / Landing
│   └── /
├── Customer
│   ├── /signin
│   ├── /login
│   └── future customer portal
└── Admin
    └── existing admin application
```

Do **not** create a separate landing-page project.

Follow the actual repository architecture as the source of truth.

Do not force a new folder structure if an equivalent existing structure already exists.

---

# 3. Single Source of Truth

The landing page must use the existing FRNDLY data ecosystem.

```text
Existing Database
├── Business Settings ──→ Landing
├── Products ───────────→ Landing
├── Reviews ────────────→ Landing
├── Ratings ────────────→ Landing
├── Testimonials ───────→ Landing
└── Contact/Social ─────→ Landing
```

Do not duplicate business information in frontend code.

The landing page must dynamically use:

- Business name
- Business logo
- Phone / WhatsApp
- Email
- Address
- Social media
- Products
- Reviews
- Ratings
- Testimonials

If data is missing, use a safe fallback or hide that section. Never fabricate business facts.

---

# 4. Business Identity

FRNDLY is currently a temporary/default business name.

The actual business name must remain editable from the existing application Settings.

Do not hardcode:

```js
const companyName = "FRNDLY";
```

except as a fallback when no business identity exists.

The same rule applies to the logo and business contact information.

If the admin changes the logo or business name in Settings, the landing page should automatically reflect the change.

Do not create a second independent business identity system.

---

# 5. Visual Direction

Selected direction:

> **Award-winning / immersive**

Combined with:

> **Hybrid Light/Dark**

The visual style should feel:

- Modern
- Premium
- Immersive
- Interactive
- Memorable
- Professional
- Product-focused
- Conversion-focused

It must still be highly usable.

Do not make it feel like:

- A generic SaaS template
- A basic corporate website
- A dashboard with a marketing page attached
- An experimental portfolio that sacrifices usability

---

# 6. Hybrid Light/Dark Storytelling

Use a hybrid visual rhythm rather than one permanent theme.

Suggested flow:

```text
DARK
Hero
 ↓
LIGHT
Products
 ↓
DARK
Why Choose Us / 3D Story
 ↓
LIGHT
How It Works
 ↓
DARK
Reviews / Social Proof
 ↓
LIGHT
About Us / FAQ
 ↓
DARK
Final CTA
 ↓
Footer
```

This is a visual direction, not an inflexible rule.

Keep the existing application's global theme system intact. The public landing page may have its own scoped visual treatment.

---

# 7. Scroll Storytelling — CRITICAL

The page must feel like **one continuous story**.

Do not create disconnected animations:

```text
Section 1 → random animation
Section 2 → random animation
Section 3 → random animation
```

Instead:

```text
Hero
 ↓
3D object introduced
 ↓
Scroll
 ↓
Object moves / transforms
 ↓
Products appear
 ↓
Object transitions
 ↓
Process section
 ↓
Story continues
 ↓
Reviews / trust
 ↓
Final CTA
```

Animations and transitions should make the entire page feel connected.

---

# 8. 3D Direction

Use a combination of product-related 3D visuals.

Potential objects:

- T-shirt
- Jacket
- Lanyard
- ID card
- Apparel package
- Fabric
- Manufacturing-related objects

3D should have a purpose.

Do not add abstract 3D simply for decoration.

---

# 9. Hero 3D

The Hero should have a strong 3D visual.

Concept:

```text
CUSTOM APPAREL &
CONVECTION SOLUTION

Template business description

[ Bergabung & Mulai Pesanan ]
[ Lihat Produk ]

                 3D PRODUCT
```

The exact business name and information must remain dynamic.

---

# 10. 3D Scroll Transformation

The 3D visual should participate in the story.

Possible sequence:

```text
Hero
 ↓
Object floats
 ↓
Scroll
 ↓
Object rotates
 ↓
Object moves toward product section
 ↓
Scale changes
 ↓
Products appear
 ↓
Object transitions into another scene
```

Prefer meaningful transformations over continuous spinning.

---

# 11. Product Visuals

Products may use high-quality visual template/reference images during development.

Suitable examples:

- T-shirts
- Jackets
- Lanyards
- ID cards
- Event apparel
- Other convection products

Transparent-background product visuals are preferred.

These are temporary marketing/template assets and do not necessarily represent exact physical products.

Do not make unsupported claims that a template image is the actual product.

---

# 12. Image Sourcing

Development may use high-quality product visual references.

Requirements:

- High resolution
- Consistent visual style
- Prefer transparent background
- Avoid obvious watermarks
- Avoid broken hotlinks
- Do not rely permanently on unstable external image URLs

Structure the implementation so official product images can later replace the temporary assets without changing component architecture.

If external assets are used, do not imply ownership by the business.

---

# 13. Optional 3D Product Conversion

Where practical:

```text
T-shirt → 3D T-shirt
Jacket → 3D Jacket
Lanyard → 3D Lanyard
ID Card → 3D Card
```

Do not force true 3D everywhere.

If heavy 3D is not practical, use:

- Transparent PNG
- CSS transforms
- Layered images
- Parallax
- Lightweight visual effects

The goal is storytelling and visual quality, not maximum technical complexity.

---

# 14. UI/UX Pro Max

Use the available UI/UX Pro Max skill as the design reasoning layer.

Apply it to:

- Visual hierarchy
- Typography hierarchy
- Spacing
- Contrast
- Responsive behavior
- Accessibility
- CTA placement
- Information architecture
- Interaction design
- Component consistency
- Mobile usability
- Performance

Do not blindly apply a generic design system.

Adapt everything to a modern convection business.

---

# 15. 21st.dev

Use 21st.dev for modern component patterns and inspiration.

Potential uses:

- Hero
- CTA
- Interactive cards
- Navigation
- Bento layouts
- Social proof
- Modern visual effects
- Animated components

Do not blindly copy a complete template.

Adapt components to FRNDLY and the existing architecture.

---

# 16. Framer Motion

Use Framer Motion for smooth motion where appropriate.

Potential uses:

- Scroll reveal
- Scroll-linked motion
- Text reveal
- Card entrance
- Hover interaction
- Layout transitions
- Navigation transitions
- Storytelling transitions

Do not add animation simply because it is possible.

Every major animation should have a visual or UX purpose.

---

# 17. Reduced Motion

Respect user reduced-motion preferences.

When reduced motion is enabled:

- Reduce 3D movement.
- Reduce parallax.
- Reduce scroll-linked transforms.
- Preserve content.
- Preserve navigation.
- Preserve usability.

Do not hide important information because animation is disabled.

---

# 18. Header

Include:

- Dynamic business logo
- Dynamic business name
- Beranda
- Produk
- Tentang Kami
- Cara Pesan
- Review / Testimonial
- Primary CTA

Primary CTA:

> **Bergabung & Mulai Pesanan**

Secondary CTA:

> **Konsultasi via WhatsApp**

On mobile, simplify navigation appropriately.

---

# 19. Header Behavior

Recommended:

```text
Top
↓
Transparent / integrated with hero

Scroll
↓
Compact / elevated header
```

Keep it accessible and not unnecessarily large.

---

# 20. Hero

Purpose:

> Explain what the business does and give the visitor a reason to continue.

Include:

- Dynamic business name
- Strong headline
- Short overview
- Primary CTA
- Secondary CTA
- 3D visual

Template headline:

> **Wujudkan Apparel Custom yang Sesuai dengan Identitasmu**

Template description:

> Kami membantu kebutuhan apparel custom untuk event, komunitas, organisasi, perusahaan, sekolah, kampus, dan berbagai kebutuhan lainnya dengan proses yang praktis dan fleksibel.

This is template copy and must remain adaptable.

---

# 21. Hero CTA

Primary:

> **Bergabung & Mulai Pesanan**

Flow:

```text
CTA
 ↓
/signin or /login
 ↓
Future Customer Authentication
```

Do not implement the complete customer portal now.

Secondary:

> **Konsultasi via WhatsApp**

Use the current business WhatsApp/phone data.

---

# 22. Trust / Social Proof

After the hero, show credibility.

Possible dynamic metrics:

- Average rating
- Number of reviews
- Number of completed orders
- Number of products
- Other measurable existing business data

Never invent numbers.

If a metric does not exist, omit it.

---

# 23. Product Showcase

Product cards are currently an overview only.

Use:

- Product image
- Product name
- Short description
- Category
- Starting price
- Relevant public product information

Do not expose internal/admin-only data.

---

# 24. Product Price

Use the price from the existing database where available.

Display concept:

> Mulai dari Rp XX.XXX

Reuse the existing FRNDLY currency formatter.

Do not create a second currency formatter.

If a product has no valid public price:

> Use a WhatsApp consultation CTA instead of inventing a price.

---

# 25. Product CTA

Do not create a large product-detail/order system yet.

Use:

> **Konsultasi via WhatsApp**

Possible generated message:

```text
Halo, saya tertarik dengan produk [Nama Produk].
Saya ingin konsultasi lebih lanjut.
```

Do not implement automated ordering in this phase.

---

# 26. Why Choose Us

Add a marketing section around themes such as:

- Custom Design
- Flexible Production
- Quality Focus
- Responsive Consultation
- Transparent Process
- Reliable Service

Do not make unsupported factual claims.

---

# 27. Suitable For

Show potential customer segments:

```text
Event
Komunitas
Organisasi
Perusahaan
Kampus
Sekolah
Brand
```

Use engaging cards or horizontal storytelling.

---

# 28. How It Works

Show the ordering journey:

```text
01 Konsultasi
 ↓
02 Pilih Produk
 ↓
03 Konfirmasi Desain
 ↓
04 Produksi
 ↓
05 Selesai
```

The actual process must remain consistent with existing FRNDLY business rules.

Do not invent contradictory rules.

---

# 29. 3D Process Story

Connect the 3D visual language to the ordering journey.

Concept:

```text
Consultation
 ↓
Product
 ↓
Design
 ↓
Production
 ↓
Finished Apparel
```

The visual may transform between stages.

---

# 30. Reviews

Use actual approved/public reviews from the database.

Do not fabricate review content.

Do not expose private customer information.

Possible display:

```text
★★★★★
"Review content..."

Product:
Kaos Custom

Rating:
9 / 10
```

Follow existing visibility/approval rules.

---

# 31. Rating

Follow the actual database rating structure.

If the system uses 1–10:

```text
9.6 / 10
★★★★★
```

Do not alter the underlying rating system.

If the actual database differs, adapt the presentation.

---

# 32. Testimonials

Show approved testimonials.

Do NOT display customer photos.

Use:

```text
"Testimonial text..."

— Available customer label

Product:
Kaos Custom

Rating:
9 / 10
```

Only display information allowed for public presentation.

---

# 33. About Us

Recommended structure:

```text
About Us

[Business Logo]

Business overview

Our Values

Business Information
├── Address
├── Phone
├── Email
└── Other available information

Social Media
├── Instagram
├── TikTok
├── Facebook
└── Other available links
```

Use dynamic data where available.

---

# 34. Business Overview Template

If a complete public description is not stored in the database, use neutral template content.

Example:

> **[Nama Bisnis]** merupakan usaha konveksi yang melayani kebutuhan apparel dan atribut custom untuk berbagai kebutuhan, mulai dari event, komunitas, organisasi, perusahaan, hingga kebutuhan personal. Kami berfokus pada proses yang fleksibel dan membantu pelanggan mewujudkan kebutuhan apparel sesuai konsep dan kebutuhannya.

Do not make unsupported claims about:

- Being number one
- Years of experience
- Production capacity
- Guarantees
- Market position

unless supported by actual business data.

---

# 35. FAQ

Add FAQ.

Possible questions:

- Apa saja produk yang tersedia?
- Apakah bisa custom desain?
- Berapa minimum order?
- Berapa lama proses produksi?
- Bagaimana proses pemesanan?
- Apakah bisa konsultasi terlebih dahulu?
- Bagaimana cara pembayaran?
- Bagaimana cara menghubungi admin?

Answers must follow existing FRNDLY business rules.

If information does not exist, use configurable/template wording.

---

# 36. Final CTA

Use a strong conversion section.

Example:

> **Siap mewujudkan kebutuhan apparel kamu?**

Supporting text:

> Konsultasikan kebutuhanmu bersama kami dan mulai buat pesanan sesuai kebutuhan.

Primary:

> **Bergabung & Mulai Pesanan**

Secondary:

> **Konsultasi via WhatsApp**

Use the dark/cinematic visual language.

---

# 37. Footer

Include where available:

- Business logo
- Business name
- Short description
- Navigation
- Contact
- Address
- Email
- Phone / WhatsApp
- Social media
- Copyright
- Existing legal links

Do not invent legal pages.

---

# 38. Customer System Preparation

Customer ordering is NOT implemented now.

Only prepare integration points.

Future:

```text
Landing
 ↓
Bergabung & Mulai Pesanan
 ↓
Sign In / Login
 ↓
Customer Portal
 ↓
Order
 ↓
Order Status
 ↓
Review
 ↓
Testimonial
```

For now, only create clean navigation to the existing/future signin/login route.

---

# 39. WhatsApp

Current scope:

> Direct WhatsApp link only.

Future scope may include automated order confirmation.

Do not implement:

- WhatsApp API
- Automated order processing
- Automated confirmation
- Customer order synchronization

Those belong to a future phase.

---

# 40. Privacy

Never expose:

- Admin-only data
- Private customer data
- Internal notes
- Internal orders
- Sensitive customer information
- Credentials

Only expose data suitable for public marketing.

---

# 41. SEO

Implement basic SEO:

- Meaningful title
- Meta description
- Open Graph metadata
- Semantic headings
- Image alt text
- Canonical URL where appropriate
- Clean public route
- Semantic HTML

Use dynamic business name where appropriate.

Do not create misleading SEO claims.

---

# 42. Performance

The page contains:

- 3D
- Framer Motion
- Scroll storytelling
- High-quality images

Therefore performance is critical.

Use:

- Lazy loading
- Optimized images
- Proper image dimensions
- Efficient rendering
- Minimal unnecessary rerenders
- Lazy-loaded heavy 3D
- Mobile optimization
- Reduced effects on low-power devices where appropriate

Avoid multiple heavy WebGL scenes running simultaneously.

---

# 43. Responsive Behavior

### Desktop

- Full 3D
- Rich scroll storytelling
- Parallax
- Complex compositions
- Full motion

### Tablet

- Reduced 3D complexity
- Reduced animation
- Simplified layouts

### Mobile

- Optimized 3D
- Reduced heavy effects
- Clear hierarchy
- Touch-friendly controls
- Readable typography
- No horizontal overflow
- Fast loading

Do not simply scale down desktop.

---

# 44. Component Architecture

Avoid giant components.

Conceptual structure:

```text
Landing
├── Header
├── Hero
├── TrustSection
├── ProductShowcase
├── WhyChooseUs
├── SuitableFor
├── ProcessSection
├── Story3D
├── ReviewSection
├── TestimonialSection
├── AboutSection
├── FAQSection
├── FinalCTA
└── Footer
```

Adapt this to the actual repository.

Before creating a new component, search for an existing equivalent.

---

# 45. File and Folder Management

The project must remain clean.

Rules:

- Follow existing repository conventions.
- No duplicate components.
- No duplicate API clients.
- No duplicate models.
- No duplicate utilities.
- No random root files.
- No `LandingPage2`, `LandingPageNew`, etc.
- Organize 3D assets.
- Organize public images.
- Organize animation utilities.
- Separate presentation from business logic.
- Reuse existing data-fetching patterns.

Do not force a new architecture over the existing one.

---

# 46. Data Fetching

Reuse the existing application data architecture.

Conceptually:

```text
Landing
 ↓
Existing API / Server Data Layer
 ↓
Existing Backend
 ↓
Existing Database
```

Do not create a second API architecture solely for the landing page.

---

# 47. Fallback Data

When data is empty:

- Business name → FRNDLY fallback
- Description → neutral template
- Logo → default FRNDLY mark
- Phone → hide if unavailable
- Social platform → hide if unavailable
- Products → safe empty state
- Reviews → safe empty state

Never fabricate business metrics or reviews.

---

# 48. Empty States

If products are unavailable:

> Produk sedang dipersiapkan.

If reviews are unavailable:

> Belum ada ulasan yang dapat ditampilkan.

If contact data is unavailable:

> Hide unavailable contact methods.

Never show broken links.

---

# 49. Database Protection

Before any migration:

1. Inspect existing schema.
2. Inspect existing models.
3. Inspect existing APIs.
4. Reuse existing fields.
5. Only add fields when genuinely necessary.

If structural database changes are required:

> Report them before applying potentially destructive changes.

Never delete existing data.

---

# 50. Existing App Protection

Do not break:

- Admin dashboard
- Customer management
- Product management
- Order management
- Invoice
- Settings
- Reports
- Authentication
- Existing business logic

Do not modify unrelated functionality.

---

# 51. No Global Design Reset

Do not use this landing page task to:

- Replace global design system
- Replace global fonts
- Replace global colors
- Replace global icons
- Redesign admin dashboard
- Redesign Settings
- Redesign Reports
- Redesign existing customer pages

Landing page styling may be immersive and distinct while remaining architecturally consistent.

---

# 52. Initial Audit

Before coding, inspect:

### Project

- Framework
- Build system
- Routing
- Component architecture
- CSS/design system
- Existing animation libraries
- Existing 3D capabilities
- Existing UI libraries

### Data

- Business settings
- Products
- Reviews
- Ratings
- Testimonials
- Contact information
- Social media
- Authentication routes

### Documentation

Read relevant existing FRNDLY documentation.

Do not modify it.

---

# 53. Required Pre-Coding Report

Before implementation, report:

```text
## Landing Page Audit

### Existing Architecture
...

### Existing Routes
...

### Existing Business Data
...

### Existing Product Data
...

### Existing Review/Rating/Testimonial Data
...

### Existing Authentication Route
...

### Existing Design System
...

### Existing Animation Libraries
...

### Existing 3D Capabilities
...

### Files to Create
...

### Files to Modify
...

### Database Changes
...

### New Dependencies
...

### Risks
...
```

Do not silently install major dependencies or change structural parts of the app.

---

# 54. Dependency Strategy

First reuse existing dependencies.

Potential technologies include:

- Framer Motion
- 21st.dev components
- Existing UI component library
- Existing 3D solution

But do not install a dependency simply because it appears in this prompt.

First inspect the repository.

If already installed:

> Reuse it.

If missing:

> Determine whether it is actually required.

Keep dependency footprint minimal.

---

# 55. 3D Technology Strategy

If an existing suitable 3D implementation exists, reuse it.

If true 3D is required, evaluate:

- Bundle size
- Mobile performance
- Existing architecture
- Compatibility
- Maintenance complexity

3D is a storytelling tool, not the goal by itself.

---

# 56. Quality Bar

The result should feel like:

> **A premium modern convection brand website.**

Not:

> A dashboard with a landing page attached.

Public site purpose:

```text
Landing
→ Marketing / Trust / Conversion

Admin
→ Productivity / Management
```

---

# 57. First-Time Visitor Test

Within 5 seconds, the visitor should understand:

- What business this is
- What it sells
- Why it matters
- What to click

Within 15 seconds, they should discover:

- Products
- Benefits
- Ordering process
- Reviews
- Contact

Before leaving, they should easily:

- Contact WhatsApp
- Start customer authentication
- Understand the business
- Find product information

---

# 58. Implementation Order

Follow:

```text
1. Inspect repository
2. Inspect architecture
3. Inspect routes
4. Inspect database models
5. Inspect existing APIs/data layer
6. Inspect business settings
7. Inspect product data
8. Inspect reviews/ratings/testimonials
9. Inspect authentication routes
10. Inspect existing design system
11. Create landing architecture
12. Base layout
13. Dynamic business identity
14. Hero
15. Trust section
16. Product showcase
17. Why Choose Us
18. Suitable For
19. How It Works
20. 3D storytelling
21. Reviews
22. Ratings
23. Testimonials
24. About Us
25. FAQ
26. Final CTA
27. Footer
28. Responsive behavior
29. Accessibility
30. SEO
31. Performance optimization
32. Regression testing
```

---

# 59. Definition of Done

The landing page is complete when:

- It exists inside the existing FRNDLY application.
- It uses the existing database.
- Business name is dynamic.
- Business logo is dynamic.
- Business contact information is dynamic where available.
- Products come from existing data.
- Product cards provide an overview.
- Product consultation can open WhatsApp.
- Reviews use approved/public data.
- Ratings follow the existing database structure.
- Testimonials do not display customer photos.
- About Us uses existing business information.
- FAQ exists.
- Why Choose Us exists.
- Suitable For exists.
- How It Works exists.
- Final CTA exists.
- Customer CTA points to Sign In/Login.
- WhatsApp CTA uses business contact data.
- Hybrid light/dark storytelling is implemented.
- 3D storytelling is meaningful.
- Scroll transitions feel connected.
- Framer Motion is used appropriately.
- UI/UX Pro Max principles are applied.
- 21st.dev patterns are adapted appropriately.
- Responsive behavior is intentional.
- Reduced-motion behavior is supported.
- SEO basics are implemented.
- Performance is optimized.
- Existing app functionality remains intact.
- Existing documentation remains unchanged.
- No unrelated refactoring is performed.
- No unnecessary database changes are performed.
- Folder structure remains clean.
- No duplicate components or APIs are introduced.

---

# 60. Final Agent Instruction

This is an existing, partially completed application.

Your task is:

> **Add a premium immersive public landing page to FRNDLY — do not rebuild FRNDLY.**

Respect:

- Existing architecture
- Existing data
- Existing business rules
- Existing documentation
- Existing authentication
- Existing components
- Existing database

The visual target:

> **Premium + Immersive + Modern + 3D + Smooth Scroll Storytelling + Hybrid Light/Dark + Conversion-focused + Performance-conscious**

The architecture target:

> **One FRNDLY application + one database + shared business data + clean separation between Public, Customer, and Admin experiences.**

When uncertain:

> Inspect the existing project first.

When an existing implementation can be reused:

> Reuse it.

When a change is outside the landing-page scope:

> Do not make it.

When structural changes are required:

> Report them before proceeding.
