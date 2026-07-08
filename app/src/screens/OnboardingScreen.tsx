import { useState } from 'react';
import { Hand, Flame, Sprout } from 'lucide-react';

export interface OnboardingScreenProps {
  onFinish: () => void;
}

const steps = [
  {
    Icon: Hand,
    title: 'Hola, soy tu CoachPal',
    body: 'Te ayudo a construir hábitos que se quedan. Un día a la vez.',
  },
  {
    Icon: Flame,
    title: 'Las rachas importan',
    body: 'Cada día que marcas un hábito, tu racha crece. Nosotros la celebramos contigo.',
  },
  {
    Icon: Sprout,
    title: 'Empieza pequeño',
    body: 'No hace falta hacerlo todo. Elige 1-3 hábitos para empezar hoy.',
  },
];

export function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const s = steps[step];
  const last = step === steps.length - 1;

  return (
    <div
      style={{
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        background: 'var(--color-bg-app)',
        fontFamily: 'var(--font-body)',
        padding: 'var(--space-5) var(--space-6) var(--space-5)',
      }}
    >
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 'var(--space-4)' }}>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: 'var(--color-brand-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <s.Icon size={40} color="var(--color-brand)" strokeWidth={1.75} />
        </div>
        <div style={{ font: 'var(--text-display-sm)', color: 'var(--color-text-primary)', letterSpacing: 'var(--tracking-tight)' }}>{s.title}</div>
        <div style={{ font: 'var(--text-body-lg)', color: 'var(--color-text-secondary)', maxWidth: 280 }}>{s.body}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 'var(--space-4)' }}>
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === step ? 20 : 7,
              height: 7,
              borderRadius: 'var(--radius-pill)',
              background: i === step ? 'var(--color-brand)' : 'var(--sand-300)',
              transition: 'all var(--duration-base) var(--ease-standard)',
            }}
          />
        ))}
      </div>
      <button
        onClick={() => (last ? onFinish() : setStep(step + 1))}
        style={{
          background: 'var(--color-brand)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-pill)',
          padding: '16px',
          font: 'var(--text-title-sm)',
          fontFamily: 'var(--font-body)',
          cursor: 'pointer',
        }}
      >
        {last ? 'Empezar' : 'Siguiente'}
      </button>
      {!last && (
        <button
          onClick={onFinish}
          style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', font: 'var(--text-body-sm)', marginTop: 12, cursor: 'pointer' }}
        >
          Saltar
        </button>
      )}
    </div>
  );
}
