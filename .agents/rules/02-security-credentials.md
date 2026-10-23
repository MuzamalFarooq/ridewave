# Rule 02: Authentication, Authorization & Credential Security

## Security Mandates
1. **Zero Credential Leaks**:
   - Never hardcode API keys, database connection strings, JWT secrets, Stripe secrets, or Cloudinary credentials into client files, server files, or documentation.
   - All secrets must reside exclusively in environment variables loaded from `.env` / `.env.local` and mirrored in `.env.example`.
   - Never print sensitive credentials or full user records (including hashed passwords or tokens) into console logs or responses.

2. **Server-Side Authorization Enforcement**:
   - Never rely exclusively on client-side route guards or hidden buttons. All mutations and sensitive queries in `app/api/` and server actions must validate the session token via `auth()` from `lib/auth.js`.
   - Validate user roles strictly:
     - `ADMIN`: Has administrative access.
     - `RIDER`: Driver role managing rides, vehicles, and active trips.
     - `TRAVELER`: Passenger role booking rides, leaving reviews, making payments.
   - Prevent unauthorized access: Ensure users can only modify their own profile, bookings, rides, vehicles, and payments.

3. **Input Validation and Sanitization**:
   - Validate all incoming request payloads using `zod` schemas or strict manual validation before processing or querying MongoDB.
   - Escape or sanitize user-generated content (e.g. chat messages, notes, descriptions) to prevent XSS.

4. **Location & Privacy Protection**:
   - Protect rider and traveler GPS data. Do not broadcast coordinates to unauthorized sockets or public endpoints.
   - Real-time GPS stream in `server.js` (`location:update`) must strictly restrict broadcasts to passengers and authorized participants of that specific ride.
