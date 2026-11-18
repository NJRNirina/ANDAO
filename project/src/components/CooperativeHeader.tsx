import { ArrowLeft } from 'lucide-react';
import BudgetCard from '@/components/BudgetCard';
import TripSummaryCard from '@/components/TripSummaryCard';
import type { TripRouteState } from '@/hooks/useTripRoute';
import type { Place } from '@/lib/nominatim';

interface CooperativeHeaderProps {
  origin: Place;
  destination: Place;
  routeState: TripRouteState;
  budget: number | null;
  onBudgetChange: (value: number | null) => void;
  onBack: () => void;
}

export default function CooperativeHeader({
  origin,
  destination,
  routeState,
  budget,
  onBudgetChange,
  onBack,
}: CooperativeHeaderProps) {
  return (
    <div className="flex shrink-0 flex-col gap-4 px-5 pb-4 pt-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Revenir aux informations du trajet"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-150 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5 text-navy" strokeWidth={2.25} />
        </button>
        <h1 className="text-xl font-bold leading-[1.2] text-navy">Choisir une coopérative</h1>
      </div>

      <TripSummaryCard origin={origin} destination={destination} routeState={routeState} />
      <BudgetCard budget={budget} onBudgetChange={onBudgetChange} route={routeState.route} />
    </div>
  );
}
