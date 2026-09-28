import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, Navigation } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { brand, directionsUrl, home } from '../lib/content';
import { usePrefs } from '../lib/app-state';
import { Img } from './Img';
import { OpenStatus, buttonClass } from './ui';

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t } = usePrefs();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%']);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const lines = t(brand.tagline).split('\n');

  return (
    <section ref={ref} className="relative flex min-h-[100svh] overflow-hidden bg-black text-white">
      <motion.div style={{ y }} className="absolute inset-0">
        <motion.div
          className="grain absolute inset-0"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: reduce ? 0 : 2.6, ease }}
        >
          <Img name={home.hero.image} priority sizes="100vw" className="h-full w-full md:hidden" />
          <Img name={home.hero.imageWide} priority sizes="100vw" className="hidden h-full w-full md:block" />
        </motion.div>
      </motion.div>

      {/* Legibility: soft vignette + bottom fade into the page background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/80" />
      <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-black/60 via-black/20 to-transparent md:block" />

      <motion.div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-end px-5 pb-32 lg:px-10 lg:pb-24"
        style={{ opacity: fade, paddingTop: 'calc(env(safe-area-inset-top) + 6rem)' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8, ease }}>
          <OpenStatus className="glass mb-5 rounded-full !border-white/15 !bg-black/25 px-3.5 py-2 text-white" />
        </motion.div>

        <p className="eyebrow mb-4 !text-white/80">
          <motion.span className="inline-block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }}>
            {t(brand.kicker)} · {brand.address.city}, {brand.address.state}
          </motion.span>
        </p>

        <h1 className="font-display text-[clamp(2.6rem,12vw,3.3rem)] leading-[0.95] font-light sm:text-7xl lg:text-[7.5rem] [@media(max-height:740px)]:text-[2.6rem] [@media(max-height:740px)_and_(min-width:640px)]:text-6xl">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className={`block ${i === 1 ? 'italic' : ''}`}
                initial={{ y: reduce ? 0 : '105%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.25 + i * 0.12, duration: 1.1, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-white/85 lg:text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease }}
        >
          {t(brand.intro)}
        </motion.p>

        <motion.div
          className="mt-7 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9, ease }}
        >
          <Link to="/menu" className={`${buttonClass.primary} !bg-white !text-black`}>
            {t(home.hero.cta)}
          </Link>
          <a href={directionsUrl} target="_blank" rel="noreferrer" className={`${buttonClass.glass} !border-white/20 !bg-white/10 !text-white`}>
            <Navigation size={17} />
            {t(home.hero.secondaryCta)}
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute bottom-28 left-1/2 z-10 hidden -translate-x-1/2 text-white/70 lg:bottom-8 lg:block"
        animate={reduce ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArrowDown size={20} />
      </motion.div>
    </section>
  );
}
