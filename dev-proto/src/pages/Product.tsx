import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Heart, Navigation, Phone, Store } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { brand, directionsUrl, formatPrice, getCategory, getProduct, productsIn, ui } from '../lib/content';
import { categoryPath } from '../lib/seo';
import { haptic, usePrefs } from '../lib/app-state';
import { Img } from '../components/Img';
import { ProductCard } from '../components/ProductCard';
import { Badge, OpenStatus, buttonClass } from '../components/ui';
import NotFound from './NotFound';

const ease = [0.22, 1, 0.36, 1] as const;

/** A dedicated, indexable page per product. */
export default function Product() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { t, favorites, toggleFavorite } = usePrefs();
  const product = getProduct(id);

  if (!product) return <NotFound />;
  const category = getCategory(product.category);
  const related = productsIn(product.category).filter((p) => p.id !== product.id);
  const fav = favorites.includes(product.id);

  const back = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate(category ? categoryPath(category.id) : '/menu'));

  return (
    <article className="lg:pt-20">
      <div className="mx-auto max-w-[1440px] lg:grid lg:grid-cols-2 lg:gap-14 lg:px-10 lg:pt-10">
        {/* Photo: full-bleed on phones, sticky on desktop */}
        <div className="relative lg:sticky lg:top-28 lg:self-start">
          <motion.div
            initial={{ scale: 1.06, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease }}
            className="grain relative overflow-hidden lg:rounded-[36px] lg:shadow-lift"
          >
            <Img name={product.image} priority sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-auto lg:h-[calc(100svh-10rem)] lg:max-h-[860px]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/45 to-transparent lg:hidden" />
          </motion.div>
          <div className="absolute inset-x-0 top-0 z-10 flex justify-between px-4 lg:hidden" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 4.5rem)' }}>
            <motion.button whileTap={{ scale: 0.88 }} type="button" onClick={back} aria-label={t(ui.product.back)} className="glass grid h-11 w-11 place-items-center rounded-full">
              <ArrowLeft size={20} />
            </motion.button>
            <FavButton fav={fav} onClick={() => toggleFavorite(product.id)} label={t(ui.product.favorite)} />
          </div>
        </div>

        <motion.div
          className="relative -mt-8 rounded-t-[32px] bg-bg px-6 pt-8 lg:mt-0 lg:rounded-none lg:px-0 lg:pt-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.7, ease }}
        >
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted">
            <Link to="/menu" className="hover:text-fg">{t(ui.nav.menu)}</Link>
            {category && (
              <>
                <ChevronRight size={14} />
                <Link to={categoryPath(category.id)} className="eyebrow hover:opacity-80">{t(category.name)}</Link>
              </>
            )}
          </nav>

          <div className="mt-4 flex items-start justify-between gap-4">
            <h1 className="font-display text-[2.7rem] leading-[1] font-normal lg:text-7xl">{t(product.name)}</h1>
            <div className="hidden lg:block"><FavButton fav={fav} onClick={() => toggleFavorite(product.id)} label={t(ui.product.favorite)} solid /></div>
          </div>
          <p className="mt-3 font-display text-3xl tabular-nums">{formatPrice(product.price)}</p>
          {product.badges.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">{product.badges.map((b) => <Badge key={b} type={b} />)}</div>
          )}
          <p className="mt-6 max-w-lg text-[1.1rem] leading-relaxed text-muted lg:text-xl">{t(product.description)}</p>

          <div className="mt-8 flex max-w-lg flex-col gap-2 rounded-2xl bg-surface p-4 text-[0.95rem] shadow-soft">
            <span className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-ok" /> {t(ui.product.availability)}</span>
            <span className="flex items-center gap-2.5 text-muted"><Store size={15} /> {t(ui.product.inStore)}</span>
            <OpenStatus className="text-muted" />
          </div>

          <div className="mt-6 grid max-w-lg grid-cols-[1fr_auto] gap-3">
            <a href={`tel:${brand.phone}`} className={`${buttonClass.primary} h-14`}>
              <Phone size={18} /> {t(ui.product.call)}
            </a>
            <a href={directionsUrl} target="_blank" rel="noreferrer" className={`${buttonClass.ghost} h-14 !px-5`} aria-label={t(ui.product.directions)}>
              <Navigation size={18} /> <span className="hidden sm:inline">{t(ui.product.directions)}</span>
            </a>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-5 pt-16 lg:px-10 lg:pt-28 lg:pb-0">
          <h2 className="mb-6 font-display text-3xl lg:text-5xl">{t(ui.product.related)}</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} sizes="(min-width: 1024px) 22vw, 46vw" />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function FavButton({ fav, onClick, label, solid }: { fav: boolean; onClick: () => void; label: string; solid?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      type="button"
      onClick={() => { haptic(); onClick(); }}
      aria-pressed={fav}
      aria-label={label}
      className={`grid h-11 w-11 place-items-center rounded-full ${solid ? 'bg-surface-2 hover:bg-line-strong' : 'glass'}`}
    >
      <motion.span key={String(fav)} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}>
        <Heart size={19} className={fav ? 'fill-accent text-accent' : ''} />
      </motion.span>
    </motion.button>
  );
}
