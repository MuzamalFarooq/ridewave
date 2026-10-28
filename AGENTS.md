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
  - `06-never-access-environment-files.md`

---

# 🔒 SECURITY RULE: NEVER ACCESS ENVIRONMENT FILES

## 1. Strict `.env` File Protection

* **NEVER open, read, inspect, analyze, print, display, or expose the contents of any `.env` file.**
* This restriction applies to all environment files, including:
  * `.env`
  * `.env.local`
  * `.env.development`
  * `.env.production`
  * `.env.test`
  * `.env.development.local`
  * `.env.production.local`
  * Any other file containing environment variables, API keys, passwords, tokens, database credentials, OAuth secrets, or private configuration.
* Never use terminal commands, scripts, IDE tools, file-reading utilities, or other methods to retrieve or display the contents of these files.
* Never copy environment variable values into source code, logs, reports, terminal output, documentation, chat responses, or generated files.
* Never expose secrets in error messages, debugging output, screenshots, or code snippets.

## 2. Do Not Modify Environment Files

* Do not create, edit, overwrite, rename, delete, or reformat any existing environment file.
* Do not change environment variable names or values.
* Do not replace real credentials with placeholder values in existing environment files.
* If a task requires an environment variable that is missing or incorrectly configured, explain the required change without opening or modifying the file.
* Ask for explicit authorization before making any proposed changes to environment configuration. Authorization to modify configuration does not automatically authorize reading or displaying secret values.

## 3. Safe Handling of Environment Variables

* You may inspect application source code to understand how environment variables are referenced, such as `process.env.DATABASE_URL`, without accessing their actual values.
* You may identify which environment variable names the application requires, provided the names can be determined without reading protected files.
* Use placeholders in examples, such as `YOUR_API_KEY` or `YOUR_DATABASE_URL`.
* Never attempt to retrieve, validate, decode, or test the actual values of protected secrets.
* Do not execute commands that might print environment variables or expose inherited secrets.

## 4. Git and Repository Safety

* Never add environment files containing secrets to Git commits.
* Do not remove or weaken existing `.gitignore` protections for environment files.
* Do not upload environment files to GitHub, Vercel, cloud storage, external APIs, or third-party services.
* Do not include secrets in build artifacts, generated documentation, test fixtures, or diagnostic reports.
* Treat environment files as sensitive even if they are not currently tracked by Git.

## 5. Continue Working Without Accessing `.env`

* Complete coding tasks using application source code, configuration schemas, existing documentation, and other non-secret project files.
* If a task cannot be completed without environment configuration, explain the limitation and provide step-by-step instructions for the user to perform the required configuration manually.
* Never assume an environment variable is missing, invalid, or incorrect without sufficient evidence from permitted sources.
* Do not stop unrelated development work simply because environment files exist in the project.

## 6. Mandatory Security Check Before Every Task

Before using any file-reading, terminal, search, or automated tool:

1. Identify whether the operation could access or expose a protected environment file.
2. Exclude all protected environment files from searches, file inspection, and automated processing.
3. Ensure commands cannot print secret values or indirectly expose protected contents.
4. If a command might access or expose secrets, do not execute it; choose a safer alternative.

## FINAL REQUIREMENT

These rules are mandatory and take priority over ordinary debugging, testing, refactoring, code-generation, and deployment tasks.

**Never access `.env` files. Never reveal their contents. Never modify them without explicit authorization. Protect secrets throughout the entire development workflow.**
