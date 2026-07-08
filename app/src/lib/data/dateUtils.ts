export const WEEKDAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
export const WEEKDAY_NAMES_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const MONTH_NAMES_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
export const MONTH_NAMES_LONG = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const pad = (n: number) => String(n).padStart(2, '0');

/** YYYY-MM-DD in local time — matches a Postgres `date` column. */
export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseIsoDate(s: string): Date {
  const [y, m, day] = s.split('-').map(Number);
  return new Date(y, m - 1, day);
}

export function formatDDMM(d: Date): string {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
}

export function formatDDMMYYYY(d: Date): string {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function parseDDMMYYYY(str: string): Date | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec((str || '').trim());
  if (!m) return null;
  let [, d, mo, y] = m;
  if (y.length === 2) y = '20' + y;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Monday-first weekday index: 0=L 1=M 2=X 3=J 4=V 5=S 6=D */
export function mondayFirstWeekday(d: Date): number {
  return (d.getDay() + 6) % 7;
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function isFutureDay(d: Date, today: Date): boolean {
  return startOfDay(d).getTime() > startOfDay(today).getTime();
}

export function isPastDay(d: Date, today: Date): boolean {
  return startOfDay(d).getTime() < startOfDay(today).getTime();
}

export function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

/** e.g. "Mié, 2 Jul, 2026" */
export function formatLongEs(d: Date): string {
  return `${WEEKDAY_NAMES_SHORT[mondayFirstWeekday(d)]}, ${d.getDate()} ${MONTH_NAMES_SHORT[d.getMonth()]}, ${d.getFullYear()}`;
}
