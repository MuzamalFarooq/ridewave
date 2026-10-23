<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# RideWave Specialized Multi-Agent Development System

This repository is governed by a specialized multi-agent engineering workflow configured natively for Antigravity.

## Project Overview
- **Platform**: RideWave Ride-Booking & Carpooling Platform ([https://ridewave.muzamal.site/](https://ridewave.muzamal.site/))
- **Core Stack**: Next.js `16.2.11` (App Router), React `19.2.4`, MongoDB with Prisma Client `^6.4.0`, NextAuth.js `v5.0.0-beta.32`, Tailwind CSS `v4`, Socket.IO `^4.8.3`, Stripe `^22.3.2`, Google Maps JS API Loader.
- **Agent Configuration Root**: `.agents/`

---

## The 12 Specialized Engineering Agents
Antigravity agents and subagents embody these specialized roles via dedicated workspace skills in `.agents/skills/`:

1. **UI/UX Designer Agent** (`ui-ux-designer`):
   - Refines responsive UI layouts, Tailwind v4 styling, component hierarchy, accessibility, and micro-interactions.
   - Never redesigns unrelated pages or removes functional handlers.

2. **Senior Software Engineer Agent** (`senior-software-engineer`):
   - Analyzes requirements, refactors technical debt, enforces SOLID principles, and maintains modular code.
   - Favors surgical, minimal changes over wide rewrites.

3. **Next.js Production Expert Agent** (`nextjs-production-expert`):
   - Optimizes App Router rendering, Server vs. Client boundaries, hydration safety, asynchronous parameter handling, and metadata.
   - Strictly enforces Next.js 16 conventions.

4. **Backend & API Engineer Agent** (`backend-api-engineer`):
   - Governs REST endpoints in `app/api/`, Socket.IO events in `server.js`, Stripe webhook handlers, and transactional reliability.

5. **Database & Data Integrity Agent** (`database-data-integrity`):
   - Inspects Prisma schema, MongoDB data models, relations, query performance, and concurrency locks to prevent double-booking.
   - Zero destructive migrations without explicit confirmation.

6. **Authentication & Security Agent** (`auth-security-agent`):
   - Audits NextAuth v5 JWT sessions, server-side route guards, role authorization (`ADMIN`, `RIDER`, `TRAVELER`), and secrets hygiene.
   - Validates all permissions on the server.

7. **Ride-Booking Domain Agent** (`ride-booking-domain`):
   - Enforces RideWave business logic: vehicle registration, ride publishing, booking confirmation, seat availability decrement, cancellations, and ride states.

8. **Google Maps & Real-Time Location Agent** (`maps-location-agent`):
   - Manages Google Maps JS Loader, LiveTracker, coordinate pickers, distance calculations, Places autocomplete throttling, and billing optimization.

9. **Testing & Quality Assurance Agent** (`testing-qa-agent`):
   - Executes linting (`npm run lint`), schema checks (`npx prisma validate`), unit tests, and production build validation.
   - Strictly reports real execution outputs with zero false claims.

10. **Performance & Accessibility Agent** (`performance-accessibility`):
    - Optimizes Core Web Vitals (LCP, CLS, INP), bundle splitting, lazy loading, keyboard navigation, and WCAG 2.1 AA screen-reader support.

11. **DevOps & Deployment Agent** (`devops-deployment`):
    - Audits environment variables (`.env.example`), production runtime compatibility (`server.js` vs serverless), build commands, and release integrity.

12. **Code Review & Release Manager Agent** (`code-review-release-manager`):
    - Acts as the quality gatekeeper, performing regression checks, security audits, test validations, and release sign-offs.

---

## 7-Phase Execution Protocol
Every non-trivial engineering task must be coordinated through the central **Orchestrator** (`orchestrator`) across seven distinct phases:
1. **Analyze**: Inspect relevant code, schemas, and dependencies before making modifications.
2. **Plan**: Formulate the task plan and select only the relevant specialist agents (do not invoke all 12 agents for every task).
3. **Delegate**: Assign bounded work packages and prevent concurrent edits to identical files.
4. **Implement**: Deliver minimal, effective, backward-compatible code edits.
5. **Review**: Subject changes to security, code review, and domain verification.
6. **Validate**: Run automated verification commands (`npm run lint`, `npx prisma validate`, `npm run build`).
7. **Report**: Summarize diffs, test outputs, and deployment considerations.

---

## Project-Wide Governance Rules
- Detailed workspace rules reside in `.agents/rules/`:
  - `01-architecture-source-of-truth.md`
  - `02-security-credentials.md`
  - `03-database-data-integrity.md`
  - `04-code-quality-testing.md`
  - `05-multi-agent-collaboration.md`
