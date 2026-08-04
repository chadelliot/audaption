/*
  The Enterprise Growth System, as data.

  Eight capabilities, taken verbatim from Part II of the Audaption Growth
  System Guide. The order is an argument, not a layout: what the customer
  experiences sits on top of what nobody funds.

  The `Room` type name and the x/y/w/h fields are historical — they date from
  an earlier drawing and are kept only so the ids stay stable. The drawings
  now derive their own geometry from `tier`.
*/

export type Level = 0 | 1 | 2 | 3 | 4 | 5;
export type Rating = Level | null;

/* ------------------------------------------------------------------ */
/* Maturity — the five published levels, plus an honest zero.          */
/* Guide, Ch. 23.                                                      */
/* ------------------------------------------------------------------ */

export const LEVELS: {
  value: Level;
  name: string;
  short: string;
  meaning: string;
}[] = [
  {
    value: 0,
    name: "Not present",
    short: "None",
    meaning: "This capability doesn't exist here yet.",
  },
  {
    value: 1,
    name: "Fragmented",
    short: "Fragmented",
    meaning: "It works because specific people make it work.",
  },
  {
    value: 2,
    name: "Established",
    short: "Established",
    meaning: "Repeatable in places. Someone owns it.",
  },
  {
    value: 3,
    name: "Connected",
    short: "Connected",
    meaning: "It operates across functions on shared definitions.",
  },
  {
    value: 4,
    name: "Scaled",
    short: "Scaled",
    meaning: "Reusable across units, regions and products.",
  },
  {
    value: 5,
    name: "Adaptive",
    short: "Adaptive",
    meaning: "It learns and improves without being rebuilt.",
  },
];

export const levelName = (l: Rating) =>
  l === null ? "Unrated" : LEVELS[l].name;

/*
  What the page actually asks.

  The five-level model stays the published framework, but a visitor cannot
  honestly separate Scaled from Adaptive about their own company on a first
  visit — and six positions on a hairline read as a quiz. So we ask about the
  bottom three rungs, which is where almost every real organisation sits, and
  show the full ladder as what lies above.

  Values map straight onto the published levels, so nothing downstream has to
  know the difference.
*/
export const CHOICES: {
  value: Level;
  n: number;
  label: string;
  note: string;
}[] = [
  {
    value: 1,
    n: 1,
    label: "Missing or ad hoc",
    note: "It doesn't really exist, or it works because specific people make it work.",
  },
  {
    value: 2,
    n: 2,
    label: "Established in places",
    note: "It works, but inside one team and on its own definitions.",
  },
  {
    value: 3,
    n: 3,
    label: "Connected across teams",
    note: "It runs across functions on definitions everyone shares.",
  },
];

/* ------------------------------------------------------------------ */
/* The eight capabilities                                              */
/* ------------------------------------------------------------------ */

export type Tier = "direction" | "experience" | "operating" | "foundation";

export interface Room {
  id: string;
  /** The capability. What the company is actually trying to build. */
  name: string;
  /** The requisition they open instead. Shown once, in scene 3, then retired. */
  plaque: string;
  ref: string;
  tier: Tier;
  /** One line, in the executive's language, on what it is for. */
  purpose: string;
  /** What it looks like when this one is weak. */
  symptom: string;
  /** Capabilities this one cannot function without. */
  depends: string[];
  /** Section-drawing geometry, in viewBox units. */
  x: number;
  y: number;
  w: number;
  h: number;
}

/*
  Drawing units. Kept small and portrait on purpose: a section of a five-storey
  building should stand up, and small units keep annotation type legible once
  the SVG is scaled down into a column.
*/
export const GEO = {
  vb: { w: 560, h: 600 },
  left: 60,
  right: 500,
  atriumX: 250,
  atriumW: 60,
  roofY: 48,
  ground: 442,
  baseY: 542,
} as const;

const LX = GEO.left;
const LW = GEO.atriumX - GEO.left; // 190
const RX = GEO.atriumX + GEO.atriumW; // 310
const RW = GEO.right - RX; // 190
const FULL_W = GEO.right - GEO.left; // 440

/** Floor bands, top to bottom. Shared by the section and the elevation. */
export const FLOORS = [
  { y: 60, h: 66 },
  { y: 134, h: 92 },
  { y: 234, h: 92 },
  { y: 334, h: 92 },
] as const;

export const ROOMS: Room[] = [
  {
    id: "commercial-strategy",
    name: "Commercial Strategy",
    plaque: "VP Growth · Chief Growth Officer",
    ref: "L-04",
    tier: "direction",
    purpose:
      "Where the company decides which customers it is for, what it will not do, and how growth is supposed to happen.",
    symptom:
      "Every function has a plan. None of them assume the same customer.",
    depends: [],
    x: LX,
    y: 60,
    w: FULL_W,
    h: 66,
  },
  {
    id: "digital-experiences",
    name: "Digital Experiences",
    plaque: "Director, Digital Experience",
    ref: "L-03/R",
    tier: "experience",
    purpose:
      "The interface the customer actually meets — and the place every internal disagreement eventually becomes visible.",
    symptom:
      "The site is redesigned every two years and the underlying journey never changes.",
    depends: ["customer-intelligence", "brand-content"],
    x: RX,
    y: 134,
    w: RW,
    h: 92,
  },
  {
    id: "brand-content",
    name: "Brand & Content Systems",
    plaque: "Content Director · Brand Director",
    ref: "L-03/L",
    tier: "experience",
    purpose:
      "Meaning the organisation can reuse: positioning, messaging, modular content, and the knowledge AI needs to sound like you.",
    symptom:
      "Content volume is up. Reuse is near zero and nobody can find last quarter's work.",
    depends: ["customer-intelligence"],
    x: LX,
    y: 134,
    w: LW,
    h: 92,
  },
  {
    id: "ai-transformation",
    name: "AI Transformation",
    plaque: "AI Transformation Lead",
    ref: "L-02/R",
    tier: "operating",
    purpose:
      "Redesigning how work happens, with governance and trusted knowledge — not adding tools to unchanged workflows.",
    symptom:
      "Plenty of pilots. No pilot has changed a workflow anyone depends on.",
    depends: ["customer-intelligence", "brand-content"],
    x: RX,
    y: 234,
    w: RW,
    h: 92,
  },
  {
    id: "marketing-automation",
    name: "Marketing Automation",
    plaque: "Lifecycle Director · Martech Manager",
    ref: "L-02/L",
    tier: "operating",
    purpose:
      "Orchestrating the customer relationship across channels, on triggers that reflect real intent.",
    symptom:
      "Hundreds of workflows, no owner, and nobody will switch any of them off.",
    depends: ["customer-intelligence", "marketing-operations"],
    x: LX,
    y: 234,
    w: LW,
    h: 92,
  },
  {
    id: "enterprise-analytics",
    name: "Enterprise Analytics",
    plaque: "Director, Marketing & Revenue Analytics",
    ref: "L-01/R",
    tier: "operating",
    purpose:
      "Turning data into decisions — forecasting, economics, incrementality — rather than into more dashboards.",
    symptom:
      "Three teams produce the same number three ways, and the meeting is about whose number is right.",
    depends: ["customer-intelligence"],
    x: RX,
    y: 334,
    w: RW,
    h: 92,
  },
  {
    id: "marketing-operations",
    name: "Marketing Operations",
    plaque: "Director, Marketing Operations",
    ref: "L-01/L",
    tier: "operating",
    purpose:
      "The operating layer: intake, prioritisation, lifecycle, routing, governance, and the capacity to execute reliably.",
    symptom:
      "Work arrives through whoever asks loudest, and quality depends on who picks it up.",
    depends: ["customer-intelligence"],
    x: LX,
    y: 334,
    w: LW,
    h: 92,
  },
  {
    id: "customer-intelligence",
    name: "Customer Intelligence",
    plaque: "Director, Customer Insights",
    ref: "B-01",
    tier: "foundation",
    purpose:
      "Identity, definitions, signals and governance. Below grade, invisible to the customer, and load-bearing for everything above it.",
    symptom:
      "Every department can describe the customer. No two descriptions agree.",
    depends: [],
    x: LX,
    y: 456,
    w: FULL_W,
    h: 86,
  },
];

export const roomById = (id: string) => ROOMS.find((r) => r.id === id);

/* ------------------------------------------------------------------ */
/* The atrium — the only space with no requisition                     */
/* ------------------------------------------------------------------ */

export const ATRIUM = {
  name: "Shared definitions",
  sub: "What every layer agrees on",
  ref: "THE SEAM",
  claim: "Nobody has ever opened a job req for the space between the layers.",
  body: "It is where a word like customer, qualified, active or margin is agreed once and means the same thing everywhere. It has no headcount, no budget line and no obvious owner — which is exactly why it is usually missing, and why the layers above it don't hold together.",
};

/* ------------------------------------------------------------------ */
/* Scene 2 — the four symptoms people actually arrive with             */
/* ------------------------------------------------------------------ */

export interface Symptom {
  id: string;
  ref: string;
  title: string;
  body: string;
  /** Rooms this symptom usually implicates, in order of likelihood. */
  implicates: string[];
}

export const SYMPTOMS: Symptom[] = [
  {
    id: "visibility",
    ref: "S-01",
    title: "Growth is hard to see",
    body: "Reporting is fragmented, attribution is disputed, forecasts move without explanation, and leadership can't connect activity to revenue or margin.",
    implicates: ["enterprise-analytics", "customer-intelligence", "marketing-operations"],
  },
  {
    id: "customer",
    ref: "S-02",
    title: "Customer understanding is incomplete",
    body: "Data sits in separate systems, definitions conflict between teams, and no one holds a full view of the relationship.",
    implicates: ["customer-intelligence", "enterprise-analytics", "digital-experiences"],
  },
  {
    id: "execution",
    ref: "S-03",
    title: "Execution is disconnected",
    body: "Marketing, Sales, Service, Operations and Finance run on separate priorities, separate workflows and separate definitions of done.",
    implicates: ["marketing-operations", "marketing-automation", "commercial-strategy"],
  },
  {
    id: "ai",
    ref: "S-04",
    title: "AI and automation won't scale",
    body: "There are tools and there are pilots. What's missing is clean data, governed process, reusable knowledge and a use case with a business owner.",
    implicates: ["ai-transformation", "customer-intelligence", "brand-content"],
  },
];

/* ------------------------------------------------------------------ */
/* Scene 3 — the plaques. The reqs companies actually open.            */
/* ------------------------------------------------------------------ */

export interface Plaque {
  id: string;
  title: string;
  /** Composite phrasing drawn from how these roles are currently written. */
  excerpt: string;
  /** Rooms the job description makes this person accountable for. */
  owns: string[];
  /** Rooms they depend on but are rarely given authority over. */
  inherits: string[];
}

export const PLAQUES: Plaque[] = [
  {
    id: "revops",
    title: "Revenue Operations Director",
    excerpt:
      "Own the systems, processes, insights and infrastructure powering the full go-to-market cycle.",
    owns: ["marketing-operations", "enterprise-analytics", "marketing-automation"],
    inherits: ["customer-intelligence"],
  },
  {
    id: "mops",
    title: "Head of Marketing Operations",
    excerpt:
      "Act as connective tissue across Marketing, Sales and Finance. Architect the growth engine.",
    owns: ["marketing-operations", "marketing-automation"],
    inherits: ["customer-intelligence", "enterprise-analytics"],
  },
  {
    id: "growth",
    title: "VP of Growth",
    excerpt:
      "Own the growth number end to end across acquisition, conversion, retention and expansion.",
    owns: ["commercial-strategy"],
    inherits: [
      "customer-intelligence",
      "enterprise-analytics",
      "marketing-operations",
      "digital-experiences",
    ],
  },
  {
    id: "analytics",
    title: "Marketing Analytics Director",
    excerpt:
      "Build the measurement framework. Deliver executive reporting and reliable forecasting.",
    owns: ["enterprise-analytics"],
    inherits: ["customer-intelligence", "marketing-operations"],
  },
  {
    id: "ai",
    title: "AI Transformation Lead",
    excerpt:
      "Identify use cases, implement AI tooling and drive adoption across commercial teams.",
    owns: ["ai-transformation"],
    inherits: ["customer-intelligence", "brand-content", "marketing-operations"],
  },
  {
    id: "dx",
    title: "Director, Digital Experience",
    excerpt:
      "Own the digital estate, personalisation and conversion across the customer journey.",
    owns: ["digital-experiences"],
    inherits: ["customer-intelligence", "brand-content", "marketing-automation"],
  },
];

/* ------------------------------------------------------------------ */
/* Scene 5 — how we engage                                             */
/* ------------------------------------------------------------------ */

export type ModelId = "design" | "accelerate" | "operate" | "activate";

export interface Model {
  id: ModelId;
  name: string;
  timing: string;
  ref: string;
  /** What state the capability is in under this model. */
  condition: string;
  when: string;
  supplies: string;
  ends: string;
  /** Plain-language example of the situation, for the scanning reader. */
  example: string;
}

export const MODELS: Model[] = [
  {
    id: "design",
    name: "Design",
    timing: "Before the hire",
    ref: "M-01",
    condition: "Nothing built yet. The plan comes first.",
    when: "You know something is missing, but not what to hire, in what order, or what it should be accountable for. We start by agreeing the KPIs and definitions everything else will be measured against.",
    supplies:
      "Diagnosis, architecture, the measurement framework, and a defensible answer to what the role should actually be.",
    ends: "The design is decided and the first piece of work is scoped.",
    example:
      "A private-equity-backed business is about to open a growth req and can't agree internally on what the role owns.",
  },
  {
    id: "accelerate",
    name: "Accelerate",
    timing: "Alongside the hire",
    ref: "M-02",
    condition: "Being built, with your new leader running it.",
    when: "You've hired the leader. They own the mandate and have roughly ninety days to show it moving, with no team and a system they didn't design.",
    supplies:
      "Multidisciplinary capacity around a leader who keeps the mandate: architecture, data, ops, analytics, content, build.",
    ends: "The internal team can carry it without us.",
    example:
      "A new CRO is ninety days in, owns the number, and has two open roles and no analytics team.",
  },
  {
    id: "operate",
    name: "Operate",
    timing: "Until it's yours",
    ref: "M-03",
    condition: "Running now, on loan, with a handover date agreed.",
    when: "The capability is needed now and the organisation isn't ready to hire five specialist roles to get it.",
    supplies:
      "An embedded, running capability, documented as it runs, with knowledge transfer built into the engagement.",
    ends: "The capability moves in-house. That date is agreed at the start.",
    example:
      "A company adopting AI needs governed data and a working use case now, and isn't ready to hire five specialists to get there.",
  },
  {
    id: "activate",
    name: "Activate",
    timing: "Once the system is built",
    ref: "M-04",
    condition: "Already yours. We help you run it.",
    when: "The intelligence, the data and the operating system are already yours. What you want is execution — demand generation, paid search and display, social, lifecycle, content production.",
    supplies:
      "Hands-on execution against a system you already own, measured on the KPIs your own analytics already define.",
    ends: "This is the one engagement designed to keep going.",
    example:
      "A marketing team with clean data and a working stack wants a partner to run acquisition and lifecycle, not rebuild anything.",
  },
];

/* ------------------------------------------------------------------ */
/* Scene 6 — the recommended first slice                               */
/* ------------------------------------------------------------------ */

export type Ratings = Record<string, Rating>;

export interface Slice {
  room: Room;
  model: Model;
  rationale: string;
  blocking: Room[];
}

/**
 * Which capability to build first.
 *
 * The rule is the book's, not a scoring algorithm: foundations before
 * visible work, and the constraint that most other rooms depend on before
 * anything else. Deliberately readable — an executive should be able to
 * disagree with it out loud.
 */
export function recommendSlice(ratings: Ratings): Slice | null {
  const rated = ROOMS.filter((r) => ratings[r.id] != null);
  if (rated.length === 0) return null;

  const val = (id: string) => ratings[id];

  // 1. Foundations first. A weak lower level caps every floor above it.
  const foundation = roomById("customer-intelligence")!;
  const fLevel = val(foundation.id);
  if (fLevel != null && fLevel <= 2) {
    const blocked = ROOMS.filter(
      (r) => r.depends.includes(foundation.id) && (val(r.id) ?? 0) >= 2,
    );
    return {
      room: foundation,
      model: modelFor(fLevel),
      rationale:
        blocked.length > 0
          ? `You rated ${blocked.length} ${blocked.length === 1 ? "capability" : "capabilities"} at Established or better on top of a foundation you rated ${levelName(fLevel)}. That work is real, and it will keep hitting the same ceiling until identity and definitions are settled underneath it.`
          : `Everything above ground depends on identity, definitions and governance. At ${levelName(fLevel)}, this is the constraint — not a sequencing preference.`,
      blocking: blocked,
    };
  }

  // 2. Otherwise: the weakest room that the most other rooms depend on.
  const weakest = [...rated].sort((a, b) => {
    const d = (val(a.id) ?? 5) - (val(b.id) ?? 5);
    if (d !== 0) return d;
    return dependents(b.id).length - dependents(a.id).length;
  })[0];

  const lvl = val(weakest.id)!;
  const deps = dependents(weakest.id).filter((r) => ratings[r.id] != null);

  return {
    room: weakest,
    model: modelFor(lvl),
    rationale:
      deps.length > 0
        ? `At ${levelName(lvl)}, this is the lowest-rated capability in the building, and ${deps.length} other ${deps.length === 1 ? "room depends" : "rooms depend"} on it. Strengthening it raises the ceiling on all of them.`
        : `At ${levelName(lvl)}, this is the lowest-rated capability you marked. It's the cheapest place to create visible movement.`,
    blocking: deps,
  };
}

function dependents(id: string) {
  return ROOMS.filter((r) => r.depends.includes(id));
}

function modelFor(level: Level): Model {
  // Nothing to build on → Design it. Something to build on → Accelerate it.
  // Already connected → the system exists, so the need is execution.
  if (level <= 1) return MODELS[0];
  if (level === 2) return MODELS[1];
  return MODELS[3];
}

/* ------------------------------------------------------------------ */
/* Derived reads                                                       */
/* ------------------------------------------------------------------ */

/** How lit the atrium is: the share of rooms operating on shared definitions. */
export function atriumLight(ratings: Ratings): number {
  const rated = ROOMS.filter((r) => ratings[r.id] != null);
  if (rated.length === 0) return 0;
  const connected = rated.filter((r) => (ratings[r.id] as Level) >= 3).length;
  return connected / ROOMS.length;
}

export function ratedCount(ratings: Ratings) {
  return ROOMS.filter((r) => ratings[r.id] != null).length;
}

export function unrated(ratings: Ratings) {
  return ROOMS.filter((r) => ratings[r.id] == null);
}
