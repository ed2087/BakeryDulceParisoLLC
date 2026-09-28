import { motion } from 'motion/react';
import { ArrowUpRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice, ui, type Product } from '../lib/content';
import { haptic, usePrefs } from '../lib/app-state';
import { productPath } from '../lib/seo';
import { Img } from './Img';
import { Badge } from './ui';

interface Props {
  product: Product;
  variant?: 'overlay' | 'stacked';
  sizes?: string;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, variant = 'stacked', sizes = '(min-width: 1024px) 30vw, 80vw', className = '', priority }: Props) {
  const { t, favorites, toggleFavorite } = usePrefs();
  const fav = favorites.includes(product.id);
  const name = t(product.name);

  const heart = (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={() => { haptic(); toggleFavorite(product.id); }}
      aria-pressed={fav}
      aria-label={`${t(ui.product.favorite)} ${name}`}
      className="glass grid h-10 w-10 place-items-center rounded-full"
    >
      <motion.span key={String(fav)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
        <Heart size={18} className={fav ? 'fill-accent text-accent' : 'text-fg'} />
      </motion.span>
    </motion.button>
  );

  const arrow = (
    <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2 text-fg transition-colors duration-300 group-hover:bg-fg group-hover:text-bg">
      <ArrowUpRight size={18} />
    </span>
  );

  const link = (
    <Link
      to={productPath(product.id)}
      className="absolute inset-0 z-[1] rounded-[inherit]"
      aria-label={name}
    />
  );

  if (variant === 'overlay') {
    return (
      <article className={`group relative overflow-hidden rounded-[28px] bg-surface-2 shadow-soft ${className}`}>
        {link}
        <div className="absolute inset-0">
          <Img name={product.image} sizes={sizes} priority={priority} className="h-full w-full transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.03]" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute top-3 right-3 left-3 z-[2] flex items-start justify-between">
          <div className="flex gap-1.5">{product.badges.slice(0, 1).map((b) => <Badge key={b} type={b} onImage />)}</div>
          {heart}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-3 p-5 text-white">
          <div className="min-w-0">
            <h3 className="font-display text-[1.6rem] leading-tight">{name}</h3>
            <p className="mt-1 text-sm text-white/80">{formatPrice(product.price)}</p>
          </div>
          <span aria-hidden className="glass grid h-10 w-10 shrink-0 place-items-center rounded-full text-fg"><ArrowUpRight size={18} /></span>
        </div>
      </article>
    );
  }

  return (
    <article className={`group relative ${className}`}>
      <div className="relative overflow-hidden rounded-[24px] bg-surface-2 shadow-soft transition-shadow duration-500 group-hover:shadow-lift">
        {link}
        <div className="aspect-[4/5]">
          <Img name={product.image} sizes={sizes} priority={priority} className="h-full w-full transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.03]" />
        </div>
        <div className="absolute top-3 right-3 left-3 z-[2] flex items-start justify-between">
          <div className="flex gap-1.5">{product.badges.slice(0, 1).map((b) => <Badge key={b} type={b} onImage />)}</div>
          {heart}
        </div>
      </div>
      <div className="relative mt-3 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-tight">{name}</h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted">{t(product.description)}</p>
          <p className="mt-1.5 text-[0.95rem] font-semibold tabular-nums">{formatPrice(product.price)}</p>
        </div>
        {arrow}
      </div>
    </article>
  );
}
