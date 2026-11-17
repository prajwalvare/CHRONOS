# CHRONOS — Architectural Specification & Engineering Master Plan

## 1. System Vision & Visual Identity
CHRONOS is an antique horological time and reminder management system. Its identity is rooted in brass, bronze, Roman numerals, exposed watch mechanics, and dark cinematic aesthetics.

### Visual & Layout Mandate
- **Opening Experience**: Dark canvas featuring a large 3D mechanical clock that experiences a scroll-driven axial explosion (crystal -> dial/hands -> motion work -> gear train -> mainplate -> cuvette).
- **Dashboard Experience (Strictly follows hand-drawn blueprint)**:
  - **Top Left**: Small working 2D analog clock showing current local time (SVG + rAF).
  - **Beside Clock**: Clickable `(+)` brass button that triggers an adjacent reminder creation pop-up.
  - **Right Side**: Horological ribbon displaying only the single next upcoming reminder.
  - **Bottom Left**: Engraved trophy showing database-verified completed reminder count.
  - **Bottom Right**: Parchment note bearing a philosophical quote, functioning as the interactive gateway to the History page.
- **History Experience**: Full scene transition that completely replaces the dashboard into an archival ledger with state filters.

---

## 2. Design System Tokens
- **Main Background**: `#080807`
- **Secondary Background**: `#12110F`
- **Surface**: `#1C1914`
- **Antique Brass**: `#A98143`
- **Primary Gold**: `#C9A45C`
- **Highlight Gold**: `#E5C78A`
- **Parchment**: `#D8C7A5`
- **Primary Text**: `#E9E0D0`
- **Secondary Text**: `#9A907E`

---

## 3. Technology Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, GSAP & ScrollTrigger, Three.js / React Three Fiber / Drei.
- **Backend**: Node.js, Express.js (Modular REST architecture), Zod, Helmet, CORS.
- **Database**: PostgreSQL with Prisma ORM.
- **Job Processing**: PostgreSQL-backed persistent scheduler (`pg-boss` or transactional polling worker).
- **Notifications**: In-app chime/modal -> Browser Notifications API -> Service Worker Web Push (VAPID).
