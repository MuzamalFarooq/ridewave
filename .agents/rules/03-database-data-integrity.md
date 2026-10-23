# Rule 03: Database & Data Integrity Protocols

## MongoDB & Prisma Governance
1. **Datasource Specifications**:
   - Provider: `mongodb`.
   - Models use `@id @default(auto()) @map("_id") @db.ObjectId` for identifiers.
   - Foreign references are stored as `String @db.ObjectId`.

2. **Concurrency & Race Condition Prevention**:
   - Booking operations must verify seat availability atomically or within transactions to prevent overbooking.
   - When a booking is confirmed or created, ensure `availableSeats >= seatsBooked` on the corresponding `Ride` record before decrementing.
   - Prevent simultaneous driver conflicting assignments: A driver cannot publish or start overlapping rides during identical time windows.

3. **Safe Migration & Schema Evolution**:
   - Never run destructive commands like `prisma db push --force-reset` on environments with existing data.
   - Always run `npx prisma validate` and `npx prisma generate` after modifying `prisma/schema.prisma`.
   - Ensure backward compatibility when adding new fields; provide default values (`@default(...)`) or mark as optional (`?`).

4. **Connection Pooling & Singleton Reuse**:
   - Always import Prisma via `import { prisma, connectPrisma } from '@/lib/prisma'` or relative `lib/prisma.js`.
   - Never instantiate a new `new PrismaClient()` in route handlers or server actions.
