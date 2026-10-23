# Rule 01: Codebase As Source of Truth & Architecture Discipline

## Core Principles
1. **Existing Code is the Absolute Source of Truth**:
   - Never assume APIs, utility signatures, schema fields, or state models from external templates or generic tutorials.
   - Always read and inspect relevant project files in `app/`, `components/`, `lib/`, `prisma/`, and `server.js` prior to proposing or executing any code modifications.

2. **No Unjustified Rewrites or Regressions**:
   - Working implementations must not be replaced without explicit authorization and documented justification.
   - Never alter unrelated pages, UI components, styling tokens, or established business logic during a targeted change.
   - Favor localized, surgical, and minimal changes over wide architectural refactors.

3. **Strict Dependency & Version Alignment**:
   - **Next.js**: Current installed version is `16.2.11`. Heed breaking changes documented in `node_modules/next/dist/docs/`. Do not assume Next.js 14/15 legacy patterns.
   - **React**: Current version is `19.2.4`. Respect React 19 hooks and compiler rules.
   - **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss` and `tailwindcss` ^4) with custom utility classes in `app/globals.css`. Do not add Tailwind v3 config files (`tailwind.config.js`).
   - **Database**: Prisma Client `^6.4.0` with MongoDB datasource (`prisma/schema.prisma`).
   - **Authentication**: NextAuth.js `v5.0.0-beta.32` with JWT session strategy and role normalization (`lib/auth.js`, `lib/auth-redirects.js`).
   - **Real-Time Communication**: Custom HTTP + Socket.IO server (`server.js`) and WebRTC (`simple-peer`).

4. **Zero Unnecessary Dependencies**:
   - Do not install new packages unless existing dependencies (`lucide-react`, `framer-motion`, `date-fns`, `zod`, `zustand`, etc.) cannot fulfill the task.
