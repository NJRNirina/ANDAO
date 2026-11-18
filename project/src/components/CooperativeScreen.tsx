import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import CooperativeHeader from '@/components/CooperativeHeader';
import CooperativeList from '@/components/CooperativeList';
import CooperativeSheet from '@/components/CooperativeSheet';
import type { TripRouteState } from '@/hooks/useTripRoute';
import { COOPERATIVES, type Cooperative } from '@/data/cooperatives';
import { normalizeText } from '@/lib/format';
import type { Place } from '@/lib/nominatim';

interface CooperativeScreenProps {
  origin: Place;
  destination: Place;
  routeState: TripRouteState;
  budget: number | null;
  onBudgetChange: (value: number | null) => void;
  onBack: () => void;
}

export default function CooperativeScreen({
  origin,
  destination,
  routeState,
  budget,
  onBudgetChange,
  onBack,
}: CooperativeScreenProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Cooperative | null>(null);
  const [isRequestSent, setIsRequestSent] = useState(false);

  const normalizedQuery = normalizeText(query);
  const visibleCooperatives = COOPERATIVES.filter((cooperative) =>
    normalizeText(cooperative.name).includes(normalizedQuery),
  );

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <CooperativeHeader
        origin={origin}
        destination={destination}
        routeState={routeState}
        budget={budget}
        onBudgetChange={onBudgetChange}
        onBack={onBack}
      />

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-6">
        {isRequestSent ? (
          <ConfirmationCard onReset={() => setIsRequestSent(false)} />
        ) : (
          <CooperativeList
            cooperatives={visibleCooperatives}
            query={query}
            onQueryChange={setQuery}
            onSelectCooperative={setSelected}
            onSelectAll={() => setIsRequestSent(true)}
          />
        )}
      </div>

      {selected && (
        <CooperativeSheet cooperative={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

interface ConfirmationCardProps {
  onReset: () => void;
}

function ConfirmationCard({ onReset }: ConfirmationCardProps) {
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div role="status" className="flex gap-3 rounded-3xl border border-turquoise/30 bg-white p-5 shadow-sm">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-turquoise" strokeWidth={2.25} />
        <div className="space-y-2">
          <h2 className="text-base font-bold text-navy">Demande envoyée</h2>
          <p className="text-sm leading-normal text-ink">
            Votre demande a été envoyée à toutes les coopératives. La première réponse vous sera
            transmise.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="rounded-2xl bg-white py-4 text-base font-semibold text-navy shadow-sm transition-all duration-200 hover:bg-sky/10 active:scale-[0.98]"
      >
        Voir les coopératives
      </button>
    </div>
  );
}
