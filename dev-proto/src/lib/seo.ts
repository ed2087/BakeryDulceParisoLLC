// One source of truth for every page's <title>, meta description, social image
// and structured data. Used at runtime (document head updates) and at build
// time by scripts/prerender.mjs, which writes a real HTML file per route.
import seo from '../content/seo.json';
import { brand, categories, formatPrice, getCategory, images, products, productsIn, fullAddress } from './content';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  image: string;
  noindex?: boolean;
  heading: string;
  jsonLd: object[];
}

const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

export const productPath = (id: string) => `/producto/${id}`;
export const categoryPath = (id: string) => `/menu/${id}`;

/** `origin` is the absolute site URL incl. base path, e.g. https://user.github.io/repo */
function bakeryLd(origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    '@id': `${origin}/#bakery`,
    name: brand.name,
    legalName: brand.legalName,
    url: `${origin}/`,
    telephone: brand.phone,
    image: `${origin}/images/${seo.defaultImage}-1600.webp`,
    servesCuisine: ['Mexican', 'Pan dulce'],
    priceRange: '$',
    acceptsReservations: false,
    paymentAccepted: 'Cash, Credit Card',
    availableLanguage: ['es', 'en'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.address.street,
      addressLocality: brand.address.city,
      addressRegion: brand.address.state,
      postalCode: brand.address.zip,
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: brand.address.lat, longitude: brand.address.lng },
    openingHoursSpecification: brand.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][h.day],
      opens: h.open,
      closes: h.close,
    })),
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
  };
}

function breadcrumbs(origin: string, trail: [string, string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${origin}${path}` })),
  };
}

export function allPages(origin = ''): PageMeta[] {
  const pages: PageMeta[] = [];
  const staticHeadings: Record<string, string> = {
    '/': `${brand.name} — ${brand.kicker.es}`,
    '/menu': 'Menú',
    '/pasteles': 'Pasteles para cada celebración',
    '/visitanos': 'Visítanos',
  };

  for (const [path, p] of Object.entries(seo.pages) as [string, { title: string; description: string; image: string; noindex?: boolean }][]) {
    const ld: object[] = [bakeryLd(origin)];
    if (path !== '/') ld.push(breadcrumbs(origin, [[brand.name, '/'], [staticHeadings[path], path]]));
    pages.push({ path, title: p.title, description: p.description, image: p.image, noindex: p.noindex, heading: staticHeadings[path], jsonLd: ld });
  }

  for (const c of categories) {
    const items = productsIn(c.id);
    if (!items.length) continue;
    const path = categoryPath(c.id);
    const vars = { name: c.name.es, nameEn: c.name.en, city: brand.address.city, items: items.map((p) => p.name.es).join(', ') };
    pages.push({
      path,
      title: fill(seo.templates.category.title, vars),
      description: fill(seo.templates.category.description, vars),
      image: c.image,
      heading: c.name.es,
      jsonLd: [
        bakeryLd(origin),
        breadcrumbs(origin, [[brand.name, '/'], ['Menú', '/menu'], [c.name.es, path]]),
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${origin}${productPath(p.id)}`, name: p.name.es })),
        },
      ],
    });
  }

  for (const p of products) {
    const cat = getCategory(p.category);
    const path = productPath(p.id);
    const vars = { name: p.name.es, nameEn: p.name.en, description: p.description.es, price: formatPrice(p.price), city: brand.address.city };
    pages.push({
      path,
      title: fill(seo.templates.product.title, vars),
      description: fill(seo.templates.product.description, vars),
      image: p.image,
      heading: p.name.es,
      jsonLd: [
        bakeryLd(origin),
        breadcrumbs(origin, [[brand.name, '/'], ['Menú', '/menu'], ...(cat ? ([[cat.name.es, categoryPath(cat.id)]] as [string, string][]) : []), [p.name.es, path]]),
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: p.name.es,
          alternateName: p.name.en,
          description: p.description.es,
          image: `${origin}/images/${p.image}-1600.webp`,
          category: cat?.name.es,
          brand: { '@type': 'Brand', name: brand.name },
          offers: {
            '@type': 'Offer',
            price: p.price.toFixed(2),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            seller: { '@id': `${origin}/#bakery` },
          },
        },
      ],
    });
  }
  return pages;
}

let cache: Map<string, PageMeta> | null = null;
export function metaFor(pathname: string): PageMeta {
  cache ??= new Map(allPages().map((p) => [p.path, p]));
  const clean = pathname.replace(/\/+$/, '') || '/';
  return cache.get(clean) ?? cache.get('/')!;
}

export const imageAlt = (key: string) => images[key]?.alt.es ?? '';
