import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface CardPaymentProps {
  total: number;
  onSuccess: () => void;
  onFail: () => void;
}

type Phase = 'form' | 'secure' | 'verifying';

// Page de la banque : volontairement bleue, différente de la palette ANDAO
const BANK_BLUE = '#0B3D91';
const RESEND_SECONDS = 45;
const MAX_TRIES = 3;
const VERIFY_MS = 2000;

const inputClass =
  'w-full rounded-2xl border border-[#B7CAD7] bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-sky/40';

function formatAr(value: number) {
  return `${value.toLocaleString('fr-FR')} Ar`;
}

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function isExpiryValid(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  return new Date(year, month, 1).getTime() > Date.now();
}

export default function CardPayment({ total, onSuccess, onFail }: CardPaymentProps) {
  const [phase, setPhase] = useState<Phase>('form');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [holder, setHolder] = useState('');
  const [error, setError] = useState('');

  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [resendLeft, setResendLeft] = useState(RESEND_SECONDS);

  // Compte à rebours "Renvoyer le code"
  useEffect(() => {
    if (phase !== 'secure') return;
    const tick = setInterval(() => setResendLeft((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(tick);
  }, [phase]);

  // Vérification avec la banque, puis succès
  useEffect(() => {
    if (phase !== 'verifying') return;
    const timer = setTimeout(() => onSuccess(), VERIFY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const digits = cardNumber.replace(/\D/g, '');
  const lastFour = digits.slice(-4);

  const handlePay = () => {
    if (digits.length !== 16) return setError('Numéro de carte invalide');
    if (!isExpiryValid(expiry)) return setError('Carte refusée ou expirée');
    if (cvv.length !== 3) return setError('CVV invalide (3 chiffres)');
    if (!holder.trim()) return setError('Entrez le nom sur la carte');
    setError('');
    setCode('');
    setCodeError('');
    setAttempts(0);
    setResendLeft(RESEND_SECONDS);
    setPhase('secure');
  };

  const handleValidateCode = () => {
    if (code.length !== 6) return;
    if (code === '000000') {
      const next = attempts + 1;
      setAttempts(next);
      setCode('');
      if (next >= MAX_TRIES) {
        onFail();
        return;
      }
      const left = MAX_TRIES - next;
      setCodeError(`Code incorrect. Il reste ${left} essai${left > 1 ? 's' : ''}.`);
      return;
    }
    setCodeError('');
    setPhase('verifying');
  };

  return (
    <>
      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-sm text-ink/60">Total</p>
        <p className="text-2xl font-bold" style={{ color: '#22A695' }}>
          {formatAr(total)}
        </p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-navy">Numéro de carte</span>
            <input
              type="text"
              inputMode="numeric"
              value={cardNumber}
              onChange={(event) => {
                setCardNumber(formatCardNumber(event.target.value));
                setError('');
              }}
              placeholder="4111 1111 1111 1111"
              className={`mt-1 ${inputClass}`}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-navy">Expiration</span>
              <input
                type="text"
                inputMode="numeric"
                value={expiry}
                onChange={(event) => {
                  setExpiry(formatExpiry(event.target.value));
                  setError('');
                }}
                placeholder="MM/AA"
                className={`mt-1 ${inputClass}`}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-navy">CVV</span>
              <input
                type="password"
                inputMode="numeric"
                maxLength={3}
                value={cvv}
                onChange={(event) => {
                  setCvv(event.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                placeholder="•••"
                className={`mt-1 ${inputClass}`}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-navy">Nom sur la carte</span>
            <input
              type="text"
              value={holder}
              onChange={(event) => {
                setHolder(event.target.value);
                setError('');
              }}
              placeholder="RAKOTO Jean"
              className={`mt-1 ${inputClass}`}
            />
          </label>
        </div>

        <p className="mt-4 text-xs text-ink/60">
          Paiement sécurisé - vos données ne sont pas conservées par l'app
        </p>
        {error && <p className="mt-2 text-sm font-medium text-orange">{error}</p>}
      </section>

      <button
        type="button"
        onClick={handlePay}
        className="w-full rounded-2xl bg-navy py-4 text-base font-semibold text-white shadow-lg shadow-navy/25 transition-all duration-200 hover:bg-navy/90 active:scale-[0.98]"
      >
        Payer {formatAr(total)}
      </button>

      {/* PAGE 3D-SECURE (simulée : c'est la page de la banque) */}
      {phase === 'secure' && (
        <div
          className="absolute inset-0 z-20 flex flex-col overflow-y-auto"
          style={{ background: BANK_BLUE }}
        >
          <div className="px-6 pb-5 pt-10 text-center text-white">
            <p className="text-lg font-bold">Banque (exemple)</p>
            <p className="mt-1 text-sm text-white/80">Vérification 3D-Secure</p>
          </div>

          <div className="flex-1 rounded-t-[28px] bg-white px-6 pb-8 pt-6">
            <p className="text-base font-bold" style={{ color: BANK_BLUE }}>
              Authentification du paiement
            </p>

            <dl className="mt-4 space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-ink/60">Marchand</dt>
                <dd className="text-sm font-semibold text-ink">ANDAO</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-ink/60">Montant</dt>
                <dd className="text-sm font-semibold text-ink">{formatAr(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-ink/60">Carte</dt>
                <dd className="text-sm font-semibold text-ink">•••• •••• •••• {lastFour}</dd>
              </div>
            </dl>

            <p className="mt-5 text-sm text-ink/70">
              Un code à 6 chiffres a été envoyé par SMS au 034 •• ••• 67
            </p>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, ''));
                setCodeError('');
              }}
              placeholder="••••••"
              aria-label="Code SMS à 6 chiffres"
              className="mt-3 w-full rounded-xl border border-[#B7CAD7] px-4 py-3 text-center text-xl tracking-[0.4em] text-ink outline-none focus:ring-2"
            />
            {codeError && <p className="mt-2 text-sm font-medium text-orange">{codeError}</p>}

            <div className="mt-3 text-center">
              {resendLeft > 0 ? (
                <p className="text-xs text-ink/60">
                  Renvoyer le code (00:{String(resendLeft).padStart(2, '0')})
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setResendLeft(RESEND_SECONDS)}
                  className="text-xs font-semibold"
                  style={{ color: BANK_BLUE }}
                >
                  Renvoyer le code
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleValidateCode}
              disabled={code.length !== 6}
              className="mt-5 w-full rounded-xl py-3 text-base font-semibold text-white disabled:opacity-40"
              style={{ background: BANK_BLUE }}
            >
              Valider
            </button>
            <button
              type="button"
              onClick={() => setPhase('form')}
              className="mt-2 w-full rounded-xl bg-mist py-3 text-base font-semibold text-navy"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* VÉRIFICATION EN COURS */}
      {phase === 'verifying' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-mist px-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-sky" />
          <p className="mt-4 text-lg font-bold text-navy">Paiement en cours</p>
          <p className="mt-1 text-base font-semibold text-navy">Vérification en cours</p>
          <p className="mt-2 text-sm text-ink/70">Nous confirmons votre paiement avec la banque…</p>
        </div>
      )}
    </>
  );
}