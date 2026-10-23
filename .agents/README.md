# RideWave Specialized Multi-Agent Development System

Welcome to the **RideWave Multi-Agent Architecture** configured for Antigravity. This system transforms Antigravity into an elite, specialized software development team tailored specifically for the RideWave ride-booking platform ([https://ridewave.muzamal.site/](https://ridewave.muzamal.site/)).

---

## 📁 System Architecture & Directory Layout

```text
ridewave/
├── AGENTS.md                                # Root agent governance & rules (loaded automatically)
├── .agents/                                 # Antigravity workspace customization root
│   ├── skills.json                          # Manifest declaring workspace skills
│   ├── hooks.json                           # Lifecycle safety hooks (destructive command blocker)
│   ├── rules/                               # Hierarchical workspace rules
│   │   ├── 01-architecture-source-of-truth.md
│   │   ├── 02-security-credentials.md
│   │   ├── 03-database-data-integrity.md
│   │   ├── 04-code-quality-testing.md
│   │   └── 05-multi-agent-collaboration.md
│   └── skills/                              # Specialized agent skills
│       ├── orchestrator/SKILL.md            # Central Orchestrator & Coordinator
│       ├── ui-ux-designer/SKILL.md          # 1. UI/UX Designer Agent
│       ├── senior-software-engineer/SKILL.md# 2. Senior Software Engineer Agent
│       ├── nextjs-production-expert/SKILL.md# 3. Next.js Production Expert Agent
│       ├── backend-api-engineer/SKILL.md    # 4. Backend & API Engineer Agent
│       ├── database-data-integrity/SKILL.md # 5. Database & Data Integrity Agent
│       ├── auth-security-agent/SKILL.md     # 6. Authentication & Security Agent
│       ├── ride-booking-domain/SKILL.md     # 7. Ride-Booking Domain Agent
│       ├── maps-location-agent/SKILL.md     # 8. Google Maps & Real-Time Location Agent
│       ├── testing-qa-agent/SKILL.md        # 9. Testing & Quality Assurance Agent
│       ├── performance-accessibility/SKILL.md# 10. Performance & Accessibility Agent
│       ├── devops-deployment/SKILL.md       # 11. DevOps & Deployment Agent
│       └── code-review-release-manager/SKILL.md# 12. Code Review & Release Manager Agent
```

---

## 👥 The 12 Specialized Engineering Agents

| Agent ID | Role | Core Responsibility | When to Involve |
| :--- | :--- | :--- | :--- |
| `orchestrator` | **Lead AI Systems Architect** | Coordinates the workflow, delegates to specialists, manages end-to-end delivery | Always active as coordinator for complex tasks |
| `ui-ux-designer` | **UI/UX Designer** | Premium visual styling, responsive design (Tailwind v4), micro-animations, layouts | UI redesigns, styling fixes, component polishing |
| `senior-software-engineer` | **Senior Software Engineer** | Clean architecture, SOLID principles, modular refactoring, DRY code | Core feature implementation, code refactoring |
| `nextjs-production-expert` | **Next.js Production Expert** | Next.js 16 conventions, App Router, Server/Client components, hydration safety | Hydration errors, routing issues, Next.js optimization |
| `backend-api-engineer` | **Backend & API Engineer** | REST API endpoints (`app/api/`), Socket.IO (`server.js`), Stripe webhooks | API development, webhook handling, server errors |
| `database-data-integrity` | **Database & Data Integrity** | MongoDB schema (`schema.prisma`), query performance, concurrency protection | Schema changes, database queries, overbooking prevention |
| `auth-security-agent` | **Authentication & Security** | NextAuth v5, role authorization (`ADMIN`/`RIDER`/`TRAVELER`), secrets protection | Auth flows, permission guards, security audits |
| `ride-booking-domain` | **Ride-Booking Domain** | Core booking state machines, seat calculations, vehicle checks, cancellations | Ride lifecycle rules, pricing, booking flows |
| `maps-location-agent` | **Google Maps & Geolocation** | Google Maps JS loader, LiveTracker, coordinate picker, geocoding, Places API | Map rendering, real-time tracking, distance/ETA |
| `testing-qa-agent` | **Testing & QA** | Linting (`npm run lint`), schema checks (`prisma validate`), automated tests | Bug reproduction, test verification, release sign-off |
| `performance-accessibility` | **Performance & Accessibility** | Core Web Vitals (LCP/CLS/INP), lazy loading, keyboard navigation, a11y | Slow page performance, bundle reduction, a11y audit |
| `devops-deployment` | **DevOps & Deployment** | Vercel settings, build validation, env variables, runtime compatibility | Production build errors, deployment configuration |
| `code-review-release-manager` | **Code Review & Release Manager**| Regression gating, architectural audit, final quality sign-off | Pre-merge reviews, release verification |

---

## 🔄 The 7-Phase Orchestration Workflow

When a task is submitted, the central Orchestrator leads the execution through seven structured phases:

1. **Analyze**: Inspect target source files, database schemas, and current behavior. Never jump into coding blindly.
2. **Plan**: Formulate a targeted plan and select only the specialized agents needed. Avoid invoking all 12 agents for single-domain tasks.
3. **Delegate**: Assign bounded subtasks to specialist skills. Ensure no concurrent edits collide on the same files.
4. **Implement**: Execute minimal, surgical, backward-compatible code edits.
5. **Review**: Subject proposed changes to the `code-review-release-manager` and `auth-security-agent`.
6. **Validate**: Run validation commands (`npm run lint`, `npx prisma validate`, `npm run build`). Verify zero errors.
7. **Report**: Deliver an executive report with changed files, test output, and production readiness status.

---

## 🛠️ Verification & Safety Commands

- **Prisma Schema Validation**: `npx prisma validate`
- **Linting & Code Quality**: `npm run lint`
- **Unit & Integration Tests**: `node --test tests/**/*.test.js`
- **Production Build Test**: `npm run build`
- **Start Local Server**: `npm run dev` (development) or `npm run start` (production custom server)
