# CHRONOS (Master Spec v1.0)

> An antique horological time and reminder management system built around the visual identity of a mechanical clock.

## Architecture Highlights
- **Cinematic Opening (Phase 2)**: 3D mechanical watch assembly with scroll-driven axial explosion (GSAP ScrollTrigger + Three.js).
- **Dashboard (Phase 3)**: Faithful implementation of the hand-drawn layout:
  - Working 2D SVG Analog Clock (synchronized with system time via `requestAnimationFrame`).
  - Adjacent `(+)` reminder creator modal.
  - Horological Ribbon carrying strictly the next upcoming appointment.
  - Engraved Trophy with verified completion counter.
  - Parchment Note with philosophical time quotes, serving as the gateway to the History Journal.
- **Full-Screen History (Phase 3/5)**: Complete scene transformation replacing the dashboard into an archival record.
- **Deterministic 10-Second Countdown (Phase 6)**: Millisecond UTC-based warning engine with sound chime, browser alerts, and Web Push notifications.

## Quick Start (Development)

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation
```bash
# In client/
cd client
npm install

# In server/
cd server
npm install
```

### Running Locally
```bash
# Terminal 1: Backend API (port 5000)
cd server
npm run dev

# Terminal 2: Frontend Client (port 5173 with proxy to 5000)
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.
