import { CheckCircle2, Loader2, MapPin, type LucideIcon } from 'lucide-react';
import { MIN_QUERY_LENGTH, usePlaceSuggestions } from '@/hooks/usePlaceSuggestions';
import type { PlaceSelection } from '@/lib/nominatim';

const TONES = {
  sky: { wrap: 'bg-sky/15', icon: 'text-sky' },
  orange: { wrap: 'bg-orange/15', icon: 'text-orange' },
} as const;

interface PlaceFieldProps {
  id: string;
  placeholder: string;
  icon: LucideIcon;
  tone: keyof typeof TONES;
  value: PlaceSelection;
  onChange: (value: PlaceSelection) => void;
}

export default function PlaceField({ id, placeholder, icon: Icon, tone, value, onChange }: PlaceFieldProps) {
  const isSearching = value.place === null && value.text.trim().length >= MIN_QUERY_LENGTH;
  const { suggestions, status } = usePlaceSuggestions(value.text, isSearching);
  const toneClasses = TONES[tone];

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toneClasses.wrap}`}>
          <Icon className={`h-4 w-4 ${toneClasses.icon}`} strokeWidth={2.5} />
        </span>
        <input
          id={id}
          type="text"
          value={value.text}
          placeholder={placeholder}
          aria-label={placeholder}
          autoComplete="off"
          onChange={(event) => onChange({ text: event.target.value, place: null })}
          className="min-w-0 flex-1 bg-transparent py-3 text-base font-semibold text-ink outline-none placeholder:font-medium placeholder:text-muted focus:text-navy"
        />
        {value.place && <CheckCircle2 className="h-5 w-5 shrink-0 text-turquoise" strokeWidth={2.25} aria-label="Lieu sélectionné" />}
      </div>

      {isSearching && status !== 'idle' && (
        <div className="ml-11 pb-3">
          {status === 'loading' && (
            <p className="flex items-center gap-2 py-2 text-sm text-ink/70">
              <Loader2 className="h-4 w-4 animate-spin text-sky" /> Recherche en cours...
            </p>
          )}
          {status === 'error' && (
            <p className="py-2 text-sm text-ink/70">Recherche impossible pour le moment.</p>
          )}
          {status === 'ready' && suggestions.length === 0 && (
            <p className="py-2 text-sm text-ink/70">Aucun lieu trouvé à Madagascar.</p>
          )}
          {suggestions.length > 0 && (
            <ul className="animate-fade-in overflow-hidden rounded-2xl border border-mist bg-white">
              {suggestions.map((place) => (
                <li key={`${place.latitude},${place.longitude}`} className="border-b border-mist last:border-b-0">
                  <button
                    type="button"
                    onClick={() => onChange({ text: place.label, place })}
                    className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-sky/10"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky" strokeWidth={2.25} />
                    <span className="text-sm leading-normal text-ink">{place.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
