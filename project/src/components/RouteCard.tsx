import { ArrowUpDown, Flag, MapPin } from 'lucide-react';
import PlaceField from '@/components/PlaceField';
import type { PlaceSelection } from '@/lib/nominatim';

interface RouteCardProps {
  origin: PlaceSelection;
  destination: PlaceSelection;
  onOriginChange: (value: PlaceSelection) => void;
  onDestinationChange: (value: PlaceSelection) => void;
  onSwap: () => void;
}

export default function RouteCard({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onSwap,
}: RouteCardProps) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <PlaceField
            id="origin"
            placeholder="Point de départ"
            icon={MapPin}
            tone="sky"
            value={origin}
            onChange={onOriginChange}
          />
          <div className="h-px bg-mist" />
          <PlaceField
            id="destination"
            placeholder="Destination"
            icon={Flag}
            tone="orange"
            value={destination}
            onChange={onDestinationChange}
          />
        </div>

        <button
          type="button"
          onClick={onSwap}
          aria-label="Inverser le départ et la destination"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-white shadow-md shadow-navy/20 transition-all duration-200 hover:scale-105 hover:bg-navy/90 active:scale-95"
        >
          <ArrowUpDown className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </div>
    </section>
  );
}
