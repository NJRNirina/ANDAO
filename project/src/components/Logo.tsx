import { useState } from 'react';
import { Bus } from 'lucide-react';

// Le logo doit être dans le dossier "public" sous le nom andao-logo.png
const LOGO_URL = '/andao-logo.jpeg';

interface LogoProps {
  size?: number;
}

export default function Logo({ size = 144 }: LogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="flex items-center justify-center rounded-3xl bg-navy shadow-lg"
        style={{ width: size, height: size }}
      >
        <Bus className="text-white" style={{ width: size / 2, height: size / 2 }} />
      </div>
    );
  }

  return (
    <img
      src={LOGO_URL}
      alt="Logo ANDAO"
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className="object-contain"
      style={{ width: size, height: size }}
    />
  );
}