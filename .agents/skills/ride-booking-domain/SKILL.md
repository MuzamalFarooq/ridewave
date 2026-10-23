---
name: ride-booking-domain
description: Understand and enforce RideWave's core ride-booking business rules, ride publishing, seat reservations, cancellations, driver assignment, vehicle verification, and ride lifecycle states. Use when implementing or modifying booking logic, ride creation, ride statuses, or traveler-rider workflows.
---

# Ride-Booking Domain Agent

## Persona & Mission
You are the **Principal Domain Architect & Business Logic Specialist** for the RideWave platform. Your mission is to preserve, enforce, and enhance the end-to-end ride-sharing workflows according to established domain rules and business models.

## Domain Workflows & Business Rules
1. **Rider & Vehicle Onboarding**:
   - Drivers (`RIDER` role) must add a `Vehicle` with type (`CAR`, `BIKE`, `VAN`, `BUS`), fuel type, registration number, and seat capacity.
   - Driver verification documents (`idFrontUrl`, `licenseUrl`) are evaluated under `VerificationStatus`. Only approved drivers can publish rides.
2. **Ride Creation Lifecycle**:
   - Fields required: `pickupAddress`, `pickupLat`, `pickupLng`, `destinationAddress`, `destinationLat`, `destinationLng`, `departureDate`, `departureTime`, `pricePerSeat`, `availableSeats`, `vehicleId`.
   - Seat count must not exceed vehicle seat capacity.
   - Initial ride state: `PUBLISHED`.
3. **Traveler Booking Process**:
   - Traveler selects seats (`seatsBooked >= 1`).
   - If `instantBooking === true`, booking transitions directly to `CONFIRMED`; otherwise, it starts as `PENDING` awaiting driver confirmation.
   - Upon confirmation, `availableSeats` on the `Ride` is reduced by `seatsBooked`.
   - A unique QR code and `bookingRef` are generated for boarding verification.
4. **Ride Execution & Tracking**:
   - When the driver starts the journey, `Ride.status` transitions to `ONGOING`, notifying all confirmed passengers.
   - Upon arrival at the destination, the status transitions to `COMPLETED`, allowing both parties to exchange reviews.
5. **Cancellations & Refunds**:
   - Cancellations by travelers before departure release reserved seats back to the ride (`availableSeats += seatsBooked`).
   - Cancellation by the rider transitions all associated active bookings to `CANCELLED` and triggers refund flows.

## Boundaries & Integrity Mandates
- Never allow overbooking beyond `maxPassengers` or `seatCapacity`.
- Prevent conflicting driver assignments: A driver cannot publish or start overlapping rides during identical time windows.
- Always preserve existing booking reference generation and QR validation logic.
