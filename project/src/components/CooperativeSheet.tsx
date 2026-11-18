import { Star } from 'lucide-react';
import BottomSheet from '@/components/BottomSheet';
import SeatMap from '@/components/SeatMap';
import type { Cooperative } from '@/data/cooperatives';
import { formatAr } from '@/lib/format';

interface CooperativeSheetProps {
  cooperative: Cooperative;
  onClose: () => void;
}

export default function CooperativeSheet({ cooperative, onClose }: CooperativeSheetProps) {
  return (
    <BottomSheet titleId="cooperative-sheet-title" onClose={onClose}>
      <div className="mt-5 flex items-start gap-4 pr-12">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky/15 text-xl font-bold text-navy">
          {cooperative.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="cooperative-sheet-title" className="text-xl font-bold leading-[1.2] text-navy">
            {cooperative.name}
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <Stars rating={cooperative.rating} />
            <span className="text-sm font-semibold text-ink">{cooperative.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <dl className="mt-6 divide-y divide-mist rounded-2xl bg-mist/60">
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-sm font-medium text-ink/70">Type de véhicule</dt>
          <dd className="text-right text-sm font-semibold text-ink">{cooperative.vehicle}</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-sm font-medium text-ink/70">Arrivée du véhicule</dt>
          <dd className="text-sm font-semibold text-ink">{cooperative.arrivalMinutes} min</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-turquoise/10 p-4">
        <span className="text-sm font-medium text-ink">Prix proposé par passager</span>
        <span className="text-2xl font-bold tabular-nums text-turquoise">
          {formatAr(cooperative.price)}
        </span>
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-base font-semibold text-navy">Plan des places</h3>
          <span className="text-xs font-medium text-ink/60">Lecture seule</span>
        </div>
        <SeatMap
          seats={cooperative.seats}
          freeSeats={cooperative.freeSeats}
          seed={cooperative.id}
        />
      </section>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-2xl bg-mist py-4 text-base font-semibold text-ink transition-all duration-150 hover:bg-mist/70 active:scale-[0.98]"
      >
        Retour
      </button>
    </BottomSheet>
  );
}

function Stars({ rating }: { rating: number }) {
  const filledCount = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < filledCount ? 'fill-orange text-orange' : 'fill-none text-muted'}`}
          strokeWidth={2}
        />
      ))}
    </div>
  );
}
