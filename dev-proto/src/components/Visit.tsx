import { Clock, MapPin, Navigation, Phone, ParkingSquare, Accessibility, Trees, CreditCard, Languages } from 'lucide-react';
import { brand, directionsUrl, fullAddress, home, ui } from '../lib/content';
import { formatTime, getOpenStatus, sameHoursEveryDay } from '../lib/hours';
import { usePrefs } from '../lib/app-state';
import { OpenStatus, buttonClass, socialIcon } from './ui';

const amenityIcon = { parking: ParkingSquare, accessible: Accessibility, outdoor: Trees, card: CreditCard, language: Languages } as const;

/** Free OpenStreetMap embed, tinted to match the theme, with our own pin on top. */
export function MapCard({ className = '' }: { className?: string }) {
  const { lat, lng } = brand.address;
  const d = 0.009;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d * 1.6},${lat - d},${lng + d * 1.6},${lat + d}&layer=mapnik`;
  return (
    <a
      href={directionsUrl}
      target="_blank"
      rel="noreferrer"
      className={`group relative block overflow-hidden rounded-[28px] bg-surface-2 shadow-soft ${className}`}
      aria-label={`${fullAddress} — Google Maps`}
    >
      <iframe
        title="Map"
        src={src}
        loading="lazy"
        tabIndex={-1}
        className="pointer-events-none absolute inset-0 h-[calc(100%+40px)] w-full scale-[1.02] border-0"
        style={{ filter: 'var(--map-filter)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--bg)_55%,transparent)] to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
        <span className="absolute top-full left-1/2 h-3 w-8 -translate-x-1/2 -translate-y-1 rounded-[50%] bg-black/25 blur-[3px]" />
        <span className="relative grid h-12 w-12 place-items-center rounded-full rounded-br-none bg-accent text-accent-fg shadow-lift transition-transform duration-500 ease-out-soft [transform:rotate(45deg)] group-hover:[transform:rotate(45deg)_scale(1.08)]">
          <MapPin size={20} className="-rotate-45" />
        </span>
      </div>
      <div className="glass absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-semibold">{brand.address.street}</p>
          <p className="text-sm text-muted">{brand.address.city}, {brand.address.state} {brand.address.zip}</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-fg text-bg">
          <Navigation size={17} />
        </span>
      </div>
    </a>
  );
}

export function HoursList() {
  const { t, lang } = usePrefs();
  const today = getOpenStatus().today;
  const days = ui.days[lang];
  if (sameHoursEveryDay) {
    const h = brand.hours[0];
    return (
      <p className="flex items-baseline justify-between gap-4 text-[1.05rem]">
        <span>{t(ui.visit.everyDay)}</span>
        <span className="font-semibold tabular-nums">{formatTime(h.open, lang)} – {formatTime(h.close, lang)}</span>
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {[1, 2, 3, 4, 5, 6, 0].map((d) => {
        const h = brand.hours.find((x) => x.day === d);
        return (
          <li key={d} className={`flex justify-between ${d === today ? 'font-semibold text-fg' : 'text-muted'}`}>
            <span>{days[d]}</span>
            <span className="tabular-nums">{h ? `${formatTime(h.open, lang)} – ${formatTime(h.close, lang)}` : '—'}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex gap-2 ${className}`}>
      {brand.social.map((s) => {
        const Icon = socialIcon[s.type as keyof typeof socialIcon];
        return (
          <li key={s.type}>
            <a href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} className="pressable grid h-11 w-11 place-items-center rounded-full border border-line-strong hover:bg-surface-2">
              <Icon size={18} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function VisitSection({ heading = true, id }: { heading?: boolean; id?: string }) {
  const { t } = usePrefs();
  return (
    <section id={id} className="mx-auto max-w-[1440px] px-5 pt-20 lg:px-10 lg:pt-36">
      {heading && (
        <div className="mb-8 lg:mb-12">
          <p className="eyebrow mb-3">{t(home.visit.eyebrow)}</p>
          <h2 className="font-display text-[2.3rem] leading-[1.02] font-normal text-balance sm:text-5xl lg:text-6xl">
            {t(home.visit.title)}
          </h2>
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
        <MapCard className="aspect-[4/3.4] lg:col-span-7 lg:aspect-auto lg:min-h-[520px]" />
        <div className="flex flex-col gap-5 rounded-[28px] bg-surface p-6 shadow-soft sm:p-8 lg:col-span-5">
          <div>
            <h3 className="font-display text-3xl">{brand.name}</h3>
            <p className="mt-1 text-muted">{fullAddress}</p>
            <OpenStatus className="mt-4" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <a href={directionsUrl} target="_blank" rel="noreferrer" className={`${buttonClass.primary} !px-4`}>
              <Navigation size={17} /> {t(ui.visit.directions)}
            </a>
            <a href={`tel:${brand.phone}`} className={`${buttonClass.ghost} !px-4`}>
              <Phone size={17} /> {t(ui.visit.call)}
            </a>
          </div>
          <div className="border-t border-line pt-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted"><Clock size={16} /> {t(ui.visit.hours)}</p>
            <HoursList />
          </div>
          <ul className="grid grid-cols-1 gap-2.5 border-t border-line pt-5 text-[0.95rem] sm:grid-cols-2">
            {brand.amenities.map((a) => {
              const Icon = amenityIcon[a.icon as keyof typeof amenityIcon];
              return (
                <li key={a.icon} className="flex items-center gap-2.5 text-muted">
                  <Icon size={17} className="shrink-0 text-fg" /> {t(a.label)}
                </li>
              );
            })}
          </ul>
          <div className="mt-auto flex items-center justify-between border-t border-line pt-5">
            <a href={`tel:${brand.phone}`} className="font-semibold tabular-nums">{brand.phoneDisplay}</a>
            <SocialLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
