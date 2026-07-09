import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Mic, Paperclip, Send, X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useAddDiaryMessage, useDiaryMessages, useStartDiaryEntry } from '../lib/data/hooks';
import * as diarioApi from '../lib/data/diarioApi';
import { ChatBubble } from '../components/diary/ChatBubble';
import { Button } from '../components/forms/Button';
import { IconButton } from '../components/forms/IconButton';

const SEED_GREETING = '¿Qué tal ha ido tu día? Cuéntame lo que quieras, con calma.';

/** Best-effort file extension from a MediaRecorder mime type, e.g. 'audio/webm;codecs=opus' -> 'webm'. */
function extFromMimeType(mime: string): string {
  return mime.split('/')[1]?.split(';')[0] || 'webm';
}

export function DiaryConversationScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const startEntry = useStartDiaryEntry();
  const [entryId, setEntryId] = useState<string | null>(null);
  const { data: messages = [] } = useDiaryMessages(entryId ?? undefined);
  const addMessage = useAddDiaryMessage(entryId ?? '');

  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (entryId || startEntry.isPending) return;
    startEntry.mutate(undefined, {
      onSuccess: async (entry) => {
        setEntryId(entry.id);
        await diarioApi.addMessage({ entryId: entry.id, role: 'assistant', contentType: 'text', textContent: SEED_GREETING });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, recording]);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const requestCompanionReply = async (id: string) => {
    setBusy(true);
    try {
      const reply = await diarioApi.getCompanionReply(id);
      await addMessage.mutateAsync({ role: 'assistant', contentType: 'text', textContent: reply });
    } catch {
      await addMessage.mutateAsync({
        role: 'assistant',
        contentType: 'text',
        textContent: 'Perdón, tuve un problema para responder recién. ¿Podés repetir lo último?',
      });
    } finally {
      setBusy(false);
    }
  };

  const sendText = async () => {
    const t = text.trim();
    if (!t || !entryId) return;
    setText('');
    await addMessage.mutateAsync({ role: 'user', contentType: 'text', textContent: t });
    await requestCompanionReply(entryId);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const stopStream = () => {
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
    setSeconds(0);
  };

  const cancelRecording = () => {
    mediaRecorderRef.current?.stop();
    stopStream();
  };

  const finishRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || !entryId || !user) return;
    const mimeType = recorder.mimeType;
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      await handleAudioBlob(blob, extFromMimeType(mimeType));
    };
    recorder.stop();
    stopStream();
  };

  const handleAudioBlob = async (blob: Blob, ext: string) => {
    if (!entryId || !user) return;
    setBusy(true);
    try {
      const path = await diarioApi.uploadAudio(user.id, entryId, blob, ext);
      const transcript = await diarioApi.transcribeAudio(path);
      await addMessage.mutateAsync({ role: 'user', contentType: 'audio', textContent: transcript, audioStoragePath: path });
      await requestCompanionReply(entryId);
    } finally {
      setBusy(false);
    }
  };

  const onAttachFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const ext = file.name.includes('.') ? file.name.split('.').pop()! : 'm4a';
    await handleAudioBlob(file, ext);
  };

  const canFinish = messages.some((m) => m.role === 'user') && !finalizing && !busy;

  const onFinish = async () => {
    if (!entryId || !user) return;
    setFinalizing(true);
    try {
      const result = await diarioApi.computeFinalization(entryId);
      const entry = await diarioApi.persistFinalization(entryId, result);
      await diarioApi.reconcileDayMood(user.id, entry.entryDate);
      navigate(`/diario/${entryId}`, { replace: true });
    } finally {
      setFinalizing(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <IconButton label="Volver" onClick={() => navigate('/diario')} icon={<X size={18} />} />
        <div style={{ font: 'var(--text-title-lg)', color: 'var(--color-text-primary)' }}>Nueva entrada</div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {messages.map((m) => (
          <ChatBubble key={m.id} msg={m} />
        ))}
        {busy && (
          <div style={{ font: 'var(--text-caption)', color: 'var(--color-text-tertiary)' }}>El acompañante está escribiendo…</div>
        )}
      </div>

      <div style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {recording ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              background: 'var(--color-danger-subtle)',
              borderRadius: 'var(--radius-pill)',
              padding: '10px 14px',
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-danger)', flexShrink: 0 }} />
            <span style={{ font: 'var(--text-body-sm)', color: 'var(--coral-700)' }}>
              Grabando… {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
            </span>
            <div style={{ flex: 1 }} />
            <IconButton label="Cancelar grabación" size="sm" onClick={cancelRecording} icon={<X size={15} />} />
            <IconButton label="Terminar y enviar audio" size="sm" variant="brand" onClick={finishRecording} icon={<Check size={15} />} />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 'var(--space-2)',
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-xl)',
              padding: '8px 10px',
            }}
          >
            <button
              onClick={() => fileInputRef.current?.click()}
              aria-label="Adjuntar audio"
              disabled={busy || !entryId}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: 'none',
                background: 'var(--color-bg-surface-2)',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Paperclip size={16} />
            </button>
            <input ref={fileInputRef} type="file" accept="audio/*" onChange={onAttachFile} style={{ display: 'none' }} />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe cómo te sientes…"
              rows={1}
              style={{
                flex: 1,
                resize: 'none',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                font: 'var(--text-body-md)',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-primary)',
                maxHeight: 90,
                padding: '8px 4px',
              }}
            />
            {text.trim() ? (
              <button
                onClick={sendText}
                disabled={busy}
                aria-label="Enviar"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'var(--color-brand)',
                  color: 'var(--color-text-on-brand)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Send size={15} />
              </button>
            ) : (
              <button
                onClick={startRecording}
                disabled={busy || !entryId}
                aria-label="Grabar audio"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'var(--color-brand-subtle)',
                  color: 'var(--color-brand)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mic size={15} />
              </button>
            )}
          </div>
        )}

        <Button variant="primary" fullWidth disabled={!canFinish} onClick={onFinish}>
          {finalizing ? 'Guardando entrada…' : 'Finalizar entrada'}
        </Button>
      </div>
    </div>
  );
}
