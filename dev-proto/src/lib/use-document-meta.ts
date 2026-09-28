import { useEffect } from 'react';
import { metaFor } from './seo';

function setMeta(selector: string, attr: string, key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Keeps <title>, description, canonical and JSON-LD in sync while navigating client-side.
 *  (The first load already has them baked into the prerendered HTML.) */
export function useDocumentMeta(pathname: string) {
  useEffect(() => {
    const m = metaFor(pathname);
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const origin = `${window.location.origin}${base}`;
    const url = `${origin}${m.path === '/' ? '/' : `${m.path}/`}`;

    document.title = m.title;
    setMeta('meta[name="description"]', 'name', 'description', m.description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', m.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', m.description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[property="og:image"]', 'property', 'og:image', `${origin}/images/${m.image}-1600.webp`);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [pathname]);
}
