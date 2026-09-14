# HalalSpots

A responsive map for discovering places tagged as halal in Astana. The interface
is in Russian and works on desktop and mobile.

**Live:** https://halalspots-narbotonurs-projects.vercel.app

## What works

- Live place catalog from OpenStreetMap Overpass, cached at the edge for one hour
- Explicit offline/demo fallback instead of silently presenting stale data as verified
- Search by name, address, category, and cuisine
- Halal-tag, delivery, category, and favorites filters
- List/marker synchronization with animated map navigation
- Browser geolocation and distance sorting
- Favorites saved locally in the browser
- Google Maps directions, native sharing, and OSM source links
- Responsive list/map navigation and keyboard-accessible controls
- Securely sanitized third-party fields and fixed API endpoints (no request proxying)
- CI for lint, TypeScript, unit tests, security audit, and production build

## Data integrity

`Halal-tag OSM` means an OpenStreetMap contributor added `diet:halal=yes|only`
or `halal=yes`. It is **not** a religious certification or an endorsement by this
project. Users should verify certification with the venue. Ratings are deliberately
not invented because OpenStreetMap does not provide them.

The server route queries small, fixed-radius requests around Astana through public
Overpass instances. Responses are limited, validated, sanitized, and cached.
Public Overpass and tile servers are suitable for a small demo; a high-traffic or
commercial deployment should use a contracted provider or self-hosted data service.

## Local development

Requirements: Node.js 20.9 or newer (CI uses Node 24).

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

## Quality checks

```bash
npm run check
npm audit
```

`npm run check` runs ESLint, strict TypeScript checking, Vitest, and a production
Next.js build. The workflow in `.github/workflows/ci.yml` runs the same checks for
pushes and pull requests.

## Architecture

```text
src/app/page.tsx             Static page shell
src/components/features/     Interactive client UI and Leaflet map
src/app/api/places/route.ts  Server-side Overpass adapter and validation
src/data/                    Clearly marked offline/demo fallback
src/lib/                     Shared types and pure utilities
```

The app requires no API key, user account, or database. Login and reservation
buttons from the original mockup were removed because no backend existed behind
them. Authentication and venue-owner workflows should only be added together with
an actual authorization model, persistent database, abuse controls, and tests.

## Technology

- Next.js 16 / React 19 / TypeScript
- React Leaflet / Leaflet
- Tailwind CSS tooling plus project-level responsive CSS
- Vitest

Map and place data: © OpenStreetMap contributors.
