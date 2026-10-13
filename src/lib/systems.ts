/*
  The opening's four layers.

  What every company already has, in the order they have to be built. The
  approach that follows (lib/approach.ts) is a sequence of decisions, not a tour
  of these four, but the opening's drawing is built from them and the phone
  cards read them.
*/

/* ------------------------------------------------------------------ */
/* The opening — four layers, bottom-up                                */
/* ------------------------------------------------------------------ */

export interface TierBand {
  id: string;
  n: string;
  name: string;
  line: string;
}

/** Landing order, and therefore build order: nothing lands on nothing. */
export const TIERS: TierBand[] = [
  {
    id: "data",
    n: "01",
    name: "Customer Data",
    line: "One customer, defined once. Everything above this depends on it, and almost nobody owns it.",
  },
  {
    id: "journey",
    n: "02",
    name: "Customer Journey",
    line: "The path a customer actually takes — not the one drawn on a whiteboard two years ago.",
  },
  {
    id: "experience",
    n: "03",
    name: "Customer Experience",
    line: "What that journey feels like at every touchpoint. The only layer a customer ever sees.",
  },
  {
    id: "strategy",
    n: "04",
    name: "Go-to-Market Strategy",
    line: "Which markets you go after, what you won't do, and where growth is supposed to come from.",
  },
];
