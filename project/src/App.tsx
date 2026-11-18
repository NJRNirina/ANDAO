import { useState } from 'react';
import BottomNav, { type NavTabId } from '@/components/BottomNav';
import PlaceholderScreen from '@/components/PlaceholderScreen';
import ProposeTripScreen, { type Stage } from '@/components/ProposeTripScreen';
import OffersScreen, { type Reservation } from '@/components/OffersScreen';
import PurchaseScreen from '@/components/PurchaseScreen';
import AuthFlow, { type Role } from '@/components/AuthFlow';
import type { CooperativeChoice } from '@/components/BudgetSheet';
import type { PlaceSelection } from '@/lib/nominatim';

const EMPTY_SELECTION: PlaceSelection = { text: '', place: null };

function CooperativeHome({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold text-navy">Espace coopérative</h1>
      <p className="mt-2 max-w-[260px] text-base text-ink/70">Bientôt disponible.</p>
      <button
        type="button"
        onClick={onLogout}
        className="mt-6 rounded-2xl bg-navy px-6 py-3 text-base font-semibold text-white"
      >
        Se déconnecter
      </button>
    </div>
  );
}

function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [introSeen, setIntroSeen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTabId>('search');
  const [stage, setStage] = useState<Stage>('route');
  const [origin, setOrigin] = useState<PlaceSelection>(EMPTY_SELECTION);
  const [destination, setDestination] = useState<PlaceSelection>(EMPTY_SELECTION);
  const [budget, setBudget] = useState<number | null>(null);
  const [choice, setChoice] = useState<CooperativeChoice>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  return (
    <div className="flex min-h-screen justify-center bg-mist sm:py-8">
      <div className="relative flex h-dvh w-full max-w-[390px] flex-col overflow-hidden bg-mist sm:h-[844px] sm:rounded-[40px] sm:border-8 sm:border-ink sm:shadow-2xl">
        {role === null ? (
          <AuthFlow
            skipIntro={introSeen}
            onAuthenticated={(newRole) => {
              setIntroSeen(true);
              setRole(newRole);
            }}
          />
        ) : role === 'cooperative' ? (
          <CooperativeHome onLogout={() => setRole(null)} />
        ) : (
          <>
            <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              {activeTab === 'search' ? (
                <ProposeTripScreen
                  stage={stage}
                  onStageChange={setStage}
                  origin={origin}
                  onOriginChange={setOrigin}
                  destination={destination}
                  onDestinationChange={setDestination}
                  budget={budget}
                  onBudgetChange={setBudget}
                  choice={choice}
                  onChoiceChange={setChoice}
                  onSeeOffers={() => setActiveTab('offers')}
                />
              ) : activeTab === 'offers' ? (
                <OffersScreen
                  budget={budget}
                  choice={choice}
                  onBack={() => setActiveTab('search')}
                  onReserve={(newReservation) => {
                    setReservation(newReservation);
                    setActiveTab('purchase');
                  }}
                  originText={origin.text}
                  destinationText={destination.text}
                />
              ) : activeTab === 'purchase' ? (
                <PurchaseScreen
                  reservation={reservation}
                  onBack={() => setActiveTab('offers')}
                  onHome={() => setActiveTab('search')}
                />
              ) : (
                <PlaceholderScreen tab={activeTab} />
              )}
            </main>
            <BottomNav active={activeTab} onChange={setActiveTab} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;