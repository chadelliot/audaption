/*
  The deep-dive pages.

  Each chapter of the approach is a front door; these are the rooms behind them.
  One page per body of work, all built to the same anatomy so a reader who has
  read one can read any of them:

    1. Where the value leaks        three ways it goes missing
    2. The exhibit                  the leak, shown (illustrative, not client data)
    3. How we ensure the value      a baseline, a standing control, and proof
    4. What you get                 the deliverables
    5. How it connects              the pages beside it

  "How we ensure the value" is the part that matters and it is deliberately the
  same three moves everywhere. A baseline, so the starting point is a number and
  not a feeling. A standing control, so the gain is held by a rule with an owner
  and does not decay when attention moves on. And proof, reported against the
  baseline on the same method, including when the answer is that something did
  not work. These describe how we work. They are not guarantees of a result, and
  nothing on these pages is a client outcome.

  Pages are grouped by the four layers the opening names — Data, Journey,
  Experience, Strategy — because that is how the approach is built.
*/

import type { ExhibitId } from "@/components/exhibits";

export type Layer = "Data" | "Journey" | "Experience" | "Strategy";

export const LAYERS: { id: Layer; line: string }[] = [
  { id: "Data", line: "What we know about each market and customer." },
  { id: "Journey", line: "The steps a buyer takes to a decision, and to the next one." },
  { id: "Experience", line: "Every touchpoint, and every signal it throws off." },
  { id: "Strategy", line: "The shared motion, the money behind it, and the proof." },
];

export interface Capability {
  slug: string;
  title: string;
  layer: Layer;
  /** The approach chapter this page extends, for the way back. */
  chapter: string;
  /** The page's headline claim. */
  claim: string;
  lede: string;
  description: string;
  leaks: { k: string; v: string }[];
  exhibits: ExhibitId[];
  exhibitNote: string;
  ensure: { k: string; v: string }[];
  gets: string[];
  related: string[];
}

export const CAPABILITIES: Capability[] = [
  /* ---------------------------------------------------------------- Data */
  {
    slug: "ideal-customer-profile",
    title: "Ideal Customer Profile",
    layer: "Data",
    chapter: "Market",
    claim: "Know your best customer before you chase the next one.",
    lede: "An ideal customer profile is only useful if it is built from evidence and it can score the whole market. We build it from the customers who buy, stay and expand, then score every account against it so every team knows where effort goes first.",
    description:
      "Build an ideal customer profile from the customers who buy, stay and expand, and score your whole market against it.",
    leaks: [
      {
        k: "A profile written from opinion",
        v: "Most are a workshop output: a paragraph of adjectives. Nobody can count against it, so it changes nothing about where effort goes.",
      },
      {
        k: "Every account treated alike",
        v: "Without tiers, a small account and a strategic one get the same follow-up, and the best accounts wait in the same queue as the rest.",
      },
      {
        k: "Winners lost in an average",
        v: "Blended win rates and deal sizes hide that a small slice of the base produces most of the revenue.",
      },
    ],
    exhibits: ["icp"],
    exhibitNote:
      "A profile built from the customers who stay, set against the whole base, and what it does once it scores the market.",
    ensure: [
      {
        k: "Baseline",
        v: "We start from closed-won and retained customers, not from the pipeline, and fix today's win rate, deal size and retention by tier, so progress has something to be measured against.",
      },
      {
        k: "Standing control",
        v: "Fit scores are recalculated on a schedule against new outcomes, and any change to a tier definition is logged and reviewed with sales and marketing.",
      },
      {
        k: "Proof",
        v: "Each tier's win rate, deal size and revenue share are reported against the baseline. If a tier stops separating winners from the rest, we say so and redraw it.",
      },
    ],
    gets: [
      "An ideal customer profile written from your own customers",
      "Fit scoring across your whole market, inside your CRM",
      "Tier definitions and the plays that follow from each",
      "A short guide so new hires and agencies use one definition",
      "A reporting view of win rate and revenue by tier",
    ],
    related: ["customer-journey", "crm-automation", "go-to-market-motion"],
  },
  {
    slug: "crm-automation",
    title: "CRM & Automation",
    layer: "Data",
    chapter: "Customer",
    claim: "One customer record, and automation that runs on it.",
    lede: "A CRM is only as useful as the record in it. We resolve duplicates into one customer profile with one owner, then automate the work that should never wait on a person: matching, scoring, routing and the first-response clock.",
    description:
      "Resolve duplicate records into one customer profile with one owner, and automate matching, scoring, routing and response.",
    leaks: [
      {
        k: "The same company, four times",
        v: "A sales import, a web form, an event list and a support ticket each created their own record, with their own name, owner and history.",
      },
      {
        k: "No owner, or three",
        v: "Accounts nobody is responsible for go cold; accounts three people are responsible for get contacted three times.",
      },
      {
        k: "Hours before a buyer hears back",
        v: "Win rate falls away in the first hours after a buyer raises a hand, and the delay is almost always process, not people.",
      },
    ],
    exhibits: ["record", "route"],
    exhibitNote:
      "Four records merged into one customer, and what has to happen on its own in the minutes after a buyer raises a hand.",
    ensure: [
      {
        k: "Baseline",
        v: "Before changing anything we measure duplicate rate, accounts without an owner, completeness of required fields and median time to first response. Those four numbers are the before.",
      },
      {
        k: "Standing control",
        v: "Merge, ownership and routing rules are written down, versioned and enforced in the system, each with a named owner. Anything outside the rules is flagged, not silently fixed.",
      },
      {
        k: "Proof",
        v: "The same four numbers are reported monthly against the baseline, alongside the downstream result that matters: win rate by response time.",
      },
    ],
    gets: [
      "A duplicate audit and a merge plan with survivorship rules",
      "Ownership and lifecycle rules, enforced in the CRM",
      "Lead scoring, routing and a response clock",
      "Automation for every step before the first human touch",
      "Data-quality and response-time reporting",
    ],
    related: ["ideal-customer-profile", "martech", "signal-led-selling"],
  },
  {
    slug: "martech",
    title: "MarTech",
    layer: "Data",
    chapter: "Customer",
    claim: "A stack that carries the signal all the way through.",
    lede: "A martech stack is a pipe, and pipes leak at joints. We audit what is connected, what is manual, what overlaps and what is unused, then fix the few integrations that carry signal before anyone buys anything new.",
    description:
      "Audit your marketing technology stack for lost signal, overlap and unused licences, and fix the integrations that matter.",
    leaks: [
      {
        k: "Consent and tag gaps",
        v: "Blocked tags and missing consent quietly remove a slice of buyer behavior before it ever reaches a tool that could use it.",
      },
      {
        k: "Joints run by hand",
        v: "An export every Monday is an integration that stops when someone is away, and everything downstream goes stale with it.",
      },
      {
        k: "Overlap and shelfware",
        v: "Two tools doing one job, and seats and features paid for and never switched on, are usually in the same places the signal is being lost.",
      },
    ],
    exhibits: ["stack"],
    exhibitNote:
      "Six tools, five joints, and the arithmetic that leaves a minority of buyer behavior reaching the CRM.",
    ensure: [
      {
        k: "Baseline",
        v: "We map every tool, joint and licence, and measure the share of buyer behavior that reaches the CRM and how much of each licence is actually used.",
      },
      {
        k: "Standing control",
        v: "One owner for every joint, a change log for tags and integrations, and a rule that nothing new is bought until the audit shows the gap it fills.",
      },
      {
        k: "Proof",
        v: "Signal reach and licence use are re-measured on the same method each quarter, with spend retired and signal recovered shown side by side.",
      },
    ],
    gets: [
      "A stack map: tools, joints, owners and licences",
      "A signal-loss measurement at every joint",
      "A retire, connect and keep list, with the savings",
      "Consent and tag remediation",
      "A change-control process so the stack stays clean",
    ],
    related: ["crm-automation", "marketing-analytics", "advertising-roi"],
  },

  /* ------------------------------------------------------------- Journey */
  {
    slug: "customer-journey",
    title: "Customer Journey",
    layer: "Journey",
    chapter: "Journey",
    claim: "Map the path buyers take, not the path you drew.",
    lede: "A journey map drawn in a workshop is a guess. We build it from what customers actually did, stage by stage, with who joined, how long it took and where buyers left, and we map the road back to a second purchase as carefully as the first.",
    description:
      "Build the buyer journey from real behavior: stages, buying roles, drop-off and the path to repeat purchase.",
    leaks: [
      {
        k: "A map nobody can measure",
        v: "Stages with no definition and no data behind them cannot be improved, only discussed.",
      },
      {
        k: "The biggest drop hides in an average",
        v: "Blended conversion says the funnel is fine. Stage by stage, one step is losing most of the buyers and nobody owns it.",
      },
      {
        k: "Repeat revenue left to chance",
        v: "The path to a second purchase is a journey of its own, and it is rarely mapped, owned or measured at all.",
      },
    ],
    exhibits: ["journey"],
    exhibitNote:
      "The buying path from what customers did, with the stage that loses the most buyers called out, and the road back.",
    ensure: [
      {
        k: "Baseline",
        v: "We reconstruct the real stages from CRM, web and sales data, and fix conversion, time and drop-off at each stage as the starting line.",
      },
      {
        k: "Standing control",
        v: "Each stage gets an owner, an exit rule and a metric, so a stall has a person to answer for it. Stage definitions change only through a logged decision.",
      },
      {
        k: "Proof",
        v: "Stage conversion and time are reported against the baseline, and the stage we targeted is called out, so an improvement can be tied to a change we made.",
      },
    ],
    gets: [
      "The journey, built from your own behavioral and sales data",
      "Buying roles, and who joins at each stage",
      "Drop-off and stall analysis, with the stage to fix first",
      "The return path: adoption, expansion, renewal and repurchase",
      "Stage definitions written into your CRM",
    ],
    related: ["ideal-customer-profile", "signal-led-selling", "go-to-market-motion"],
  },

  /* ---------------------------------------------------------- Experience */
  {
    slug: "website-conversion",
    title: "Website & Conversion",
    layer: "Experience",
    chapter: "Touchpoints",
    claim: "Make the page respond to the buyer in front of it.",
    lede: "Your website is where the message meets behavior. We design what each page shows by market and stage, test it against a bar we agree beforehand, and measure how far each visit gets, so the site keeps learning instead of being redesigned every few years.",
    description:
      "Design website experiences that respond to each buyer by market and stage, and measure what each visit teaches.",
    leaks: [
      {
        k: "One page for every buyer",
        v: "An enterprise committee and an operations manager arrive with different questions and leave with the same answer.",
      },
      {
        k: "Redesigns that start from taste",
        v: "A new look is not an experiment. Without a hypothesis and a bar for success, nobody learns whether it worked.",
      },
      {
        k: "Visits that teach nothing",
        v: "Page views are counted but journey progression is not, so the site never tells the rest of the system what a buyer is ready for.",
      },
    ],
    exhibits: ["touchpoints", "website"],
    exhibitNote:
      "The funnel and what we say at each stage to two different buyers, then one page opening two ways, the rule that decides which, and how each did against the default.",
    ensure: [
      {
        k: "Baseline",
        v: "We measure conversion by market and stage on today's pages, and agree the handful of pages that carry the pipeline.",
      },
      {
        k: "Standing control",
        v: "Every variant has a rule, an owner and a test with a success measure agreed beforehand. Losing variants are retired, not left running.",
      },
      {
        k: "Proof",
        v: "Conversion for each audience is reported against its own baseline, with the confidence of the test stated, so a win is a win.",
      },
    ],
    gets: [
      "A priority list of the pages that carry pipeline",
      "Audience rules by market and lifecycle stage",
      "Variant design and a testing plan",
      "Measurement that ties visits to journey progression",
      "A playbook so the site keeps learning",
    ],
    related: ["content-creative", "signal-led-selling", "customer-journey"],
  },
  {
    slug: "content-creative",
    title: "Content & Creative",
    layer: "Experience",
    chapter: "Touchpoints",
    claim: "Test the message against the audience, not just the channel.",
    lede: "A message that wins with one buyer loses with the next. We run message-by-audience tests and keep the results in one library that creative, marketing and sales all use, so what to say becomes a matter of evidence.",
    description:
      "Test messages against audiences, keep a library of what works where, and brief creative from evidence.",
    leaks: [
      {
        k: "Taste decides",
        v: "The loudest opinion in the room picks the message, and the test, if there is one, is run against the channel and not the reader.",
      },
      {
        k: "Winners are not kept",
        v: "A message that worked is used once and forgotten, so every campaign starts from a blank page.",
      },
      {
        k: "One message for every reader",
        v: "Procurement, operations, finance and the executive each want a different first sentence, and get the same one.",
      },
    ],
    exhibits: ["reach"],
    exhibitNote:
      "Meetings booked per hundred who saw a message, by audience. The same message, read by different people.",
    ensure: [
      {
        k: "Baseline",
        v: "We inventory the messages in use today and fix response by audience as the starting point.",
      },
      {
        k: "Standing control",
        v: "A test calendar with a bar for a win and a bar for retiring a message agreed up front. Results go into one library, not into slide decks.",
      },
      {
        k: "Proof",
        v: "Winning combinations are reported with sample sizes, and the library records what each message did and where, so the next brief starts from evidence.",
      },
    ],
    gets: [
      "A message-by-audience testing plan",
      "A message library with results attached",
      "Creative briefs written from what worked",
      "Sales-ready versions of the winners",
      "Retirement rules for what does not",
    ],
    related: ["website-conversion", "advertising-roi", "ideal-customer-profile"],
  },
  {
    slug: "signal-led-selling",
    title: "Signal-led Selling",
    layer: "Experience",
    chapter: "Signals",
    claim: "Turn every touchpoint into a signal someone acts on.",
    lede: "An account leaves a trail. Read together on one timeline, the trail tells a seller when to call and what to say. We decide which signals matter, give each an owner and a play, and wire them into the tools your people already use.",
    description:
      "Define the buyer signals that matter, give each an owner and a play, and put them in front of sellers at the right moment.",
    leaks: [
      {
        k: "Signals nobody sees",
        v: "A funding round, a new executive or a competitor page view is captured in a tool no seller opens.",
      },
      {
        k: "Plays nobody owns",
        v: "A signal with no named owner and no agreed response is just a notification, and notifications get ignored.",
      },
      {
        k: "Contact when it is convenient",
        v: "Without timing, outreach follows the seller's calendar rather than the buyer's moment, and arrives after the opportunity has formed.",
      },
    ],
    exhibits: ["sell"],
    exhibitNote:
      "One account across ninety days: what marketing did, what the account did, what the system did, and what a seller did.",
    ensure: [
      {
        k: "Baseline",
        v: "We catalogue the signals you already capture, who sees them and how long it takes before anyone acts, and trace a sample of won deals back through their trail.",
      },
      {
        k: "Standing control",
        v: "A short list of signals, each with a named owner, a play for marketing, a play for sales and a response window. A signal without an owner is not live.",
      },
      {
        k: "Proof",
        v: "Time from signal to action, and the pipeline and win rate of signal-triggered accounts against the rest, reported monthly.",
      },
    ],
    gets: [
      "A signal library: what matters, why, and what each one means",
      "Plays for marketing and sales for every signal",
      "Routing, alerts and response windows in your tools",
      "Account timelines for sellers",
      "Reporting on signal-to-action time and outcome",
    ],
    related: ["customer-journey", "crm-automation", "go-to-market-motion"],
  },

  /* ------------------------------------------------------------ Strategy */
  {
    slug: "go-to-market-motion",
    title: "Go-to-Market Motion",
    layer: "Strategy",
    chapter: "Motion",
    claim: "One motion, one plan and one scoreboard, shared.",
    lede: "This is where the three layers meet. For each stage of the journey we set what marketing does, what sales does and the one measure they share, so handoffs are designed rather than negotiated, and nobody optimizes a number the other team cannot see.",
    description:
      "Align sales and marketing in one go-to-market motion: shared stages, plays, owners and a single scoreboard.",
    leaks: [
      {
        k: "Two plans, two scoreboards",
        v: "Marketing is measured on leads and sales on revenue, so each can hit its number while the company misses its own.",
      },
      {
        k: "Handoffs negotiated, not designed",
        v: "What counts as ready, and what travels with the account, is argued over every quarter instead of written down once.",
      },
      {
        k: "Measures only one team can see",
        v: "A metric that lives in one team's tool cannot be acted on by the other, however much it matters to both.",
      },
    ],
    exhibits: ["motion"],
    exhibitNote:
      "The journey's stages across, and down the side what marketing does, what sales does, the measure they share and who owns it.",
    ensure: [
      {
        k: "Baseline",
        v: "We write down how sales and marketing work today, stage by stage, where each hands off and what each is measured on, and fix the shared starting numbers.",
      },
      {
        k: "Standing control",
        v: "One plan, one scoreboard and a named owner for every step, with a monthly joint review where the scoreboard is the agenda.",
      },
      {
        k: "Proof",
        v: "Pipeline created, win rate and net revenue retention are reported to both teams from one source, with changes tied to decisions made in the review.",
      },
    ],
    gets: [
      "The shared plan, by journey stage",
      "Handoff definitions, with the context that travels with them",
      "One scoreboard, built in your reporting",
      "Roles and owners for every step",
      "The review cadence that keeps it alive",
    ],
    related: ["ideal-customer-profile", "customer-journey", "signal-led-selling", "advertising-roi"],
  },
  {
    slug: "advertising-roi",
    title: "Advertising ROI",
    layer: "Strategy",
    chapter: "Fund",
    claim: "Fund the motion where the next dollar earns most.",
    lede: "Average return tells you what a channel did. The slope of its curve tells you what the next dollar will do. We read the curves, move money before the quarter closes, and keep reading them, so spend follows return instead of habit.",
    description:
      "Read the marginal return of every advertising channel and move budget to where the next dollar earns most.",
    leaks: [
      {
        k: "Averages hide saturation",
        v: "The channel with the best average return is often the one furthest past its knee, where the next dollar buys the least.",
      },
      {
        k: "Budgets set once a year",
        v: "Money allocated in January is defended in October long after the curves have moved.",
      },
      {
        k: "Platforms grading their own homework",
        v: "Each platform reports the return it wants to be credited with, and those reports do not add up to the revenue that was booked.",
      },
    ],
    exhibits: ["allocate"],
    exhibitNote:
      "Four channels as response curves, today's spend on each, and what moving $25K a month would return at the same total.",
    ensure: [
      {
        k: "Baseline",
        v: "We build response curves for each channel from your spend and outcome history, and fix the starting return, marginal return and budget split.",
      },
      {
        k: "Standing control",
        v: "A standing monthly review with caps and floors per channel, a pre-agreed rule for when money moves, and a log of every change and its reason.",
      },
      {
        k: "Proof",
        v: "Return after each move is read against the curve we predicted and reconciled to finance, so a reallocation is judged by what it earned, not by what a platform says.",
      },
    ],
    gets: [
      "Response curves and marginal returns by channel",
      "A budget reallocation plan with caps and floors",
      "A monthly cadence for reading and moving spend",
      "Reconciled return reporting",
      "A way to test new channels without guessing",
    ],
    related: ["marketing-analytics", "go-to-market-motion", "martech"],
  },
  {
    slug: "marketing-analytics",
    title: "Marketing Analytics",
    layer: "Strategy",
    chapter: "Prove",
    claim: "Report one number, with the range behind it.",
    lede: "Every platform claims the sale, and added together they claim more than the company booked. We reconcile credit to finance, show each channel's return as a range, and give leadership one number it can repeat and a read it can allocate against.",
    description:
      "Reconcile marketing attribution to finance and report return as a range, so leadership has one number it can trust.",
    leaks: [
      {
        k: "Every platform claims the sale",
        v: "Each one counts the conversions it touched, so the same revenue is counted several times over.",
      },
      {
        k: "Reports nobody reconciles",
        v: "Marketing, finance and the platforms each hold a different number, and the meeting is spent deciding which to believe.",
      },
      {
        k: "Credit treated as a verdict",
        v: "First-touch, last-touch and modelled credit disagree. Reporting one as the truth hides how much is actually known.",
      },
    ],
    exhibits: ["prove", "attribution"],
    exhibitNote:
      "Return by channel as a range against a target, and the fuller picture of how three methods credit the same booked revenue.",
    ensure: [
      {
        k: "Baseline",
        v: "We reconcile what each platform reports against what finance booked, and make that gap the starting number.",
      },
      {
        k: "Standing control",
        v: "One measurement model, one set of metric definitions and one source of truth, with a named owner. Any change to a definition is logged.",
      },
      {
        k: "Proof",
        v: "Credit is reported as a range, always summing to the finance number, with the method stated, so a board can repeat the figure and an allocator can act on the range.",
      },
    ],
    gets: [
      "A unified measurement model and metric dictionary",
      "Reconciliation of every platform to finance",
      "Attribution as a range, with the method explained",
      "An executive view built for decisions, not decoration",
      "A cadence for reading it and acting on it",
    ],
    related: ["advertising-roi", "martech", "go-to-market-motion"],
  },
  {
    slug: "ai-readiness",
    title: "AI Readiness",
    layer: "Strategy",
    chapter: "Scale",
    claim: "Build in the order that unlocks automation and AI.",
    lede: "AI does not skip steps. Each layer you build makes something new possible: a profile unlocks scoring, a journey unlocks next-best-action, signals unlock timing, a shared motion unlocks forecasting. We build in that order so each step pays for the next.",
    description:
      "Sequence the build by what each step unlocks, so automation and AI have the data and structure they need to work.",
    leaks: [
      {
        k: "Pilots with nothing to stand on",
        v: "A model is pointed at data that has no single customer record, no agreed stages and no owner, and the pilot stalls.",
      },
      {
        k: "Tools bought before the layers",
        v: "A platform is selected for what is new, not for what the foundation underneath it can support.",
      },
      {
        k: "AI nobody owns",
        v: "A use case with no business owner and no baseline cannot succeed or fail, only continue.",
      },
    ],
    exhibits: ["aipath", "readiness"],
    exhibitNote:
      "The order to build in and what each step unlocks, and a readiness check showing which use cases can run today and which layer blocks the rest.",
    ensure: [
      {
        k: "Baseline",
        v: "We assess each layer against what the use cases you want actually need, and rank them by what is ready today and what is blocked by which layer.",
      },
      {
        k: "Standing control",
        v: "A build order by what each step unlocks, with owners, and a rule that a pilot starts only when the layers beneath it are in place and a business owner is named.",
      },
      {
        k: "Proof",
        v: "Each use case is judged against a baseline from before it ran and shown at the layer where it works, so success and failure are both traceable to a cause.",
      },
    ],
    gets: [
      "A readiness assessment against the use cases you care about",
      "A build order, by what each step unlocks",
      "The foundations built: profile, journey, signals and motion",
      "Pilots with owners and baselines",
      "Governance for the data and knowledge AI will read",
    ],
    related: ["ideal-customer-profile", "crm-automation", "go-to-market-motion"],
  },
];

export const CAPABILITY: Record<string, Capability> = Object.fromEntries(
  CAPABILITIES.map((c) => [c.slug, c]),
);
