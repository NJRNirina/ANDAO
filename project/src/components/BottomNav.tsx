import { Bookmark, Search, ShoppingBag, Tag, User, type LucideIcon } from 'lucide-react';

export type NavTabId = 'search' | 'offers' | 'purchase' | 'saved' | 'profile';

export const NAV_ITEMS: { id: NavTabId; label: string; icon: LucideIcon }[] = [
  { id: 'search', label: 'Recherche', icon: Search },
  { id: 'offers', label: 'Offres', icon: Tag },
  { id: 'purchase', label: 'Achats', icon: ShoppingBag },
  { id: 'saved', label: 'Enregistrés', icon: Bookmark },
  { id: 'profile', label: 'Profil', icon: User },
];

interface BottomNavProps {
  active: NavTabId;
  onChange: (id: NavTabId) => void;
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="sticky bottom-0 z-10 border-t border-mist bg-white/95 px-2 pb-2 pt-1 backdrop-blur">
      <ul className="flex items-stretch justify-between">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <li key={id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-current={isActive ? 'page' : undefined}
                className="group flex w-full flex-col items-center gap-1 rounded-2xl py-2 transition-colors"
              >
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition-all duration-200 ${
                    isActive ? 'bg-sky/15' : 'group-hover:bg-sky/10'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform duration-200 group-active:scale-90 ${
                      isActive ? 'text-sky' : 'text-sky/70'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </span>
                <span
                  className={`text-[11px] ${isActive ? 'font-semibold text-navy' : 'font-medium text-ink/60'}`}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}