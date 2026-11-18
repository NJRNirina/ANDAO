import { Minus, Plus } from 'lucide-react';

const BUDGET_STEP = 1000;
const MAX_DIGITS = 9;

interface BudgetInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export default function BudgetInput({ value, onChange }: BudgetInputProps) {
  const adjust = (delta: number) => {
    const next = Math.max(0, (value ?? 0) + delta);
    onChange(next === 0 ? null : next);
  };

  const handleTyping = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, MAX_DIGITS);
    const amount = Number(digits);
    onChange(amount > 0 ? amount : null);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={() => adjust(-BUDGET_STEP)}
        disabled={value === null}
        aria-label="Diminuer le budget de 1 000 Ar"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky/10 text-navy transition-all duration-150 hover:bg-sky/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-5 w-5" strokeWidth={2.5} />
      </button>

      <div className="flex min-w-0 flex-1 items-baseline justify-center gap-1">
        <input
          type="text"
          inputMode="numeric"
          value={value === null ? '' : value.toLocaleString('fr-FR')}
          onChange={(event) => handleTyping(event.target.value)}
          placeholder="Votre budget"
          aria-label="Budget par passager en Ar"
          className="w-full min-w-0 bg-transparent text-center text-2xl font-bold tabular-nums text-turquoise outline-none placeholder:font-semibold placeholder:text-muted"
        />
        {value !== null && <span className="text-lg font-semibold text-turquoise">Ar</span>}
      </div>

      <button
        type="button"
        onClick={() => adjust(BUDGET_STEP)}
        aria-label="Augmenter le budget de 1 000 Ar"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky/10 text-navy transition-all duration-150 hover:bg-sky/20 active:scale-95"
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
