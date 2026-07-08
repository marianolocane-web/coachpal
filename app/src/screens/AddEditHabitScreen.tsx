import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { X, Copy, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useCreateHabit, useCreateUnit, useDeleteHabit, useDeleteUnit, useHabit, useUnits, useUpdateHabit, useUpdateUnit } from '../lib/data/hooks';
import type { ChartType, HabitInput, ResponseType } from '../lib/data/types';
import { formatDDMMYYYY, parseDDMMYYYY, MONTH_NAMES_LONG, WEEKDAY_LETTERS } from '../lib/data/dateUtils';
import { Input } from '../components/forms/Input';
import { Select } from '../components/forms/Select';
import { Button } from '../components/forms/Button';
import { IconButton } from '../components/forms/IconButton';

const DAYS = WEEKDAY_LETTERS;
const RESPONSE_TYPES: { value: ResponseType; label: string }[] = [
  { value: 'boolean', label: 'Sí / No' },
  { value: 'number', label: 'Numérica' },
  { value: 'text', label: 'Texto libre' },
];
const OTHER_UNIT_VALUE = '__other__';
const CHART_TYPES: ChartType[] = ['Everest', 'Termómetro', 'Valor diario', 'Promedio semanal'];

function DatePickerField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const parsed = parseDDMMYYYY(value) || new Date();
  const [viewYear, setViewYear] = useState(parsed.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed.getMonth());
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
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
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const selected = parseDDMMYYYY(value);
  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const goMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  };

  const pickDay = (d: number) => {
    onChange(formatDDMMYYYY(new Date(viewYear, viewMonth, d)));
    setOpen(false);
  };

  const yearOptions: number[] = [];
  for (let y = viewYear - 6; y <= viewYear + 6; y++) yearOptions.push(y);

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)' }}>
      {label && <span style={{ font: 'var(--text-label-md)', color: 'var(--color-text-secondary)' }}>{label}</span>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', padding: '6px 8px 6px 14px' }}>
        <input
          type="text"
          placeholder="DD/MM/AA"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ border: 'none', outline: 'none', background: 'transparent', font: 'var(--text-body-md)', fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)', width: '100%' }}
        />
        <IconButton label="Elegir fecha" variant="ghost" size="sm" onClick={openPicker} icon={<CalendarIcon size={16} />} />
      </div>

      {open && (
        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6, zIndex: 60, background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', padding: 'var(--space-4)', width: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-3)' }}>
            <IconButton label="Mes anterior" variant="ghost" size="sm" onClick={() => goMonth(-1)} icon={<ChevronLeft size={14} />} />
            <div style={{ flex: 1, textAlign: 'center', font: 'var(--text-label-md)', color: 'var(--color-text-primary)' }}>{MONTH_NAMES_LONG[viewMonth]}</div>
            <select
              value={viewYear}
              onChange={(e) => setViewYear(Number(e.target.value))}
              style={{ font: 'var(--text-label-sm)', fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)', background: 'var(--color-bg-surface-2)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '4px 6px', cursor: 'pointer' }}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <IconButton label="Mes siguiente" variant="ghost" size="sm" onClick={() => goMonth(1)} icon={<ChevronRight size={14} />} />
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
                >
                  {d || ''}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function UnitManagerModal({ onClose }: { onClose: () => void }) {
  const { data: units = [] } = useUnits();
  const createUnit = useCreateUnit();
  const updateUnit = useUpdateUnit();
  const deleteUnit = useDeleteUnit();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftLabel, setDraftLabel] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const startEdit = (id: string, label: string) => {
    setEditingId(id);
    setDraftLabel(label);
  };
  const saveEdit = () => {
    if (!draftLabel.trim() || !editingId) return;
    updateUnit.mutate({ id: editingId, label: draftLabel.trim() });
    setEditingId(null);
  };
  const addUnit = () => {
    if (!newLabel.trim()) return;
    createUnit.mutate(newLabel.trim());
    setNewLabel('');
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--color-bg-app)', zIndex: 50, display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <IconButton label="Cerrar" variant="ghost" onClick={onClose} icon={<X size={18} />} />
        <div style={{ flex: 1, font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>Unidades de medida</div>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {units.map((u) => (
          <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-3) var(--space-4)' }}>
            {editingId === u.id ? (
              <>
                <div style={{ flex: 1 }}>
                  <Input value={draftLabel} onChange={(e) => setDraftLabel(e.target.value)} />
                </div>
                <Button variant="primary" size="sm" onClick={saveEdit}>Guardar</Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancelar</Button>
              </>
            ) : (
              <>
                <div style={{ flex: 1, font: 'var(--text-body-md)', color: 'var(--color-text-primary)' }}>{u.label}</div>
                <IconButton label="Editar" variant="ghost" size="sm" onClick={() => startEdit(u.id, u.label)} icon={<Pencil size={15} />} />
                <IconButton label="Eliminar" variant="ghost" size="sm" onClick={() => deleteUnit.mutate(u.id)} icon={<Trash2 size={15} />} />
              </>
            )}
          </div>
        ))}

        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
          <div style={{ flex: 1 }}>
            <Input placeholder="Nueva unidad — ej. Vasos de agua" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
          </div>
          <Button variant="secondary" onClick={addUnit}>Añadir</Button>
        </div>
      </div>

      <div style={{ padding: 'var(--space-5)' }}>
        <Button variant="primary" fullWidth onClick={onClose}>Listo</Button>
      </div>
    </div>
  );
}

function sectionTitle(t: string): ReactNode {
  return (
    <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', margin: 'var(--space-2) 0' }}>
      {t}
    </div>
  );
}

export function AddEditHabitScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isEdit = !!id;
  const { data: habit } = useHabit(id);
  const { data: units = [] } = useUnits();
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const deleteHabit = useDeleteHabit();

  const duplicateFrom = (location.state as { duplicateFrom?: HabitInput } | null)?.duplicateFrom;
  const seed = habit || duplicateFrom;

  const [name, setName] = useState(seed?.name ? (duplicateFrom ? `Copia de ${seed.name}` : seed.name) : '');
  const [tagsText, setTagsText] = useState((seed?.tags || []).join(', '));
  const [description, setDescription] = useState(seed?.description || '');
  const [question, setQuestion] = useState(seed?.question || '¿Lo cumpliste hoy?');
  const [responseType, setResponseType] = useState<ResponseType>(seed?.responseType || 'boolean');
  const [cueVisual, setCueVisual] = useState(seed?.cueVisual || '');
  const [negativeEmoji, setNegativeEmoji] = useState(seed?.identity?.negativeEmoji || '');
  const [negativeLabel, setNegativeLabel] = useState(seed?.identity?.negativeLabel || '');
  const [positiveEmoji, setPositiveEmoji] = useState(seed?.identity?.positiveEmoji || '');
  const [positiveLabel, setPositiveLabel] = useState(seed?.identity?.positiveLabel || '');
  const [contextTodo, setContextTodo] = useState(seed?.contextTodo || '');
  const [goalLabel, setGoalLabel] = useState(seed?.goalLabel || '');
  const [goalValue, setGoalValue] = useState(seed?.goalValue || '');
  const [unit, setUnit] = useState(seed?.unit || (units[0]?.value ?? ''));
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [goalDate, setGoalDate] = useState(seed?.goalDate || '');
  const [charts, setCharts] = useState<ChartType[]>(seed?.charts || ['Valor diario']);
  const [days, setDays] = useState<number[]>(seed?.days || [0, 1, 2, 3, 4]);
  const [timeOfDay, setTimeOfDay] = useState(seed?.timeOfDay || '08:00');
  const [status, setStatus] = useState(seed?.status || 'Activo');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const loadedIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (habit && habit.id !== loadedIdRef.current) {
      loadedIdRef.current = habit.id;
      setName(habit.name);
      setTagsText(habit.tags.join(', '));
      setDescription(habit.description);
      setQuestion(habit.question);
      setResponseType(habit.responseType);
      setCueVisual(habit.cueVisual);
      setNegativeEmoji(habit.identity?.negativeEmoji || '');
      setNegativeLabel(habit.identity?.negativeLabel || '');
      setPositiveEmoji(habit.identity?.positiveEmoji || '');
      setPositiveLabel(habit.identity?.positiveLabel || '');
      setContextTodo(habit.contextTodo);
      setGoalLabel(habit.goalLabel);
      setGoalValue(habit.goalValue);
      setUnit(habit.unit);
      setGoalDate(habit.goalDate);
      setCharts(habit.charts);
      setDays(habit.days);
      setTimeOfDay(habit.timeOfDay);
      setStatus(habit.status);
    }
  }, [habit]);

  useEffect(() => {
    if (!unit && units.length > 0 && !isEdit) setUnit(units[0].value);
  }, [units, unit, isEdit]);

  const toggleDay = (i: number) => setDays((ds) => (ds.includes(i) ? ds.filter((d) => d !== i) : [...ds, i]));
  const toggleChart = (c: ChartType) => setCharts((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]));

  const buildInput = (): HabitInput => ({
    name,
    description,
    question,
    responseType,
    cueVisual,
    contextTodo,
    tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
    identity: negativeEmoji || positiveEmoji ? { negativeEmoji, negativeLabel, positiveEmoji, positiveLabel } : null,
    goalLabel,
    goalValue,
    unit,
    goalDate,
    charts,
    days,
    timeOfDay,
    status: status as 'Activo' | 'Pausado',
    icon: habit?.icon,
    category: habit?.category,
    color: habit?.color,
    streakGoal: habit?.streakGoal,
  });

  const save = () => {
    if (isEdit && id) {
      updateHabit.mutate({ id, input: buildInput() }, { onSuccess: () => navigate(`/habits/${id}`) });
    } else {
      createHabit.mutate(buildInput(), { onSuccess: (created) => navigate(`/habits/${created.id}`) });
    }
  };

  const remove = () => {
    if (!id) return;
    deleteHabit.mutate(id, { onSuccess: () => navigate('/habits') });
  };

  const duplicate = () => {
    navigate('/habits/new', { state: { duplicateFrom: buildInput() } });
  };

  const unitOptions = [...units.map((u) => ({ value: u.value, label: u.label })), { value: OTHER_UNIT_VALUE, label: 'Otra unidad de medida…' }];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-app)', fontFamily: 'var(--font-body)' }}>
      <div style={{ padding: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <IconButton label="Cerrar" variant="ghost" onClick={() => navigate(-1)} icon={<X size={18} />} />
        <div style={{ flex: 1, font: 'var(--text-title-md)', color: 'var(--color-text-primary)' }}>{isEdit ? 'Editar hábito' : 'Nuevo hábito'}</div>
        {isEdit && <IconButton label="Duplicar" variant="ghost" onClick={duplicate} icon={<Copy size={16} />} />}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 var(--space-5) var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Input label="Nombre" placeholder="Ej. Meditar 10 min" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Etiquetas (separadas por coma)" placeholder="Ej. Salud, Mañana" value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
        <Input label="Descripción" placeholder="¿En qué consiste este hábito?" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input label="Pregunta validadora" placeholder="Ej. ¿Dormiste 7hs?" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <Select label="Tipo de respuesta" value={responseType} onChange={(v) => setResponseType(v as ResponseType)} options={RESPONSE_TYPES} />

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
              onChange={(v) => (v === OTHER_UNIT_VALUE ? setUnitModalOpen(true) : setUnit(v))}
              options={unitOptions}
            />
          </div>
        </div>
        <DatePickerField label="Fecha límite" value={goalDate} onChange={setGoalDate} />

        <div>
          <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-secondary)', marginBottom: 8 }}>Tipo de gráfico</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CHART_TYPES.map((c) => (
              <button
                key={c}
                onClick={() => toggleChart(c)}
                style={{
                  padding: '6px 12px', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer',
                  font: 'var(--text-label-sm)', fontFamily: 'var(--font-body)',
                  background: charts.includes(c) ? 'var(--color-brand)' : 'var(--color-bg-surface-2)',
                  color: charts.includes(c) ? 'white' : 'var(--color-text-secondary)',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ font: 'var(--text-label-md)', color: 'var(--color-text-secondary)', marginBottom: 8 }}>Días</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {DAYS.map((d, i) => (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                style={{
                  width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', font: 'var(--text-label-md)',
                  background: days.includes(i) ? 'var(--color-brand)' : 'var(--color-bg-surface-2)',
                  color: days.includes(i) ? 'white' : 'var(--color-text-secondary)',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <Input label="Horario" placeholder="08:00" value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)} />
        <Select label="Estado" value={status} onChange={(v) => setStatus(v as 'Activo' | 'Pausado')} options={[{ value: 'Activo', label: 'Activo' }, { value: 'Pausado', label: 'Pausado' }]} />

        {isEdit && (
          <div style={{ marginTop: 'var(--space-2)' }}>
            {!confirmDelete ? (
              <Button variant="danger" fullWidth onClick={() => setConfirmDelete(true)}>Eliminar hábito</Button>
            ) : (
              <div style={{ background: 'var(--color-danger-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ font: 'var(--text-body-sm)', color: 'var(--coral-700)' }}>¿Seguro que quieres eliminar este hábito? No se puede deshacer.</div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <Button variant="secondary" fullWidth onClick={() => setConfirmDelete(false)}>Cancelar</Button>
                  <Button variant="danger" fullWidth onClick={remove}>Sí, eliminar</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: 'var(--space-5)' }}>
        <Button variant="primary" fullWidth onClick={save} disabled={!name.trim()}>
          {isEdit ? 'Guardar cambios' : 'Crear hábito'}
        </Button>
      </div>

      {unitModalOpen && <UnitManagerModal onClose={() => setUnitModalOpen(false)} />}
    </div>
  );
}
