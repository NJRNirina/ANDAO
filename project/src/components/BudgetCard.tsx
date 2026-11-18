import { useEffect, useRef } from 'react';
import BudgetInput from '@/components/BudgetInput';
import type { TripRoute } from '@/lib/osrm';
import { suggestedFare } from '@/lib/pricing';

interface BudgetCardProps {
  budget: number | null;
  onBudgetChange: (value: number | null) => void;
  route: TripRoute | null;
}

export default function BudgetCard({ budget, onBudgetChange, route }: BudgetCardProps) {
  const fare = route ? suggestedFare(route.distanceKm) : null;
  const lastFilledFare = useRef<number | null>(null);

  // Met l'estimation dans le champ du budget (une seule fois par trajet)
  useEffect(() => {
    if (fare !== null && budget === null && lastFilledFare.current !== fare) {
      lastFilledFare.current = fare;
      onBudgetChange(fare);
    }
  }, [fare, budget, onBudgetChange]);

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-center text-xs font-medium text-ink/60">Votre budget par passager</p>
      <div className="mt-3">
        <BudgetInput value={budget} onChange={onBudgetChange} />
      </div>
    </section>
  );
}