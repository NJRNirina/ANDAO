import { Compass } from 'lucide-react';
import type { NavTabId } from '@/components/BottomNav';
import { NAV_ITEMS } from '@/components/BottomNav';

interface PlaceholderScreenProps {
  tab: NavTabId;
}

export default function PlaceholderScreen({ tab }: PlaceholderScreenProps) {
  const item = NAV_ITEMS.find((navItem) => navItem.id === tab);

  return (
    <div className="flex flex-col items-center px-6 pt-24 text-center animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
        <Compass className="h-9 w-9 text-sky" strokeWidth={2} />
      </div>
      <h1 className="mt-6 text-2xl font-bold leading-[1.2] text-navy">{item?.label}</h1>
      <p className="mt-2 max-w-[260px] text-base leading-normal text-ink/70">
        Cette section arrive bientôt. Revenez sur Recherche pour proposer votre trajet.
      </p>
    </div>
  );
}
