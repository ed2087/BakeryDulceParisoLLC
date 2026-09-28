import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang, Localized } from './content';
import { load, save } from './storage';

/* ---------- Preferences: language, theme, favorites ---------- */

type Theme = 'light' | 'dark';

interface Prefs {
  lang: Lang;
  toggleLang: () => void;
  t: (value: Localized) => string;
  theme: Theme;
  toggleTheme: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const PrefsContext = createContext<Prefs | null>(null);
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

function readStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem('dp-theme');
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => load<Lang>('dp-lang', 'es'));
  const [explicitTheme, setExplicitTheme] = useState<Theme | null>(readStoredTheme);
  const [systemDark, setSystemDark] = useState(() => darkQuery().matches);
  const [favorites, setFavorites] = useState<string[]>(() => load<string[]>('dp-favs', []));
  const theme: Theme = explicitTheme ?? (systemDark ? 'dark' : 'light');

  useEffect(() => {
    const mq = darkQuery();
    const onChange = () => setSystemDark(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#14110F' : '#FAF6F0');
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    save('dp-lang', lang);
  }, [lang]);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setExplicitTheme(next);
    try { localStorage.setItem('dp-theme', next); } catch { /* ignore */ }
  }, [theme]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      save('dp-favs', next);
      return next;
    });
  }, []);

  const value = useMemo<Prefs>(
    () => ({
      lang,
      toggleLang: () => setLang((l) => (l === 'es' ? 'en' : 'es')),
      t: (v) => v[lang],
      theme,
      toggleTheme,
      favorites,
      toggleFavorite,
    }),
    [lang, theme, toggleTheme, favorites, toggleFavorite],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used inside PrefsProvider');
  return ctx;
}

/* ---------- Transient UI (search overlay) ---------- */

interface UIState { searchOpen: boolean; setSearchOpen: (v: boolean) => void }
const UIContext = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const value = useMemo(() => ({ searchOpen, setSearchOpen }), [searchOpen]);
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside UIProvider');
  return ctx;
}

/** A tiny "tap" on phones that support it (Android). Silent elsewhere. */
export const haptic = (ms = 8) => {
  try { navigator.vibrate?.(ms); } catch { /* ignore */ }
};
