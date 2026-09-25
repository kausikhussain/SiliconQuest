# Silicon Quiz Club — Web Platform

> Where Curiosity Meets Competition. The official digital portal and arena telemetry platform for the Silicon Quiz Club at Silicon Institute of Technology.

---

## Overview

The **Silicon Quiz Club Web Platform** is an editorial-grade, responsive digital hub engineered to showcase collegiate trivia championships, syndicate leaderboards, institutional archives, event registrations, and the student leadership structure.

---

## Tech Stack & Architecture

- **Core**: React 18 + TypeScript + Vite
- **Styling**: Vanilla CSS Design Tokens, Glassmorphism, Fluid Responsive Typography
- **3D Telemetry & Visuals**: Three.js Canvas Visualizers
- **Icons & UI Micro-interactions**: Lucide React + Canvas Confetti
- **Backend Services**: Node.js API Middleware + PostgreSQL Engine

---

## Executive Leadership Showcase & Portrait Standards

The platform presents a tiered governance structure:
1. **Tier 01 — Faculty-in-Charge (FIC)**: Academic oversight and institutional governance.
2. **Tier 02 — Secretary**: Chief student executive directing tournament architecture and collegiate syndicate representation.
3. **Tier 03 — Joint Secretary**: Student executive co-directing stage operations, real-time arena telemetry, and logistics.
4. **Tier 04 — Senior Coordinators**: 6-member editorial grid overseeing arena operations and logistics.
5. **Tier 05 — Coordinators**: Collegiate tournament operational managers.

### Media & Portrait Framing Guidelines
To ensure visual balance and prevent distortion or aggressive cropping across viewports:
- **Aspect Ratio Standard**: `3:4` portrait ratio (`1086 × 1448px` or proportional `682 × 1024px`).
- **Container Styling**: `.leadership-portrait-box` utilizes `aspect-ratio: 3 / 4` across desktop, tablet, and mobile.
- **Optical Framing**: Executive portraits maintain `object-fit: cover` with `object-position: center top` / `center 5%` to preserve headroom, collar, shirt details, and natural upper-body proportions.
- **Cache Management**: Image asset references in `clubData.ts` incorporate version query parameters (`?v=YYYYMMDD`) to invalidate stale CDN and browser caches upon asset updates.

---

## MindMirror 2K26 — Orientation Showcase & Visual Archive

The platform integrates a dedicated, editorial-grade visual chronicle for **MindMirror 2K26** (10 September 2026, Seminar Hall, Silicon Institute of Technology):

### Narrative Sequence & Gallery Architecture
1. **Cinematic Hero**: Full-bleed orientation banner projection with dynamic gradient scrim and contextual metadata badges.
2. **01 · Inauguration & Ceremonial Commencement**:
   - Full-width panoramic dais photo featuring faculty panel (Dr. Simanchal Bag, Dr. Chinmayee Padhy, Dr. Manoj Kumar Mahapatra).
   - 3-column ceremonial lamp lighting triptych by senior faculty dignitaries and coordinators.
3. **02 · Faculty Addresses**: Podium speeches and orientation discourses delivered to attendees.
4. **03 · Student Presentations & Web Platform Showcase**: Live stage demonstrations including presentation of the official Silicon Quiz Club portal.
5. **04 · The Audience**: Wide-angle seminar hall atmosphere and crowd perspective.
6. **05 · Engagement & Interaction**: High-engagement audience interaction gallery utilizing a balanced 2+3 editorial grid layout.
7. **06 · Closing Ceremony**: Certificate of participation conferrals and formal conclusion.

### Interactive Lightbox & Accessibility Standards
- **Keyboard Navigation**: `Left` / `Right` arrow keys for sequential image browsing, `Esc` or background click to dismiss.
- **Touch Gesture Support**: Mobile swipe gestures (`deltaX` detection) for fluid photo browsing and swipe-down dismiss.
- **Accessibility & Semantics**: `role="dialog"`, `aria-modal="true"`, focus visibility rings, and `decoding="async"` for optimal render performance.

---

## Local Development

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Setup & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Platform runs locally at `http://localhost:3000`.

---

## Repository & Contribution Workflow
Maintained with conventional commit specifications:
- `feat(assets)`: Media asset updates and optimizations
- `fix(team)`: Component layout and responsive grid refinements
- `style(team)`: Optical alignment, positioning, and aesthetic adjustments
- `fix(data)`: Data models, syndicate records, and cache invalidation tags
- `docs`: Architecture documentation and team standards
