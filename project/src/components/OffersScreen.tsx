import { useState } from 'react';
import { ArrowLeft, CalendarDays, MapPin, Route, Star, Users } from 'lucide-react';
import type { CooperativeChoice } from '@/components/BudgetSheet';
import OfferPopup, { type ReservationDetails } from '@/components/OfferPopup';
import { COOPERATIVES, type Cooperative } from '@/data/cooperatives';

export interface Reservation extends ReservationDetails {
  cooperative: Cooperative;
  routeName: string;
  station: string;
}

interface OffersScreenProps {
  budget: number | null;
  choice: CooperativeChoice;
  onBack: () => void;
  onReserve: (reservation: Reservation) => void;
  originText?: string;
  destinationText?: string;
}

// Gares routières d'Antananarivo (exemples de répartition)
const TANA_STATIONS = ['Ambodivona', 'Ampasampito', 'Lalana Pastora Rahajason'];

function shortPlace(text: string) {
  const first = text.split(',')[0].trim();
  if (first === 'Antananarivo') return 'Tana';
  if (first === 'Toamasina') return 'Tamatave';
  return first;
}

function getStation(cooperative: Cooperative, originText: string, index: number) {
  if (originText.trim().toLowerCase().startsWith('antananarivo')) {
    return cooperative.id === 'cotisse' ? 'Ambodivona' : TANA_STATIONS[index % TANA_STATIONS.length];
  }
  const city = originText.split(',')[0].trim();
  return city ? `Gare routière de ${city}` : 'Gare routière';
}

function getDepartureDate(arrivalMinutes: number) {
  return new Date(Date.now() + arrivalMinutes * 60000).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export default function OffersScreen({
  budget,
  choice,
  onBack,
  onReserve,
  originText = '',
  destinationText = '',
}: OffersScreenProps) {
  const [selected, setSelected] = useState<Cooperative | null>(null);

  if (budget === null) {
    return (
      <div className="flex flex-col items-center px-6 pt-24 text-center">
        <h1 className="text-2xl font-bold text-navy">Offres</h1>
        <p className="mt-2 max-w-[260px] text-base text-ink/70">
          Aucune demande en cours. Proposez d'abord votre trajet dans Recherche.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 rounded-2xl bg-navy px-6 py-3 text-base font-semibold text-white"
        >
          Proposer un trajet
        </button>
      </div>
    );
  }

  const chosenId = choice && choice !== 'all' ? choice.id : null;
  const routeName =
    originText && destinationText
      ? `${shortPlace(originText)}-${shortPlace(destinationText)}`
      : 'Trajet';

  const offers = COOPERATIVES.filter((cooperative) => cooperative.price <= budget).sort(
    (a, b) => {
      if (a.id === chosenId) return -1;
      if (b.id === chosenId) return 1;
      return a.price - b.price;
    },
  );

  const handleReserve = (details: ReservationDetails) => {
    if (!selected) return;
    const index = Math.max(0, offers.findIndex((offer) => offer.id === selected.id));
    onReserve({
      ...details,
      cooperative: selected,
      routeName,
      station: getStation(selected, originText, index),
    });
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col gap-4 px-5 pb-6 pt-8">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Retour à la recherche"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 text-navy" />
        </button>
        <h1 className="text-2xl font-bold text-navy">Offres</h1>
      </header>

      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
        <span className="text-sm text-ink/60">Votre budget</span>
        <span className="text-lg font-bold" style={{ color: '#22A695' }}>
          {budget.toLocaleString('fr-FR')} Ar
        </span>
      </div>

      <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:#4D9AE5_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-sky/50">
        {offers.map((cooperative, index) => (
          <li key={cooperative.id}>
            <button
              type="button"
              onClick={() => setSelected(cooperative)}
              className="flex w-full items-start gap-3 rounded-2xl bg-white p-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-sky/15 text-2xl font-bold text-navy">
                {cooperative.name.charAt(0)}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 text-sm text-ink/70">
                  <Star className="h-4 w-4 text-orange" fill="currentColor" />
                  {cooperative.rating.toFixed(1)}
                </span>
                <span className="mt-0.5 block truncate text-base font-semibold text-navy">
                  {cooperative.name}
                </span>

                <span className="mt-1 flex items-center gap-1.5 text-xs text-ink/70">
                  <Route className="h-3.5 w-3.5 shrink-0 text-sky" />
                  <span className="truncate">{routeName}</span>
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs text-ink/70">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-sky" />
                  <span className="truncate">{getStation(cooperative, originText, index)}</span>
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs text-ink/70">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0 text-sky" />
                  <span className="truncate capitalize">
                    {getDepartureDate(cooperative.arrivalMinutes)}
                  </span>
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs text-ink/70">
                  <Users className="h-3.5 w-3.5 shrink-0 text-sky" />
                  <span>{cooperative.freeSeats} places libres</span>
                </span>

                {cooperative.id === chosenId && (
                  <span className="mt-1.5 inline-block rounded-full bg-navy px-2 py-0.5 text-xs font-semibold text-white">
                    Votre choix
                  </span>
                )}
              </span>

              <span className="shrink-0 text-base font-bold" style={{ color: '#22A695' }}>
                {cooperative.price.toLocaleString('fr-FR')} Ar
              </span>
            </button>
          </li>
        ))}

        {offers.length === 0 && (
          <li className="px-2 pt-6 text-center text-sm text-ink/60">
            Aucune coopérative ne correspond à ce budget. Augmentez-le dans Recherche avec le bouton +.
          </li>
        )}
      </ul>

      {selected && (
        <OfferPopup
          cooperative={selected}
          onClose={() => setSelected(null)}
          onReserve={handleReserve}
        />
      )}
    </div>
  );
}