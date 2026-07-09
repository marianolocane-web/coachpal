import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { DiaryMessage } from '../../lib/data/types';
import { getAudioSignedUrl } from '../../lib/data/diarioApi';

type ChatBubbleMessage = Pick<DiaryMessage, 'role' | 'contentType' | 'textContent' | 'audioStoragePath'>;

function AudioPlayButton({ storagePath }: { storagePath: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    if (!url) {
      const signed = await getAudioSignedUrl(storagePath);
      setUrl(signed);
      return; // plays once the <audio> element mounts with the src, see below
    }
    const el = audioRef.current;
    if (!el) return;
    if (playing) el.pause();
    else void el.play();
  };

  return (
    <>
      <button
        onClick={toggle}
        aria-label={playing ? 'Pausar nota de voz' : 'Reproducir nota de voz'}
        style={{
          border: 'none',
          background: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        {playing ? <Pause size={14} /> : <Play size={14} />}
      </button>
      {url && (
        <audio
          ref={audioRef}
          src={url}
          autoPlay
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          style={{ display: 'none' }}
        />
      )}
    </>
  );
}

export function ChatBubble({ msg }: { msg: ChatBubbleMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && (
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'var(--color-brand)',
            color: 'var(--color-text-on-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: 'var(--text-label-sm)',
            marginRight: 8,
            flexShrink: 0,
          }}
        >
          IA
        </div>
      )}
      <div
        style={{
          maxWidth: '75%',
          padding: '10px 14px',
          borderRadius: 'var(--radius-lg)',
          borderBottomRightRadius: isUser ? 4 : 'var(--radius-lg)',
          borderBottomLeftRadius: isUser ? 'var(--radius-lg)' : 4,
          background: isUser ? 'var(--color-brand)' : 'var(--color-bg-surface-2)',
          color: isUser ? 'var(--color-text-on-brand)' : 'var(--color-text-primary)',
          font: 'var(--text-body-md)',
        }}
      >
        {msg.contentType === 'audio' && msg.audioStoragePath ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AudioPlayButton storagePath={msg.audioStoragePath} />
            <span>{msg.textContent}</span>
          </div>
        ) : (
          msg.textContent
        )}
      </div>
    </div>
  );
}
