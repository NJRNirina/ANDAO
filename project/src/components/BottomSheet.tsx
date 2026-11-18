import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  titleId: string;
  onClose: () => void;
  children: ReactNode;
}

export default function BottomSheet({ titleId, onClose, children }: BottomSheetProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-end bg-ink/40 animate-fade-in" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="relative max-h-[92%] w-full animate-sheet-up overflow-y-auto rounded-t-[32px] bg-white px-6 pb-8 pt-3 shadow-2xl"
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-mist" aria-hidden="true" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-mist transition-transform duration-150 active:scale-95"
        >
          <X className="h-4 w-4 text-ink" strokeWidth={2.5} />
        </button>
        {children}
      </div>
    </div>
  );
}
