const FARE_PER_KM = 90;
const FARE_ROUNDING = 1000;

export const suggestedFare = (distanceKm: number) =>
  Math.round((distanceKm * FARE_PER_KM) / FARE_ROUNDING) * FARE_ROUNDING;
