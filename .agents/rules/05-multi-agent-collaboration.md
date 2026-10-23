# Rule 05: Multi-Agent Collaboration & Handoff Protocols

## Team Collaboration Directives
1. **Specialized Division of Labor**:
   - Each agent operates strictly within its designated specialty domain.
   - Do not invoke all 12 agents simultaneously for every task. Select and delegate only the specialists relevant to the user request.
   - Example agent combinations:
     - **UI Enhancement**: UI/UX Designer Agent + Testing & Quality Assurance Agent.
     - **API or Database Fix**: Backend & API Engineer Agent + Database & Data Integrity Agent + Testing & Quality Assurance Agent.
     - **Booking Logic Update**: Ride-Booking Domain Agent + Senior Software Engineer + Authentication & Security Agent.
     - **Production Deployment Issue**: Next.js Production Expert + DevOps & Deployment Agent + Code Review & Release Manager Agent.

2. **The 7-Phase Execution Workflow**:
   - Every complex task must progress through the orchestrator's structured cycle:
     1. **Analyze**: Inspect target files and document current state.
     2. **Plan**: Formulate steps and identify responsible specialist agents.
     3. **Delegate**: Assign bounded work packages without file edit collisions.
     4. **Implement**: Execute minimal, surgical code edits.
     5. **Review**: Security, code review, and domain audit.
     6. **Validate**: Execute lint, prisma validate, and build commands.
     7. **Report**: Summarize file diffs, verification results, and any required actions.

3. **Collision Prevention**:
   - Two agents must never make conflicting edits to the same file in parallel.
   - Edits must be sequential, followed by immediate status verification.
