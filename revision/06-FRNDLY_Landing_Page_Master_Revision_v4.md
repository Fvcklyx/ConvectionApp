# FRNDLY Landing Page — Master Revision Prompt v4
## Cinematic 3D Spatial Website + Interactive Parallax Scene Engine

> **Revision layer only.**
>
> This document is additive. It does **not** replace, rewrite, delete, rename, merge, or modify any previously created FRNDLY `.md` documentation.
>
> This revision exists because the previous landing-page implementation still behaved too much like a conventional section-based website with animation added on top. **That is no longer the target.**
>
> The target of v4 is a **scene-based, spatial, cinematic interactive experience** whose interaction concept is benchmarked against the supplied reference video.

---

# 0. MASTER DIRECTIVE

You are not being asked to merely "add parallax".

You are being asked to transform the FRNDLY landing page into a:

> **Cinematic 3D Scene Engine for a modern convection/garment business.**

The website must feel like a **physical visual world** rather than a stack of HTML sections.

The reference video demonstrates the interaction concept we want:

- a strong physical/3D composition,
- a visible frame/portal/screen-like boundary,
- depth between foreground, midground, and background,
- objects visually breaking out of a frame,
- camera-like movement,
- perspective,
- dramatic scale changes,
- transitions driven by scroll,
- cinematic lighting/reflection,
- visual continuity between scenes.

The exact subject matter must be changed from the reference into the FRNDLY/convection story.

The reference video is an **interaction and composition benchmark**, not a brand-copying target.

---

# 1. NON-NEGOTIABLE SUCCESS CONDITION

The landing page is **NOT complete** if it merely contains:

- a parallax library,
- a few `translateY()` effects,
- fade-in sections,
- floating cards,
- a 3D object sitting statically on the page,
- a Three.js canvas that does not materially participate in the story,
- generic scroll animations.

The implementation must visibly demonstrate:

```text
REAL SPATIAL DEPTH
        +
3D INTERACTIVE OBJECTS
        +
CAMERA / PERSPECTIVE MOVEMENT
        +
SCROLL-DRIVEN TIMELINE
        +
LAYERED PARALLAX
        +
OBJECT BREAKOUT FROM FRAME
        +
SCENE-TO-SCENE TRANSFORMATION
        +
CINEMATIC STORYTELLING
```

The user should be able to **feel depth** while scrolling.

If a reviewer can disable JavaScript animation and the page still looks conceptually identical, the implementation is probably too shallow.

---

# 2. REFERENCE VIDEO — PRIMARY INTERACTION BENCHMARK

A reference video was supplied with this task.

Known supplied reference asset:

`WhatsApp Video 2026-08-12 at 22.52.14.mp4`

The video is the primary visual/interaction reference for this revision.

The reference demonstrates a cinematic presentation involving:

- a dark physical environment,
- a laptop/screen-like frame,
- content visually existing inside the frame,
- objects extending outside the screen boundary,
- strong foreground/background separation,
- reflection,
- perspective,
- camera-like composition,
- dramatic object scale,
- visual transformation across moments.

## IMPORTANT

Do **not** copy:

- branding,
- logos,
- exact text,
- exact imagery,
- exact website content,
- copyrighted assets,
- exact business concept.

Instead extract the **interaction grammar**:

```text
PHYSICAL FRAME
      ↓
CONTENT INSIDE FRAME
      ↓
DEPTH
      ↓
OBJECT BREAKOUT
      ↓
CAMERA MOVEMENT
      ↓
SCALE TRANSFORMATION
      ↓
SCENE TRANSITION
```

### Reference principle

> **The reference video is an interaction benchmark, not merely visual inspiration.**

The final FRNDLY implementation must be evaluated against the reference conceptually and spatially.

---

# 3. REFERENCE ASSET HANDLING

If the reference video is available inside the project, inspect it.

Preferred project location if a local reference needs to be created:

```text
docs/
└── references/
    └── FRNDLY-parallax-reference.mp4
```

If the video is not physically available to the coding agent:

1. Do not fabricate details that cannot be verified.
2. Use any supplied extracted reference frames if available.
3. Preserve the interaction requirements defined in this document.
4. If the visual benchmark is materially unavailable, report it before claiming visual parity.

Do not replace the reference with a generic "modern landing page" reference.

---

# 4. DOCUMENT GOVERNANCE

## 4.1 Existing `.md` files are protected

Do NOT modify:

- `SRS.md`
- `PRD.md`
- `UIUX.md`
- `Business-Rules.md`
- `Architecture.md`
- `Coding-Rules.md`
- `master-rules.md`
- previous UI/UX revision prompts
- previous feature revision prompts
- previous landing-page revisions
- any other existing FRNDLY `.md`

This v4 document is a new revision layer.

### If conflict occurs

1. Detect it.
2. Identify the conflicting document.
3. Report the conflict.
4. Do not silently overwrite the existing rule.
5. Do not modify the existing document unless explicitly instructed later.

---

# 5. EXISTING APPLICATION PROTECTION

The FRNDLY application already exists and is partially implemented.

Do not rebuild the entire application.

The landing page may be architecturally rebuilt **within its own scope** if the current landing-page architecture prevents the required experience.

You may redesign/rebuild:

- landing-page components,
- landing-page scene architecture,
- landing-page animation system,
- landing-page 3D engine,
- landing-page asset pipeline,
- landing-page route structure where necessary.

You must NOT casually rewrite:

- dashboard,
- customer management,
- product management,
- order management,
- invoice system,
- report system,
- settings,
- authentication,
- database schema,
- unrelated backend logic,
- existing business workflows.

---

# 6. CORE DESIGN PHILOSOPHY

FRNDLY should feel like:

```text
EXISTING FRNDLY BRAND
        +
CINEMATIC DIGITAL EXPERIENCE
        +
PHYSICAL WORLD ILLUSION
        +
REAL 3D
        +
INTERACTIVE PARALLAX
        +
CAMERA MOVEMENT
        +
SCROLL STORYTELLING
```

The landing page should be more expressive than the dashboard.

However:

- FRNDLY remains recognizable.
- Color palette remains derived from the existing application.
- Typography remains compatible with the application.
- Icon language remains compatible.
- Business data remains connected.
- Brand identity remains connected.

Do not create an unrelated futuristic brand.

---

# 7. BRAND CONSISTENCY

Before implementation, inspect the existing FRNDLY application.

Use the existing app as the source of truth for:

- primary color,
- accent colors,
- neutral colors,
- typography,
- logo,
- icon style,
- border radius,
- visual hierarchy,
- light/dark theme,
- button language,
- semantic status colors.

## Important

The landing page may use:

- cinematic dark backgrounds,
- stronger contrast,
- reflective surfaces,
- dramatic lighting,
- controlled atmospheric effects,

but these must remain visually related to FRNDLY.

Do not randomly introduce a new brand palette.

---

# 8. HERO CONCEPT

The hero must NOT be a conventional:

```text
Heading
Paragraph
Button
Image
```

layout with animation.

Instead, establish a **physical cinematic scene**.

Recommended concept:

```text
RAW MATERIAL
     ↓
FABRIC / THREAD
     ↓
DESIGN
     ↓
GARMENT
```

The opening should communicate:

> **FRNDLY turns ideas and materials into finished products.**

The first scene should establish the visual language for the entire experience.

---

# 9. PORTAL / FRAME SYSTEM

A major requirement inspired by the supplied reference is a **frame/portal concept**.

The frame does not have to be a laptop.

It may be:

- fabric panel,
- industrial frame,
- production surface,
- screen,
- glass panel,
- machine opening,
- sewing frame,
- packaging frame,
- physical product frame,
- abstract portal derived from the manufacturing process.

The agent may select the frame that best supports each scene.

## Frame behavior

A frame may:

- contain content,
- establish depth,
- create a foreground boundary,
- reveal a scene,
- hide a scene,
- act as a transition,
- be entered by the camera,
- be exited by the camera,
- be broken by a 3D object.

Example:

```text
┌─────────────────────────────┐
│                             │
│        FRNDLY SCENE         │
│                             │
│            👕               │
│             \               │
│              \              │
└───────────────\─────────────┘
                 \
                  \
                OBJECT
              BREAKS FRAME
```

This breakout behavior is a major requirement.

---

# 10. PHYSICAL WORLD ILLUSION

The page may simulate a physical environment.

Possible elements:

- floor,
- table,
- reflective surface,
- soft shadows,
- ambient lighting,
- depth haze,
- rim lighting,
- controlled reflections,
- glass,
- metal,
- fabric,
- paper,
- industrial surfaces.

The goal:

> Make the website feel like the camera is observing a physical installation.

Do not make every scene visually identical.

---

# 11. CINEMATIC SCENE STRUCTURE

The landing page should be organized as a sequence of scenes.

Suggested narrative:

```text
SCENE 01 — IDEA
    ↓
SCENE 02 — FABRIC
    ↓
SCENE 03 — DESIGN
    ↓
SCENE 04 — CUTTING
    ↓
SCENE 05 — PRINTING / EMBROIDERY
    ↓
SCENE 06 — SEWING
    ↓
SCENE 07 — QUALITY CONTROL
    ↓
SCENE 08 — FINISHING
    ↓
SCENE 09 — PRODUCT
    ↓
SCENE 10 — PACKAGING
    ↓
SCENE 11 — READY TO ORDER
```

This is a storytelling framework, not a rigid requirement.

If audit findings show that another order creates a stronger narrative, adjust it.

---

# 12. SCENE PRINCIPLE

Each scene must have:

```text
PURPOSE
VISUAL ANCHOR
PRIMARY OBJECT
DEPTH LAYERS
CAMERA STATE
SCROLL RANGE
MOTION STATE
TRANSITION OUT
```

Example:

```text
SCENE: CUTTING

Purpose:
Show precision and transformation.

Primary object:
Fabric + cutting pattern.

Background:
Workshop / abstract dark environment.

Midground:
Fabric surface.

Foreground:
Pattern/cutting object.

Camera:
Slow dolly forward.

Scroll:
Fabric moves upward.

Interaction:
Mouse slightly changes perspective.

Exit:
Cut fabric moves toward camera.

Transition:
Camera passes through fabric.
```

---

# 13. SINGLE WORLD VS DISCONNECTED SECTIONS

Do NOT build scenes as unrelated page sections.

Bad:

```text
Section 1
fade out

Section 2
fade in

Section 3
fade out
```

Required:

```text
Scene 1
    ↓
object transformation
    ↓
camera movement
    ↓
scene boundary
    ↓
Scene 2
```

The user should feel:

> "I am moving through one continuous visual world."

---

# 14. SCROLL AS THE MASTER TIMELINE

Scroll must become the primary storytelling input.

Conceptually:

```text
scroll progress
       ↓
scene progress
       ↓
camera
       +
objects
       +
lighting
       +
typography
       +
masks
       +
background
       +
effects
```

Do not implement scroll merely as:

```js
opacity = scrollY
```

Instead build a scene/timeline system.

Example:

```text
0.00 ─────────────── Scene 01
0.10 ─────────────── Scene 01 → 02
0.20 ─────────────── Scene 02
0.30 ─────────────── Scene 02 → 03
...
1.00 ─────────────── Final CTA
```

---

# 15. STICKY SCENE SYSTEM

Use sticky scenes where appropriate.

Example:

```text
SCROLL
   ↓

┌─────────────────────────────┐
│                             │
│          3D SHIRT           │
│                             │
└─────────────────────────────┘

SCENE STAYS STICKY

scroll
 ↓
shirt rotates

scroll
 ↓
camera zooms

scroll
 ↓
shirt moves forward

scroll
 ↓
shirt breaks frame

scroll
 ↓
next scene
```

Do not force every scene to be sticky.

Use the technique where it improves storytelling.

---

# 16. CAMERA SYSTEM

Create a real camera abstraction.

Camera may perform:

- dolly in,
- dolly out,
- zoom,
- orbit,
- tilt,
- pan,
- rotation,
- perspective shifts,
- depth transitions,
- scene entry,
- scene exit.

Example:

```text
CAMERA FAR
    ↓
DOLLY FORWARD
    ↓
OBJECT GROWS
    ↓
OBJECT FILLS VIEWPORT
    ↓
CAMERA PASSES OBJECT
    ↓
NEXT SCENE
```

Camera movement must be smooth and physically believable.

Avoid random camera movement.

---

# 17. OBJECT BREAKOUT

Object breakout is mandatory in multiple meaningful scenes.

Examples:

```text
FABRIC
  ↓
comes out of frame

THREAD
  ↓
crosses viewport

T-SHIRT
  ↓
extends beyond frame

PACKAGE
  ↓
moves toward camera
```

The breakout must be spatially convincing.

Do not fake every breakout using only CSS `z-index`.

Where appropriate, use real 3D positioning and perspective.

---

# 18. DRAMATIC SCALE

Objects may undergo dramatic scale changes.

Example:

```text
small
  ↓
medium
  ↓
large
  ↓
fills viewport
  ↓
breaks frame
  ↓
transforms
```

Do not limit scaling to subtle UI motion.

Use dramatic scale when the narrative supports it.

---

# 19. OBJECT PHYSICS

Motion should feel physical.

Use:

- spring,
- inertia,
- damping,
- momentum,
- velocity-aware transitions,
- controlled overshoot,
- settle behavior.

Avoid:

```text
linear movement
instant stop
robotic transitions
```

Prefer:

```text
movement
   ↓
momentum
   ↓
slight overshoot
   ↓
settle
```

Motion.dev should handle the UI/motion layer where appropriate.

---

# 20. MOUSE + SCROLL COMBINATION

Mouse movement and scroll movement may influence the same object.

Conceptual model:

```text
FINAL TRANSFORM
=
SCROLL TRANSFORM
+
MOUSE TRANSFORM
+
SCENE OFFSET
+
INTERACTION STATE
```

Example:

```text
Scroll:
camera moves forward.

Mouse:
camera subtly orbits.

Hover:
object tilts.

Click:
object rotates.

```

Do not allow interactions to fight each other.

Use spring/damping to blend the inputs.

---

# 21. MOUSE INTERACTION

Implement meaningful mouse interaction.

Possible behavior:

### Hover

```text
object
→ tilt
→ depth shift
→ subtle scale
→ lighting response
```

### Mouse movement

```text
cursor left
→ object slightly follows

cursor right
→ object follows right

cursor up
→ subtle tilt

cursor down
→ subtle tilt
```

### Click

Where appropriate:

```text
click
→ rotate
→ reveal detail
→ transform state
→ trigger transition
```

Not every object needs every interaction.

Interaction must remain purposeful.

---

# 22. 3D PRODUCT VIEWER

The product scene should support an interactive product experience.

Where 3D assets exist, allow:

- rotate,
- drag,
- zoom,
- inspect,
- change viewing angle,
- optionally change product color/material where data supports it.

Example:

```text
             👕
          ↙  ↓  ↘

       BLACK WHITE NAVY

            ROTATE
```

Do not fabricate product variants that do not exist in the data.

---

# 23. DATA-DRIVEN 3D PRODUCTS

Product data may come from the existing application.

Use an adaptive strategy:

```text
Database Product
       ↓
3D asset available?
   ┌───┴────┐
  YES      NO
   ↓        ↓
3D model   Image
   ↓        ↓
Interactive parallax fallback
```

The landing page should not break when a product lacks a 3D model.

---

# 24. 3D ASSET SOURCES

The agent may use:

- GLB,
- GLTF,
- optimized Three.js geometry,
- procedural geometry,
- Blender-generated assets,
- suitable open-source 3D assets,
- properly licensed assets.

If an asset does not exist:

> The agent may create an appropriate asset.

Do not use copyrighted assets without appropriate permission/licensing.

---

# 25. IMAGE ASSET PIPELINE

For photographic scenes:

```text
HD PHOTO
   ↓
CUTOUT / SUBJECT EXTRACTION
   ↓
FOREGROUND
MIDGROUND
BACKGROUND
   ↓
DEPTH COMPOSITION
   ↓
PAN / ZOOM / TILT
   ↓
PARALLAX
```

The agent may source high-quality visual references from:

- Google image search,
- open-source repositories,
- stock/free image sources,
- suitable public image libraries,

but must respect licensing.

Do not use low-resolution or visibly watermarked images.

---

# 26. VIDEO ASSET PIPELINE

Short video clips may be used for:

- background atmosphere,
- machine operation,
- printing,
- sewing,
- fabric movement,
- texture,
- cinematic transition.

Possible structure:

```text
VIDEO
 ↓
MASK
 ↓
DEPTH LAYER
 ↓
PARALLAX
 ↓
OVERLAY
 ↓
MOTION
```

Do not turn the entire landing page into a video player.

Video should be used selectively.

---

# 27. PHOTO + 3D HYBRID SCENES

Do not choose between photography and 3D globally.

A scene may combine:

```text
3D OBJECT
+
HD PHOTO BACKGROUND
+
CUTOUT FOREGROUND
+
HTML TYPOGRAPHY
+
PARTICLES
+
LIGHTING
```

This hybrid approach is encouraged.

---

# 28. TYPOGRAPHY AS A SPATIAL OBJECT

Typography is allowed to have depth.

Text may:

- move in Z-space,
- scale dramatically,
- rotate,
- split,
- merge,
- mask,
- reveal,
- slide,
- move behind objects,
- move in front of objects,
- respond to camera movement.

Example:

```text
             CREATE

                ↓

           [3D SHIRT]

                ↓

              PRINT
```

Typography must remain readable.

Do not distort text purely for decoration if readability is lost.

---

# 29. OBJECT/TEXT DEPTH ORDER

The composition may use:

```text
BACKGROUND
    ↓
MIDGROUND
    ↓
TYPOGRAPHY
    ↓
3D OBJECT
    ↓
FOREGROUND
```

Or:

```text
BACKGROUND
    ↓
TEXT
    ↓
OBJECT
    ↓
TEXT
```

Objects may intentionally cross text boundaries.

This is part of the cinematic spatial language.

---

# 30. TRANSFORMATION BETWEEN SCENES

Whenever possible, let one object become the bridge to the next scene.

Example:

```text
FABRIC
  ↓
folds
  ↓
pattern appears
  ↓
cut
  ↓
garment shape
  ↓
PRINT
  ↓
finished shirt
```

This is preferable to:

```text
fade out
fade in
```

Use:

- morph,
- zoom-through,
- object movement,
- mask,
- camera pass,
- depth transition,
- scale transformation,
- material transformation,
- portal transition.

---

# 31. TRANSITION SYSTEM

Use a combination of:

- object-based transition,
- zoom-through,
- camera movement,
- mask,
- fade,
- slide,
- morph,
- depth reveal.

The transition type should be selected according to the scene.

Do not use the same transition everywhere.

---

# 32. FULLSCREEN 3D WORLD

The landing page may use a fullscreen WebGL/3D canvas as the main visual foundation.

Conceptually:

```text
BODY
│
├── Fullscreen 3D/WebGL Canvas
│   ├── Scene Manager
│   ├── Camera
│   ├── Lights
│   ├── 3D Objects
│   ├── Materials
│   ├── Shaders
│   ├── Particles
│   └── Effects
│
└── HTML Overlay
    ├── Navigation
    ├── Typography
    ├── CTA
    ├── Progress
    └── Accessibility content
```

Do not make WebGL decorative.

The 3D world must materially participate in the story.

---

# 33. WEBGL / SHADER PERMISSION

The agent is explicitly allowed to use:

- WebGL,
- GLSL,
- shader effects,
- displacement,
- noise,
- distortion,
- liquid transitions,
- particles,
- procedural geometry,
- custom materials,

when they improve the intended experience.

Do not add effects merely because they are technically possible.

---

# 34. LIGHTING

3D scenes may use:

- key light,
- fill light,
- rim light,
- environment light,
- contact shadows,
- soft shadows,
- reflections,
- controlled highlights.

Lighting may evolve between scenes.

Example:

```text
Scene A
cool / dark

Scene B
brighter production light

Scene C
strong product rim light

Scene D
clean premium light
```

The lighting should support storytelling.

---

# 35. REFLECTIONS

Reflections are encouraged where visually appropriate.

Possible surfaces:

- floor,
- glass,
- polished metal,
- packaging,
- product surface.

Keep reflections controlled.

Do not make the whole page look like chrome.

---

# 36. PARTICLES / ATMOSPHERE

Particles are allowed:

- fabric fibers,
- dust,
- thread fragments,
- subtle industrial particles,
- light particles,
- small atmospheric elements.

Use them to create depth.

Do not fill the viewport with particles.

---

# 37. CINEMATIC BACKGROUND

The visual direction should resemble the supplied reference:

- dark or controlled cinematic environment,
- high contrast,
- soft light,
- reflective surfaces,
- strong subject focus,
- restrained background.

The exact FRNDLY palette must remain connected to the existing app.

Do not turn the page into an unrelated neon/futuristic theme.

---

# 38. NAVIGATION

Use a minimal floating navigation system.

Recommended:

```text
FRNDLY                 PROCESS
                       PRODUCTS
                       ABOUT
                       CONTACT

                       ●
```

Navigation may transform with scenes.

The final navigation architecture should remain usable.

Avoid a giant conventional navbar covering the cinematic composition.

---

# 39. SCENE PROGRESS INDICATOR

Provide a subtle scene progress indicator.

Examples:

```text
01 / 11

●──────────────○
```

or:

```text
01
│
02
│
03
│
04
```

The indicator must reflect actual scene progress.

It may animate with Motion.dev.

---

# 40. CTA

Primary CTA:

> **Bergabung & Mulai Pesanan**

It should eventually route to:

- customer sign-in,
- customer registration,
- customer portal.

For this revision, focus on the landing page.

Do not implement the full customer ordering portal unless already available and integration is explicitly required.

CTA should be prepared for future integration.

---

# 41. CTA AS PART OF THE WORLD

CTA should not necessarily look like a generic button.

It may:

- float in depth,
- magnetically respond to cursor,
- have spring movement,
- reveal an arrow,
- move toward the cursor,
- participate in scene transition,
- become part of the final composition.

Example:

```text
        READY TO CREATE?

      ┌──────────────────┐
      │ START ORDER  ↗   │
      └──────────────────┘
```

Do not sacrifice usability.

---

# 42. MAGNETIC MICROINTERACTIONS

Allowed for:

- CTA,
- navigation,
- icons,
- important controls.

Possible behavior:

```text
cursor approaches
      ↓
element moves slightly
      ↓
cursor enters
      ↓
element follows
      ↓
cursor leaves
      ↓
spring returns
```

Use restrained movement.

---

# 43. CUSTOM CURSOR

A custom cursor is permitted if the current FRNDLY experience benefits from it.

Possible states:

```text
DEFAULT
HOVER
DRAG
INTERACTIVE
3D OBJECT
CTA
```

Do not destroy native browser affordances.

Provide a suitable fallback for touch devices.

---

# 44. LOADING EXPERIENCE

Loading must be cinematic.

Do not use a fake fixed delay.

Loading duration should be driven by actual readiness of critical assets and application/network conditions.

Example:

```text
0%
 ↓
THREAD / FABRIC MOTION
 ↓
critical assets preload
 ↓
scene engine initializes
 ↓
3D assets ready
 ↓
100%
 ↓
opening scene reveals
```

The loading experience should never intentionally wait longer than necessary.

---

# 45. ASSET LOADING STRATEGY

Use:

### Critical assets

Preload:

- hero 3D object,
- hero textures,
- first scene background,
- critical fonts,
- scene-engine dependencies.

### Non-critical assets

Lazy-load:

- later scene images,
- later 3D models,
- later videos,
- secondary effects.

Example:

```text
SCENE 01 ACTIVE
      ↓
SCENE 02 PRELOAD

SCENE 02 ACTIVE
      ↓
SCENE 03 PRELOAD
```

This allows cinematic visuals without unnecessarily blocking initial load.

---

# 46. DATA-DRIVEN LANDING PAGE

The landing page must be architected so that business content can eventually come from the existing application.

Potential data:

```text
businessName
businessLogo
businessDescription
phone
email
address
socialMedia
products
productCategories
ratings
reviews
testimonials
contactPerson
businessSettings
```

Do not hard-code business identity into dozens of components.

---

# 47. DATABASE INTEGRATION PREPARATION

The landing page should be ready for:

```text
FRNDLY APP
     ↓
Business Settings
     ↓
Products
     ↓
Reviews
     ↓
Contact
     ↓
Landing Page
```

The exact API/database implementation must be determined after auditing the existing project.

Do not invent endpoints.

Do not fabricate database fields.

If an API already exists, reuse it.

---

# 48. PRODUCT DATA FALLBACK

If real product data is unavailable during development:

Use clearly identified mock/placeholder data.

Do not present fake data as real production data.

Architecture should allow:

```text
Mock Data
    ↓
replace adapter
    ↓
Real API
```

without rebuilding scene components.

---

# 49. REVIEW / TESTIMONIAL CONTENT

Reviews may be presented with:

- rating,
- product type,
- short review,
- customer initials/name only if allowed by data/privacy rules.

The user previously requested that testimonials do not require customer photos.

Respect that.

---

# 50. ABOUT / BUSINESS INFORMATION

Landing page should support:

- business name,
- business overview,
- contact person,
- phone,
- email,
- address,
- social media,
- business identity,
- product categories.

Use actual FRNDLY data when available.

Do not invent business information.

---

# 51. PRODUCT PRESENTATION

Initial product cards may remain simple.

The cinematic experience should not force every product into a complex 3D viewer.

Recommended:

```text
Cinematic product scene
        ↓
Simple product overview
        ↓
Product name
Category
Short description
        ↓
Contact / WhatsApp
```

Detailed product ordering can remain a future scope.

---

# 52. WHATSAPP PREPARATION

Product detail may eventually route to WhatsApp.

Prepare CTA architecture for:

```text
Product
   ↓
WhatsApp
   ↓
Admin
```

Do not implement complex automated ordering unless already part of the existing scope.

---

# 53. RESPONSIVE CINEMATIC DESIGN

The cinematic concept must remain consistent across:

- desktop,
- tablet,
- mobile.

But do NOT simply shrink desktop.

Each device may have its own composition.

### Desktop

Wide camera composition.

### Tablet

Reduced depth and adjusted framing.

### Mobile

Portrait composition.

Example:

```text
DESKTOP

TEXT        3D OBJECT
    \       /
     \     /
      FRAME


MOBILE

TEXT

   3D
 OBJECT

 FRAME
```

The narrative remains consistent while composition changes.

---

# 54. MOBILE 3D

Mobile may use:

- reduced polygon complexity,
- fewer particles,
- simplified shadows,
- reduced shader complexity,
- fewer simultaneous objects.

But do NOT turn the mobile experience into a static website.

The spatial storytelling should remain.

---

# 55. DEVICE CAPABILITY SYSTEM

Implement capability-aware rendering.

Conceptually:

```text
HIGH
 ↓
Full 3D
Full effects
Shaders
Particles
Video
Advanced lighting

MEDIUM
 ↓
3D
Reduced particles
Reduced shader complexity
Reduced video

LOW
 ↓
Simplified 3D
Parallax
Motion
Minimal effects
```

Fallback must preserve the **concept**, not simply remove everything.

---

# 56. PERFORMANCE PRINCIPLE

Performance matters.

But:

> **Do not simplify the intended experience prematurely merely because optimization is difficult.**

First build the intended cinematic experience.

Then optimize intelligently.

Optimization techniques may include:

- lazy loading,
- code splitting,
- asset compression,
- GLB optimization,
- texture resizing,
- texture compression,
- instancing,
- object pooling,
- effect reduction,
- device capability detection,
- render throttling where appropriate,
- visibility-based rendering,
- scene disposal.

---

# 57. PERFORMANCE BUDGET

Track:

- initial JavaScript payload,
- 3D asset size,
- texture sizes,
- video sizes,
- WebGL draw calls,
- number of active objects,
- frame rate,
- memory usage,
- mobile behavior.

Do not claim "optimized" without testing.

---

# 58. MOTION SYSTEM

Use **Motion.dev as the primary UI/motion system**.

Use current Motion.dev APIs.

Do not rely on outdated Framer Motion patterns when the current Motion.dev API is available.

Motion should control:

- entrance animation,
- text reveal,
- microinteractions,
- hover,
- gestures,
- layout transitions,
- scroll-linked UI,
- CTA interactions,
- navigation transitions.

---

# 59. GSAP POLICY

Motion.dev remains primary.

GSAP/ScrollTrigger may be used **only when a real cinematic/3D timeline requirement cannot be implemented cleanly with Motion.dev**.

Do not add GSAP automatically.

If GSAP is introduced:

1. Explain why.
2. Keep its scope isolated.
3. Avoid duplicating animation logic.
4. Prevent Motion and GSAP from fighting over the same property.

---

# 60. SMOOTH SCROLL

A smooth-scroll library such as Lenis may be used.

If used:

- integrate it with the animation/render loop correctly,
- avoid scroll hijacking,
- preserve native accessibility,
- preserve keyboard navigation,
- support touch scrolling,
- respect reduced-motion preferences.

Smoothness must not mean disabling normal browser behavior.

---

# 61. SCROLL PHYSICS

Scroll-linked animations should feel:

- smooth,
- responsive,
- inertial,
- controlled.

Avoid excessive lag.

The user should feel that the website responds to scroll rather than fighting it.

---

# 62. BACKGROUND ANIMATION

Backgrounds may include:

- light movement,
- gradient movement,
- subtle particles,
- depth haze,
- texture movement,
- reflections,
- environment motion.

Background animation must support the focal object.

Do not animate everything simultaneously.

---

# 63. ENTRANCE ANIMATIONS

Entrance animations should be scene-aware.

Possible:

```text
camera enters
 ↓
background appears
 ↓
object appears
 ↓
typography reveals
 ↓
interaction becomes active
```

Avoid generic:

```text
everything fade-in 0.5s
```

---

# 64. MICROINTERACTIONS

Include meaningful microinteractions for:

- buttons,
- navigation,
- product cards,
- 3D objects,
- progress indicators,
- CTA,
- cursor,
- interactive imagery.

Microinteraction should communicate:

- affordance,
- state,
- feedback,
- depth.

---

# 65. PARALLAX LAYERS

Every major visual scene should be evaluated for:

```text
BACKGROUND
MIDGROUND
FOREGROUND
```

Possible motion ratios:

```text
Background: slow
Midground: medium
Foreground: fast
3D Object: camera-linked
UI: subtle
```

Do not use identical translation values across layers.

---

# 66. TRUE PARALLAX REQUIREMENT

A scene only qualifies as "true parallax" if there is visible relative movement between depth layers.

Bad:

```text
all layers move together
```

Good:

```text
background  →  1x
midground   →  1.8x
foreground  →  3x
3D object   →  camera/depth-based
```

Values must be tuned visually.

---

# 67. DEPTH COMPOSITING

For 2D scenes:

```text
PHOTO
 ↓
SUBJECT CUTOUT
 ↓
FOREGROUND
 ↓
MIDGROUND
 ↓
BACKGROUND
```

Then animate each layer independently.

Where appropriate, use masks.

---

# 68. MASKS / REVEALS

Allowed techniques:

- clip-path,
- SVG masks,
- CSS masks,
- shader masks,
- image reveal,
- object occlusion.

Use masks to create:

```text
scene appears through fabric
object passes behind text
camera enters portal
product emerges from darkness
```

---

# 69. SCENE OCCLUSION

Objects may intentionally pass:

- behind text,
- in front of text,
- behind frame,
- in front of frame,
- through a mask.

This creates depth.

Use real 3D depth where practical.

---

# 70. 3D SCENE ENGINE ARCHITECTURE

A suitable architecture may resemble:

```text
landing/
│
├── scenes/
│   ├── SceneIntro/
│   ├── SceneFabric/
│   ├── SceneDesign/
│   ├── SceneCutting/
│   ├── ScenePrinting/
│   ├── SceneSewing/
│   ├── SceneQuality/
│   ├── SceneProduct/
│   ├── ScenePackaging/
│   └── SceneCTA/
│
├── engine/
│   ├── SceneManager
│   ├── SceneTimeline
│   ├── CameraController
│   ├── ScrollController
│   ├── ParallaxSystem
│   ├── InteractionSystem
│   ├── AssetManager
│   ├── PerformanceManager
│   └── DeviceCapability
│
├── three/
│   ├── models/
│   ├── materials/
│   ├── shaders/
│   ├── lights/
│   └── effects/
│
├── motion/
│   ├── transitions/
│   ├── microinteractions/
│   └── gestures/
│
├── data/
│   └── landingPageAdapter
│
└── components/
    ├── Navigation
    ├── ProgressIndicator
    ├── CTA
    └── Typography
```

This is an architectural direction, not a command to blindly create all folders.

Reuse the project's existing conventions where possible.

---

# 71. SCENE MANAGER

A central scene manager should know:

```text
current scene
previous scene
next scene
scene progress
camera state
asset state
interaction state
```

Avoid creating isolated animation logic for every section.

---

# 72. CAMERA CONTROLLER

Camera controller should expose concepts such as:

```text
position
rotation
zoom
target
damping
scene offset
mouse influence
scroll influence
```

Do not scatter camera manipulation across unrelated components.

---

# 73. SCENE TIMELINE

Each scene should define:

```text
start
end
enter
active
exit
```

Example:

```text
Scene 03

0.00 → camera enters
0.15 → object appears
0.35 → object moves
0.55 → text reveals
0.75 → object rotates
0.90 → camera advances
1.00 → transition
```

---

# 74. ASSET MANAGER

The asset manager should support:

- preload,
- lazy loading,
- cache,
- cleanup,
- progress reporting,
- error fallback.

Do not load all heavy assets at once.

---

# 75. ERROR FALLBACK

If a 3D asset fails:

```text
3D model
 ↓ failure
optimized image
 ↓
depth/parallax fallback
```

If video fails:

```text
video
 ↓ failure
poster image
```

The landing page must remain usable.

---

# 76. DATA ADAPTER

Create a thin adapter between business data and presentation.

Example conceptual:

```text
businessService
      ↓
landingPageAdapter
      ↓
scene components
```

Do not couple the 3D engine directly to database implementation.

---

# 77. OPEN CODE / AGENT WORKFLOW

The agent MUST NOT start by blindly coding.

Required workflow:

```text
1. AUDIT
      ↓
2. STUDY DOCUMENTATION
      ↓
3. STUDY .opencode/skills
      ↓
4. STUDY CURRENT LANDING PAGE
      ↓
5. STUDY FRNDLY APP DESIGN SYSTEM
      ↓
6. STUDY REFERENCE VIDEO
      ↓
7. DESIGN SCENE MAP
      ↓
8. DESIGN 3D / PARALLAX ARCHITECTURE
      ↓
9. PLAN ASSET PIPELINE
      ↓
10. IMPLEMENT ENGINE
      ↓
11. IMPLEMENT SCENES
      ↓
12. CONNECT REAL DATA
      ↓
13. TEST INTERACTIONS
      ↓
14. VISUAL QA
      ↓
15. PERFORMANCE QA
      ↓
16. ACCESSIBILITY QA
      ↓
17. FINAL POLISH
```

---

# 78. `.opencode/skills` MUST BE STUDIED

Before implementation, inspect:

```text
.opencode/skills/
```

The agent MUST:

1. Discover available skills.
2. Identify relevant skills.
3. Read the relevant instructions.
4. Use them during planning and implementation.
5. Avoid loading unrelated skills unnecessarily.

Relevant categories may include:

```text
UI/UX
3D/WebGL
Motion
Animation
Browser
Visual QA
Asset/Image
Frontend
Performance
Accessibility
```

Do not assume the names above exist.

Inspect the actual folder.

---

# 79. TOKEN-EFFICIENCY RULE

Because this project uses OpenCode/9Router and multiple skills:

Use:

```text
RELEVANT SKILLS
+
RELEVANT FILES
+
RELEVANT CONTEXT
```

instead of loading the entire repository into every task.

Do not repeatedly read unchanged files.

Do not load every skill just because it exists.

But:

> **Do not sacrifice required quality merely to save tokens.**

Use targeted context.

---

# 80. CODEBASE AUDIT BEFORE IMPLEMENTATION

Inspect:

- framework,
- package manager,
- routing,
- landing page,
- dashboard,
- reusable components,
- CSS architecture,
- Tailwind config,
- design tokens,
- fonts,
- icons,
- theme,
- current animation libraries,
- Three.js/R3F availability,
- asset structure,
- API layer,
- database integration,
- business settings,
- product data,
- review data,
- existing `.md` documentation.

Also inspect:

```text
package.json
```

and existing dependency versions.

Do not install a new library when an existing dependency already provides the needed capability.

---

# 81. REUSE BEFORE REBUILD

Before creating a new:

- button,
- typography component,
- card,
- navigation component,
- icon,
- data adapter,
- theme utility,

check whether an existing FRNDLY component can be reused.

Only create a new component if necessary.

---

# 82. DO NOT OVER-ABSTRACT

The scene engine should be reusable but not unnecessarily complex.

Avoid creating:

- 10 abstraction layers for simple animations,
- generic wrappers that obscure behavior,
- duplicate scene systems,
- duplicate animation systems.

Prefer clear, maintainable architecture.

---

# 83. VISUAL QA

After implementation, inspect the actual rendered page.

Do not rely solely on code correctness.

Test:

- initial viewport,
- scrolling,
- scene transitions,
- 3D breakout,
- mouse interaction,
- hover,
- click,
- drag,
- camera,
- text depth,
- loading,
- navigation,
- CTA,
- mobile,
- tablet,
- dark/light if applicable.

---

# 84. REFERENCE COMPARISON QA

Compare the implemented experience with the supplied reference concept.

Ask:

### Spatial

- Is there visible depth?
- Do layers move differently?
- Does the object feel physically present?

### Frame

- Does a frame/portal establish composition?
- Can objects break the frame?

### Camera

- Does scrolling feel like camera movement?
- Are perspective changes visible?

### Scene

- Does one scene transform into another?
- Or are they merely stacked sections?

### Motion

- Is movement continuous?
- Does it have weight?
- Are transitions choreographed?

If the answer is "no", do not declare completion.

---

# 85. ACCEPTANCE CRITERIA — CRITICAL

All of the following should be verified.

## Spatial / Parallax

- [ ] True multi-layer parallax exists.
- [ ] Foreground, midground and background have different motion.
- [ ] 3D depth is visually obvious.
- [ ] Camera movement is visible.
- [ ] Perspective changes are visible.
- [ ] Objects can break the frame.
- [ ] Scroll drives the spatial timeline.
- [ ] Scene transitions are spatial, not merely fade-based.

## 3D

- [ ] Real 3D exists.
- [ ] 3D is not decorative only.
- [ ] 3D responds to scroll.
- [ ] 3D responds to mouse where appropriate.
- [ ] Selected 3D objects respond to hover.
- [ ] Selected objects support click/drag interaction.
- [ ] Product viewer can use real 3D where assets exist.
- [ ] Image fallback exists when 3D is unavailable.

## Cinematic

- [ ] Hero is cinematic.
- [ ] Scenes feel connected.
- [ ] Camera transitions are choreographed.
- [ ] Object transformations bridge scenes.
- [ ] Lighting supports the narrative.
- [ ] Reflections are used where appropriate.
- [ ] Background atmosphere is controlled.
- [ ] Typography participates in the spatial composition.

## Motion

- [ ] Motion.dev is the primary motion system.
- [ ] Entrance animations are meaningful.
- [ ] Hover effects include movement, not only color.
- [ ] Microinteractions exist.
- [ ] Mouse interactions exist.
- [ ] Loading animation exists.
- [ ] Background motion exists.
- [ ] Scroll-linked motion exists.
- [ ] Motion has physical weight.

## Product / Business

- [ ] FRNDLY identity is preserved.
- [ ] Business data can be connected.
- [ ] Product data can be connected.
- [ ] Reviews can be connected.
- [ ] Contact information can be connected.
- [ ] Logo can be connected.
- [ ] CTA is prepared for sign-in/customer portal.
- [ ] WhatsApp integration can be added later without redesigning the scene architecture.

## Responsive

- [ ] Desktop composition is polished.
- [ ] Tablet composition is polished.
- [ ] Mobile composition is intentionally designed.
- [ ] Mobile does not simply shrink desktop.
- [ ] 3D remains meaningful on mobile.
- [ ] Performance adaptation exists.

## Accessibility

- [ ] Keyboard navigation works.
- [ ] Semantic HTML exists.
- [ ] Contrast remains readable.
- [ ] `prefers-reduced-motion` is respected.
- [ ] Native interaction remains available where necessary.

## Performance

- [ ] Critical assets are prioritized.
- [ ] Non-critical assets lazy-load.
- [ ] 3D assets are optimized.
- [ ] Images are optimized.
- [ ] Videos are optimized.
- [ ] Heavy effects are capability-aware.
- [ ] No obvious memory leaks.
- [ ] No unnecessary continuous rendering when scenes are inactive.

## Code quality

- [ ] Existing reusable components were reused where appropriate.
- [ ] No unnecessary duplicate systems were created.
- [ ] Scene architecture is maintainable.
- [ ] 3D engine is isolated from business data.
- [ ] Data adapter exists where necessary.
- [ ] Existing application functionality remains intact.
- [ ] Existing `.md` files remain untouched.

---

# 86. FAILURE CONDITIONS

The task must be considered failed if the result is primarily:

```text
Navbar
Hero
Card
Section
Section
Section
Footer
```

with:

```text
fade
fade
fade
```

and a static 3D object.

It also fails if:

- parallax is barely visible,
- all layers move together,
- 3D is decorative,
- camera never moves,
- objects never break frames,
- scene transitions are unrelated,
- interaction is only color change,
- mouse interaction is fake,
- the reference interaction concept is ignored.

---

# 87. DO NOT OVER-SAFE THE DESIGN

Do not reduce the design to:

- generic SaaS landing page,
- generic 3D hero,
- generic floating cards,
- generic gradient blobs,
- generic glassmorphism,
- generic fade-in animations.

The user explicitly wants:

> **advanced, experimental, cinematic, award-style interaction.**

Take creative risks while preserving usability and FRNDLY identity.

---

# 88. ACCESSIBILITY / REDUCED MOTION

If:

```css
prefers-reduced-motion: reduce
```

is active:

- reduce camera movement,
- reduce parallax,
- disable aggressive effects,
- reduce autoplay motion,
- preserve content and navigation,
- preserve usability.

Do not remove essential information.

---

# 89. SEO

Despite the cinematic architecture, preserve:

- semantic headings,
- crawlable content,
- metadata,
- Open Graph,
- descriptive image alt text,
- structured content where appropriate.

Do not render all important marketing content only inside WebGL.

---

# 90. SECURITY / DATA INTEGRITY

Do not:

- expose secrets,
- expose API keys,
- hard-code credentials,
- fabricate production data,
- directly expose database credentials to the client,
- make destructive database changes.

---

# 91. DEPENDENCY POLICY

Before adding a dependency:

1. Check whether it already exists.
2. Check whether existing dependencies can solve the problem.
3. Add only if it materially improves the implementation.
4. Avoid multiple libraries doing the same job.

Preferred conceptual stack:

```text
React / existing FRNDLY frontend
        +
Motion.dev
        +
React Three Fiber / Three.js if appropriate
        +
Lenis if required
        +
GSAP only when genuinely necessary
```

The actual stack must follow the repository audit.

---

# 92. NEXT-ACTION SCOPE

This revision focuses on the landing page.

Future functionality such as:

- customer portal,
- customer ordering,
- order tracking,
- review submission,
- automatic WhatsApp confirmation,
- automatic order creation,
- customer dashboard,

should be treated as future integration points.

Do not allow future scope to derail the landing-page implementation.

---

# 93. FINAL SCENE

The final scene should bring the story back to the user.

Concept:

```text
Everything we make
starts with your idea.
```

Then:

```text
READY TO CREATE?

[Bergabung & Mulai Pesanan ↗]
```

The CTA should feel like the culmination of the journey, not a random button.

---

# 94. FINAL EXPERIENCE MAP

The intended experience is approximately:

```text
                    OPEN
                     ↓
              CINEMATIC LOAD
                     ↓
                SCENE 01
                 IDEA
                     ↓
             FRAME / PORTAL
                     ↓
               FABRIC / THREAD
                     ↓
             CAMERA MOVEMENT
                     ↓
              SCENE 02
                DESIGN
                     ↓
             OBJECT BREAKOUT
                     ↓
              SCENE 03
               CUTTING
                     ↓
              CAMERA PASS
                     ↓
              SCENE 04
          PRINTING / EMBROIDERY
                     ↓
                3D / VIDEO
                     ↓
              SCENE 05
                SEWING
                     ↓
             PHYSICAL MOTION
                     ↓
              SCENE 06
             QUALITY CONTROL
                     ↓
              SCENE 07
               FINISHING
                     ↓
              SCENE 08
                PRODUCT
                     ↓
             INTERACTIVE 3D
                     ↓
              SCENE 09
              PACKAGING
                     ↓
             OBJECT TRANSITION
                     ↓
              SCENE 10
               FINAL CTA
                     ↓
       BERGABUNG & MULAI PESANAN
```

The exact scene count may change after visual planning.

---

# 95. IMPLEMENTATION RULE

Before coding, the agent must produce an internal/working plan containing:

1. Current architecture.
2. Current landing-page architecture.
3. Existing design system.
4. Relevant `.opencode/skills`.
5. Reference-video interaction analysis.
6. Scene map.
7. Camera map.
8. 3D asset map.
9. Image/video asset map.
10. Scroll timeline.
11. Data integration map.
12. Performance strategy.
13. Responsive strategy.
14. Files to modify.
15. Files to create.
16. Dependencies to add, if any.
17. Risks.

Then implement.

Do not jump directly into a large rewrite.

---

# 96. VISUAL ITERATION LOOP

Use:

```text
IMPLEMENT
   ↓
RUN
   ↓
VIEW
   ↓
COMPARE
   ↓
IDENTIFY VISUAL GAP
   ↓
FIX
   ↓
VIEW AGAIN
```

Repeat until the spatial behavior is convincing.

Do not stop after the first technically functioning implementation.

---

# 97. FINAL PRINCIPLE

The final FRNDLY landing page should feel like:

> **A cinematic journey through the process of turning an idea into a finished garment.**

Not:

> A normal business landing page with some 3D objects added.

The core equation is:

```text
FRNDLY BRAND
      +
CONVECTION STORY
      +
PHYSICAL WORLD ILLUSION
      +
REAL 3D
      +
CAMERA
      +
TRUE PARALLAX
      +
SCROLL TIMELINE
      +
OBJECT BREAKOUT
      +
MOTION.DEV
      +
MICROINTERACTION
      +
CINEMATIC TRANSITIONS
      +
DATA-DRIVEN CONTENT
      +
RESPONSIVE DESIGN
      +
PERFORMANCE ADAPTATION
      =
FRNDLY CINEMATIC INTERACTIVE EXPERIENCE
```

---

# 98. FINAL COMMAND TO THE AGENT

> **Build the experience, not merely the effects.**
>
> Study the existing FRNDLY application.
>
> Study the existing FRNDLY documentation without modifying it.
>
> Study `.opencode/skills` selectively and use the relevant skills.
>
> Study the supplied reference video and treat its interaction concept as the benchmark.
>
> If the current landing-page architecture cannot produce the required spatial experience, redesign/rebuild the landing-page architecture within scope.
>
> Do not confuse "having a parallax library" with creating a parallax website.
>
> Do not confuse "having a 3D model" with creating an interactive 3D experience.
>
> Do not confuse "having animations" with cinematic storytelling.
>
> The user must visibly experience:
>
> **depth → camera movement → layered parallax → object interaction → object breakout → transformation → scene transition → cinematic storytelling.**
>
> Build the FRNDLY landing page as a **continuous interactive world** rather than a collection of animated sections.
>
> Preserve FRNDLY's identity and existing application.
>
> Do not modify existing `.md` documentation.
>
> Do not claim completion until the acceptance criteria have been tested.
