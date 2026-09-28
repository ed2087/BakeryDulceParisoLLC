import { AnimatePresence, motion } from 'motion/react';
import { CakeSlice, Croissant, House, MapPin, Moon, Phone, Search, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { brand, ui } from '../lib/content';
import { haptic, usePrefs, useUI } from '../lib/app-state';

const links = [
  { to: '/', label: ui.nav.home, icon: House, end: true },
  { to: '/menu', label: ui.nav.menu, icon: Croissant },
  { to: '/pasteles', label: ui.nav.cakes, icon: CakeSlice },
  { to: '/visitanos', label: ui.nav.visit, icon: MapPin },
];

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

export function Wordmark({ className = '' }: { className?: string }) {
  const { t } = usePrefs();
  return (
    <Link to="/" className={`group flex flex-col leading-none ${className}`} aria-label={brand.name}>
      <span className="font-display text-[1.35rem] italic tracking-tight">{brand.name}</span>
      <span className="mt-0.5 text-[0.58rem] font-semibold tracking-[0.28em] uppercase opacity-70">{t(brand.kicker)}</span>
    </Link>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="pressable grid h-10 w-10 place-items-center rounded-full hover:bg-[color-mix(in_srgb,currentColor_10%,transparent)]">
      {children}
    </button>
  );
}

export function Header() {
  const { t, lang, toggleLang, theme, toggleTheme } = usePrefs();
  const { setSearchOpen } = useUI();
  const { pathname } = useLocation();
  const scrolled = useScrolled();
  const overHero = pathname === '/' && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,color,border-color,backdrop-filter] duration-500 ${
        overHero ? 'border-b border-transparent text-white' : 'glass !border-x-0 !border-t-0 text-fg'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-5 lg:h-20 lg:px-10">
        <Wordmark />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.slice(1).map((l) => (
            <NavLink key={l.to} to={l.to} className="relative rounded-full px-4 py-2 text-[0.92rem] font-medium">
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span layoutId="desktop-nav-pill" className="absolute inset-0 rounded-full bg-[color-mix(in_srgb,currentColor_10%,transparent)]" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                  )}
                  <span className="relative">{t(l.label)}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <IconButton label={t(ui.nav.search)} onClick={() => setSearchOpen(true)}>
            <Search size={19} />
          </IconButton>
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t(ui.nav.language)}
            className="pressable h-10 rounded-full px-2.5 text-[0.78rem] font-semibold tracking-wider hover:bg-[color-mix(in_srgb,currentColor_10%,transparent)]"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          <IconButton label={t(ui.nav.theme)} onClick={() => { haptic(); toggleTheme(); }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
                {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
              </motion.span>
            </AnimatePresence>
          </IconButton>
          <a
            href={`tel:${brand.phone}`}
            className={`pressable ml-2 hidden h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold tabular-nums lg:inline-flex ${overHero ? 'bg-white text-black' : 'bg-fg text-bg'}`}
          >
            <Phone size={16} />
            {brand.phoneDisplay}
          </a>
        </div>
      </div>
    </header>
  );
}

/** Floating iOS-style tab bar, phones and tablets only. */
export function MobileNav() {
  const { t } = usePrefs();

  return (
    <nav
      aria-label="Tabs"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 lg:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="glass flex w-full max-w-md items-stretch justify-between rounded-[26px] p-1.5 shadow-lift">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} onClick={() => haptic(6)} className="relative flex-1">
            {({ isActive }) => (
              <span className={`relative flex h-14 flex-col items-center justify-center gap-1 rounded-[20px] transition-colors duration-300 ${isActive ? 'text-fg' : 'text-muted'}`}>
                {isActive && (
                  <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-[20px] bg-[color-mix(in_srgb,var(--fg)_8%,transparent)]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
                )}
                <span className="relative">
                  <l.icon size={21} strokeWidth={isActive ? 2.1 : 1.7} />
                </span>
                <span className="relative text-[0.66rem] font-medium">{t(l.label)}</span>
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
