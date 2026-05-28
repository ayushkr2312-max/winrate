export const PILLARS = [
  {
    id: "experience",
    num: "01",
    module: "CTX",
    role: "Context layer",
    short: "Experience",
    title: "Esports context, first",
    lead: "We come from esports operations, so we understand what breaks when teams scale quickly with limited resources.",
    body: "That context helps us design systems that fit real org pressure: match schedules, staff constraints, sponsor obligations, and fast-moving decisions.",
    signals: [
      { k: "Org reality", v: "Built around your structure, not a generic template." },
      { k: "Budget aware", v: "Scoped to what actually creates value at your stage." },
      { k: "Hands-on", v: "Practical and execution-focused from day one." },
    ],
    outputs: ["Operational audits", "Process mapping", "Execution plans"],
    stat: "Native",
    statLabel: "esports ops DNA",
    accent: "lime",
  },
  {
    id: "technical",
    num: "02",
    module: "BLD",
    role: "Build layer",
    short: "Technical",
    title: "Build, not just advise",
    lead: "We implement the systems ourselves: automations, dashboards, prep tooling, integrations, and operational workflows.",
    body: "Instead of reports and decks, you get working systems your team can use immediately and improve over time.",
    signals: [
      { k: "Automation", v: "Remove repetitive manual operations." },
      { k: "Dashboards", v: "Centralize team and org visibility." },
      { k: "Tooling", v: "Role-specific systems for faster execution." },
    ],
    outputs: ["Workflow systems", "Custom dashboards", "Data and prep tools"],
    stat: "Ship",
    statLabel: "working systems, not decks",
    accent: "lime",
  },
  {
    id: "network",
    num: "03",
    module: "NET",
    role: "Access layer",
    short: "Network",
    title: "Resource access that saves time and money",
    lead: "Our esports network helps orgs source reliable people and vendors without expensive trial-and-error.",
    body: "We route staffing, creative, analyst, coaching, and service sourcing through trusted channels that match your budget level.",
    signals: [
      { k: "Talent", v: "Staff, editors, designers, analysts, players, coaches." },
      { k: "Vendors", v: "Reliable suppliers and service partners." },
      { k: "Value", v: "Fit and cost-conscious options over hype picks." },
    ],
    outputs: ["Network sourcing", "Vendor routing", "Resource matchmaking"],
    stat: "Direct",
    statLabel: "industry routing",
    accent: "ion",
  },
  {
    id: "custom",
    num: "04",
    module: "SCP",
    role: "Scope layer",
    short: "Custom",
    title: "No one-size-fits-all",
    lead: "Every org is different, so every engagement is scoped to your goals, operating model, and current capacity.",
    body: "We build the right blend of systems, human support, and process optimization for your specific stage.",
    signals: [
      { k: "Flexible scope", v: "Start focused, then scale as results compound." },
      { k: "Clear delivery", v: "Defined priorities, milestones, and ownership." },
      { k: "Long-term", v: "Iterate and optimize beyond launch." },
    ],
    outputs: ["Custom systems", "Scoped implementation", "Continuous optimization"],
    stat: "Yours",
    statLabel: "scoped to your org",
    accent: "amber",
  },
];

export const FLOW = [
  { n: "01", title: "Understand", desc: "Map structure, goals, constraints, and operational weight." },
  { n: "02", title: "Diagnose", desc: "Find bottlenecks, manual loops, and process gaps costing time." },
  { n: "03", title: "Build", desc: "Implement workflows, dashboards, and tooling around your team." },
  { n: "04", title: "Iterate", desc: "Optimize with your org as you scale to the next stage." },
];

export const EQUATION = [
  { k: "Context", pillar: 0 },
  { k: "Execution", pillar: 1 },
  { k: "Network", pillar: 2 },
];

/** Orbit positions (%, %) around the core dial */
export const ORBIT_SLOTS = [
  { x: 50, y: 6 },
  { x: 92, y: 50 },
  { x: 50, y: 94 },
  { x: 8, y: 50 },
];
