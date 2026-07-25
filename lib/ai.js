/**
 * AI-powered fare estimation with dynamic pricing
 */

// Base rates per km by vehicle type (USD)
const BASE_RATES = {
  BIKE: 0.15,
  CAR: 0.25,
  VAN: 0.35,
  BUS: 0.20,
};

// Surge multipliers by time of day
const getSurgeMultiplier = () => {
  const hour = new Date().getHours();
  if (hour >= 7 && hour <= 9) return 1.3;   // Morning rush
  if (hour >= 17 && hour <= 19) return 1.4; // Evening rush
  if (hour >= 22 || hour <= 5) return 1.2;  // Late night
  return 1.0;
};

// Fuel type adjustments
const FUEL_ADJUSTMENTS = {
  ELECTRIC: 0.85,
  HYBRID: 0.90,
  CNG: 0.92,
  PETROL: 1.0,
  DIESEL: 1.05,
};

/**
 * Calculate AI fare estimate
 * @param {Object} params
 * @param {number} params.distanceKm - Distance in kilometers
 * @param {number} params.durationMinutes - Estimated duration in minutes
 * @param {string} params.vehicleType - CAR | BIKE | VAN | BUS
 * @param {string} params.fuelType - PETROL | DIESEL | ELECTRIC | HYBRID | CNG
 * @param {number} params.seats - Number of available seats (lower supply = higher price)
 * @param {boolean} params.isInstant - Instant booking premium
 * @returns {Object} - Pricing breakdown
 */
export const calculateFareEstimate = ({
  distanceKm,
  durationMinutes = 0,
  vehicleType = 'CAR',
  fuelType = 'PETROL',
  seats = 4,
  isInstant = false,
}) => {
  const baseRate = BASE_RATES[vehicleType] || BASE_RATES.CAR;
  const surgeMultiplier = getSurgeMultiplier();
  const fuelAdjustment = FUEL_ADJUSTMENTS[fuelType] || 1.0;

  // Base fare calculation
  let baseFare = distanceKm * baseRate;

  // Time-based component (PKR per minute)
  const timeFare = durationMinutes * 0.02;

  // Minimum fare
  const minFare = vehicleType === 'BIKE' ? 2 : 5;

  // Calculate raw fare
  let fare = Math.max(baseFare + timeFare, minFare);

  // Apply surge
  fare *= surgeMultiplier;

  // Apply fuel adjustment
  fare *= fuelAdjustment;

  // Low seat availability premium (scarcity pricing)
  if (seats === 1) fare *= 1.15;

  // Instant booking premium
  if (isInstant) fare *= 1.08;

  // Platform fee (8%)
  const platformFee = fare * 0.08;
  const totalFare = fare + platformFee;

  return {
    estimatedFare: Math.round(fare * 100) / 100,
    platformFee: Math.round(platformFee * 100) / 100,
    totalFare: Math.round(totalFare * 100) / 100,
    suggestedMin: Math.round(fare * 0.85 * 100) / 100,
    suggestedMax: Math.round(fare * 1.15 * 100) / 100,
    surgeMultiplier,
    isSurge: surgeMultiplier > 1,
    breakdown: {
      distanceFare: Math.round(baseFare * 100) / 100,
      timeFare: Math.round(timeFare * 100) / 100,
      platformFee: Math.round(platformFee * 100) / 100,
    },
  };
};

/**
 * Get AI ride recommendations based on user history
 * Rule-based recommendation engine
 */
export const getAIRecommendations = (rides, userPrefs = {}) => {
  if (!rides || rides.length === 0) return [];

  const { preferredVehicleType, maxBudget, preferredDeparture } = userPrefs;

  return rides
    .filter((ride) => {
      if (maxBudget && ride.pricePerSeat > maxBudget) return false;
      if (preferredVehicleType && ride.vehicle?.vehicleType !== preferredVehicleType) return false;
      return true;
    })
    .sort((a, b) => {
      // Score based on rating, price, and availability
      const scoreA =
        (a.rider?.profile?.averageRating || 3) * 0.4 +
        (1 / (a.pricePerSeat || 1)) * 0.3 +
        (a.availableSeats / (a.maxPassengers || 4)) * 0.3;
      const scoreB =
        (b.rider?.profile?.averageRating || 3) * 0.4 +
        (1 / (b.pricePerSeat || 1)) * 0.3 +
        (b.availableSeats / (b.maxPassengers || 4)) * 0.3;
      return scoreB - scoreA;
    })
    .slice(0, 5);
};

/**
 * Calculate rider earnings estimate
 */
export const calculateRiderEarnings = (rides) => {
  if (!rides || rides.length === 0) {
    return { totalEarnings: 0, platformFees: 0, netEarnings: 0, completedRides: 0 };
  }

  const completed = rides.filter((r) => r.status === 'COMPLETED');
  const totalEarnings = completed.reduce((sum, r) => {
    const bookingRevenue = r.bookings?.reduce(
      (bs, b) => bs + (b.status === 'COMPLETED' ? b.totalAmount : 0),
      0
    ) || 0;
    return sum + bookingRevenue;
  }, 0);

  const platformFees = totalEarnings * 0.08;
  const netEarnings = totalEarnings - platformFees;

  return {
    totalEarnings: Math.round(totalEarnings * 100) / 100,
    platformFees: Math.round(platformFees * 100) / 100,
    netEarnings: Math.round(netEarnings * 100) / 100,
    completedRides: completed.length,
  };
};
