import { useMemo, useState } from 'react';
import { Bus, CalendarDays, Clock, Hash, X } from 'lucide-react';
import type { Cooperative } from '@/data/cooperatives';

export interface ReservationDetails {
  seats: number[];
  count: number;
  total: number;
  date: string;
  time: string;
  plate: string;
}

interface OfferPopupProps {
  cooperative: Cooperative;
  onClose: () => void;
  onReserve: (details: ReservationDetails) => void;
}

function getDeparture(arrivalMinutes: number) {
  const departure = new Date(Date.now() + arrivalMinutes * 60000);
  departure.setMinutes(Math.ceil(departure.getMinutes() / 5) * 5, 0, 0);
  return {
    date: departure.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    time: departure.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  };
}

function hashId(id: string) {
  let seed = 1;
  for (const char of id) {
    seed = (seed * 31 + char.charCodeAt(0)) % 2147483647;
  }
  return seed;
}

// Matricule d'exemple (4 chiffres + 3 lettres), toujours la même pour une coopérative
function getPlate(cooperative: Cooperative) {
  const seed = hashId(cooperative.id);
  const digits = String(1000 + (seed % 9000));
  const letters = 'ABCDEFGHJKLMNPRSTUV';
  const l1 = letters[seed % letters.length];
  const l2 = letters[Math.floor(seed / 7) % letters.length];
  const l3 = letters[Math.floor(seed / 49) % letters.length];
  return `${digits} ${l1}${l2}${l3}`;
}

// Places déjà réservées (toujours les mêmes pour une coopérative)
function getReservedSeats(cooperative: Cooperative) {
  const total = cooperative.seats;
  const reservedCount = Math.max(0, total - cooperative.freeSeats);

  let seed = hashId(cooperative.id);

  const numbers = Array.from({ length: total }, (_, i) => i + 1);
  for (let i = total - 1; i > 0; i--) {
    seed = (seed * 48271) % 2147483647;
    const j = seed % (i + 1);
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return new Set(numbers.slice(0, reservedCount));
}

export default function OfferPopup({ cooperative, onClose, onReserve }: OfferPopupProps) {
  const [count, setCount] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);

  const departure = getDeparture(cooperative.arrivalMinutes);
  const plate = getPlate(cooperative);
  const reservedSeats = useMemo(() => getReservedSeats(cooperative), [cooperative]);
  const rowCount = Math.ceil(cooperative.seats / 4);
  const maxCount = Math.max(1, cooperative.freeSeats);
  const total = cooperative.price * count;
  const ready = selected.length === count;

  const changeCount = (next: number) => {
    const value = Math.min(maxCount, Math.max(1, next));
    setCount(value);
    setSelected((current) => current.slice(0, value));
  };

  const toggleSeat = (seat: number) => {
    if (reservedSeats.has(seat)) return;
    setSelected((current) => {
      if (current.includes(seat)) return current.filter((item) => item !== seat);
      if (current.length >= count) return [...current.slice(1), seat];
      return [...current, seat];
    });
  };

  const handleReserve = () => {
    if (!ready) return;
    onReserve({
      seats: [...selected].sort((a, b) => a - b),
      count,
      total,
      date: departure.date,
      time: departure.time,
      plate,
    });
  };

  return (
    <div
      className="absolute inset-0 z-20 flex items-end bg-ink/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={cooperative.name}
    >
      <div
        className="flex max-h-[92%] w-full flex-col rounded-t-3xl bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative px-5 pt-5">
          <h2 className="pr-12 text-xl font-bold text-navy">{cooperative.name}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-mist"
          >
            <X className="h-5 w-5 text-navy" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-2 pt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-mist px-4 py-3">
              <CalendarDays className="h-5 w-5 shrink-0 text-sky" />
              <div>
                <p className="text-xs text-ink/60">Date de départ</p>
                <p className="text-sm font-semibold capitalize text-navy">{departure.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-mist px-4 py-3">
              <Clock className="h-5 w-5 shrink-0 text-sky" />
              <div>
                <p className="text-xs text-ink/60">Heure de départ</p>
                <p className="text-sm font-semibold text-navy">{departure.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-mist px-4 py-3">
              <Bus className="h-5 w-5 shrink-0 text-sky" />
              <div>
                <p className="text-xs text-ink/60">Véhicule</p>
                <p className="text-sm font-semibold text-navy">{cooperative.vehicle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-mist px-4 py-3">
              <Hash className="h-5 w-5 shrink-0 text-sky" />
              <div>
                <p className="text-xs text-ink/60">Matricule</p>
                <p className="text-sm font-semibold tracking-wider text-navy">{plate}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-mist px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-navy">Nombre de places</p>
              <p className="text-xs text-ink/60">{cooperative.freeSeats} disponibles</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => changeCount(count - 1)}
                disabled={count <= 1}
                aria-label="Moins de places"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl font-semibold text-navy shadow-sm disabled:opacity-40"
              >
                −
              </button>
              <span className="w-6 text-center text-lg font-bold text-navy">{count}</span>
              <button
                type="button"
                onClick={() => changeCount(count + 1)}
                disabled={count >= maxCount}
                aria-label="Plus de places"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl font-semibold text-navy shadow-sm disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          <h3 className="mt-5 text-base font-bold text-navy">Choisissez vos places</h3>
          <div className="mt-3 rounded-2xl border border-mist p-4">
            <div className="mb-3 flex items-center">
              <span className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white">
                Chauffeur
              </span>
            </div>

            <div className="space-y-2">
              {Array.from({ length: rowCount }, (_, row) => (
                <div key={row} className="flex items-center justify-between">
                  {[0, 1, 2, 3].map((col) => {
                    const seat = row * 4 + col + 1;
                    const exists = seat <= cooperative.seats;
                    const isReserved = reservedSeats.has(seat);
                    const isSelected = selected.includes(seat);

                    return (
                      <div key={col} className={col === 1 ? 'mr-6' : ''}>
                        {exists ? (
                          <button
                            type="button"
                            onClick={() => toggleSeat(seat)}
                            disabled={isReserved}
                            aria-label={`Place ${seat}`}
                            aria-pressed={isSelected}
                            className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-all duration-150 ${
                              isReserved
                                ? 'cursor-not-allowed text-white/80'
                                : isSelected
                                  ? 'scale-105 bg-navy text-white shadow-md'
                                  : 'bg-sky text-white active:scale-95'
                            }`}
                            style={isReserved ? { backgroundColor: '#A8AAAD' } : undefined}
                          >
                            {seat}
                          </button>
                        ) : (
                          <span className="block h-10 w-10" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-ink/70">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-sky" /> Disponible
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-navy" /> Votre choix
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded" style={{ backgroundColor: '#A8AAAD' }} /> Réservée
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-mist px-4 py-3">
            <span className="text-sm text-ink/70">
              {count} place{count > 1 ? 's' : ''} × {cooperative.price.toLocaleString('fr-FR')} Ar
            </span>
            <span className="text-base font-bold" style={{ color: '#22A695' }}>
              {total.toLocaleString('fr-FR')} Ar
            </span>
          </div>

          {!ready && (
            <p className="mt-3 text-center text-sm text-ink/60">
              Touchez {count - selected.length} place{count - selected.length > 1 ? 's' : ''} sur le plan.
            </p>
          )}
        </div>

        <div className="flex justify-center px-5 pb-5 pt-3">
          <button
            type="button"
            onClick={handleReserve}
            disabled={!ready}
            className="w-3/4 rounded-2xl bg-navy py-4 text-base font-semibold text-white shadow-lg shadow-navy/25 transition-all duration-200 hover:bg-navy/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-mist disabled:text-ink/40 disabled:shadow-none"
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
}