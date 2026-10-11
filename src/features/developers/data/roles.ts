/**
 * roles.ts
 * ────────────────────────────────────
 * Every developer role offered by Peoplix.
 * Add a new role by appending an object to the `roles` array.
 * The `slug` is used in the URL query param (?role=<slug>).
 */

export interface Role {
  /** URL-safe slug, e.g. "frontend" */
  slug: string;
  /** Display name shown in the category list and detail panel */
  title: string;
  /** One-line description for the category row */
  shortDescription: string;
  /** 1–2 paragraph summary: "What this person does" */
  summary: string;
  /** 6–8 concrete bullet points of day-to-day work */
  dayToDay: string[];
  /** Tech / tool chip labels */
  skills: string[];
  /** 2–3 lines about what the person will build at Peoplix */
  whatYoullBuild: string;
  /** 3–4 "nice to have" bullets */
  niceToHave: string[];
  /** Meta row values — use "[FILL]" as a placeholder you will replace later */
  meta: {
    experience: string;
    workType: string;
    location: string;
  };
}

export const roles: Role[] = [
  {
    slug: "frontend",
    title: "Frontend Developer",
    shortDescription:
      "Build the interface users see and interact with every day.",
    summary:
      "The frontend developer turns designs into responsive, accessible UI that feels fast and polished. You own everything from component architecture and state management to routing, API integration, and cross-browser testing — making sure every pixel works on every device.",
    dayToDay: [
      "Translate Figma designs into pixel-perfect React components with semantic HTML and accessible markup",
      "Architect reusable component libraries with clear prop APIs and comprehensive Storybook documentation",
      "Implement client-side routing, code-splitting, and lazy loading to keep initial bundle size under budget",
      "Integrate REST and GraphQL APIs, managing loading states, error boundaries, and optimistic updates",
      "Write and maintain unit tests (Jest / Vitest) and integration tests for critical user flows",
      "Profile and optimise Core Web Vitals — LCP, CLS, INP — across mobile and desktop",
      "Set up and maintain the Tailwind design-token system, ensuring consistency with the design team",
      "Review pull requests for accessibility, performance regressions, and adherence to coding standards",
    ],
    skills: [
      "HTML",
      "CSS",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Vite",
      "Jest / Vitest",
      "Storybook",
    ],
    whatYoullBuild:
      "You'll own the Peoplix dashboard UI — the surfaces HR teams use every day to manage employees, run reports, and make decisions. You'll build new feature modules end-to-end and continuously improve performance and accessibility.",
    niceToHave: [
      "Experience with Next.js or Remix for SSR / SSG patterns",
      "Familiarity with animation libraries like Framer Motion or GSAP",
      "Background in design systems and component library publishing",
      "Contributions to open-source front-end projects",
    ],
    meta: {
      experience: "[FILL]",
      workType: "[FILL]",
      location: "[FILL]",
    },
  },
  {
    slug: "backend",
    title: "Backend Developer",
    shortDescription:
      "Build the logic, APIs, and services behind every screen.",
    summary:
      "The backend developer designs and implements the server-side logic that powers Peoplix — APIs, authentication, business rules, background jobs, and integrations. You ensure data flows reliably, securely, and at scale.",
    dayToDay: [
      "Design and implement RESTful and GraphQL APIs with clear versioning and thorough OpenAPI documentation",
      "Build authentication and authorisation flows — JWT, OAuth 2.0, RBAC — securing every endpoint",
      "Write business-logic services that enforce domain rules, validate inputs, and handle edge cases gracefully",
      "Develop background workers and job queues for email delivery, report generation, and data syncing",
      "Integrate with third-party services (payment gateways, notification providers, HRIS platforms)",
      "Implement structured logging, distributed tracing, and error reporting for production observability",
      "Write unit and integration tests for every service layer, maintaining high coverage thresholds",
      "Participate in architecture reviews, helping scale the system to handle growing traffic and data volume",
    ],
    skills: [
      "Node.js",
      "Python",
      "REST / GraphQL",
      "PostgreSQL",
      "Redis",
      "Message Queues",
      "Docker",
      "CI/CD",
    ],
    whatYoullBuild:
      "You'll design and ship the APIs that power Peoplix's HR platform — from employee management endpoints to real-time analytics pipelines. You'll own critical services like payroll processing, permission systems, and webhook integrations.",
    niceToHave: [
      "Experience with Go or Java for high-throughput services",
      "Knowledge of event-driven architectures and CQRS patterns",
      "Familiarity with infrastructure-as-code (Terraform, Pulumi)",
      "Prior work on multi-tenant SaaS platforms",
    ],
    meta: {
      experience: "[FILL]",
      workType: "[FILL]",
      location: "[FILL]",
    },
  },
  {
    slug: "devops",
    title: "Server Management (DevOps / SysAdmin)",
    shortDescription:
      "Keep everything running — servers, pipelines, and deployments.",
    summary:
      "The DevOps / SysAdmin engineer provisions and maintains the infrastructure that Peoplix runs on. You own CI/CD pipelines, monitoring, alerting, backups, scaling, security patching, and incident response — keeping uptime as close to 100% as possible.",
    dayToDay: [
      "Provision and manage cloud infrastructure (compute, networking, storage) using Terraform and IaC principles",
      "Build and maintain CI/CD pipelines in GitHub Actions for automated testing, building, and deployment",
      "Configure and manage container orchestration with Docker and Kubernetes across staging and production",
      "Set up comprehensive monitoring, alerting, and dashboards using Prometheus, Grafana, and PagerDuty",
      "Implement automated backup strategies and disaster-recovery runbooks for databases and object storage",
      "Harden servers and networks — firewall rules, TLS certificates, OS patching, vulnerability scanning",
      "Lead incident response: triage, mitigate, resolve, and write post-mortems for production outages",
      "Optimise cloud spend by right-sizing instances, implementing auto-scaling, and reviewing usage reports",
    ],
    skills: [
      "Linux",
      "Docker",
      "Kubernetes",
      "AWS / GCP / Azure",
      "Nginx",
      "Terraform",
      "GitHub Actions",
      "Prometheus / Grafana",
    ],
    whatYoullBuild:
      "You'll architect and maintain the infrastructure that serves Peoplix's platform to thousands of companies. You'll design zero-downtime deployment strategies and build the observability stack that keeps the engineering team confident in every release.",
    niceToHave: [
      "Experience with service meshes (Istio, Linkerd)",
      "Knowledge of FinOps practices and cloud cost optimisation",
      "Background in SOC 2 or ISO 27001 compliance environments",
      "Familiarity with GitOps workflows (ArgoCD, Flux)",
    ],
    meta: {
      experience: "[FILL]",
      workType: "[FILL]",
      location: "[FILL]",
    },
  },
  {
    slug: "database",
    title: "Database (DB) Engineer",
    shortDescription:
      "Design, optimise, and protect the data that powers everything.",
    summary:
      "The database engineer owns schema design, query performance, data integrity, migrations, backups, replication, and access control. You make sure Peoplix's data is fast to query, safe to store, and ready for the reporting pipelines that drive business decisions.",
    dayToDay: [
      "Design normalised and denormalised schemas that balance query performance with data integrity",
      "Write and optimise complex SQL queries, analysing execution plans and adding targeted indexes",
      "Plan and execute zero-downtime schema migrations using tools like pgroll, Flyway, or custom scripts",
      "Configure and monitor database replication (streaming, logical) for high availability and read scaling",
      "Implement automated backup schedules, point-in-time recovery testing, and cross-region disaster recovery",
      "Enforce row-level security, column masking, and access-control policies to meet compliance requirements",
      "Build and maintain ETL pipelines that feed data from operational databases into analytics warehouses",
      "Monitor query performance, connection pools, and resource utilisation, tuning configuration as traffic grows",
    ],
    skills: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "SQL",
      "Database Replication",
      "ETL Pipelines",
      "Data Modelling",
    ],
    whatYoullBuild:
      "You'll design the data layer that underpins every Peoplix feature — from the employee directory to payroll calculations and compliance reporting. You'll build the migration framework and the analytics pipeline that turns raw data into actionable HR insights.",
    niceToHave: [
      "Experience with columnar stores (ClickHouse, BigQuery) for analytics",
      "Knowledge of graph databases (Neo4j) for org-chart modelling",
      "Background in GDPR or data-residency compliance for HR data",
      "Familiarity with database proxy layers (PgBouncer, ProxySQL)",
    ],
    meta: {
      experience: "[FILL]",
      workType: "[FILL]",
      location: "[FILL]",
    },
  },
  {
    slug: "fullstack",
    title: "Full-Stack Developer",
    shortDescription:
      "Work across UI, API, and database to ship complete features.",
    summary:
      "The full-stack developer bridges front-end and back-end to deliver features end-to-end. You're comfortable writing a React component in the morning, an API endpoint after lunch, and a database migration before the day is over — whatever it takes to ship.",
    dayToDay: [
      "Scope, design, and implement entire features from UI mockup through API to database schema",
      "Build responsive React interfaces and connect them to backend services you also write and maintain",
      "Design RESTful APIs with proper validation, error handling, and documentation alongside the UI that consumes them",
      "Write database queries and migrations, ensuring performance and data integrity across the stack",
      "Collaborate with designers, product managers, and other engineers to break epics into shippable increments",
      "Set up feature flags and A/B test scaffolding to safely roll out new functionality to subsets of users",
      "Write end-to-end tests that cover the full user journey, from button click to database record",
      "Mentor teammates by reviewing code across the stack and sharing context that only a full-stack view provides",
    ],
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "REST APIs",
      "Tailwind CSS",
      "Git",
      "Docker",
    ],
    whatYoullBuild:
      "You'll own entire feature verticals inside Peoplix — designing the database model, building the API, and crafting the UI. From the onboarding wizard to the reporting dashboard, you'll ship features that thousands of HR teams rely on daily.",
    niceToHave: [
      "Experience with monorepo tooling (Turborepo, Nx)",
      "Familiarity with serverless platforms (Vercel, AWS Lambda)",
      "Background in product-led growth or SaaS metrics",
      "Interest in developer experience and internal tooling",
    ],
    meta: {
      experience: "[FILL]",
      workType: "[FILL]",
      location: "[FILL]",
    },
  },
  {
    slug: "mobile",
    title: "Mobile Developer",
    shortDescription:
      "Build and ship iOS and Android apps that work everywhere.",
    summary:
      "The mobile developer builds and maintains Peoplix's iOS and Android applications. You handle everything from navigation and offline behaviour to push notifications and app-store releases — delivering a native-quality experience on every device.",
    dayToDay: [
      "Build and maintain cross-platform mobile apps using React Native or Flutter with shared business logic",
      "Implement offline-first data strategies with local storage, background sync, and conflict resolution",
      "Design and integrate push notification flows for time-sensitive HR alerts (approvals, reminders, announcements)",
      "Manage app-store submission pipelines — build signing, metadata, screenshots, review compliance",
      "Optimise app startup time, memory usage, and battery consumption for low-end devices",
      "Implement biometric authentication, secure storage, and certificate pinning for sensitive HR data",
      "Write unit and integration tests, plus automated UI tests using Detox or Appium",
      "Coordinate with the backend team on API contracts and with designers on platform-specific UX conventions",
    ],
    skills: [
      "React Native",
      "Flutter",
      "iOS (Swift)",
      "Android (Kotlin)",
      "TypeScript",
      "Push Notifications",
      "App Store Connect",
      "Play Console",
    ],
    whatYoullBuild:
      "You'll build Peoplix's mobile companion app — letting managers approve leave requests on the go, employees check pay slips from their phones, and HR teams send company-wide announcements that land as push notifications.",
    niceToHave: [
      "Published apps with 10k+ active users",
      "Experience with CodePush or OTA update strategies",
      "Knowledge of mobile analytics and crash reporting (Sentry, Firebase)",
      "Background in accessibility on mobile platforms (VoiceOver, TalkBack)",
    ],
    meta: {
      experience: "[FILL]",
      workType: "[FILL]",
      location: "[FILL]",
    },
  },
  {
    slug: "qa",
    title: "QA / Test Engineer",
    shortDescription:
      "Write test plans, automate tests, and guard release quality.",
    summary:
      "The QA / Test engineer writes test strategies, builds automated test suites, finds and reports bugs, and gates every release. You're the last line of defence between code and production — making sure nothing ships that shouldn't.",
    dayToDay: [
      "Write comprehensive test plans and test cases for new features based on product specs and edge-case analysis",
      "Build and maintain end-to-end test suites using Playwright or Cypress that run in CI on every pull request",
      "Develop unit and integration test harnesses for backend services using Jest, pytest, or equivalent frameworks",
      "Perform exploratory testing sessions to find bugs that automated tests miss — edge cases, race conditions, UX issues",
      "Triage, document, and prioritise bugs with clear reproduction steps, environment details, and severity ratings",
      "Monitor and report on test coverage, flaky-test rates, and defect escape rates to improve release confidence",
      "Collaborate with developers to shift testing left — pair on testable architecture and review test code in PRs",
      "Maintain test data fixtures, mock services, and staging environments that mirror production behaviour",
    ],
    skills: [
      "Playwright",
      "Cypress",
      "Jest",
      "Test Planning",
      "API Testing",
      "CI/CD Integration",
      "Bug Tracking",
      "Performance Testing",
    ],
    whatYoullBuild:
      "You'll build the automated test infrastructure that gives Peoplix's engineering team the confidence to ship multiple times a day. You'll own the E2E suite, the regression gate, and the quality metrics dashboard.",
    niceToHave: [
      "Experience with visual regression testing (Percy, Chromatic)",
      "Knowledge of load and stress testing tools (k6, Locust)",
      "Background in accessibility auditing (axe, Lighthouse)",
      "ISTQB or similar certification",
    ],
    meta: {
      experience: "[FILL]",
      workType: "[FILL]",
      location: "[FILL]",
    },
  },
  {
    slug: "ai-ml",
    title: "AI / ML Engineer",
    shortDescription:
      "Build, evaluate, and deploy ML and LLM-powered features.",
    summary:
      "The AI / ML engineer designs and deploys machine-learning models and LLM-powered features inside Peoplix. You build data pipelines, train and evaluate models, craft prompt strategies, and ship intelligent features that help HR teams make better decisions.",
    dayToDay: [
      "Design and build data pipelines that clean, transform, and feature-engineer HR datasets for model training",
      "Train, fine-tune, and evaluate classification, NLP, and recommendation models using scikit-learn, PyTorch, or TensorFlow",
      "Develop and optimise LLM prompt chains for features like smart job-description generation and candidate screening",
      "Build model-serving infrastructure with proper versioning, A/B testing, and rollback capabilities",
      "Implement evaluation frameworks — offline metrics (precision, recall, NDCG) and online A/B experiment analysis",
      "Monitor model performance in production, detecting drift, bias, and degradation over time",
      "Collaborate with product and engineering to translate business problems into well-scoped ML projects",
      "Document model cards, data lineage, and ethical considerations for every model shipped to production",
    ],
    skills: [
      "Python",
      "PyTorch / TensorFlow",
      "scikit-learn",
      "LLMs / Prompt Engineering",
      "Data Pipelines",
      "MLOps",
      "SQL",
      "Docker",
    ],
    whatYoullBuild:
      "You'll build the intelligent features that set Peoplix apart — from attrition-risk predictions and smart talent matching to AI-assisted performance reviews and automated compliance flagging.",
    niceToHave: [
      "Experience with RAG architectures and vector databases (Pinecone, Weaviate)",
      "Knowledge of responsible AI practices and bias mitigation techniques",
      "Background in HR-tech or people-analytics domains",
      "Publications or open-source contributions in ML / NLP",
    ],
    meta: {
      experience: "[FILL]",
      workType: "[FILL]",
      location: "[FILL]",
    },
  },
  {
    slug: "security",
    title: "Security Engineer",
    shortDescription:
      "Protect systems, data, and users through proactive security.",
    summary:
      "The security engineer safeguards Peoplix's platform and its users' sensitive HR data. You perform threat modelling, vulnerability scanning, secure code review, access-control design, compliance auditing, and incident handling — building security into every layer.",
    dayToDay: [
      "Conduct threat modelling sessions for new features and architecture changes, identifying risks before code is written",
      "Run automated vulnerability scans (SAST, DAST, SCA) and triage findings into actionable fix-lists for dev teams",
      "Perform secure code reviews focused on injection, authentication bypass, access-control flaws, and data exposure",
      "Design and enforce least-privilege access-control policies across infrastructure, APIs, and databases",
      "Lead compliance efforts — SOC 2, GDPR, HIPAA readiness — maintaining evidence, controls, and audit trails",
      "Develop and maintain an incident-response playbook, running tabletop exercises and leading real-time triage",
      "Build security-awareness training for the engineering team, covering OWASP Top 10 and secure coding practices",
      "Evaluate and integrate security tooling — SIEM, WAF, secrets management, certificate rotation — into the stack",
    ],
    skills: [
      "Threat Modelling",
      "SAST / DAST",
      "OWASP Top 10",
      "IAM / RBAC",
      "SOC 2 / GDPR",
      "Incident Response",
      "Penetration Testing",
      "Secrets Management",
    ],
    whatYoullBuild:
      "You'll build the security posture that lets Peoplix's customers trust the platform with their most sensitive employee data. You'll own the vulnerability management program, the compliance framework, and the incident-response process.",
    niceToHave: [
      "OSCP, CEH, or equivalent security certifications",
      "Experience with bug-bounty programs",
      "Knowledge of cloud-native security (AWS GuardDuty, GCP Security Command Center)",
      "Background in securing multi-tenant SaaS applications handling PII",
    ],
    meta: {
      experience: "[FILL]",
      workType: "[FILL]",
      location: "[FILL]",
    },
  },
];
