const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const RESPONSE_TYPES = [
  { value: 'boolean', label: 'Sí / No' },
  { value: 'number', label: 'Numérica' },
  { value: 'text', label: 'Texto libre' },
];
const DEFAULT_UNITS = [
  { value: 'kg', label: 'Kgs' },
  { value: 'reps', label: 'Repeticiones' },
  { value: 'min', label: 'Minutos' },
  { value: 'sleep', label: 'Sleep Score' },
];
const OTHER_UNIT_VALUE = '__other__';
const CHART_TYPES = ['Everest', 'Termómetro', 'Valor diario', 'Promedio semanal'];
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const WEEKDAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function parseDDMMYYYY(str) {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec((str || '').trim());
  if (!m) return null;
  let [, d, mo, y] = m;
  if (y.length === 2) y = '20' + y;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  return isNaN(date.getTime()) ? null : date;
}

function formatDDMMYYYY(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function DatePickerField({ label, value, onChange }) {
  const { useState, useRef, useEffect } = React;
  const { IconButton } = window.CoachPalDesignSystem_c83b94;
  const [open, setOpen] = useState(false);
  const parsed = parseDDMMYYYY(value) || new Date();
  const [viewYear, setViewYear] = useState(parsed.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed.getMonth());
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const openPicker = () => {
    const d = parseDDMMYYYY(value) || new Date();
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setOpen((o) => !o);
  };

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const selected = parseDDMMYYYY(value);
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const goMonth = (delta) => {
    let m = viewMonth + delta, y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m); setViewYear(y);
  };

  const pickDay = (d) => {
    const date = new Date(viewYear, viewMonth, d);
    onChange(formatDDMMYYYY(date));
    setOpen(false);
  };

  const yearOptions = [];
  for (let y = viewYear - 6; y <= viewYear + 6; y++) yearOptions.push(y);

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)' }}>
      {label && (
        <span style={{ font: 'var(--text-label-md)', color: 'var(--color-text-secondary)' }}>{label}</span>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '6px 8px 6px 14px',
        }}
      >
        <input
          type="text"
          placeholder="DD/MM/AA"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            font: 'var(--text-body-md)',
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-primary)',
            width: '100%',
          }}
        />
        <IconButton label="Elegir fecha" variant="ghost" size="sm" onClick={openPicker} icon={<span style={{ fontSize: 16 }}>📅</span>} />
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 6, zIndex: 60,
          background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
          padding: 'var(--space-4)', width: 280,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-3)' }}>
            <IconButton label="Mes anterior" variant="ghost" size="sm" onClick={() => goMonth(-1)} icon={<span style={{ fontSize: 14 }}>‹</span>} />
            <div style={{ flex: 1, textAlign: 'center', font: 'var(--text-label-md)', color: 'var(--color-text-primary)' }}>{MONTH_NAMES[viewMonth]}</div>
            <select
              value={viewYear}
              onChange={(e) => setViewYear(Number(e.target.value))}
              style={{
                font: 'var(--text-label-sm)', fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)',
                background: 'var(--color-bg-surface-2)', border: 'none', borderRadius: 'var(--radius-sm)',
                padding: '4px 6px', cursor: 'pointer',
              }}
            >
              {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <IconButton label="Mes siguiente" variant="ghost" size="sm" onClick={() => goMonth(1)} icon={<span style={{ fontSize: 14 }}>›</span>} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
            {WEEKDAY_LETTERS.map((d, i) => (
              <div key={i} style={{ textAlign: 'center', font: 'var(--text-caption)', color: 'var(--color-text-tertiary)' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {cells.map((d, i) => {
              const isSelected = d && selected && selected.getDate() === d && selected.getMonth() === viewMonth && selected.getFullYear() === viewYear;
              return (
                <button
                  key={i}
                  disabled={!d}
                  onClick={() => d && pickDay(d)}
                  style={{
                    aspectRatio: '1', border: 'none', borderRadius: '50%', cursor: d ? 'pointer' : 'default',
                    fontFamily: 'var(--font-body)', font: 'var(--text-label-sm)',
                    background: isSelected ? 'var(--color-brand)' : 'transparent',
                    color: !d ? 'transparent' : isSelected ? 'white' : 'var(--color-text-primary)',
                  }}
                >{d || ''}</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function UnitManagerModal({ units, onClose, onChange }) {
  const { useState } = React;
  const { Button, Input, IconButton } = window.CoachPalDesignSystem_c83b94;
  const [rows, setRows] = useState(units);
  const [editingIdx, setEditingIdx] = useState(null);
  const [draftLabel, setDraftLabel] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const startEdit = (i) => { setEditingIdx(i); setDraftLabel(rows[i].label); };
  const saveEdit = () => {
    if (!draftLabel.trim()) return;
    setRows((rs) => rs.map((r, i) => i === editingIdx ? { ...r, label: draftLabel.trim() } : r));
    setEditingIdx(null);
  };
  const remove = (i) => setRows((rs) => rs.filter((_, idx) => idx !== i));
  const addUnit = () => {
    if (!newLabel.trim()) return;
    const value = 'custom_' + Date.now();
    setRows((rs) => [...rs, { value, label: newLabel.trim() }]);
    setNewLabel('');
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--color-bg-app)', zIndex: 50, display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <IconButton label="Cerrar" variant="ghost" onClick={() => onClose(null)} icon={<span style={{ fontSize: 18 }}>✕</span>} />
        <div style={{ flex: 1, font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>Unidades de medida</div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {rows.map((u, i) => (
          <div key={u.value} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-3) var(--space-4)' }}>
            {editingIdx === i ? (
              <>
                <div style={{ flex: 1 }}><Input value={draftLabel} onChange={(e) => setDraftLabel(e.target.value)} /></div>
                <Button variant="primary" size="sm" onClick={saveEdit}>Guardar</Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingIdx(null)}>Cancelar</Button>
              </>
            ) : (
              <>
                <div style={{ flex: 1, font: 'var(--text-body-md)', color: 'var(--color-text-primary)' }}>{u.label}</div>
                <IconButton label="Editar" variant="ghost" size="sm" onClick={() => startEdit(i)} icon={<span style={{ fontSize: 15 }}>✎</span>} />
                <IconButton label="Eliminar" variant="ghost" size="sm" onClick={() => remove(i)} icon={<span style={{ fontSize: 15 }}>🗑</span>} />
              </>
            )}
          </div>
        ))}

        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
          <div style={{ flex: 1 }}><Input placeholder="Nueva unidad — ej. Vasos de agua" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} /></div>
          <Button variant="secondary" onClick={addUnit}>Añadir</Button>
        </div>
      </div>

      <div style={{ padding: 'var(--space-5)' }}>
        <Button variant="primary" fullWidth onClick={() => onChange(rows)}>Guardar cambios</Button>
      </div>
    </div>
  );
}

function AddEditHabitScreen({ habit, onBack, onSave, onDelete, onDuplicate }) {
  const { useState } = React;
  const { Input, Select, Checkbox, Button, IconButton, Badge } = window.CoachPalDesignSystem_c83b94;
  const isEdit = !!habit;

  const [name, setName] = useState(habit?.name || '');
  const [tagsText, setTagsText] = useState((habit?.tags || []).join(', '));
  const [description, setDescription] = useState(habit?.description || '');
  const [question, setQuestion] = useState(habit?.question || '¿Lo cumpliste hoy?');
  const [responseType, setResponseType] = useState(habit?.responseType || 'boolean');
  const [cueVisual, setCueVisual] = useState(habit?.cueVisual || '');
  const [negativeEmoji, setNegativeEmoji] = useState(habit?.identity?.negativeEmoji || '');
  const [negativeLabel, setNegativeLabel] = useState(habit?.identity?.negativeLabel || '');
  const [positiveEmoji, setPositiveEmoji] = useState(habit?.identity?.positiveEmoji || '');
  const [positiveLabel, setPositiveLabel] = useState(habit?.identity?.positiveLabel || '');
  const [contextTodo, setContextTodo] = useState(habit?.contextTodo || '');
  const [goalLabel, setGoalLabel] = useState(habit?.goalLabel || '');
  const [goalValue, setGoalValue] = useState(habit?.goalValue || '');
  const [units, setUnits] = useState(DEFAULT_UNITS);
  const [unit, setUnit] = useState(habit?.unit || 'min');
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [goalDate, setGoalDate] = useState(habit?.goalDate || '');
  const [charts, setCharts] = useState(habit?.charts || ['Valor diario']);
  const [days, setDays] = useState(habit?.days || [0, 1, 2, 3, 4]);
  const [time, setTime] = useState(habit?.time || '08:00');
  const [status, setStatus] = useState(habit?.status || 'Activo');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggleDay = (i) => setDays((ds) => ds.includes(i) ? ds.filter((d) => d !== i) : [...ds, i]);
  const toggleChart = (c) => setCharts((cs) => cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]);

  const buildHabit = () => ({
    ...habit,
    name, description, question, responseType, cueVisual, contextTodo,
    tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
    identity: (negativeEmoji || positiveEmoji) ? { negativeEmoji, negativeLabel, positiveEmoji, positiveLabel, votes: habit?.identity?.votes || 0 } : null,
    goalLabel, goalValue, unit, goalDate, charts, days, time, status,
  });

  const sectionTitle = (t) => (
    <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', margin: 'var(--space-2) 0' }}>{t}</div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <IconButton label="Cerrar" variant="ghost" onClick={onBack} icon={<span style={{ fontSize: 18 }}>✕</span>} />
        <div style={{ flex: 1, font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>{isEdit ? 'Editar hábito' : 'Nuevo hábito'}</div>
        {isEdit && <IconButton label="Duplicar" variant="ghost" onClick={() => onDuplicate?.(buildHabit())} icon={<span style={{ fontSize: 16 }}>⧉</span>} />}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Input label="Nombre" placeholder="Ej. Meditar 10 min" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Etiquetas (separadas por coma)" placeholder="Ej. Salud, Mañana" value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
        <Input label="Descripción" placeholder="¿En qué consiste este hábito?" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input label="Pregunta validadora" placeholder="Ej. ¿Dormiste 7hs?" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <Select label="Tipo de respuesta" value={responseType} onChange={setResponseType} options={RESPONSE_TYPES} />

        {sectionTitle('Fórmula James Clear')}
        <Input label="Elemento visual (señal)" placeholder="Ej. Ver el auto → 10 sentadillas" value={cueVisual} onChange={(e) => setCueVisual(e.target.value)} />
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1 }}><Input label="No elijo ser" placeholder="🤯" value={negativeEmoji} onChange={(e) => setNegativeEmoji(e.target.value)} /></div>
          <div style={{ flex: 2 }}><Input label="Descripción" placeholder="Burnout" value={negativeLabel} onChange={(e) => setNegativeLabel(e.target.value)} /></div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1 }}><Input label="Elijo ser" placeholder="🧘‍♂️" value={positiveEmoji} onChange={(e) => setPositiveEmoji(e.target.value)} /></div>
          <div style={{ flex: 2 }}><Input label="Descripción" placeholder="Paz mental" value={positiveLabel} onChange={(e) => setPositiveLabel(e.target.value)} /></div>
        </div>
        <Input label="Contexto (to-do previo)" placeholder="Ej. Dejar la ropa de deporte lista" value={contextTodo} onChange={(e) => setContextTodo(e.target.value)} />

        {sectionTitle('Meta')}
        <Input label="Objetivo" placeholder="Ej. Pesar" value={goalLabel} onChange={(e) => setGoalLabel(e.target.value)} />
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ flex: 1 }}><Input label="Valor" placeholder="90" value={goalValue} onChange={(e) => setGoalValue(e.target.value)} /></div>
          <div style={{ flex: 1 }}>
            <Select
              label="Unidad"
              value={unit}
              onChange={(v) => { if (v === OTHER_UNIT_VALUE) setUnitModalOpen(true); else setUnit(v); }}
              options={[...units, { value: OTHER_UNIT_VALUE, label: 'Otra unidad de medida…' }]}
            />
          </div>
        </div>
        <DatePickerField label="Fecha límite" value={goalDate} onChange={setGoalDate} />

        <div>
          <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-secondary)', marginBottom: 8 }}>Tipo de gráfico</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CHART_TYPES.map((c) => (
              <button key={c} onClick={() => toggleChart(c)} style={{
                padding: '6px 12px', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer',
                font: 'var(--text-label-sm)', fontFamily: 'var(--font-body)',
                background: charts.includes(c) ? 'var(--color-brand)' : 'var(--color-bg-surface-2)',
                color: charts.includes(c) ? 'white' : 'var(--color-text-secondary)',
              }}>{c}</button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-secondary)', marginBottom: 8 }}>Días</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {DAYS.map((d, i) => (
              <button key={i} onClick={() => toggleDay(i)} style={{
                width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', font: 'var(--text-label-md)',
                background: days.includes(i) ? 'var(--color-brand)' : 'var(--color-bg-surface-2)',
                color: days.includes(i) ? 'white' : 'var(--color-text-secondary)',
              }}>{d}</button>
            ))}
          </div>
        </div>

        <Input label="Horario" placeholder="08:00" value={time} onChange={(e) => setTime(e.target.value)} />
        <Select label="Estado" value={status} onChange={setStatus} options={[{ value: 'Activo', label: 'Activo' }, { value: 'Pausado', label: 'Pausado' }]} />

        {isEdit && (
          <div style={{ marginTop: 'var(--space-2)' }}>
            {!confirmDelete ? (
              <Button variant="danger" fullWidth onClick={() => setConfirmDelete(true)}>Eliminar hábito</Button>
            ) : (
              <div style={{ background: 'var(--color-danger-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ font: 'var(--text-body-sm)', color: 'var(--coral-700)' }}>¿Seguro que quieres eliminar este hábito? No se puede deshacer.</div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <Button variant="secondary" fullWidth onClick={() => setConfirmDelete(false)}>Cancelar</Button>
                  <Button variant="danger" fullWidth onClick={() => onDelete?.(habit)}>Sí, eliminar</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: 'var(--space-5)' }}>
        <Button variant="primary" fullWidth onClick={() => onSave(buildHabit())}>
          {isEdit ? 'Guardar cambios' : 'Crear hábito'}
        </Button>
      </div>

      {unitModalOpen && (
        <UnitManagerModal
          units={units}
          onClose={() => setUnitModalOpen(false)}
          onChange={(newUnits) => {
            setUnits(newUnits);
            if (!newUnits.some((u) => u.value === unit)) {
              setUnit(newUnits[newUnits.length - 1]?.value || '');
            }
            setUnitModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
