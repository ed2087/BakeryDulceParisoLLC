import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryPath, productPath } from '../lib/seo';
import { categories, formatPrice, getCategory, normalize, products, ui } from '../lib/content';
import { usePrefs, useUI } from '../lib/app-state';
import { Img } from './Img';

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUI();
  const { t, lang } = usePrefs();
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchOpen) return;
    setQ('');
    const id = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSearchOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [searchOpen, setSearchOpen]);

  const results = useMemo(() => {
    const needle = normalize(q);
    if (!needle) return [];
    return products.filter((p) => {
      const cat = getCategory(p.category);
      const hay = normalize([p.name.es, p.name.en, p.description.es, p.description.en, cat?.name.es, cat?.name.en].join(' '));
      return needle.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [q]);

  const open = (id: string) => {
    setSearchOpen(false);
    navigate(productPath(id));
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t(ui.nav.search)}
          className="fixed inset-0 z-[60] overflow-y-auto bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-2xl"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="mx-auto max-w-3xl px-5 pb-32"
            style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3">
              <label className="flex h-14 flex-1 items-center gap-3 rounded-2xl bg-surface px-4 shadow-soft">
                <Search size={20} className="text-muted" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t(ui.search.placeholder)}
                  className="h-full flex-1 bg-transparent text-[1.05rem] outline-none placeholder:text-muted"
                  enterKeyHint="search"
                  autoComplete="off"
                />
              </label>
              <button type="button" onClick={() => setSearchOpen(false)} className="pressable grid h-14 w-14 place-items-center rounded-2xl bg-surface shadow-soft" aria-label={t(ui.search.close)}>
                <X size={20} />
              </button>
            </div>

            {!q && (
              <div className="mt-10">
                <h2 className="font-display text-4xl sm:text-5xl">{t(ui.search.placeholder)}</h2>
                <p className="eyebrow mt-8 mb-3 !text-muted">{t(ui.search.suggestions)}</p>
                <div className="flex flex-wrap gap-2">
                  {ui.search.suggestionTerms[lang].map((s) => (
                    <button key={s} type="button" onClick={() => setQ(s)} className="pressable rounded-full border border-line-strong px-4 py-2 text-sm hover:bg-surface-2">
                      {s}
                    </button>
                  ))}
                </div>
                <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {categories.slice(0, 5).map((c) => (
                    <button key={c.id} type="button" onClick={() => { setSearchOpen(false); navigate(categoryPath(c.id)); }} className="pressable text-left">
                      <Img name={c.image} sizes="120px" className="aspect-square w-full rounded-2xl" />
                      <span className="mt-2 block text-sm font-medium">{t(c.name)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {q && (
              <ul className="mt-6 divide-y divide-line">
                {results.map((p, i) => (
                  <motion.li key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <button type="button" onClick={() => open(p.id)} className="pressable group flex w-full items-center gap-4 py-3 text-left">
                      <Img name={p.image} sizes="72px" className="h-[72px] w-[72px] shrink-0 rounded-2xl" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-xl">{t(p.name)}</span>
                        <span className="block truncate text-sm text-muted">{t(p.description)}</span>
                      </span>
                      <span className="font-semibold tabular-nums">{formatPrice(p.price)}</span>
                      <ArrowUpRight size={18} className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </motion.li>
                ))}
                {results.length === 0 && <li className="py-16 text-center text-muted">{t(ui.search.empty)}</li>}
              </ul>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
