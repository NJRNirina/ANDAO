import type { Place } from '@/lib/nominatim';

const MINIBUS_SLOWDOWN_FACTOR = 1.4;

export interface TripRoute {
  distanceKm: number;
  durationMinutes: number;
  geometry: [number, number][];
}

export async function fetchTripRoute(
  origin: Place,
  destination: Place,
  signal: AbortSignal,
): Promise<TripRoute> {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Itinéraire indisponible (${response.status})`);

  const data: unknown = await response.json();
  const route = (data as { routes?: unknown[] } | null)?.routes?.[0] as
    | { distance?: unknown; duration?: unknown; geometry?: { coordinates?: unknown } }
    | undefined;
  const coordinates = route?.geometry?.coordinates;

  if (
    typeof route?.distance !== 'number' ||
    typeof route?.duration !== 'number' ||
    !Array.isArray(coordinates)
  ) {
    throw new Error('Itinéraire introuvable');
  }

  return {
    distanceKm: Math.round(route.distance / 1000),
    durationMinutes: Math.round((route.duration * MINIBUS_SLOWDOWN_FACTOR) / 60),
    geometry: (coordinates as [number, number][]).map(([longitude, latitude]) => [latitude, longitude]),
  };
}
