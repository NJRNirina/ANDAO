import RouteCard from '@/components/RouteCard';
import BudgetSheet, { type CooperativeChoice } from '@/components/BudgetSheet';
import { useTripRoute } from '@/hooks/useTripRoute';
import type { PlaceSelection } from '@/lib/nominatim';

export type Stage = 'route' | 'budget';

interface ProposeTripScreenProps {
  stage: Stage;
  onStageChange: (stage: Stage) => void;
  origin: PlaceSelection;
  onOriginChange: (value: PlaceSelection) => void;
  destination: PlaceSelection;
  onDestinationChange: (value: PlaceSelection) => void;
  budget: number | null;
  onBudgetChange: (value: number | null) => void;
  choice: CooperativeChoice;
  onChoiceChange: (value: CooperativeChoice) => void;
  onSeeOffers: () => void;
}

export default function ProposeTripScreen({
  stage,
  onStageChange,
  origin,
  onOriginChange,
  destination,
  onDestinationChange,
  budget,
  onBudgetChange,
  choice,
  onChoiceChange,
  onSeeOffers,
}: ProposeTripScreenProps) {
  const originPlace = origin.place;
  const destinationPlace = destination.place;
  const routeState = useTripRoute(originPlace, destinationPlace);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="flex flex-col gap-4 px-5 pb-6 pt-8">
        <header>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-navy">
            <span className="h-2 w-2 rounded-full bg-orange" aria-hidden="true" />
            Coopératives &amp; P2P
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-[1.2] text-navy">Proposer un trajet</h1>
        </header>

        <RouteCard
          origin={origin}
          destination={destination}
          onOriginChange={onOriginChange}
          onDestinationChange={onDestinationChange}
          onSwap={() => {
            onOriginChange(destination);
            onDestinationChange(origin);
          }}
        />

        <button
          type="button"
          onClick={() => onStageChange('budget')}
          disabled={!originPlace || !destinationPlace}
          className="mt-2 w-full rounded-2xl bg-navy py-4 text-base font-semibold text-white shadow-lg shadow-navy/25 transition-all duration-200 hover:bg-navy/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-mist disabled:text-ink/40 disabled:shadow-none"
        >
          Continuer
        </button>
      </div>

      {stage === 'budget' && originPlace && destinationPlace && (
        <BudgetSheet
          origin={originPlace}
          destination={destinationPlace}
          routeState={routeState}
          budget={budget}
          onBudgetChange={onBudgetChange}
          choice={choice}
          onChoiceChange={onChoiceChange}
          onClose={() => onStageChange('route')}
          onContinue={onSeeOffers}
        />
      )}
    </div>
  );
}