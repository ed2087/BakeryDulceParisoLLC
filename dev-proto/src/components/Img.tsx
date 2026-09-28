import { useState, type CSSProperties } from 'react';
import { images, placeholders } from '../lib/content';
import { usePrefs } from '../lib/app-state';

const BASE = import.meta.env.BASE_URL;
export const imageUrl = (key: string, w: 800 | 1600 = 800) => `${BASE}images/${key}-${w}.webp`;

interface Props {
  name: string;
  /** `sizes` attribute — how wide the image renders, so the browser picks 800w or 1600w. */
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  alt?: string;
}

/** Responsive WebP with a blurred low-res preview that fades into the full image. */
export function Img({ name, sizes = '100vw', className = '', style, priority, alt }: Props) {
  const { t } = usePrefs();
  const [loaded, setLoaded] = useState(false);
  const entry = images[name];
  const blur = placeholders[name];

  return (
    <span
      className={`relative block overflow-hidden bg-surface-2 ${className}`}
      style={{ ...style, backgroundImage: blur ? `url(${blur})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <img
        src={imageUrl(name, 800)}
        srcSet={`${imageUrl(name, 800)} 800w, ${imageUrl(name, 1600)} 1600w`}
        sizes={sizes}
        alt={alt ?? (entry ? t(entry.alt) : '')}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        ref={(el) => { if (el?.complete && el.naturalWidth) setLoaded(true); }}
        className={`h-full w-full object-cover transition-[opacity,filter] duration-700 ease-out ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`}
      />
    </span>
  );
}
