import { AlertCircle, Clock, Loader2, Route } from 'lucide-react';
import TripMap from '@/components/TripMap';
import type { TripRouteState } from '@/hooks/useTripRoute';
import type { Place } from '@/lib/nominatim';
import { formatDuration } from '@/lib/format';

interface TripSummaryCardProps {
  origin: Place;
  destination: Place;
  routeState: TripRouteState;
}

export default function TripSummaryCard({ origin, destination, routeState }: TripSummaryCardProps) {
  const { route, status, retry } = routeState;

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="h-32 bg-mist">
        <TripMap origin={origin} destination={destination} route={route} />
      </div>

      <div className="space-y-3 p-4">
        <ul className="space-y-2">
          <li className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-navy" aria-hidden="true" />
            <span className="truncate text-sm font-semibold text-ink">{origin.label}</span>
          </li>
          <li className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-orange" aria-hidden="true" />
            <span className="truncate text-sm font-semibold text-ink">{destination.label}</span>
          </li>
        </ul>

        {status === 'ready' && route && (
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-sky/10 p-3">
              <Route className="h-4 w-4 shrink-0 text-sky" strokeWidth={2.5} />
              <div>
                <p className="text-xs font-medium text-ink/60">Distance</p>
                <p className="text-sm font-bold text-navy">{route.distanceKm} km</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-sky/10 p-3">
              <Clock className="h-4 w-4 shrink-0 text-sky" strokeWidth={2.5} />
              <div>
                <p className="text-xs font-medium text-ink/60">Durée estimée</p>
                <p className="text-sm font-bold text-navy">{formatDuration(route.durationMinutes)}</p>
              </div>
            </div>
          </div>
        )}

        {status === 'loading' && (
          <p className="flex items-center gap-2 text-sm font-medium text-ink/70">
            <Loader2 className="h-4 w-4 animate-spin text-sky" /> Calcul du trajet en cours...
          </p>
        )}

        {status === 'error' && (
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-mist/70 p-3">
            <p className="flex items-center gap-2 text-sm font-medium text-ink">
              <AlertCircle className="h-4 w-4 shrink-0 text-orange" strokeWidth={2.5} />
              Impossible de calculer le trajet. Réessayez.
            </p>
            <button
              type="button"
              onClick={retry}
              className="shrink-0 rounded-full bg-navy px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy/90"
            >
              Réessayer
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
