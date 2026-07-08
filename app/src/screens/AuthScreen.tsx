import { useState, type FormEvent } from 'react';
import { useAuth } from '../lib/auth';
import { Input } from '../components/forms/Input';
import { Button } from '../components/forms/Button';
import wordmark from '../assets/wordmark.svg';

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    if (mode === 'signup') setSignedUp(true);
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 'var(--space-7)',
        background: 'var(--color-bg-app)',
        fontFamily: 'var(--font-body)',
        padding: 'var(--space-6)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img src={wordmark} alt="CoachPal" width={180} height={42} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ font: 'var(--text-title-lg)', color: 'var(--color-text-primary)' }}>
          {mode === 'signin' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
        </div>
        <div style={{ font: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
          {mode === 'signin' ? 'Tu racha te está esperando.' : 'Un día a la vez. Empecemos.'}
        </div>
      </div>

      {signedUp ? (
        <div
          style={{
            background: 'var(--color-brand-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-5)',
            font: 'var(--text-body-md)',
            color: 'var(--green-700)',
            textAlign: 'center',
          }}
        >
          Revisa tu correo para confirmar la cuenta y luego inicia sesión.
        </div>
      ) : (
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Correo" type="email" placeholder="tú@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Contraseña" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div style={{ font: 'var(--text-caption)', color: 'var(--color-danger)' }}>{error}</div>}
          <Button type="submit" variant="primary" fullWidth disabled={loading || !email || !password}>
            {loading ? 'Un momento…' : mode === 'signin' ? 'Entrar' : 'Crear cuenta'}
          </Button>
        </form>
      )}

      <button
        onClick={() => {
          setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
          setError(null);
          setSignedUp(false);
        }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'var(--text-body-sm)', color: 'var(--color-brand)', fontFamily: 'var(--font-body)' }}
      >
        {mode === 'signin' ? '¿No tienes cuenta? Crea una' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </div>
  );
}
