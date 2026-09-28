import { motion, useScroll, useTransform } from 'motion/react';
import { Send } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { home, productsIn, ui } from '../lib/content';
import { haptic, usePrefs } from '../lib/app-state';
import { Img } from '../components/Img';
import { ProductCard } from '../components/ProductCard';
import { Reveal, buttonClass } from '../components/ui';
import { Field, SuccessPanel } from './forms';

const servingOptions = ['10–20', '20–40', '40–80', '80+'];

function ChoiceChips({ legend, options, value, onChange }: { legend: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => { haptic(); onChange(o); }}
            className={`pressable h-11 rounded-full px-4 text-sm font-medium transition-colors ${value === o ? 'bg-fg text-bg' : 'bg-surface-2 hover:bg-line-strong'}`}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function Cakes() {
  const { t } = usePrefs();
  const c = home.celebrations;
  const occasions = c.occasions.map((o) => t(o));
  const [occasion, setOccasion] = useState(occasions[0]);
  const [servings, setServings] = useState(servingOptions[1]);
  const [done, setDone] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    haptic(20);
    setDone(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (done) {
    return (
      <SuccessPanel title={t(ui.cake.doneTitle)} body={t(ui.cake.doneBody)}>
        <Link to="/" className={buttonClass.primary}>{t(ui.form.back)}</Link>
      </SuccessPanel>
    );
  }

  return (
    <div className="pb-10">
      <div ref={heroRef} className="grain relative h-[78svh] min-h-[520px] overflow-hidden bg-black text-white">
        <motion.div style={{ y }} className="absolute inset-0">
          <Img name={c.image} priority sizes="100vw" className="h-full w-full" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75" />
        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-end px-5 pb-12 lg:px-10 lg:pb-20">
          <Reveal>
            <p className="eyebrow mb-3 !text-white/80">{t(c.eyebrow)}</p>
            <h1 className="max-w-3xl font-display text-[3rem] leading-[0.98] font-light sm:text-7xl lg:text-8xl">{t(c.title)}</h1>
            <p className="mt-5 max-w-md text-white/85 lg:text-lg">{t(c.body)}</p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="no-scrollbar snap-x-mandatory -mx-5 mt-8 flex gap-3 overflow-x-auto px-5 lg:mx-0 lg:mt-12 lg:grid lg:grid-cols-3 lg:gap-6 lg:px-0">
          {c.gallery.map((g, i) => (
            <Reveal key={g} delay={i * 0.08} className="w-[72vw] shrink-0 snap-start lg:w-auto">
              <Img name={g} sizes="(min-width: 1024px) 30vw, 72vw" className="aspect-[4/5] w-full rounded-[24px] shadow-soft" />
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <h2 className="font-display text-[2.3rem] leading-[1.02] sm:text-5xl">{t(ui.cake.title)}</h2>
            <p className="mt-4 max-w-md text-muted lg:text-lg">{t(ui.cake.subtitle)}</p>
            <div className="mt-10 hidden grid-cols-2 gap-5 lg:grid">
              {productsIn('pasteles').slice(0, 2).map((p) => (
                <ProductCard key={p.id} product={p} sizes="18vw" />
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <form onSubmit={submit} className="flex flex-col gap-6 rounded-[28px] bg-surface p-6 shadow-soft sm:p-8">
              <ChoiceChips legend={t(ui.cake.occasion)} options={occasions} value={occasion} onChange={setOccasion} />
              <ChoiceChips legend={t(ui.cake.servings)} options={servingOptions} value={servings} onChange={setServings} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t(ui.cake.date)} name="date" type="date" required />
                <Field label={t(ui.form.phone)} name="tel" type="tel" autoComplete="tel" inputMode="tel" />
              </div>
              <Field label={t(ui.form.name)} name="name" autoComplete="name" required />
              <Field label={t(ui.cake.notes)} name="notes" multiline />
              <button type="submit" className={`${buttonClass.accent} h-14 text-base`}>
                <Send size={18} /> {t(ui.cake.submit)}
              </button>
            </form>
          </Reveal>
        </div>

        <section className="mt-20 lg:hidden">
          <div className="grid grid-cols-2 gap-x-3 gap-y-8">
            {productsIn('pasteles').map((p) => (
              <ProductCard key={p.id} product={p} sizes="46vw" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
