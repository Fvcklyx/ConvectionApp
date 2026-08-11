# FRNDLY Landing Page — Master Revision Prompt v3
## Cinematic + Experimental Interactive Parallax Experience

> Advanced master instruction for the next FRNDLY landing-page revision.
>
> **Do NOT modify, rewrite, delete, or replace any previously created `.md` documentation.** This document is additive and governs the next landing-page implementation.

---

## 1. CORE OBJECTIVE

Transform the current FRNDLY landing page into a **cinematic, premium, experimental, highly interactive parallax experience**.

Combine:

- Existing FRNDLY design system
- Real interactive 3D
- Motion.dev
- Scroll-linked choreography
- Cinematic parallax
- Mouse interaction
- Drag/rotate interaction
- Click interaction
- Physics-like movement
- Hover effects
- Loading animations
- Entrance animations
- Microinteractions
- Background animations
- Image-depth compositing
- Pan / zoom / tilt
- Masks and reveals
- Scene transitions
- Optional WebGL/shader effects
- Responsive cinematic behavior
- Performance-aware asset loading
- Relevant `.opencode/skills`

The result should feel closer to an **interactive premium brand / award-style website** than a generic SaaS landing page.

However:

> **FRNDLY must remain recognizable as the same product ecosystem as the existing application.**

---

## 2. DESIGN PRINCIPLE

The landing page is not a new unrelated brand.

```text
EXISTING FRNDLY APP
        +
CINEMATIC MARKETING EXPERIENCE
        +
INTERACTIVE 3D
        +
PARALLAX
        +
MOTION
```

The visual language may become more expressive than the dashboard, but:

- colors remain derived from FRNDLY,
- typography remains consistent,
- icon language remains consistent,
- brand identity remains consistent,
- dark/light theme remains compatible,
- existing business identity remains connected.

---

## 3. MANDATORY AUDIT BEFORE CODING

Before changing implementation, inspect:

1. Frontend framework.
2. Routing.
3. Existing landing page.
4. Dashboard.
5. Existing layouts.
6. Navigation/header.
7. Existing reusable components.
8. Typography and font loading.
9. Tailwind configuration.
10. CSS variables/design tokens.
11. Light/dark theme.
12. Icon system.
13. Existing animation dependencies.
14. `package.json`.
15. Existing asset structure.
16. Business/company data.
17. Product data.
18. Review/rating data.
19. API/database access patterns.
20. Existing image handling.
21. Existing performance optimizations.

Do not redesign blindly.

---

## 4. `.opencode/skills` MUST BE STUDIED

Before implementation, inspect:

```text
.opencode/skills/
```

The agent MUST:

1. Discover available skills.
2. Read relevant skill instructions.
3. Identify which skills apply to the current task.
4. Use relevant skills during planning and implementation.
5. Avoid loading unrelated skills unnecessarily.
6. Reuse skill guidance instead of reinventing established workflows.

Skill selection should be task-aware:

```text
UI task
→ UI/UX skill

3D task
→ 3D/WebGL skill if available

Motion task
→ animation/motion skill if available

Asset task
→ asset/image skill if available

Browser validation
→ browser/testing skill if available
```

### Token-efficiency rule

Load skills selectively according to relevance.

```text
Relevant skills
+
Relevant files
+
Relevant context
=
Maximum quality with minimum unnecessary context
```

Do not sacrifice implementation quality merely to reduce context.

---

## 5. EXISTING FRNDLY DESIGN SYSTEM IS THE SOURCE OF TRUTH

Inspect and reuse:

- color palette,
- CSS variables,
- typography,
- component tokens,
- buttons,
- cards,
- borders,
- radius,
- shadows,
- spacing,
- iconography,
- theme system.

### Color rule

Do NOT invent an unrelated brand palette.

Allowed:

- existing FRNDLY colors,
- derived shades,
- derived tints,
- opacity variants,
- gradients based on existing colors,
- compatible neutrals.

Do not suddenly introduce an unrelated neon/purple/orange/blue brand identity.

The landing page can be visually richer without becoming visually unrelated.

---

## 6. CINEMATIC + EXPERIMENTAL VISUAL DIRECTION

Target:

> **Cinematic + Experimental, while remaining usable.**

Use:

- depth,
- movement,
- layered composition,
- perspective,
- responsive objects,
- cinematic transitions,
- interactive scenes,
- dynamic imagery,
- 3D,
- parallax.

Avoid turning the website into an unreadable visual experiment.

---

## 7. REAL 3D — NOT DECORATION

3D MUST be interactive.

Preferred technology:

- React Three Fiber
- Three.js
- `.glb` / `.gltf`
- Motion.dev for surrounding motion/state
- WebGL when appropriate

Possible objects:

- T-shirt
- Hoodie
- Jacket
- Polo
- Cap
- Lanyard
- other relevant convection products.

---

## 8. FULL 3D INTERACTION

### Hover

```text
mouse enters
→ object tilts
→ subtle camera response
→ lighting/depth response
```

### Mouse movement

```text
mouse position
→ normalized coordinates
→ spring-based object/camera movement
```

### Click

May trigger:

- state transition,
- rotation,
- camera change,
- material/color state,
- reveal,
- detail mode.

### Drag

Where useful:

```text
drag
→ rotate object
release
→ inertia/spring return
```

### Scroll

May control:

- rotation,
- translation,
- scale,
- camera movement,
- scene transition.

Do not force every interaction onto every 3D object.

---

## 9. PHYSICS-LIKE MOVEMENT

Use Motion Values + spring/inertia-style behavior where appropriate.

Example:

```text
Mouse moves
↓
3D object follows
↓
mouse stops
↓
object continues subtly
↓
spring settles
```

Movement should feel natural rather than mechanically attached to the cursor.

---

## 10. MOTION.DEV IS THE PRIMARY MOTION SYSTEM

Use current Motion for React:

```bash
npm install motion
```

Preferred:

```js
import { motion } from "motion/react";
```

Do not use:

```js
import { motion } from "framer-motion";
```

unless legacy compatibility is genuinely required.

Official references:

- https://motion.dev/docs/react
- https://motion.dev/docs/react-animation
- https://motion.dev/docs/react-scroll-animations
- https://motion.dev/docs/react-use-scroll
- https://motion.dev/docs/react-gestures
- https://motion.dev/docs/layout-animations

---

## 11. MOTION.DEV FEATURES

Review current Motion.dev documentation before implementation.

Use when appropriate:

- `motion`
- variants
- `whileInView`
- `whileHover`
- `whileTap`
- `whileFocus`
- `useScroll`
- `useTransform`
- `useSpring`
- `useMotionValue`
- `useMotionValueEvent`
- `useInView`
- `useAnimate`
- `AnimatePresence`
- stagger
- layout animations
- reduced-motion support

Select APIs based on interaction requirements rather than using them arbitrarily.

---

## 12. NO FAKE ANIMATION

This is not enough:

```text
opacity 0 → 1
```

for every section.

Use meaningful:

- translate,
- scale,
- rotate,
- perspective,
- parallax,
- depth,
- stagger,
- reveal,
- mask,
- camera movement,
- object movement,
- layout transition,
- image movement.

Color change alone should not be the default interaction.

---

## 13. INTERACTION-FIRST DESIGN

Interactive elements should preferably respond through:

- movement,
- depth,
- scale,
- tilt,
- rotation,
- position,
- perspective,
- reveal,
- magnetic behavior,
- image movement,
- cursor relationship.

Example:

```text
BUTTON
→ magnetic movement
→ slight scale
→ directional icon movement
```

Not merely:

```text
BUTTON
→ background color changes
```

Not every element must be animated simultaneously; motion should remain intentional.

---

## 14. ADVANCED INTERACTION SYSTEM

Possible interactions:

### Hover
- magnetic buttons
- tilt cards
- image zoom
- 3D tilt
- depth movement
- icon translation
- cursor interaction
- spotlight

### Click
- micro transition
- state change
- expansion
- object response
- ripple/depth effect

### Mouse
- parallax
- spotlight
- object tilt
- camera movement
- layered depth

### Scroll
- scene progression
- image pan
- zoom
- rotation
- reveal
- mask
- camera/object movement

### Focus
- accessible motion feedback.

---

## 15. CUSTOM CURSOR

A custom cursor may be used.

Possible states:

```text
DEFAULT
↓
INTERACTIVE
↓
VIEW
↓
DRAG
↓
CLICK
```

Examples:

- smooth cursor following,
- scale changes,
- contextual text,
- 3D interaction indicator,
- product-card interaction.

Do not block normal pointer interaction or keyboard accessibility.

On touch devices, use appropriate alternatives.

---

## 16. MAGNETIC INTERACTIONS

Buttons/CTAs may use magnetic movement:

```text
cursor approaches
↓
button subtly follows
↓
cursor leaves
↓
button springs back
```

Keep movement controlled and clickable.

---

## 17. LOADING EXPERIENCE

Use a **dynamic, asset-aware cinematic loading experience**.

Do not artificially delay fast connections.

```text
PAGE LOAD
↓
measure actual readiness
↓
fonts
images
3D assets
critical resources
↓
readiness
↓
minimum visual threshold if necessary
↓
READY
↓
hero entrance
```

Fast connection:

```text
load fast → enter fast
```

Slow connection:

```text
assets loading
→ maintain cinematic loading state
→ do not reveal broken/incomplete scenes
```

The loading state must reflect actual readiness rather than a fake fixed delay.

---

## 18. LOADING ANIMATION

Possible elements:

- FRNDLY logo reveal,
- progress indicator,
- animated line,
- subtle 3D object,
- scene preparation,
- mask reveal,
- typography entrance.

Keep it proportional to actual loading.

---

## 19. SCENE ARCHITECTURE

Treat major storytelling areas as **scenes**, not merely HTML sections.

Possible:

```text
SCENE 01 — HERO
SCENE 02 — BRAND STORY
SCENE 03 — PRODUCTS
SCENE 04 — PROCESS
SCENE 05 — QUALITY
SCENE 06 — REVIEWS
SCENE 07 — TESTIMONIAL
SCENE 08 — ABOUT
SCENE 09 — CTA
```

Adapt the number to the final design.

Each scene should have:

- visual purpose,
- content purpose,
- motion purpose,
- transition in,
- transition out.

---

## 20. VIEWPORT-TAKEOVER SCENES

Some scenes may use:

```text
100vh / viewport takeover
```

Example:

```text
SCENE 01
↓ scroll
3D transforms
↓
scene transition
↓
SCENE 02
```

Do not make every section full-screen.

Use viewport takeover where it improves storytelling.

---

## 21. NATURAL SCROLL — NO FULL SCROLL HIJACKING

Use normal browser scrolling.

Do NOT globally replace or disable native scrolling.

Use:

```text
Natural browser scroll
+
scroll-linked Motion
+
cinematic choreography
```

The user remains in control.

---

## 22. PARALLAX WEBSITE PIPELINE

For suitable scenes:

```text
1. PLAN SCENE
       ↓
2. SOURCE HD IMAGE
       ↓
3. VERIFY QUALITY / USAGE
       ↓
4. CUT OUT SUBJECT
       ↓
5. FOREGROUND / MIDGROUND / BACKGROUND
       ↓
6. DEPTH APPROXIMATION
       ↓
7. PAN / ZOOM / TILT
       ↓
8. SCROLL PARALLAX
       ↓
9. MASK / REVEAL
       ↓
10. TRANSITION
       ↓
11. NEXT SCENE
```

---

## 23. IMAGE DEPTH COMPOSITING

When suitable:

```text
Original image
↓
Subject extraction
↓
Foreground
↓
Midground
↓
Background
↓
Independent motion
```

Example:

```text
BACKGROUND
environment

MIDGROUND
person/product

FOREGROUND
fabric/details/particles
```

Each layer may move at a different rate.

---

## 24. IMAGE MOTION

Use where appropriate:

- pan,
- zoom,
- tilt,
- parallax,
- scale,
- translation,
- controlled rotation.

Do not animate every image identically.

---

## 25. MASKS / REVEALS / TRANSITIONS

Use:

- clip-path,
- masks,
- scale reveal,
- directional reveal,
- image wipe,
- layered fade,
- perspective transition,
- shared object transition.

Avoid defaulting to simple opacity fades.

---

## 26. CUSTOM CSS FOR REALISTIC TIMING

Use CSS where technically appropriate for:

- complex easing,
- transform composition,
- pseudo-elements,
- gradients,
- masks,
- background effects,
- fine-grained visual timing.

Motion.dev remains the primary orchestration system.

---

## 27. BACKGROUND ANIMATION

Allowed:

- animated gradients,
- mesh gradients,
- noise/grain,
- subtle particles,
- light rays,
- floating shapes,
- image depth layers,
- 3D environments,
- WebGL backgrounds.

Effects must remain derived from FRNDLY's visual identity.

---

## 28. WEBGL / SHADER EFFECTS

WebGL/shader effects are explicitly allowed.

Potential uses:

- image distortion,
- displacement,
- liquid transitions,
- subtle hover distortion,
- noise,
- reveal effects,
- scene transitions.

Example:

```text
NORMAL IMAGE
↓
cursor interaction
↓
subtle displacement
↓
image reacts to pointer
```

### Constraint

Do not use shaders merely to demonstrate technology.

Use them when they materially improve the experience.

---

## 29. 3D + WEBGL ARCHITECTURE

If React Three Fiber is used, isolate 3D logic.

Conceptual structure:

```text
src/
├── components/
│   ├── landing/
│   ├── motion/
│   ├── three/
│   ├── scenes/
│   └── effects/
│
├── assets/
│   ├── images/
│   ├── 3d/
│   └── textures/
```

Adapt to existing repository conventions.

Do not reorganize the entire project blindly.

---

## 30. RESPONSIVE CINEMATIC EXPERIENCE

Maintain the cinematic direction across:

- desktop,
- tablet,
- mobile.

But do NOT force identical geometry.

Adapt:

- layout,
- scale,
- object position,
- camera,
- spacing,
- typography,
- interaction range,
- depth,
- composition.

The cinematic identity should remain consistent while proportions adapt.

If an effect is genuinely incompatible with a device, do not force it.

Provide an appropriate alternative.

---

## 31. MOBILE INTERACTION

Touch devices do not have a mouse.

Replace cursor effects with:

- tap,
- swipe,
- drag,
- scroll,
- appropriate touch interactions.

3D may remain interactive through touch drag, scroll, or tap.

Do not require hover for important content.

---

## 32. PERFORMANCE — ADVANCED, NOT OVERLY SAFE

Performance matters, but MUST NOT become an excuse to make the design generic.

Goal:

> **Advanced visual experience with intelligent optimization.**

Use when appropriate:

- lazy loading,
- dynamic imports,
- optimized GLB,
- compressed textures,
- WebP/AVIF,
- responsive images,
- GPU-friendly transforms,
- appropriate DPR,
- scene-level loading,
- asset preloading where beneficial,
- conditional effects,
- Motion Values,
- shader optimization.

Do not remove advanced effects merely because they require engineering effort.

Instead:

```text
Advanced effect
↓
Optimize
↓
Measure
↓
Keep if acceptable
```

---

## 33. PERFORMANCE ADAPTATION

```text
High capability device
→ full cinematic experience

Medium capability
→ optimized cinematic experience

Low capability
→ reduced expensive effects
```

Do not make the low-capability experience visually broken.

Maintain hierarchy, storytelling, branding and motion where feasible.

---

## 34. REDUCED MOTION

Respect:

```text
prefers-reduced-motion
```

Use Motion's reduced-motion capabilities.

A reduced-motion user must still receive a complete and attractive experience.

---

## 35. ASSET SOURCING

External images may be sourced from:

- Google Images for discovery/reference,
- Unsplash,
- Pexels,
- Pixabay,
- Wikimedia Commons,
- other sources with clearly documented usage rights.

Recommended workflow:

```text
SEARCH
↓
SELECT
↓
VERIFY HD QUALITY
↓
VERIFY SOURCE / USAGE
↓
DOWNLOAD
↓
OPTIMIZE
↓
CUT OUT
↓
CREATE DEPTH LAYERS
↓
IMPLEMENT PARALLAX
```

Do not blindly copy random images when source/license is unclear.

This workflow should be practical, not excessively bureaucratic.

---

## 36. PRODUCT VISUAL STRATEGY

Hybrid system:

### 3D
For:
- hero,
- featured product,
- storytelling moments,
- interactive product experience.

### Images
For:
- product cards,
- supporting sections,
- product overview.

Do not force every product into 3D.

---

## 37. MICROINTERACTIONS

Examples:

### Button
```text
hover
→ magnetic movement
→ icon shifts
→ subtle scale
```

### Card
```text
hover
→ lift
→ tilt
→ image depth movement
```

### Product
```text
hover
→ image/object responds
```

### Rating
```text
hover
→ subtle sequential response
```

### Navigation
```text
hover
→ indicator moves
```

Microinteractions should reinforce usability.

---

## 38. ENTRANCE ANIMATIONS

Use choreographed entrances:

```text
logo
↓
headline
↓
supporting text
↓
CTA
↓
3D object
↓
ambient background
```

Use stagger and controlled timing.

---

## 39. SCROLL CHOREOGRAPHY

For each scene:

```text
ENTRY
↓
HOLD
↓
INTERACTION
↓
TRANSFORMATION
↓
EXIT
```

Example:

```text
Hero enters
↓
3D settles
↓
user scrolls
↓
object rotates
↓
headline shifts
↓
background depth changes
↓
next scene emerges
```

---

## 40. PERSISTENT VISUAL ANCHORS

Where useful, a visual element may continue across scenes:

- 3D garment,
- logo,
- product,
- graphic shape,
- light source.

The element can transform rather than disappear/reappear.

---

## 41. MOUSE-DRIVEN PARALLAX

Use normalized pointer coordinates.

Concept:

```text
pointerX
pointerY
↓
normalized range
↓
spring
↓
layer transforms
```

Different layers should have different movement amplitudes.

Tune values to the actual composition.

---

## 42. MOUSE-DRIVEN 3D

For supported scenes:

```text
mouse X
→ object Y rotation

mouse Y
→ object X rotation
```

Use smoothing/spring behavior.

Avoid expensive raw pointer-driven React rerenders.

---

## 43. ADVANCED CURSOR EFFECTS

Potential states:

```text
default
→ subtle dot

interactive
→ expanded cursor

product
→ "VIEW"

drag
→ "DRAG"

CTA
→ contextual state
```

Do not sacrifice accessibility.

---

## 44. LANDING PAGE CONTENT

Maintain the established FRNDLY content direction:

- business overview,
- products,
- ordering process,
- terms/information,
- reviews,
- ratings,
- testimonials,
- about us,
- contact person,
- social media,
- address,
- email,
- phone,
- final CTA.

Primary CTA:

**Bergabung & Mulai Pesanan**

Destination:

**customer sign-in/login**

Future customer workflow may support:

- registration,
- login,
- ordering,
- order status,
- reviews,
- testimonials,
- WhatsApp confirmation.

For this task, focus on the landing page.

---

## 45. FUTURE ACTION — PAGE TRANSITIONS

Do NOT implement full page-transition architecture now unless already supported.

Document as next action:

```text
NEXT ACTION
→ Cross-page cinematic transitions
→ Landing → Login
→ Landing → Customer portal
→ Product/detail transitions
```

Do not scope-creep into the customer portal.

---

## 46. DATA INTEGRATION

Use existing data when available:

- company name,
- logo,
- phone,
- email,
- address,
- social media,
- products,
- ratings,
- reviews,
- testimonials.

Do not fabricate real business data.

If an endpoint does not exist:

1. identify the dependency,
2. isolate mock data if needed,
3. document it,
4. do not silently change unrelated backend systems.

---

## 47. FILE / COMPONENT ARCHITECTURE

Create organized systems where necessary.

Possible:

```text
components/
├── landing/
├── scenes/
├── motion/
├── three/
├── effects/
└── shared/
```

Assets:

```text
public/
├── images/
├── 3d/
├── textures/
└── ...
```

Adapt to existing conventions.

---

## 48. NO UNNECESSARY REFACTOR

The agent may create or organize landing-specific systems.

It must NOT:

- rewrite unrelated dashboard code,
- replace authentication,
- rewrite the backend unnecessarily,
- change database structure without approval,
- remove existing features,
- alter established application behavior.

---

## 49. REQUIRED PRE-CODING PLAN

Before implementation, produce a working plan covering:

### A. Existing design system
- font,
- palette,
- theme,
- icons,
- reusable components.

### B. Existing architecture
- framework,
- routes,
- components,
- styling,
- existing animation system.

### C. Skills
- relevant `.opencode/skills`,
- why each applies,
- what should not be loaded.

### D. Scene plan
For each scene:
- purpose,
- imagery,
- 3D object,
- foreground,
- midground,
- background,
- scroll behavior,
- mouse behavior,
- transition.

### E. Motion plan
- entrance,
- hover,
- click,
- mouse,
- scroll,
- exit.

### F. Asset plan
- source,
- quality,
- usage,
- optimization,
- depth layers.

### G. Performance plan
- lazy loading,
- scene loading,
- 3D optimization,
- responsive strategy.

---

## 50. IMPLEMENTATION WORKFLOW

```text
AUDIT
↓
READ RELEVANT .opencode/skills
↓
UNDERSTAND FRNDLY DESIGN SYSTEM
↓
UNDERSTAND EXISTING DATA
↓
PLAN SCENES
↓
PLAN ASSETS
↓
PLAN MOTION
↓
PLAN 3D
↓
IMPLEMENT FOUNDATION
↓
IMPLEMENT LOADING
↓
IMPLEMENT HERO SCENE
↓
IMPLEMENT 3D INTERACTION
↓
IMPLEMENT PARALLAX
↓
IMPLEMENT SCENE TRANSITIONS
↓
IMPLEMENT MICROINTERACTIONS
↓
IMPLEMENT REMAINING SCENES
↓
RESPONSIVE ADAPTATION
↓
PERFORMANCE OPTIMIZATION
↓
ACCESSIBILITY
↓
BROWSER TEST
↓
VISUAL QA
↓
CODE REVIEW
↓
FIX
↓
FINAL VERIFICATION
```

---

## 51. ACCEPTANCE CRITERIA

### Visual
- [ ] Recognizably FRNDLY.
- [ ] Colors derived from existing app.
- [ ] Typography consistent.
- [ ] Icon system consistent.
- [ ] Light/dark theme coherent.

### 3D
- [ ] Real 3D exists.
- [ ] 3D is interactive.
- [ ] Mouse interaction works.
- [ ] Hover interaction works.
- [ ] Click interaction exists where meaningful.
- [ ] Drag/rotate exists where appropriate.
- [ ] Scroll affects 3D where appropriate.
- [ ] Natural spring/inertia-like movement exists.

### Motion
- [ ] Motion.dev is primary.
- [ ] Entrance animation exists.
- [ ] Hover effects exist.
- [ ] Microinteractions exist.
- [ ] Mouse animations exist.
- [ ] Scroll-linked animations exist.
- [ ] Scene transitions exist.
- [ ] Layout transitions are used where appropriate.
- [ ] Motion is not limited to color changes.

### Parallax
- [ ] Scenes have depth.
- [ ] Suitable images use layered depth.
- [ ] Foreground/midground/background move differently.
- [ ] Pan/zoom/tilt are used where appropriate.
- [ ] Masks/reveals are used where beneficial.
- [ ] Transitions feel cinematic.

### Advanced
- [ ] Background animations exist where useful.
- [ ] WebGL/shader effects are used where they materially improve the experience.
- [ ] Custom cursor exists where appropriate.
- [ ] Magnetic interactions exist where appropriate.
- [ ] Loading reflects actual asset readiness.
- [ ] Fast connections are not artificially delayed.

### Responsive
- [ ] Desktop is cinematic.
- [ ] Tablet is cinematic.
- [ ] Mobile is cinematic.
- [ ] Layout/proportion adapt per device.
- [ ] Hover-only functionality is not required on touch devices.
- [ ] Incompatible effects are not forcibly applied.

### Performance
- [ ] 3D assets optimized.
- [ ] Images optimized.
- [ ] Expensive scenes loaded intelligently.
- [ ] Advanced effects remain usable.
- [ ] Low-capability devices receive an adapted experience.
- [ ] `prefers-reduced-motion` is supported.

### Engineering
- [ ] Relevant `.opencode/skills` were studied.
- [ ] Existing reusable components were reused.
- [ ] Landing-specific systems are organized.
- [ ] No unrelated application functionality was changed.
- [ ] Existing `.md` files remain untouched.
- [ ] No destructive database changes were made.
- [ ] Browser testing performed.
- [ ] Visual QA performed.
- [ ] Code review performed.

---

## 52. HARD CONSTRAINTS

1. Do not rewrite previous `.md` files.
2. Do not replace the existing FRNDLY design system.
3. Do not invent an unrelated color palette.
4. Do not use static imagery as a substitute for required 3D.
5. Do not call a page animated merely because it fades in.
6. Do not use color change as the only interaction mechanism.
7. Do not introduce unnecessary animation libraries.
8. Motion.dev is the primary motion system.
9. Do not hijack native browser scrolling globally.
10. Do not artificially delay loading on fast connections.
11. Do not fabricate business data.
12. Do not blindly use random copyrighted images from search results.
13. Do not over-optimize into a generic/static design.
14. Do not sacrifice usability for effects.
15. Do not sacrifice the advanced visual direction merely because an effect requires engineering effort; optimize intelligently first.
16. Do not modify unrelated application functionality.
17. Do not make the user lose control of normal navigation or scrolling.
18. Do not make hover the only way to access important functionality.
19. Do not force incompatible 3D/effects on devices where they genuinely do not work.
20. Do not load every `.opencode/skills` context unnecessarily.

---

## 53. FINAL EXPERIENCE TARGET

```text
OPEN WEBSITE
      ↓
CINEMATIC LOADING
      ↓
HERO REVEAL
      ↓
3D OBJECT RESPONDS
      ↓
MOUSE INTERACTION
      ↓
SCROLL
      ↓
PARALLAX SCENE
      ↓
IMAGE DEPTH
      ↓
MOTION TRANSITION
      ↓
PRODUCT EXPERIENCE
      ↓
3D / MICROINTERACTIONS
      ↓
PROCESS STORY
      ↓
REVIEWS
      ↓
TESTIMONIALS
      ↓
ABOUT
      ↓
FINAL CTA
```

The user should feel:

> **The website is responding to them, rather than simply displaying content to them.**

---

## 54. DESIGN NORTH STAR

**FRNDLY should feel like an interactive physical showroom translated into the browser.**

The user should be able to:

- look,
- hover,
- move,
- drag,
- click,
- scroll,
- discover,
- interact,
- understand the business.

The website must remain:

**FRNDLY + cinematic + interactive + premium + usable.**

Not:

**generic SaaS + random animations + unrelated colors.**
