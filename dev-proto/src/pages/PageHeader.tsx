import type { ReactNode } from 'react';
import type { Localized } from '../lib/content';
import { usePrefs } from '../lib/app-state';
import { Reveal } from '../components/ui';

export function PageHeader({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: Localized; subtitle?: Localized; children?: ReactNode }) {
  const { t } = usePrefs();
  return (
    <header className="mx-auto max-w-[1440px] px-5 pt-[calc(6rem+env(safe-area-inset-top))] pb-6 lg:px-10 lg:pt-36 lg:pb-10">
      <Reveal>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="font-display text-[2.9rem] leading-[0.98] font-light sm:text-7xl lg:text-8xl">{t(title)}</h1>
        {subtitle && <p className="mt-4 max-w-lg text-[1.05rem] text-muted lg:text-lg">{t(subtitle)}</p>}
        {children}
      </Reveal>
    </header>
  );
}
