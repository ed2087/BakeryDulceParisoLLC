import { Link } from 'react-router-dom';
import { brand, fullAddress, ui } from '../lib/content';
import { formatTime } from '../lib/hours';
import { usePrefs } from '../lib/app-state';
import { SocialLinks } from './Visit';

export function Footer() {
  const { t, lang } = usePrefs();
  const h = brand.hours[0];
  const nav = [
    { to: '/menu', label: ui.nav.menu },
    { to: '/pasteles', label: ui.nav.cakes },
    { to: '/visitanos', label: ui.nav.visit },
  ];
  return (
    <footer className="mt-24 border-t border-line pb-32 lg:mt-36 lg:pb-12">
      <div className="mx-auto max-w-[1440px] px-5 pt-14 lg:px-10 lg:pt-20">
        <p className="font-display text-[3.2rem] leading-none italic sm:text-7xl lg:text-[9rem]">{brand.name}</p>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="eyebrow mb-3 !text-muted">{t(ui.visit.findUs)}</p>
            <p className="leading-relaxed">{fullAddress}</p>
            <a href={`tel:${brand.phone}`} className="mt-1 block tabular-nums">{brand.phoneDisplay}</a>
          </div>
          <div>
            <p className="eyebrow mb-3 !text-muted">{t(ui.visit.hours)}</p>
            <p>{t(ui.visit.everyDay)}</p>
            <p className="tabular-nums">{formatTime(h.open, lang)} – {formatTime(h.close, lang)}</p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow mb-3 !text-muted">{brand.shortName}</p>
            <ul className="space-y-1.5">
              {nav.map((n) => (
                <li key={n.to}><Link to={n.to} className="hover:text-accent">{t(n.label)}</Link></li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow mb-3 !text-muted">Social</p>
            <SocialLinks />
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-[0.8rem] text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {brand.legalName}. {t(ui.footer.rights)}</p>
          <p>{t(ui.footer.prototype)}</p>
        </div>
      </div>
    </footer>
  );
}
