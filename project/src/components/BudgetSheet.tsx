import { useState } from 'react';
import BottomSheet from '@/components/BottomSheet';
import BudgetCard from '@/components/BudgetCard';
import TripSummaryCard from '@/components/TripSummaryCard';
import CooperativeList from '@/components/CooperativeList';
import { COOPERATIVES, type Cooperative } from '@/data/cooperatives';
import type { TripRouteState } from '@/hooks/useTripRoute';
import type { Place } from '@/lib/nominatim';

export type CooperativeChoice = Cooperative | 'all' | null;

interface BudgetSheetProps {
  origin: Place;
  destination: Place;
  routeState: TripRouteState;
  budget: number | null;
  onBudgetChange: (value: number | null) => void;
  choice: CooperativeChoice;
  onChoiceChange: (value: CooperativeChoice) => void;
  onClose: () => void;
  onContinue: () => void;
}

export default function BudgetSheet({
  origin,
  destination,
  routeState,
  budget,
  onBudgetChange,
  choice,
  onChoiceChange,
  onClose,
  onContinue,
}: BudgetSheetProps) {
  const [query, setQuery] = useState('');

  const filtered = COOPERATIVES.filter((cooperative) =>
    cooperative.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const choiceLabel =
    choice === 'all' ? 'Aucune préférence' : choice ? choice.name : null;

  return (
    <BottomSheet titleId="budget-sheet-title" onClose={onClose}>
      <h2 id="budget-sheet-title" className="mt-5 pr-12 text-xl font-bold leading-[1.2] text-navy">
        Infos du trajet
      </h2>

      <div className="mt-5 space-y-4">
        <TripSummaryCard origin={origin} destination={destination} routeState={routeState} />
        <BudgetCard budget={budget} onBudgetChange={onBudgetChange} route={routeState.route} />
      </div>

      <h3 className="mt-6 text-base font-bold text-navy">Choisir une coopérative</h3>
      <div className="mt-3 flex h-72 flex-col">
        <CooperativeList
          cooperatives={filtered}
          query={query}
          onQueryChange={setQuery}
          onSelectCooperative={(cooperative) => onChoiceChange(cooperative)}
          onSelectAll={() => onChoiceChange('all')}
        />
      </div>

      {choiceLabel && (
        <p className="mt-3 text-sm text-ink/70">
          Sélection : <span className="font-semibold text-navy">{choiceLabel}</span>
        </p>
      )}

      <button
        type="button"
        onClick={onContinue}
        disabled={budget === null || choice === null}
        className="mt-4 w-full rounded-2xl bg-navy py-4 text-base font-semibold text-white shadow-lg shadow-navy/25 transition-all duration-200 hover:bg-navy/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-mist disabled:text-ink/40 disabled:shadow-none"
      >
        Voir les offres
      </button>
    </BottomSheet>
  );
}