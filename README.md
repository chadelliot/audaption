# Audaption

Marketing site for Audaption — Enterprise Growth Systems.

Live at **[audaption.com](https://audaption.com)**.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind 4 · framer-motion · Lenis.

## Local development

```bash
npm install
npm run dev
```

## The drawing set

Every diagram on the homepage is authored SVG built on one true-isometric
projection in `src/lib/iso.ts`. Nothing is a rendered image, so every label is
real text: sharp at any zoom, selectable, translatable and editable in code.

- `src/lib/iso.ts` — projection, cube geometry, face skins
- `src/components/iso/` — the cube primitive, sheared face type, the shared
  capability blueprint, tooltips
- `src/components/scenes/` — one file per homepage section
- `src/lib/systems.ts` — all section copy, as data

Two conventions worth knowing before editing a drawing:

1. **Type is sheared into the face of a solid, not laid over it.** `FaceLabel`
   maps the baseline onto the plane. A label that floats beside an object stops
   it reading as dimensional.
2. **A vertical stack is painted bottom-up.** The box above occludes the top
   face of the box below, so drawing in reading order buries every label but
   the last.

## Content

Section copy lives in `src/lib/systems.ts` rather than in the components, so
wording can be changed without touching layout or animation.

## The enquiry form

`src/app/api/assessment/route.ts` emails the submission and creates a HubSpot
contact. Both are best-effort: with no keys configured the route logs the
submission and still returns success, because a lead lost to a missing
environment variable is worse than one recorded in a log.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Required for the email to actually send |
| `ENQUIRY_TO` | Recipient (defaults to cparker@audaption.com) |
| `ENQUIRY_FROM` | Verified sender, e.g. `Audaption <site@audaption.com>` |
| `HUBSPOT_TOKEN` | Optional; creates a CRM contact |

**This route needs a server.** It does not run on a static host — see the
deployment note below.

## Deployment

The custom domain is configured via `CNAME` at the repository root.

Note that this app is not purely static: the enquiry form posts to a Next.js
route handler. A static export (`output: "export"`) would build and deploy
fine, but the form would 404 on submit unless it is repointed at a hosted form
endpoint first.

## Previous site

The prior homepage is preserved at `/legacy`.
