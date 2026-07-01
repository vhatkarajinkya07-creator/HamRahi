# WanderGo — Travel Discovery Demo

A cinematic, Reels-style travel discovery MVP built with **React, Vite, React
Router, Framer Motion, and CesiumJS**. All content is static/local demo data —
there is no backend or API.

## Quick start

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

```bash
npm run build     # production build to /dist
npm run preview   # serve the production build locally
npm run lint       # oxlint
```

No API keys or accounts are required. The globe uses OpenStreetMap tiles and
Cesium's default ellipsoid terrain instead of Cesium Ion, so it works
out of the box. If you'd like richer imagery/terrain, sign up for a free
Cesium Ion token at https://ion.cesium.com and set it in
`src/hooks/useCesiumViewer.js`.

## What's implemented

- **Hero** — full-screen, slowly auto-rotating Cesium globe with floating
  travel accents (plane / pin / compass) and a scroll-fade headline.
- **ThemeSection** — the category/mood system from the brief (beach,
  mountain, desert, forest, snow, urban), each with its own gradient palette.
- **GlobeSection** — the core "Reels for destinations" experience. A sticky
  Cesium globe sits behind a snap-scrolling stack of full-viewport
  DestinationCards. As each destination scrolls into view
  (IntersectionObserver via useActiveSection), the globe camera flies to
  its coordinates, a glow pulse repositions to that point, and the card
  animates in with a scale/blur "pulled from Earth" entrance
  (cardEmerge in animations/variants.js). A dot rail (Sidebar) lets you
  jump directly to any destination.
- **ReelsSection** — a Pinterest/Instagram-style masonry grid of static
  traveler posts (data/community.js), each linked back to its destination.
- **Destination detail page** (/destination/:id) — gallery, tags, traveler
  posts for that place, and a sticky booking-style summary card.
- **About** and **Login** — supporting pages; Login is a static, no-op demo
  form (nothing is submitted anywhere).
- **Navbar** — fixed, glassmorphic, and solidifies on scroll.

## Project structure

```
src/
├── components/     # Navbar, Hero, DestinationCard, GlobeSection,
│                    ThemeSection, ReelsSection, Footer, Sidebar
├── pages/          # Home, Destination, About, Login
├── routes/         # AppRoutes.jsx (React Router route table)
├── data/           # destinations.js, community.js — static demo content
├── hooks/          # useCesiumViewer, useActiveSection, useScrollPosition
├── animations/     # variants.js — shared Framer Motion presets
└── styles/         # variables.css (design tokens), global.css
```

## Design tokens

Base brand colors, type (Bricolage Grotesque display / Plus Jakarta Sans
body / IBM Plex Mono for coordinates & labels), and per-category theme
palettes all live in `src/styles/variables.css`. Category themes are applied
as CSS classes (theme-beach, theme-mountain, etc.) that override the
--theme-* custom properties, which cascade into cards, chips, and the
globe's glow color.

## Notes for extending past the MVP

- Swap `data/destinations.js` / `data/community.js` for real API calls.
- The Cesium viewer is intentionally minimal (no terrain, no Ion) to avoid
  requiring credentials for this demo — swap in createWorldTerrainAsync()
  and a Bing/Ion imagery layer for production-quality visuals.
- useActiveSection currently drives which destination the globe flies to;
  the same pattern extends naturally to a "for you" or filtered destination
  feed once real data is wired in.
