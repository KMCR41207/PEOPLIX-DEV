/**
 * aboutContent.ts
 * ────────────────────────────────────
 * Every "About Peoplix" point rendered in the About section.
 * Each item is one row — do NOT merge into paragraphs.
 * Content sourced from https://peoplix.ai
 */

export interface AboutPoint {
  /** Display number, e.g. "01" */
  number: string;
  /** Short title for the row */
  title: string;
  /** 1–2 line description */
  description: string;
}

export const aboutPoints: AboutPoint[] = [
  {
    number: "01",
    title: "What Peoplix is",
    description:
      "Peoplix builds intelligent AI voice agents that resolve enterprise service requests end-to-end — starting with HR operations and expanding across shared services.",
  },
  {
    number: "02",
    title: "Mission",
    description:
      "Resolve every employee request instantly. No tickets, no wait times, no extra headcount — just autonomous AI agents that understand, decide, and act.",
  },
  {
    number: "03",
    title: "The problem we solve",
    description:
      "Enterprise HR service desks are drowning in repetitive tickets. Teams spend 60–70% of their time answering the same leave, payroll, and policy questions while employees wait hours for simple answers.",
  },
  {
    number: "04",
    title: "Who it's for",
    description:
      "CHROs, VP HR Operations, Head of Shared Services, CIOs, and IT Leaders seeking measurable automation, cost reduction, and improved employee experience.",
  },
  {
    number: "05",
    title: "Voice-first AI agents",
    description:
      "Natural, conversational AI agents that handle employee requests through secure voice and chat interactions — with built-in authentication and natural language understanding.",
  },
  {
    number: "06",
    title: "Policy reasoning engine",
    description:
      "Understands and applies company HR policies in real-time, giving employees accurate, context-aware answers with automatic policy parsing and updates.",
  },
  {
    number: "07",
    title: "Real-time HRIS transactions",
    description:
      "Executes live HR system actions — from leave requests to payroll queries — directly inside Workday without human intervention, with full audit trails.",
  },
  {
    number: "08",
    title: "How it works",
    description:
      "Employee speaks or chats → AI reasons over intent and context → Policy engine validates compliance → Transaction engine executes in Workday → Done, with full auditability.",
  },
  {
    number: "09",
    title: "Why Peoplix",
    description:
      "Traditional chatbots deflect questions — Peoplix resolves work. 94% resolution rate, 42-second average handle time, 50%+ HR service cost savings, and 24/7 employee support.",
  },
  {
    number: "10",
    title: "Security & privacy",
    description:
      "Enterprise-grade security architecture with role-based access control, encrypted data handling, full audit trails, and SOC 2-ready infrastructure. Every action is logged and traceable.",
  },
  {
    number: "11",
    title: "Our team & culture",
    description:
      "We ship fast, stay close to the problem, and build at the intersection of AI and enterprise operations. Developers here own features end-to-end and see their work reach thousands of users.",
  },
  {
    number: "12",
    title: "Contact",
    description:
      "peoplix.ai · Book a demo or get in touch through the website contact form.",
  },
];
