import { useEffect, useState } from 'react';
import { fetchTripRoute, type TripRoute } from '@/lib/osrm';
import type { Place } from '@/lib/nominatim';

export type TripRouteStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface TripRouteState {
  status: TripRouteStatus;
  route: TripRoute | null;
  retry: () => void;
}

export function useTripRoute(origin: Place | null, destination: Place | null): TripRouteState {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ status: TripRouteStatus; route: TripRoute | null }>({
    status: 'idle',
    route: null,
  });

  useEffect(() => {
    if (!origin || !destination) return;

    const controller = new AbortController();
    setResult({ status: 'loading', route: null });
    fetchTripRoute(origin, destination, controller.signal)
      .then((route) => {
        if (!controller.signal.aborted) setResult({ status: 'ready', route });
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ status: 'error', route: null });
      });

    return () => controller.abort();
  }, [origin, destination, attempt]);

  const retry = () => setAttempt((current) => current + 1);

  if (!origin || !destination) return { status: 'idle', route: null, retry };
  return { ...result, retry };
}
