import { brand } from './content';

type Hours = (typeof brand.hours)[number];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Current day/minute in the bakery's own timezone, regardless of the viewer's. */
function bakeryNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: brand.timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '0';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export function formatTime(hhmm: string, lang: 'es' | 'en') {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(2000, 0, 1, h, m);
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
    hour: 'numeric',
    minute: m ? '2-digit' : undefined,
  }).format(d);
}

export function getOpenStatus(now = new Date()) {
  const { day, minutes } = bakeryNow(now);
  const today: Hours | undefined = brand.hours.find((h) => h.day === day);
  if (today && minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { open: true as const, time: today.close, today: day };
  }
  // Closed: find next opening (later today or a following day).
  for (let i = 0; i < 7; i++) {
    const d = (day + i) % 7;
    const h = brand.hours.find((x) => x.day === d);
    if (!h) continue;
    if (i > 0 || minutes < toMinutes(h.open)) return { open: false as const, time: h.open, today: day };
  }
  return { open: false as const, time: null, today: day };
}

/** True when every day has identical hours (lets us say "Every day 8–9"). */
export const sameHoursEveryDay =
  brand.hours.length === 7 &&
  brand.hours.every((h) => h.open === brand.hours[0].open && h.close === brand.hours[0].close);

