// Small shared building blocks.
import { motion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode, SVGProps } from 'react';
import { ui, type Badge as BadgeType, type Localized } from '../lib/content';
import { getOpenStatus, formatTime } from '../lib/hours';
import { usePrefs } from '../lib/app-state';

/** Fades + lifts content into view once as it scrolls in. */
export function Reveal({ children, delay = 0, className, ...rest }: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({ eyebrow, title, action, className = '' }: { eyebrow: Localized; title: Localized; action?: ReactNode; className?: string }) {
  const { t } = usePrefs();
  return (
    <Reveal className={`flex items-end justify-between gap-4 ${className}`}>
      <div>
        <p className="eyebrow mb-2">{t(eyebrow)}</p>
        <h2 className="font-display text-[2rem] leading-[1.05] font-normal text-balance sm:text-5xl lg:text-6xl">{t(title)}</h2>
      </div>
      {action}
    </Reveal>
  );
}

export function Badge({ type, onImage = false }: { type: BadgeType; onImage?: boolean }) {
  const { t } = usePrefs();
  const dot = type === 'fresh' ? 'bg-ok' : type === 'seasonal' ? 'bg-accent' : 'bg-fg';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide uppercase ${
        onImage ? 'glass text-fg' : 'bg-surface-2 text-fg'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
      {t(ui.badges[type])}
    </span>
  );
}

export function OpenStatus({ className = '' }: { className?: string }) {
  const { t, lang } = usePrefs();
  const s = getOpenStatus();
  return (
    <span className={`inline-flex items-center gap-2 text-sm ${className}`}>
      <span className="relative flex h-2 w-2">
        {s.open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${s.open ? 'bg-ok' : 'bg-muted'}`} />
      </span>
      <span>
        <strong className="font-semibold">{t(s.open ? ui.status.openNow : ui.status.closed)}</strong>
        {s.time && (
          <span className="opacity-75">
            {' · '}
            {t(s.open ? ui.status.until : ui.status.opensAt)} {formatTime(s.time, lang)}
          </span>
        )}
      </span>
    </span>
  );
}

export const buttonClass = {
  primary:
    'pressable inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-fg px-6 text-[0.95rem] font-semibold text-bg hover:opacity-90',
  accent:
    'pressable inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-[0.95rem] font-semibold text-accent-fg hover:opacity-90',
  ghost:
    'pressable inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-line-strong px-6 text-[0.95rem] font-semibold hover:bg-surface-2',
  glass:
    'pressable glass inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-semibold',
};

/* Brand marks (Lucide no longer ships these). */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 20): SVGProps<SVGSVGElement> => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true });

export const InstagramIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
);
export const FacebookIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" /></svg>
);
export const GoogleIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}><path d="M20.5 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h4.8a4.2 4.2 0 0 1-1.8 2.7v2.3h2.9c1.7-1.6 2.6-3.9 2.6-6.7z" /><path d="M12 21c2.4 0 4.5-.8 5.9-2.1L15 16.6c-.8.5-1.8.9-3 .9-2.3 0-4.3-1.6-5-3.7H4v2.3A9 9 0 0 0 12 21z" /><path d="M7 13.8a5.4 5.4 0 0 1 0-3.6V7.9H4a9 9 0 0 0 0 8.2l3-2.3z" /><path d="M12 6.5c1.3 0 2.5.5 3.4 1.3L18 5.3A9 9 0 0 0 4 7.9l3 2.3c.7-2.1 2.7-3.7 5-3.7z" /></svg>
);

export const socialIcon = { instagram: InstagramIcon, facebook: FacebookIcon, google: GoogleIcon } as const;
