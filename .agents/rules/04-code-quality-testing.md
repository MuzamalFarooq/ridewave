# Rule 04: Quality Assurance, Verification & Build Safety

## Code Quality Standards
1. **Mandatory Build & Lint Verification**:
   - Before declaring any task complete, verify that the project builds or passes linting without syntax errors.
   - Run relevant validation commands:
     - `npm run lint` for ESLint checks.
     - `npx prisma validate` for Prisma schema integrity.
     - `npm run build` when validating full production build readiness.

2. **Honest Test Reporting**:
   - Never claim a test, build, or script passed unless it actually executed with an exit code of 0.
   - If a test or command fails, diagnose the root cause with precise file references and line numbers before applying a patch.

3. **Defensive Error Handling**:
   - API route handlers in `app/api/` must wrap database and third-party API calls in `try...catch` blocks.
   - Return clean, structured JSON responses: `{ success: false, error: "Reason" }` with appropriate HTTP status codes (400, 401, 403, 404, 500).
   - Log errors gracefully with context (`console.error('[Module] context', error)`).
