# FRNDLY Landing Page --- Master Revision Prompt v2

## 3D + Motion.dev + Existing FRNDLY Design System + Storytelling Scroll

> This is a new landing-page revision document. Do not modify or
> overwrite any previously created `.md` files.

------------------------------------------------------------------------

## 0. NON-NEGOTIABLE OBJECTIVE

Upgrade the existing FRNDLY landing page into a premium, modern,
interactive marketing website for a convection/garment business while
remaining visually connected to the existing FRNDLY application.

The previous implementation is insufficient if: - there is no real 3D
interaction, - the 3D object is only a static image, - major sections
are static, - scroll only moves between sections, - Motion is only used
for a few fade-ins, - the landing page invents an unrelated color
system, - the landing page looks like a separate product from the FRNDLY
app.

The final result must combine:

**Existing FRNDLY Design System + Real 3D + Motion.dev + Scroll-linked
storytelling + Interactive micro-interactions +
Responsive/performance-aware implementation.**

------------------------------------------------------------------------

## 1. AUDIT BEFORE CODING

Before changing anything, inspect:

1.  Existing frontend folder structure.
2.  Dashboard.
3.  Navigation/sidebar/header.
4.  Buttons and cards.
5.  Forms.
6.  Typography.
7.  Icon system.
8.  Color palette.
9.  Tailwind configuration.
10. CSS variables/design tokens.
11. Dark/light theme.
12. Existing animation dependencies.
13. `package.json`.
14. Reusable components.
15. Existing layouts.
16. Existing assets.
17. Logo/business identity data.
18. Product data structure.
19. Existing database/API integration relevant to public business
    information.

### HARD CONSTRAINT

Do not invent a new design system before understanding the current
FRNDLY design system.

The landing page is a marketing layer on top of FRNDLY, not a completely
separate visual identity.

------------------------------------------------------------------------

## 2. EXISTING FRNDLY APP IS THE PRIMARY VISUAL REFERENCE

The existing application is the source of truth for:

-   brand colors,
-   typography,
-   spacing philosophy,
-   border radius,
-   component treatment,
-   button styling,
-   icon style,
-   light/dark theme,
-   visual hierarchy,
-   design tokens.

The landing page may be more expressive and cinematic than the
dashboard, but it must remain recognizably FRNDLY.

### COLOR CONSTRAINT

Do not invent an unrelated color palette.

Inspect: - CSS variables, - Tailwind theme, - dashboard colors, - button
colors, - backgrounds/surfaces, - text colors, - accent colors.

Reuse those tokens.

Landing-page-specific colors may only be: - existing FRNDLY colors, -
derived shades/tints, - opacity variants, - gradients derived from
existing colors, - compatible neutral surfaces.

Do not introduce an unrelated neon/purple/blue/orange palette merely
because it is trendy.

------------------------------------------------------------------------

## 3. TYPOGRAPHY AND ICONS

Reuse the existing FRNDLY typography system.

If the application uses Poppins or another established font, keep it.

Do not introduce an unrelated display font without explicit
justification.

Reuse the existing icon library/system. Do not mix unrelated icon
families.

------------------------------------------------------------------------

## 4. REAL 3D IS REQUIRED

The landing page MUST contain actual interactive 3D elements.

A static PNG/JPG does not count as 3D.

Preferred approach:

-   React Three Fiber / Three.js
-   `.glb` / `.gltf` assets
-   controlled camera and lighting
-   Motion.dev for surrounding UI and motion state
-   scroll-linked transformations
-   responsive quality settings

Possible 3D objects: - T-shirt - Hoodie - Jacket - Polo - Lanyard -
Cap - other relevant convection products

Use a hybrid approach: - Hero/featured storytelling: real 3D. - Product
overview cards: optimized images are acceptable. - Featured product
interactions: use 3D when it materially improves the experience.

Do not force every product into 3D.

------------------------------------------------------------------------

## 5. 3D MUST PARTICIPATE IN THE STORY

Do not simply place a rotating shirt in the hero and leave it there.

Example:

``` text
HERO
↓
3D garment appears
↓
SCROLL
↓
garment rotates
↓
SCROLL
↓
object/camera position changes
↓
SCROLL
↓
product information appears
↓
SCROLL
↓
object transitions toward product showcase
```

The exact narrative can adapt to the final design, but the 3D object
must have a meaningful relationship with scroll progression.

------------------------------------------------------------------------

## 6. MOTION.DEV IS THE REQUIRED MOTION SYSTEM

Use the current Motion for React package:

``` bash
npm install motion
```

Use:

``` js
import { motion } from "motion/react";
```

Do not use the legacy:

``` js
import { motion } from "framer-motion";
```

unless the existing project requires legacy compatibility.

Official references: - https://motion.dev/docs/react -
https://motion.dev/docs/react-animation

Motion currently supports scroll-triggered and scroll-linked animation,
layout animation, gestures, Motion Values and related APIs.

------------------------------------------------------------------------

## 7. MOTION.DEV APIs TO EXPLORE

Before implementation, review current Motion.dev documentation and
select the appropriate APIs.

Relevant APIs: - `motion` - `whileInView` - `whileHover` - `whileTap` -
`whileFocus` - `useScroll` - `useTransform` - `useSpring` -
`useMotionValueEvent` - `useInView` - `useAnimate` - `AnimatePresence` -
variants - stagger - layout animations - shared layout techniques where
appropriate - reduced-motion support

References: - https://motion.dev/docs/react-scroll-animations -
https://motion.dev/docs/react-use-scroll -
https://motion.dev/docs/react-gestures -
https://motion.dev/docs/layout-animations

------------------------------------------------------------------------

## 8. MOTION ARCHITECTURE

Create a consistent motion language.

### Page entrance

-   staggered hero text
-   CTA entrance
-   3D object entrance
-   navigation entrance

### Scroll-triggered

Use `whileInView` / `useInView` for elements entering the viewport: -
section headings, - cards, - reviews, - testimonials.

### Scroll-linked

Use `useScroll` + Motion Values for continuous relationships: - 3D
rotation, - parallax, - hero movement, - progress, - scale, -
storytelling transitions.

### Gesture

Use: - `whileHover` - `whileTap` - `whileFocus`

for: - CTA, - product cards, - navigation, - social links.

### Layout transitions

Use Motion layout capabilities when elements genuinely change layout or
state.

------------------------------------------------------------------------

## 9. EVERY MAJOR SECTION MUST HAVE INTENTIONAL MOTION

The page must not feel static.

  Section            Motion
  ------------------ ----------------------------------
  Navbar             entrance + hide/show
  Hero               stagger + 3D + parallax
  Overview           reveal + subtle movement
  Product showcase   card hover + object/image motion
  Process            sequential storytelling
  Order flow         step transitions
  Reviews            reveal + micro interaction
  Testimonials       controlled entrance
  About              layered reveal
  CTA                strong but restrained motion
  Footer             subtle entrance

This does not mean every element must constantly move.

Motion must communicate hierarchy and interaction.

------------------------------------------------------------------------

## 10. NO FAKE MOTION

This is insufficient:

``` text
opacity: 0 → 1
```

applied once to an entire section.

Use meaningful combinations: - stagger, - depth, - parallax, - 3D
movement, - hover response, - scroll-linked transformation, - scale, -
directional transitions, - layout transitions.

Avoid repetitive fade-ins everywhere.

------------------------------------------------------------------------

## 11. STORYTELLING SCROLL IS THE CORE EXPERIENCE

The landing page must feel like one connected narrative.

Recommended story:

``` text
HERO
↓
What the business offers
↓
Why choose the business
↓
Products
↓
How ordering works
↓
Quality/process
↓
Reviews & ratings
↓
Testimonials
↓
About us
↓
Contact/social
↓
Final CTA
```

The sections must visually and motion-wise transition into one another.

Scrolling should feel like advancing the story, not merely moving
between blocks.

------------------------------------------------------------------------

## 12. SECTION TRANSITIONS

Use Motion.dev and scroll/layout techniques such as: - overlapping
elements, - parallax, - persistent visual anchors, - persistent 3D
object, - background transitions, - scale transitions, - controlled
blur, - clipping/masking, - directional movement, - shared product
imagery.

Use selectively. Avoid excessive blur and effects.

------------------------------------------------------------------------

## 13. HERO

The hero MUST communicate: - what the convection business does, - its
value, - visual identity, - primary CTA.

Required: 1. Strong headline. 2. Supporting description. 3. Primary CTA:
**Bergabung & Mulai Pesanan** 4. Secondary interaction where
appropriate. 5. Real 3D product/object. 6. Motion entrance sequence. 7.
Scroll-linked interaction.

The 3D object is a primary visual anchor.

------------------------------------------------------------------------

## 14. CTA

Primary CTA:

**Bergabung & Mulai Pesanan**

Destination: - customer sign-in/login.

The landing page should prepare for future: - registration, - login, -
ordering, - order status, - reviews, - testimonials.

Do not overbuild the customer portal in this task.

------------------------------------------------------------------------

## 15. DATABASE / API INTEGRATION

Use existing FRNDLY data where available: - business name, - logo, -
phone, - email, - address, - social media, - products, - ratings, -
reviews, - testimonials.

Do not fabricate fields.

Inspect the existing database/API first.

If a required public-data endpoint does not exist: 1. document the
dependency, 2. use isolated mock data only if necessary for UI
development, 3. clearly isolate mock data, 4. do not silently modify
unrelated backend systems.

------------------------------------------------------------------------

## 16. PRODUCT SECTION

Keep product cards relatively simple for the first version.

Possible content: - product image, - product name, - short
description, - category, - optional starting information.

Product detail may continue through WhatsApp.

Use 3D selectively for featured products.

------------------------------------------------------------------------

## 17. REVIEWS / RATINGS

Do not require customer photos.

Use: - rating, - review text, - product/category, - optional customer
display name according to existing data/privacy rules.

------------------------------------------------------------------------

## 18. ABOUT US

Use actual existing information: - business name, - logo, - contact
person, - phone, - email, - address, - social media.

Never invent contact information.

------------------------------------------------------------------------

## 19. THEME SYSTEM

The landing page MUST remain compatible with the existing FRNDLY theme
system.

``` text
FRNDLY Light
↓
Landing Light

FRNDLY Dark
↓
Landing Dark
```

The landing page may use richer compositions, depth and 3D lighting, but
its base palette must remain derived from FRNDLY.

Do not create a separate unrelated theme architecture.

------------------------------------------------------------------------

## 20. RESPONSIVE MOTION

### Desktop

Allow: - full 3D, - richer parallax, - complex storytelling, - larger
object movement.

### Tablet

Reduce: - movement distance, - simultaneous animation, - 3D complexity.

### Mobile

Prioritize: - readability, - performance, - touch, - reduced object
movement, - safe layout.

No horizontal overflow.

------------------------------------------------------------------------

## 21. PERFORMANCE

Use: - lazy loading, - optimized 3D assets, - compressed textures, -
suitable device pixel ratio, - reduced geometry where possible, - lazy
initialization, - conditional rendering, - transform/opacity-based
animation where appropriate, - Motion Values for continuous motion.

Motion's current documentation describes native ScrollTimeline use where
available for scroll-linked animation and fallbacks when needed.

Reference: https://motion.dev/docs/react-use-scroll

------------------------------------------------------------------------

## 22. REDUCED MOTION / ACCESSIBILITY

Respect:

``` text
prefers-reduced-motion
```

Use Motion's reduced-motion support where appropriate.

A reduced-motion user must still receive a fully functional landing page
without intense 3D/scroll effects.

------------------------------------------------------------------------

## 23. INTERACTION DESIGN

Interactive elements must provide clear feedback.

Buttons: - hover, - tap, - focus.

Cards: - controlled hover movement/elevation.

Navigation: - active state, - smooth transitions.

Links: - visible interaction state.

Do not let animation interfere with keyboard navigation or clicking.

------------------------------------------------------------------------

## 24. 3D COMPONENT ARCHITECTURE

If React Three Fiber is used, isolate the 3D system.

Conceptual structure:

``` text
src/
├── components/
│   ├── landing/
│   │   ├── Hero/
│   │   ├── StorySections/
│   │   ├── ProductShowcase/
│   │   ├── Process/
│   │   ├── Reviews/
│   │   ├── Testimonials/
│   │   ├── About/
│   │   └── CTA/
│   │
│   ├── motion/
│   │   ├── Reveal/
│   │   ├── Parallax/
│   │   ├── Stagger/
│   │   └── MotionSection/
│   │
│   └── three/
│       ├── ProductScene/
│       ├── TShirtModel/
│       ├── HoodieModel/
│       └── SceneLighting/
```

Adapt to the actual repository structure. Do not blindly create this
exact tree.

------------------------------------------------------------------------

## 25. MOTION PRIMITIVES

Where repetition exists, create reusable primitives such as:

``` text
Reveal
StaggerContainer
StaggerItem
Parallax
FloatingObject
MagneticCTA
SectionTransition
```

Do not over-abstract.

------------------------------------------------------------------------

## 26. MOTION TOKENS

Create consistent motion values for: - fast, - normal, - slow, -
spring, - soft spring, - stagger.

Do not randomly use different durations everywhere.

------------------------------------------------------------------------

## 27. DO NOT MIX ANIMATION LIBRARIES

Motion.dev is the primary animation system.

Do not introduce GSAP, legacy Framer Motion, or another animation
library unless a concrete technical reason exists and it is explicitly
approved.

------------------------------------------------------------------------

## 28. VISUAL QUALITY BAR

The final result must feel: - modern, - premium, - clean, -
interactive, - visually coherent, - responsive, - technically polished.

Avoid: - generic SaaS templates, - excessive rounded cards, - excessive
glassmorphism, - random gradients, - excessive shadows, - random
floating elements, - random animation, - static hero image, -
inconsistent icons, - unrelated colors.

------------------------------------------------------------------------

## 29. REQUIRED PRE-CODING REPORT

Before implementation, report:

### A. Existing Design System

-   current font,
-   colors,
-   theme tokens,
-   component library,
-   icon system.

### B. Existing Frontend Architecture

-   framework,
-   routing,
-   component structure,
-   styling,
-   animation setup.

### C. Existing Data

-   business data,
-   product data,
-   reviews,
-   contact data,
-   API availability.

### D. 3D Strategy

-   technology,
-   asset format,
-   lazy loading,
-   responsive strategy.

### E. Motion Strategy

List motion behavior for every major section.

### F. Risks

-   performance,
-   compatibility,
-   dependency conflicts,
-   data/API gaps.

Do not make broad code changes before this audit and plan are complete.

------------------------------------------------------------------------

## 30. IMPLEMENTATION WORKFLOW

``` text
AUDIT
↓
UNDERSTAND EXISTING DESIGN SYSTEM
↓
IDENTIFY DATA/API
↓
PLAN
↓
IMPLEMENT FOUNDATION
↓
IMPLEMENT REAL 3D
↓
IMPLEMENT MOTION SYSTEM
↓
IMPLEMENT STORYTELLING SCROLL
↓
IMPLEMENT SECTIONS
↓
RESPONSIVE OPTIMIZATION
↓
ACCESSIBILITY
↓
BROWSER TEST
↓
VISUAL REVIEW
↓
CODE REVIEW
↓
FIX
↓
FINAL VERIFICATION
```

------------------------------------------------------------------------

## 31. ACCEPTANCE CRITERIA

The landing page is NOT complete unless:

-   [ ] Real 3D exists and is visible.
-   [ ] 3D responds meaningfully to scroll/interaction.
-   [ ] Motion.dev is the primary motion system.
-   [ ] Major sections have intentional motion.
-   [ ] Scroll storytelling connects sections.
-   [ ] Hero contains meaningful 3D interaction.
-   [ ] Existing FRNDLY color system is preserved.
-   [ ] Existing typography is preserved.
-   [ ] Existing icon language is preserved.
-   [ ] Light/dark theme remains coherent.
-   [ ] Desktop is polished.
-   [ ] Tablet is polished.
-   [ ] Mobile is polished.
-   [ ] Reduced motion is supported.
-   [ ] 3D assets are optimized.
-   [ ] No horizontal overflow exists.
-   [ ] CTA routes to customer sign-in/login.
-   [ ] Existing application functionality is not broken.
-   [ ] Existing `.md` documentation is untouched.
-   [ ] Existing reusable components are reused where appropriate.
-   [ ] Browser testing is completed.
-   [ ] Visual review is completed.
-   [ ] Code review is completed.

------------------------------------------------------------------------

## 32. CRITICAL CONSTRAINTS

1.  Do not change unrelated application functionality.
2.  Do not rewrite existing `.md` files.
3.  Do not replace the existing design system.
4.  Do not invent a new brand palette.
5.  Do not use a static image as a substitute for required 3D.
6.  Do not use only fade-in animations and call the page animated.
7.  Do not use legacy Framer Motion imports when current Motion.dev can
    be used.
8.  Do not add multiple animation libraries unnecessarily.
9.  Do not make every element move constantly.
10. Do not sacrifice performance for visual effects.
11. Do not fabricate business/database data.
12. Do not modify unrelated backend modules.
13. Do not make destructive database changes.
14. Do not create unnecessary duplicate components.
15. Do not remove existing functionality without explicit approval.

------------------------------------------------------------------------

## 33. FINAL DESIGN PRINCIPLE

FRNDLY should feel like:

> **The existing FRNDLY application evolved into an immersive
> public-facing experience.**

Not:

> **A completely different website that happens to link to FRNDLY.**

The landing page should belong to the same product ecosystem while being
more expressive, cinematic and interactive.

Core experience:

``` text
FRNDLY DESIGN SYSTEM
        +
REAL 3D
        +
MOTION.DEV
        +
SCROLL-LINKED STORYTELLING
        +
MICRO-INTERACTIONS
        +
RESPONSIVE PERFORMANCE
        =
PREMIUM FRNDLY LANDING PAGE
```

------------------------------------------------------------------------

## 34. OFFICIAL MOTION.DEV REFERENCES

Use the current official documentation as the technical reference:

-   https://motion.dev/docs/react
-   https://motion.dev/docs/react-animation
-   https://motion.dev/docs/react-scroll-animations
-   https://motion.dev/docs/react-use-scroll
-   https://motion.dev/docs/react-gestures
-   https://motion.dev/docs/layout-animations

Do not rely on outdated Framer Motion examples when an equivalent
current Motion.dev API exists.
