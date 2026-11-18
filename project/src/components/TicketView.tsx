import { QRCodeSVG } from 'qrcode.react';
import type { Reservation } from '@/components/OffersScreen';

interface TicketViewProps {
  reservation: Reservation;
  reference: string;
  method: string;
  total: number;
  paidAt: Date;
  passenger?: string;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-ink/50">{label}</p>
      <p className="text-sm font-semibold capitalize text-navy">{value}</p>
    </div>
  );
}

export default function TicketView({
  reservation,
  reference,
  method,
  total,
  paidAt,
  passenger = 'RAKOTO Jean',
}: TicketViewProps) {
  const [from, ...rest] = reservation.routeName.split('-');
  const to = rest.join('-');
  const seats = reservation.seats.map((seat) => `N° ${seat}`).join(' et ');
  const paidDate = paidAt.toLocaleDateString('fr-FR');
  const paidTime = paidAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const qrValue = [reference, reservation.date, reservation.time, reservation.seats.join('+')].join('|');

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="bg-navy px-5 py-4 text-center">
          <p className="pl-[0.3em] text-lg font-bold tracking-[0.3em] text-white">ANDAO</p>
          <p className="mt-1 text-xs font-semibold tracking-wider text-white">BILLET ÉLECTRONIQUE</p>
          <p className="text-[10px] tracking-wider text-white/70">E-TICKET | AUTOBUS / TAXI-BROUSSE</p>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-ink/50">Billet N°</p>
            <p className="text-base font-bold tracking-wider text-navy">{reference}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-ink/50">Départ</p>
              <p className="text-sm font-bold uppercase text-navy">{from}</p>
              <p className="text-xs text-ink/70">{reservation.station}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-ink/50">Arrivée</p>
              <p className="text-sm font-bold uppercase text-navy">{to}</p>
              <p className="text-xs text-ink/70">Gare routière de {to}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" value={reservation.date} />
            <Field label="Heure de départ" value={reservation.time} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Places" value={seats} />
            <Field label="Passager" value={passenger} />
          </div>

          <Field label="Coopérative" value={reservation.cooperative.name} />
          <Field label="Véhicule" value={`${reservation.cooperative.vehicle} - ${reservation.plate}`} />

          <div className="flex items-start justify-between gap-3">
            <Field
              label="Paiement"
              value={`${method} | ${total.toLocaleString('fr-FR')} Ar`}
            />
            <span
              className="mt-1 shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: '#22A695' }}
            >
              PAYÉ
            </span>
          </div>
          <p className="-mt-2 text-xs text-ink/60">
            Payé le {paidDate} à {paidTime}
          </p>
        </div>

        {/* Bord découpé façon ticket */}
        <div className="relative">
          <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-mist" />
          <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-mist" />
          <div className="mx-5 border-t-2 border-dashed border-[#B7CAD7]" />
        </div>

        <div className="flex flex-col items-center px-5 pb-6 pt-5">
          <QRCodeSVG value={qrValue} size={150} fgColor="#060D27" bgColor="#FFFFFF" />
          <p className="mt-3 text-xs font-medium text-ink/60">Scannez à l'embarquement</p>
          <p className="text-xs font-semibold tracking-wider text-navy">{reference}</p>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <ul className="list-disc space-y-2 pl-4 text-sm text-ink/70">
          <li>Présentez-vous à la gare routière 30 minutes avant le départ.</li>
          <li>Montrez le QR code au chauffeur ou au contrôleur.</li>
          <li>Une pièce d'identité peut être demandée.</li>
          <li>Annulation et remboursement : selon les conditions de la coopérative.</li>
        </ul>
      </section>

      <div className="grid gap-3">
        <button
          type="button"
          className="w-full rounded-2xl bg-navy py-4 text-base font-semibold text-white shadow-lg shadow-navy/25 active:scale-[0.98]"
        >
          Télécharger en image
        </button>
        <button
          type="button"
          className="w-full rounded-2xl bg-white py-4 text-base font-semibold text-navy shadow-sm active:scale-[0.98]"
        >
          Partager
        </button>
        <button
          type="button"
          className="w-full rounded-2xl bg-white py-4 text-base font-semibold text-navy shadow-sm active:scale-[0.98]"
        >
          Contacter la coopérative
        </button>
      </div>
    </div>
  );
}