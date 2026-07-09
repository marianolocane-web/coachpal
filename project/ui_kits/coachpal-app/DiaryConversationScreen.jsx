function DiaryConversationScreen({ onBack, onFinish }) {
  const { useState, useRef, useEffect } = React;
  const { Button } = window.CoachPalDesignSystem_c83b94;

  const [messages, setMessages] = useState([
    { id: 'seed', role: 'ai', text: '¿Qué tal ha ido tu día? Cuéntame lo que quieras, con calma.' },
  ]);
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, recording]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const aiReply = () => {
    const replies = [
      'Gracias por contarlo. ¿Cómo te ha hecho sentir eso?',
      'Tiene sentido. ¿Qué crees que te ayudaría mañana?',
      'Te escucho. Eso que dices dice mucho de cómo estás cuidándote.',
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    setTimeout(() => {
      setMessages((ms) => [...ms, { id: Date.now() + '-ai', role: 'ai', text: reply }]);
    }, 700);
  };

  const sendText = () => {
    const t = text.trim();
    if (!t) return;
    setMessages((ms) => [...ms, { id: Date.now(), role: 'user', text: t }]);
    setText('');
    aiReply();
  };

  const startRecording = () => {
    setRecording(true);
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const cancelRecording = () => {
    clearInterval(timerRef.current);
    setRecording(false);
    setSeconds(0);
  };

  const finishRecording = () => {
    clearInterval(timerRef.current);
    setRecording(false);
    const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
    const ss = String(seconds % 60).padStart(2, '0');
    setMessages((ms) => [...ms, { id: Date.now(), role: 'user', kind: 'audio', duration: `${mm}:${ss}` }]);
    setSeconds(0);
    aiReply();
  };

  const onAttachFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setMessages((ms) => [...ms, { id: Date.now(), role: 'user', kind: 'audio', duration: 'archivo', filename: file.name }]);
    e.target.value = '';
    aiReply();
  };

  const canFinish = messages.some((m) => m.role === 'user');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-surface)', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>←</button>
        <div style={{ font: 'var(--text-title-lg)', color: 'var(--color-text-primary)' }}>Nueva entrada</div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {messages.map((m) => (
          <ChatBubble key={m.id} msg={m} />
        ))}
      </div>

      <div style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {recording ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)', background: 'var(--color-danger-subtle)',
            borderRadius: 'var(--radius-pill)', padding: '10px 14px',
          }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%', background: 'var(--color-danger)', flexShrink: 0,
              animation: 'diaryPulse 1s ease-in-out infinite',
            }} />
            <span style={{ font: 'var(--text-body-sm)', color: 'var(--coral-700)' }}>Grabando… {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</span>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 3, height: 18 }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={i} style={{ width: 2, borderRadius: 1, background: 'var(--coral-500)', height: 6 + ((i * 37) % 12), opacity: 0.7 }} />
              ))}
            </div>
            <button onClick={cancelRecording} aria-label="Cancelar grabación" style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--color-bg-surface)', color: 'var(--color-text-secondary)', cursor: 'pointer', flexShrink: 0 }}>✕</button>
            <button onClick={finishRecording} aria-label="Detener grabación" style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--color-danger)', color: 'var(--sand-0)', cursor: 'pointer', flexShrink: 0 }}>■</button>
          </div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)', background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-xl)', padding: '8px 10px',
          }}>
            <button onClick={() => fileInputRef.current && fileInputRef.current.click()} aria-label="Adjuntar audio" style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'var(--color-bg-surface-2)', color: 'var(--color-text-secondary)', cursor: 'pointer', flexShrink: 0, fontSize: 15 }}>⇧</button>
            <input ref={fileInputRef} type="file" accept="audio/*" onChange={onAttachFile} style={{ display: 'none' }} />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe cómo te sientes…"
              rows={1}
              style={{
                flex: 1, resize: 'none', border: 'none', outline: 'none', background: 'transparent',
                font: 'var(--text-body-md)', fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)',
                maxHeight: 90, padding: '8px 4px',
              }}
            />
            {text.trim() ? (
              <button onClick={sendText} aria-label="Enviar" style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'var(--color-brand)', color: 'var(--color-text-on-brand)', cursor: 'pointer', flexShrink: 0, fontSize: 15 }}>➤</button>
            ) : (
              <button onClick={startRecording} aria-label="Grabar audio" style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'var(--color-brand-subtle)', color: 'var(--color-brand)', cursor: 'pointer', flexShrink: 0, fontSize: 15 }}>●</button>
            )}
          </div>
        )}

        <Button variant="primary" fullWidth disabled={!canFinish} onClick={() => onFinish(messages)}>Finalizar entrada</Button>
      </div>

      <style>{`@keyframes diaryPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.75); } }`}</style>
    </div>
  );
}

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && (
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-brand)', color: 'var(--color-text-on-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: 'var(--text-label-sm)', marginRight: 8, flexShrink: 0 }}>IA</div>
      )}
      <div style={{
        maxWidth: '75%', padding: '10px 14px', borderRadius: 'var(--radius-lg)',
        borderBottomRightRadius: isUser ? 4 : 'var(--radius-lg)',
        borderBottomLeftRadius: isUser ? 'var(--radius-lg)' : 4,
        background: isUser ? 'var(--color-brand)' : 'var(--color-bg-surface-2)',
        color: isUser ? 'var(--color-text-on-brand)' : 'var(--color-text-primary)',
        font: 'var(--text-body-md)',
      }}>
        {msg.kind === 'audio' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>▶</span>
            <span>{msg.filename ? `Nota adjunta · ${msg.filename}` : `Nota de voz · ${msg.duration}`}</span>
          </div>
        ) : msg.text}
      </div>
    </div>
  );
}
