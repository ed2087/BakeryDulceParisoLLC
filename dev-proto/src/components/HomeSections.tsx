import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { brand, categories, featuredProducts, home, popularProducts } from '../lib/content';
import { categoryPath } from '../lib/seo';
import { usePrefs } from '../lib/app-state';
import { Img } from './Img';
import { ProductCard } from './ProductCard';
import { Reveal, SectionHeader, buttonClass } from './ui';

const container = 'mx-auto max-w-[1440px] px-5 lg:px-10';

function SeeAll({ to }: { to: string }) {
  const { t } = usePrefs();
  return (
    <Link to={to} className="pressable group mb-1 inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold">
      {t(home.fresh.link)}
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function FreshFromOven() {
  const [lead, ...rest] = featuredProducts;
  return (
    <section className="pt-14 lg:pt-28" aria-labelledby="fresh">
      <SectionHeader className={container} eyebrow={home.fresh.eyebrow} title={home.fresh.title} action={<SeeAll to="/menu" />} />

      {/* Phones/tablets: swipeable carousel */}
      <div className="no-scrollbar snap-x-mandatory mt-7 flex gap-4 overflow-x-auto px-5 pb-4 lg:hidden">
        {featuredProducts.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06} className="shrink-0 snap-start">
            <ProductCard product={p} variant="overlay" sizes="80vw" priority={i < 2} className="aspect-[4/5] w-[78vw] max-w-[380px]" />
          </Reveal>
        ))}
      </div>

      {/* Desktop: editorial asymmetric grid */}
      <div className={`${container} mt-12 hidden grid-cols-12 gap-6 lg:grid`}>
        {lead && (
          <Reveal className="col-span-6 row-span-2">
            <ProductCard product={lead} variant="overlay" sizes="45vw" className="h-full min-h-[640px]" />
          </Reveal>
        )}
        {rest.slice(0, 4).map((p, i) => (
          <Reveal key={p.id} delay={0.08 * (i + 1)} className="col-span-3">
            <ProductCard product={p} variant="overlay" sizes="22vw" className="aspect-[4/5]" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function CategoryScroller() {
  const { t } = usePrefs();
  return (
    <section className="pt-14 lg:pt-28">
      <SectionHeader className={container} eyebrow={home.categories.eyebrow} title={home.categories.title} />
      <div className="no-scrollbar snap-x-mandatory mt-7 flex gap-3 overflow-x-auto px-5 pb-2 lg:mx-auto lg:grid lg:max-w-[1440px] lg:grid-cols-9 lg:gap-4 lg:overflow-visible lg:px-10">
        {categories.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.04} className="shrink-0 snap-start">
            <Link to={categoryPath(c.id)} className="pressable group block w-[112px] lg:w-auto">
              <div className="overflow-hidden rounded-[22px] shadow-soft">
                <Img name={c.image} sizes="(min-width: 1024px) 11vw, 120px" className="aspect-[3/4] w-full transition-transform duration-700 ease-out-soft group-hover:scale-[1.05]" />
              </div>
              <p className="mt-2.5 text-center text-[0.9rem] font-medium">{t(c.name)}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Celebrations() {
  const { t } = usePrefs();
  const c = home.celebrations;
  return (
    <section className="pt-16 lg:pt-32">
      <div className={`${container} grid items-center gap-8 lg:grid-cols-12 lg:gap-12`}>
        <Reveal className="relative lg:col-span-7">
          <div className="grain relative overflow-hidden rounded-[32px] shadow-lift">
            <Img name={c.image} sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[4/5] w-full sm:aspect-[16/11]" />
          </div>
          <div className="absolute -bottom-6 -right-2 hidden w-[34%] overflow-hidden rounded-[24px] border-4 border-bg shadow-lift sm:block lg:-right-8">
            <Img name={c.gallery[0]} sizes="20vw" className="aspect-square w-full" />
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-5">
          <p className="eyebrow mb-3">{t(c.eyebrow)}</p>
          <h2 className="font-display text-[2.3rem] leading-[1.02] font-normal text-balance sm:text-5xl lg:text-6xl">{t(c.title)}</h2>
          <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-muted">{t(c.body)}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {c.occasions.map((o) => (
              <li key={o.es} className="rounded-full border border-line-strong px-4 py-2 text-sm">{t(o)}</li>
            ))}
          </ul>
          <div className="mt-8 flex gap-3">
            <Link to="/pasteles" className={buttonClass.accent}>
              {t(c.cta)}
              <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 lg:hidden">
            {c.gallery.slice(1).map((g) => (
              <Img key={g} name={g} sizes="45vw" className="aspect-square w-full rounded-[20px]" />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Popular() {
  return (
    <section className="pt-16 lg:pt-32">
      <SectionHeader className={container} eyebrow={home.popular.eyebrow} title={home.popular.title} action={<SeeAll to="/menu" />} />
      <div className={`${container} mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:mt-12 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12`}>
        {popularProducts.slice(0, 8).map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 0.06}>
            <ProductCard product={p} sizes="(min-width: 1024px) 22vw, 46vw" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Story() {
  const { t } = usePrefs();
  const s = home.story;
  return (
    <section className="pt-20 lg:pt-36" id="historia">
      <div className={`${container} grid items-center gap-10 lg:grid-cols-12 lg:gap-16`}>
        <Reveal className="relative order-1 lg:order-2 lg:col-span-6">
          <Img name={s.image} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/5] w-full rounded-[32px] shadow-lift lg:w-[85%]" />
          <motion.div
            className="absolute -bottom-8 right-0 hidden w-[42%] overflow-hidden rounded-[24px] border-4 border-bg shadow-lift lg:block"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Img name={s.imageSecondary} sizes="20vw" className="aspect-[3/4] w-full" />
          </motion.div>
        </Reveal>
        <Reveal delay={0.1} className="order-2 lg:order-1 lg:col-span-6">
          <p className="eyebrow mb-3">{t(s.eyebrow)}</p>
          <h2 className="font-display text-[2.6rem] leading-[1] font-light sm:text-6xl lg:text-7xl">
            <span className="italic">{t(s.title)}</span>
          </h2>
          <p className="mt-6 max-w-lg text-[1.08rem] leading-relaxed text-muted lg:text-lg">{t(s.body)}</p>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-6">
            {s.stats.map((st) => (
              <div key={st.value}>
                <dt className="sr-only">{t(st.label)}</dt>
                <dd className="font-display text-4xl lg:text-5xl">{st.value}</dd>
                <dd className="mt-1 text-[0.8rem] leading-snug text-muted">{t(st.label)}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

export function Classes() {
  const { t } = usePrefs();
  const c = home.classes;
  return (
    <section className="pt-20 lg:pt-36">
      <div className={container}>
        <Reveal className="grain relative overflow-hidden rounded-[32px] text-white shadow-lift">
          <Img name={c.image} sizes="100vw" className="aspect-[4/5] w-full sm:aspect-[21/9]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent sm:bg-gradient-to-r sm:from-black/70 sm:via-black/30" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:inset-y-0 sm:flex sm:max-w-xl sm:flex-col sm:justify-center sm:p-12 lg:p-16">
            <p className="eyebrow mb-3 !text-white/80">{t(c.eyebrow)}</p>
            <h2 className="font-display text-[2.1rem] leading-[1.05] sm:text-5xl">{t(c.title)}</h2>
            <p className="mt-4 max-w-sm text-white/85">{t(c.body)}</p>
            <a href={`tel:${brand.phone}`} className={`${buttonClass.glass} mt-7 self-start !border-white/20 !bg-white/15 !text-white`}>
              {t(c.cta)}
              <ArrowUpRight size={17} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
