export function timeToMinutes(t: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec((t || '').trim());
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

/** Orders items by how close their `time` is to `now`, wrapping to the next day; unparseable times ("Todo el día") sort last. */
export function sortByProximityToNow<T>(items: T[], getTime: (item: T) => string, now: Date): T[] {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return [...items].sort((a, b) => {
    const ta = timeToMinutes(getTime(a));
    const tb = timeToMinutes(getTime(b));
    if (ta === null && tb === null) return 0;
    if (ta === null) return 1;
    if (tb === null) return -1;
    const da = (ta - nowMin + 1440) % 1440;
    const db = (tb - nowMin + 1440) % 1440;
    return da - db;
  });
}
