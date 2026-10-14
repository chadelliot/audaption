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

## What is on the page

- **The opening** is the one isometric drawing, on the tan ground: four layers
  that start out of line and set into one stack. It is authored SVG on one projection (`src/lib/iso.ts`,
  `src/components/iso/Cube.tsx`), so every label is real text.
- **The approach** is the go-to-market strategy, built out in the same four layers
  the opening names: Data, Journey, Experience, Strategy. It is a pinned,
  scroll-driven deck (`src/components/deck/Deck.tsx`) of nine chapters; scrolling
  moves through them, and Next, Back, the rail and the arrow keys scroll to one.
  Each chapter is one question, one flat working exhibit from
  `src/components/exhibits/` that builds itself in as the chapter arrives, and one
  recommendation. The story is deliberately not the diagnosis on aboutchad.com.
- **On a phone** the approach is one fixed screen, one chapter at a time
  (`src/components/deck/MobileDeck.tsx`): chapter tabs on top, two panes (the idea,
  which always fits without scrolling, and the graphic), and a dark control dock at
  the bottom with one "See the graphic" button above Back / Next. Swipe sideways to
  change chapter. The contact section below has its own tan ground so the end of
  the deck is obvious. The laptop deck is a separate component.
- **The deep dives** are one page per body of work, at `/capabilities/<slug>/`,
  generated from `src/lib/capabilities.ts` by `src/components/capability/`. A
  chapter links to its page. A new page is a data entry, not a build: add it to
  that file and it exists, with the same anatomy as the rest (where the value
  leaks, the exhibit, how we ensure it, what you get, how it connects).
- **Getting to the deep dives**: each chapter has a docked "Learn more" tab on the
  right edge of the screen (a solid badge on phones), and the header's *Deep dives*
  menu opens a panel of every page with a live miniature of whichever one is
  hovered (`src/components/site/DeepDiveMenu.tsx`).
- **The close** is the enquiry form.

Every exhibit is an *illustrative* example and says so in its corner. None of it
is client data; keep it that way.

Two rules worth knowing before editing an exhibit:

1. **An exhibit must carry its chapter's claim.** If a chapter's claim changes
   (`src/lib/approach.ts`), change its exhibit with it. Timber is only ever used
   for what is leaking, weak or unowned.
2. **Exhibits are fitted, not sized.** `FitBox` scales an exhibit to the stage it
   is in, so one can be made denser without ever running off a laptop screen.
   Check any change at 1440×780 and 1280×720.

## Content

Copy lives in `src/lib/approach.ts` (the chapters) and `src/lib/systems.ts` (the
opening) rather than in the components, so wording can be
changed without touching layout or animation.


## The enquiry form

`server/assessment-route.ts` emails the submission and creates a HubSpot
contact. Both are best-effort: with no keys configured the route logs the
submission and still returns success, because a lead lost to a missing
environment variable is worse than one recorded in a log.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Required for the email to actually send |
| `ENQUIRY_TO` | Recipient (defaults to cparker@audaption.com) |
| `ENQUIRY_FROM` | Verified sender, e.g. `Audaption <site@audaption.com>` |
| `HUBSPOT_TOKEN` | Optional; creates a CRM contact |

**This route is not built.** It lives in `server/` rather than `src/app`
because the site is exported statically. See `server/README.md` for how to
bring it back.

## Deployment

Pushing to `main` builds a static export and publishes it to GitHub Pages via
`.github/workflows/deploy.yml`. Nothing is committed to a second branch.

The custom domain is set in the repository's Pages settings and carried in
`public/CNAME` so it survives each deploy. `public/.nojekyll` stops Pages from
Jekyll-processing the `_next/` directory, which would otherwise strip the
underscore-prefixed folders and break every asset.

Because Pages serves files and runs no server, the enquiry form posts to
whatever `NEXT_PUBLIC_FORM_ENDPOINT` is set to — a repository variable read at
build time. With nothing set, the form falls back to opening the visitor's
mail client. See `server/README.md`.

## Previous site

The prior homepage is preserved at `/legacy`.
