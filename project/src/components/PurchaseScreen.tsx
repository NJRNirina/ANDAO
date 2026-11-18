import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  Smartphone,
} from 'lucide-react';
import type { Reservation } from '@/components/OffersScreen';
import TicketView from '@/components/TicketView';
import CardPayment from '@/components/CardPayment';

const SERVICE_FEE = 2000;
const COUNTDOWN_SECONDS = 120;
const POPUP_DELAY_MS = 2000;

type Step =
  | 'summary'
  | 'method'
  | 'phone'
  | 'waiting'
  | 'success'
  | 'failed'
  | 'timeout'
  | 'card'
  | 'ticket';

const METHODS = [
  { id: 'MVola', subtitle: 'Mobile Money', icon: Smartphone },
  { id: 'Orange Money', subtitle: 'Mobile Money', icon: Smartphone },
  { id: 'Carte Visa', subtitle: 'Visa / Mastercard', icon: CreditCard },
];

// Couleurs des opérateurs : volontairement différentes de la palette ANDAO,
// car dans la vraie vie le pop-up appartient à l'opérateur.
const OPERATORS: Record<string, { prefixes: string[]; placeholder: string; bg: string; fg: string }> = {
  MVola: { prefixes: ['034', '038'], placeholder: '034 12 345 67', bg: '#FFD100', fg: '#060D27' },
  'Orange Money': { prefixes: ['032', '037'], placeholder: '032 12 345 67', bg: '#FF7900', fg: '#FFFFFF' },
};

interface PurchaseScreenProps {
  reservation?: Reservation | null;
  onBack?: () => void;
  onHome?: () => void;
}

function formatAr(value: number) {
  return `${value.toLocaleString('fr-FR')} Ar`;
}

function makeReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const part = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `MG-${part()}-${part()}`;
}

function formatClock(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const minutes = String(Math.floor(safe / 60)).padStart(2, '0');
  const seconds = String(safe % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function PurchaseScreen({
  reservation = null,
  onBack,
  onHome,
}: PurchaseScreenProps) {
  const [step, setStep] = useState<Step>('summary');
  const [method, setMethod] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [showPopup, setShowPopup] = useState(false);
  const [pin, setPin] = useState('');
  const [reference, setReference] = useState('');
  const [paidAt, setPaidAt] = useState<Date>(new Date());

  // Nouvelle réservation : on repart du récapitulatif
  useEffect(() => {
    setStep('summary');
    setMethod(null);
    setPhone('');
    setPhoneError('');
    setPin('');
    setShowPopup(false);
  }, [reservation]);

  // Pendant l'attente : compte à rebours + apparition du pop-up de l'opérateur
  useEffect(() => {
    if (step !== 'waiting') return;
    const tick = setInterval(() => setSecondsLeft((value) => value - 1), 1000);
    const popup = setTimeout(() => setShowPopup(true), POPUP_DELAY_MS);
    return () => {
      clearInterval(tick);
      clearTimeout(popup);
    };
  }, [step]);

  // Délai dépassé
  useEffect(() => {
    if (step === 'waiting' && secondsLeft <= 0) {
      setShowPopup(false);
      setStep('timeout');
    }
  }, [step, secondsLeft]);

  if (!reservation) {
    return (
      <div className="flex flex-col items-center px-6 pt-24 text-center">
        <h1 className="text-2xl font-bold text-navy">Achats</h1>
        <p className="mt-2 max-w-[260px] text-base text-ink/70">
          Aucune réservation en cours. Choisissez une offre et touchez « Réserver ».
        </p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mt-6 rounded-2xl bg-navy px-6 py-3 text-base font-semibold text-white"
          >
            Voir les offres
          </button>
        )}
      </div>
    );
  }

  const unitPrice = reservation.cooperative.price;
  const total = reservation.total + SERVICE_FEE;
  const seatsLabel = reservation.seats.join(' et ');
  const operator = method ? OPERATORS[method] : undefined;

  const startWaiting = () => {
    setSecondsLeft(COUNTDOWN_SECONDS);
    setPin('');
    setShowPopup(false);
    setStep('waiting');
  };

  const confirmPhone = () => {
    if (!operator) return;
    const digits = phone.replace(/\D/g, '');
    const valid = digits.length === 10 && operator.prefixes.some((prefix) => digits.startsWith(prefix));
    if (!valid) {
      setPhoneError('Numéro invalide');
      return;
    }
    setPhoneError('');
    startWaiting();
  };

  const validatePin = () => {
    if (pin.length !== 4) return;
    setShowPopup(false);
    if (pin === '0000') {
      setStep('failed');
      return;
    }
    setReference(makeReference());
    setPaidAt(new Date());
    setStep('success');
  };

  const goBack = () => {
    if (step === 'method') setStep('summary');
    else if (step === 'phone' || step === 'card' || step === 'waiting') setStep('method');
    else if (step === 'ticket') setStep('success');
    else onBack?.();
  };

  const canGoBack = step !== 'success' && step !== 'failed' && step !== 'timeout';

  const titles: Record<Step, string> = {
    summary: 'Récapitulatif',
    method: 'Moyen de paiement',
    phone: method ? `Paiement ${method}` : 'Paiement',
    waiting: 'Paiement en cours',
    success: 'Paiement réussi',
    failed: 'Paiement échoué',
    timeout: 'Délai dépassé',
    card: 'Paiement par carte',
    ticket: 'Mon billet',
  };

  const primaryButton =
    'w-full rounded-2xl bg-navy py-4 text-base font-semibold text-white shadow-lg shadow-navy/25 transition-all duration-200 hover:bg-navy/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-white disabled:text-ink/40 disabled:shadow-none';
  const secondaryButton =
    'w-full rounded-2xl bg-white py-4 text-base font-semibold text-navy shadow-sm transition-all duration-200 active:scale-[0.98]';

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-6 pt-8">
        <header className="flex items-center gap-3">
          {canGoBack && (
            <button
              type="button"
              onClick={goBack}
              aria-label="Retour"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <ArrowLeft className="h-5 w-5 text-navy" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-navy">{titles[step]}</h1>
        </header>

        {/* ÉCRAN 1 : RÉCAPITULATIF */}
        {step === 'summary' && (
          <>
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-ink/60">Départ</p>
                  <p className="text-base font-semibold text-navy">
                    {reservation.routeName.split('-')[0]}
                  </p>
                  <p className="text-sm text-ink/70">{reservation.station}</p>
                </div>
                <div>
                  <p className="text-xs text-ink/60">Arrivée</p>
                  <p className="text-base font-semibold text-navy">
                    {reservation.routeName.split('-').slice(1).join('-')}
                  </p>
                </div>
              </div>

              <dl className="mt-5 space-y-2 border-t border-mist pt-4">
                {[
                  { label: 'Date', value: reservation.date },
                  { label: 'Départ', value: reservation.time },
                  { label: 'Coopérative', value: reservation.cooperative.name },
                  {
                    label: 'Places',
                    value: `${reservation.count} (siège${reservation.count > 1 ? 's' : ''} ${seatsLabel})`,
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-ink/60">{row.label}</dt>
                    <dd className="text-right text-sm font-semibold capitalize text-navy">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <dl className="mt-4 space-y-2 border-t border-mist pt-4">
                <div className="flex justify-between">
                  <dt className="text-sm text-ink/60">
                    {reservation.count} place{reservation.count > 1 ? 's' : ''} x {formatAr(unitPrice)}
                  </dt>
                  <dd className="text-sm font-semibold text-navy">{formatAr(reservation.total)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-ink/60">Frais de service</dt>
                  <dd className="text-sm font-semibold text-navy">{formatAr(SERVICE_FEE)}</dd>
                </div>
                <div className="flex justify-between border-t border-mist pt-3">
                  <dt className="text-base font-bold text-navy">Total</dt>
                  <dd className="text-lg font-bold" style={{ color: '#22A695' }}>
                    {formatAr(total)}
                  </dd>
                </div>
              </dl>
            </section>

            <button type="button" onClick={() => setStep('method')} className={primaryButton}>
              Payer {formatAr(total)}
            </button>
          </>
        )}

        {/* ÉCRAN 2 : CHOIX DU PAIEMENT */}
        {step === 'method' && (
          <>
            <div className="rounded-3xl bg-white p-5 text-center shadow-sm">
              <p className="text-xs text-ink/60">Total à payer</p>
              <p className="mt-1 text-2xl font-bold" style={{ color: '#22A695' }}>
                {formatAr(total)}
              </p>
            </div>

            <ul className="space-y-3">
              {METHODS.map(({ id, subtitle, icon: Icon }) => {
                const selected = method === id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => setMethod(id)}
                      aria-pressed={selected}
                      className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm transition-all duration-200 active:scale-[0.99]"
                      style={{ border: `2px solid ${selected ? '#22A695' : 'transparent'}` }}
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky/15">
                        <Icon className="h-6 w-6 text-sky" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-base font-semibold text-navy">{id}</span>
                        <span className="block text-sm text-ink/60">{subtitle}</span>
                      </span>
                      {selected && <CheckCircle2 className="h-6 w-6" style={{ color: '#22A695' }} />}
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={() => setStep(method === 'Carte Visa' ? 'card' : 'phone')}
              disabled={!method}
              className={primaryButton}
            >
              Continuer
            </button>
          </>
        )}

        {/* ÉCRAN 3 : NUMÉRO MVola / ORANGE MONEY */}
        {step === 'phone' && operator && (
          <>
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm text-ink/60">Montant</p>
              <p className="text-2xl font-bold" style={{ color: '#22A695' }}>
                {formatAr(total)}
              </p>

              <label className="mt-5 block">
                <span className="text-sm font-medium text-navy">Numéro {method}</span>
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  maxLength={14}
                  onChange={(event) => {
                    setPhone(event.target.value.replace(/[^\d\s]/g, ''));
                    setPhoneError('');
                  }}
                  placeholder={operator.placeholder}
                  className="mt-1 w-full rounded-2xl border border-[#B7CAD7] bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-sky/40"
                />
              </label>
              <p className="mt-2 text-xs text-ink/60">
                Un message de confirmation sera envoyé sur ce numéro.
              </p>
              {phoneError && <p className="mt-2 text-sm font-medium text-orange">{phoneError}</p>}
            </section>

            <button type="button" onClick={confirmPhone} className={primaryButton}>
              Confirmer
            </button>
          </>
        )}

        {/* ÉCRAN 4 : ATTENTE */}
        {step === 'waiting' && (
          <>
            <section className="flex flex-col items-center rounded-3xl bg-white p-6 text-center shadow-sm">
              <Loader2 className="h-12 w-12 animate-spin text-sky" />
              <p className="mt-4 text-base font-semibold text-navy">En attente de validation</p>
              <p className="mt-2 text-sm text-ink/70">
                Validez le paiement sur votre téléphone avec votre code secret
              </p>
              <p className="mt-5 text-4xl font-bold tabular-nums text-navy">{formatClock(secondsLeft)}</p>
              <p className="text-xs text-ink/60">temps restant</p>
            </section>

            <button type="button" onClick={() => setStep('method')} className={secondaryButton}>
              Annuler
            </button>
          </>
        )}

        {/* ÉCRAN 5 : PAIEMENT RÉUSSI */}
        {step === 'success' && (
          <>
            <section className="flex flex-col items-center rounded-3xl bg-white p-6 text-center shadow-sm">
              <CheckCircle2 className="h-16 w-16" style={{ color: '#22A695' }} />
              <p className="mt-3 text-lg font-bold text-navy">Paiement réussi</p>
              <p className="mt-1 text-sm text-ink/70">
                {formatAr(total)} payés avec {method}
              </p>
            </section>

            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <dl className="space-y-2">
                {[
                  { label: 'Réservation', value: reference },
                  { label: 'Trajet', value: reservation.routeName },
                  { label: 'Départ', value: `${reservation.date}, ${reservation.time}` },
                  { label: 'Places', value: seatsLabel },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-ink/60">{row.label}</dt>
                    <dd className="text-right text-sm font-semibold text-navy">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <button type="button" onClick={() => setStep('ticket')} className={primaryButton}>
              Voir mon billet
            </button>
            <button type="button" onClick={() => onHome?.()} className={secondaryButton}>
              Retour à l'accueil
            </button>
          </>
        )}

        {/* ÉCHEC : SOLDE INSUFFISANT / DÉLAI DÉPASSÉ */}
        {(step === 'failed' || step === 'timeout') && (
          <>
            <section className="flex flex-col items-center rounded-3xl bg-white p-6 text-center shadow-sm">
              <AlertTriangle className="h-16 w-16 text-orange" />
              <p className="mt-3 text-lg font-bold text-navy">
                {step === 'failed' ? 'Solde insuffisant' : 'Paiement non validé à temps'}
              </p>
              <p className="mt-1 text-sm text-ink/70">Aucun montant n'a été débité.</p>
            </section>

            <button type="button" onClick={() => setStep('phone')} className={primaryButton}>
              Réessayer
            </button>
            <button type="button" onClick={() => setStep('method')} className={secondaryButton}>
              Changer de moyen de paiement
            </button>
          </>
        )}

        {/* CARTE VISA : prochaine étape */}
                {step === 'card' && (
          <CardPayment
            total={total}
            onSuccess={() => {
              setReference(makeReference());
              setPaidAt(new Date());
              setStep('success');
            }}
            onFail={() => setStep('failed')}
          />
        )}

        {/* BILLET ÉLECTRONIQUE */}
        {step === 'ticket' && (
          <TicketView
            reservation={reservation}
            reference={reference}
            method={method ?? ''}
            total={total}
            paidAt={paidAt}
          />
        )}
      </div>

      {/* POP-UP DE L'OPÉRATEUR (simulé) */}
      {showPopup && step === 'waiting' && operator && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-ink/60 px-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Code secret ${method}`}
        >
          <div className="w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div
              className="px-4 py-3 text-center text-sm font-bold"
              style={{ background: operator.bg, color: operator.fg }}
            >
              {method}
            </div>
            <div className="p-5 text-center">
              <p className="text-sm font-semibold text-ink">Payer {formatAr(total)} à ANDAO ?</p>
              <p className="mt-2 text-xs text-ink/60">Entrez votre code secret</p>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(event) => setPin(event.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                aria-label="Code secret"
                className="mt-3 w-full rounded-xl border border-[#B7CAD7] px-4 py-3 text-center text-xl tracking-[0.5em] text-ink outline-none focus:ring-2 focus:ring-sky/40"
              />
                            <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPopup(false);
                    setStep('method');
                  }}
                  className="rounded-xl bg-mist py-3 text-sm font-semibold text-navy"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={validatePin}
                  disabled={pin.length !== 4}
                  className="rounded-xl bg-navy py-3 text-sm font-semibold text-white disabled:opacity-40"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}