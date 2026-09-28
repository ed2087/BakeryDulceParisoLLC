import { AnimatePresence, motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import { categories, getCategory, products, productsIn, ui } from '../lib/content';
import { usePrefs } from '../lib/app-state';
import { ProductCard } from '../components/ProductCard';
import { Img } from '../components/Img';
import { PageHeader } from './PageHeader';
import { categoryPath } from '../lib/seo';

export default function Menu() {
  const { category } = useParams();
  const { t } = usePrefs();
  const active = category ? getCategory(category) : undefined;
  const sections = active ? [active] : categories.filter((c) => productsIn(c.id).length > 0);

  return (
    <div className="pb-8">
      {active ? (
        <PageHeader eyebrow={t(ui.nav.menu)} title={active.name} subtitle={active.blurb} />
      ) : (
        <PageHeader eyebrow={`${products.length} ${t(ui.menu.items)}`} title={ui.menu.title} subtitle={ui.menu.subtitle} />
      )}

      {/* Sticky category chips */}
      <div className="glass sticky top-[calc(4rem+env(safe-area-inset-top))] z-30 !border-x-0 lg:top-20">
        <div className="no-scrollbar mx-auto flex max-w-[1440px] gap-2 overflow-x-auto px-5 py-3 lg:px-10">
          <Chip to="/menu" active={!active} label={t(ui.menu.all)} />
          {categories.map((c) => (
            <Chip key={c.id} to={categoryPath(c.id)} active={active?.id === c.id} label={t(c.name)} image={c.image} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active?.id ?? 'all'}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[1440px] px-5 lg:px-10"
        >
          {sections.map((c) => (
            <section key={c.id} className="pt-10 lg:pt-16" aria-labelledby={`cat-${c.id}`}>
              <div className={active ? 'sr-only' : 'mb-6 flex items-end justify-between gap-4 border-b border-line pb-4'}>
                <div>
                  <h2 id={`cat-${c.id}`} className="font-display text-3xl lg:text-5xl">{t(c.name)}</h2>
                  <p className="mt-1 text-muted">{t(c.blurb)}</p>
                </div>
                <span className="text-sm text-muted tabular-nums">{productsIn(c.id).length}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
                {productsIn(c.id).map((p) => (
                  <ProductCard key={p.id} product={p} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw" />
                ))}
              </div>
            </section>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Chip({ to, active, label, image }: { to: string; active: boolean; label: string; image?: string }) {
  return (
    <Link
      to={to}
      preventScrollReset
      aria-current={active ? 'page' : undefined}
      className={`pressable flex h-10 shrink-0 items-center gap-2 rounded-full pr-4 text-sm font-medium transition-colors ${image ? 'pl-1' : 'pl-4'} ${
        active ? 'bg-fg text-bg' : 'bg-surface-2 text-fg hover:bg-line-strong'
      }`}
    >
      {image && <Img name={image} sizes="32px" className="h-8 w-8 rounded-full" />}
      {label}
    </Link>
  );
}
