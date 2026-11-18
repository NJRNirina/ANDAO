import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { Bus, Eye, EyeOff, User } from 'lucide-react';
import Logo from '@/components/Logo';

export type Role = 'traveler' | 'cooperative';
type Mode = 'login' | 'signup';

interface AuthFlowProps {
  onAuthenticated: (role: Role) => void;
  skipIntro?: boolean;
}

const SPLASH_MS = 2400;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const KEYFRAMES = `
@keyframes andao-logo-in {
  from { opacity: 0; transform: scale(0.7); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes andao-title-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes andao-rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .andao-anim { animation: none !important; opacity: 1 !important; transform: none !important; }
  .andao-move { transition: none !important; }
}
`;

const inputClass =
  'w-full rounded-2xl border border-[#B7CAD7] bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-sky/40';

export default function AuthFlow({ onAuthenticated, skipIntro = false }: AuthFlowProps) {
  const [sheetOpen, setSheetOpen] = useState(skipIntro);
  const [role, setRole] = useState<Role>('traveler');
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (skipIntro) return;
    const timer = setTimeout(() => setSheetOpen(true), SPLASH_MS);
    return () => clearTimeout(timer);
  }, [skipIntro]);

  const isTraveler = role === 'traveler';
  const isSignup = mode === 'signup';

  const changeRole = (next: Role) => {
    setRole(next);
    setError('');
  };

  const changeMode = (next: Mode) => {
    setMode(next);
    setError('');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (isSignup) {
      if (!name.trim() || !identifier.trim() || !password || !confirm) {
        setError('Remplissez tous les champs.');
        return;
      }
      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères.');
        return;
      }
      if (password !== confirm) {
        setError('Les mots de passe ne correspondent pas.');
        return;
      }
    } else if (!identifier.trim() || !password) {
      setError('Entrez vos identifiants.');
      return;
    }

    setError('');
    onAuthenticated(role);
  };

  // Apparition des éléments du formulaire, un par un
  let step = 0;
  const rise = (): CSSProperties => ({
    animation: `andao-rise 500ms ${EASE} both`,
    animationDelay: `${350 + step++ * 80}ms`,
    animationPlayState: sheetOpen ? 'running' : 'paused',
  });

  const identifierLabel = isSignup || isTraveler ? 'Numéro de téléphone' : 'Identifiant de la coopérative';
  const identifierPlaceholder = isSignup || isTraveler ? '034 00 000 00' : 'Votre identifiant';

  return (
    <div
      className="relative flex min-h-0 flex-1 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #4D9AE5 0%, #B7CAD7 55%, #E8EAEC 100%)' }}
    >
      <style>{KEYFRAMES}</style>

      {/* Logo + nom : centrés pendant le splash, puis ils remontent */}
      <div
        className="andao-move absolute left-0 right-0 flex flex-col items-center"
        style={{
          top: sheetOpen ? '4%' : '50%',
          transform: `translateY(${sheetOpen ? '0%' : '-50%'}) scale(${sheetOpen ? 0.55 : 1})`,
          transformOrigin: 'top center',
          transition: `top 800ms ${EASE}, transform 800ms ${EASE}`,
        }}
      >
        <div
          className="andao-anim"
          style={{ animation: 'andao-logo-in 800ms cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
        >
          <Logo size={144} />
        </div>
        <p
          className="andao-anim mt-6 pl-[0.3em] text-3xl font-bold tracking-[0.3em] text-ink"
          style={{ animation: 'andao-title-in 600ms ease-out 500ms both' }}
        >
          ANDAO
        </p>
      </div>

      {/* Panneau blanc : connexion / inscription */}
      <div
        className="andao-move absolute inset-x-0 bottom-0 flex max-h-[78%] flex-col rounded-t-[32px] bg-white shadow-2xl"
        style={{
          transform: sheetOpen ? 'translateY(0)' : 'translateY(105%)',
          transition: `transform 800ms ${EASE}`,
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 pb-8 pt-6"
        >
          {/* Choix du rôle */}
          <div className="andao-anim flex rounded-2xl bg-mist p-1" style={rise()}>
            <button
              type="button"
              onClick={() => changeRole('traveler')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                isTraveler ? 'bg-navy text-white' : 'text-navy'
              }`}
            >
              <User className="h-4 w-4" />
              Voyageur
            </button>
            <button
              type="button"
              onClick={() => changeRole('cooperative')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                !isTraveler ? 'bg-navy text-white' : 'text-navy'
              }`}
            >
              <Bus className="h-4 w-4" />
              Coopérative
            </button>
          </div>

          <h1 className="andao-anim text-2xl font-bold text-navy" style={rise()}>
            {isSignup ? 'Créer un compte' : 'Connexion'}
          </h1>

          {isSignup && (
            <label className="andao-anim block" style={rise()}>
              <span className="text-sm font-medium text-navy">
                {isTraveler ? 'Nom complet' : 'Nom de la coopérative'}
              </span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={isTraveler ? 'Votre nom' : 'Nom de la coopérative'}
                className={`mt-1 ${inputClass}`}
              />
            </label>
          )}

          <label className="andao-anim block" style={rise()}>
            <span className="text-sm font-medium text-navy">{identifierLabel}</span>
            <input
              type={isSignup || isTraveler ? 'tel' : 'text'}
              inputMode={isSignup || isTraveler ? 'tel' : 'text'}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder={identifierPlaceholder}
              className={`mt-1 ${inputClass}`}
            />
          </label>

          <label className="andao-anim block" style={rise()}>
            <span className="text-sm font-medium text-navy">Mot de passe</span>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Votre mot de passe"
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-sky" />
                ) : (
                  <Eye className="h-5 w-5 text-sky" />
                )}
              </button>
            </div>
          </label>

          {isSignup && (
            <label className="andao-anim block" style={rise()}>
              <span className="text-sm font-medium text-navy">Confirmer le mot de passe</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                placeholder="Répétez le mot de passe"
                className={`mt-1 ${inputClass}`}
              />
            </label>
          )}

          {!isSignup && (
            <button
              type="button"
              className="andao-anim -mt-1 self-end text-sm font-medium text-sky"
              style={rise()}
            >
              Mot de passe oublié ?
            </button>
          )}

          {error && <p className="text-sm font-medium text-orange">{error}</p>}

          <button
            type="submit"
            className="andao-anim w-full rounded-2xl bg-navy py-4 text-base font-semibold text-white shadow-lg shadow-navy/25 transition-all duration-200 hover:bg-navy/90 active:scale-[0.98]"
            style={rise()}
          >
            {isSignup ? 'Créer mon compte' : 'Se connecter'}
          </button>

          <p className="andao-anim text-center text-sm text-ink/60" style={rise()}>
            {isSignup ? 'Vous avez déjà un compte ?' : "Vous n'avez pas encore de compte ?"}{' '}
            <button
              type="button"
              onClick={() => changeMode(isSignup ? 'login' : 'signup')}
              className="font-semibold text-navy"
            >
              {isSignup ? 'Se connecter' : 'Créer un compte'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}