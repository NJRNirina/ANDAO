import { CircleDot } from 'lucide-react';

const SEATS_PER_ROW = 4;

interface SeatMapProps {
  seats: number;
  freeSeats: number;
  seed: string;
}

export default function SeatMap({ seats, freeSeats, seed }: SeatMapProps) {
  const occupied = occupiedSeatFlags(seats, freeSeats, seed);
  const rows = buildRows(seats);

  return (
    <div className="space-y-4">
      <div className="relative mx-auto w-full max-w-[220px] rounded-[40px] border-2 border-mist bg-mist/40 px-5 pb-6 pt-12">
        <div
          className="absolute left-1/2 top-4 h-2 w-16 -translate-x-1/2 rounded-full bg-sky/30"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-2.5" role="img" aria-label="Plan des places du véhicule">
          <div className="grid grid-cols-5 justify-items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
              <CircleDot className="h-4 w-4 text-navy" strokeWidth={2.25} aria-hidden="true" />
            </span>
            <span className="h-7 w-7" />
            <span className="h-7 w-7" />
            <span className="h-7 w-7" />
            <span className="h-7 w-7" />
          </div>

          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 justify-items-center gap-2">
              {row.map((seatIndex, column) =>
                seatIndex === null ? (
                  <span key={column} className="h-7 w-7" />
                ) : (
                  <span
                    key={column}
                    title={occupied[seatIndex] ? 'Occupée' : 'Libre'}
                    className={`h-7 w-7 rounded-lg transition-colors ${
                      occupied[seatIndex] ? 'bg-muted' : 'bg-turquoise'
                    }`}
                  />
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <ul className="flex items-center justify-center gap-6 text-sm font-medium text-ink">
        <li className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-turquoise" aria-hidden="true" />
          Libre
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-muted" aria-hidden="true" />
          Occupée
        </li>
      </ul>
    </div>
  );
}

function buildRows(seats: number): (number | null)[][] {
  const rows: (number | null)[][] = [];
  for (let start = 0; start < seats; start += SEATS_PER_ROW) {
    const [left1, left2, right1, right2] = [0, 1, 2, 3].map((offset) => {
      const index = start + offset;
      return index < seats ? index : null;
    });
    rows.push([left1, left2, null, right1, right2]);
  }
  return rows;
}

function occupiedSeatFlags(seats: number, freeSeats: number, seed: string): boolean[] {
  const ranked = Array.from({ length: seats }, (_, index) => ({
    index,
    rank: hashText(`${seed}-${index}`),
  })).sort((a, b) => a.rank - b.rank);
  const occupiedIndexes = new Set(ranked.slice(0, seats - freeSeats).map((seat) => seat.index));
  return Array.from({ length: seats }, (_, index) => occupiedIndexes.has(index));
}

function hashText(text: string): number {
  let hash = 2166136261;
  for (const char of text) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
