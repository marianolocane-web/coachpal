import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { getAudioSignedUrl } from '../../lib/data/diarioApi';

export function AudioMessagePlayer({ storagePath, label }: { storagePath: string; label?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = async () => {
    if (!url) {
      const signed = await getAudioSignedUrl(storagePath);
      setUrl(signed);
      return; // effect below plays it once the <audio> src is set
    }
    const el = audioRef.current;
    if (!el) return;
    if (playing) el.pause();
    else void el.play();
  };

  useEffect(() => {
    if (url && audioRef.current) void audioRef.current.play();
  }, [url]);

  return (
    <div
      style={{
        background: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <button
        onClick={togglePlay}
        aria-label={playing ? 'Pausar' : 'Reproducir'}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: 'none',
          background: 'var(--color-brand)',
          color: 'var(--color-text-on-brand)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ height: 6, borderRadius: 'var(--radius-pill)', background: 'var(--sand-200)', overflow: 'hidden' }}>
          <div style={{ width: `${progress * 100}%`, height: '100%', background: 'var(--color-brand)', transition: 'width 200ms linear' }} />
        </div>
        <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)', marginTop: 4 }}>{label || 'Nota de voz'}</div>
      </div>
      {url && (
        <audio
          ref={audioRef}
          src={url}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => {
            const el = e.currentTarget;
            if (el.duration) setProgress(el.currentTime / el.duration);
          }}
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
}
