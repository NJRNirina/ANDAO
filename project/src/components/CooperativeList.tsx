import { ChevronRight, Layers, Search } from 'lucide-react';
import type { Cooperative } from '@/data/cooperatives';

interface CooperativeListProps {
  cooperatives: Cooperative[];
  query: string;
  onQueryChange: (value: string) => void;
  onSelectCooperative: (cooperative: Cooperative) => void;
  onSelectAll: () => void;
}

export default function CooperativeList({
  cooperatives,
  query,
  onQueryChange,
  onSelectCooperative,
  onSelectAll,
}: CooperativeListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <label className="flex shrink-0 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-sky/40">
        <Search className="h-5 w-5 shrink-0 text-sky" strokeWidth={2.25} />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Rechercher une coopérative"
          aria-label="Rechercher une coopérative"
          className="w-full bg-transparent text-base text-ink outline-none placeholder:text-muted"
        />
      </label>

      <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto pb-2 pr-1">
        <li>
          <button
            type="button"
            onClick={onSelectAll}
            className="group flex w-full items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy">
              <Layers className="h-5 w-5 text-white" strokeWidth={2.25} />
            </span>
            <span className="flex-1 text-left text-base font-semibold text-navy">
              Aucune préférence
            </span>
            <ChevronRight className="h-5 w-5 text-sky transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </li>

        {cooperatives.map((cooperative) => (
          <li key={cooperative.id}>
            <button
              type="button"
              onClick={() => onSelectCooperative(cooperative)}
              className="group flex w-full items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky/15 text-sm font-bold text-navy">
                {cooperative.name.charAt(0)}
              </span>
              <span className="flex-1 text-left text-base font-semibold text-ink">
                {cooperative.name}
              </span>
              <ChevronRight className="h-5 w-5 text-sky transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </li>
        ))}

        {cooperatives.length === 0 && (
          <li className="px-2 pt-4 text-center text-sm text-ink/60">
            Aucune coopérative ne correspond à « {query} ».
          </li>
        )}
      </ul>
    </div>
  );
}
