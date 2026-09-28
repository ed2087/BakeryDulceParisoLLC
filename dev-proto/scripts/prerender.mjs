// Runs after `vite build`. Writes one real HTML file per page (dist/<route>/index.html)
// with its own <title>, description, canonical URL, Open Graph tags, JSON-LD and
// crawlable fallback content — so every product and category page ranks on its own.
// Also writes sitemap.xml, robots.txt and a 404.html SPA fallback.
//
// SITE_URL  absolute origin + base path, e.g. https://user.github.io/dulce-paraiso
import { createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');
const base = process.env.BASE_PATH || '/';
const site = (process.env.SITE_URL || `http://localhost:4173${base}`).replace(/\/$/, '');

const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const { allPages, imageAlt } = await vite.ssrLoadModule('/src/lib/seo.ts');
const seo = JSON.parse(await readFile(path.join(root, 'src/content/seo.json'), 'utf8'));
await vite.close();

const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pages = allPages(site);

function render(page) {
  const url = `${site}${page.path === '/' ? '/' : `${page.path}/`}`;
  const image = `${site}/images/${page.image}-1600.webp`;
  const head = [
    `<link rel="canonical" href="${url}" />`,
    page.noindex ? '<meta name="robots" content="noindex" />' : '',
    `<meta property="og:type" content="${page.path.startsWith('/producto/') ? 'product' : 'website'}" />`,
    `<meta property="og:site_name" content="${esc(seo.siteName)}" />`,
    `<meta property="og:locale" content="${seo.locale}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ...page.jsonLd.map((ld) => `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`),
  ].filter(Boolean).join('\n    ');

  // Visible to crawlers and no-JS visitors; React replaces it on load.
  const body = `<main data-ssr style="max-width:720px;margin:0 auto;padding:6rem 1.25rem;font-family:system-ui,sans-serif">
      <h1>${esc(page.heading)}</h1>
      <p>${esc(page.description)}</p>
      <img src="${base}images/${page.image}-800.webp" alt="${esc(imageAlt(page.image))}" width="800" style="width:100%;height:auto;border-radius:24px" />
      <nav><a href="${base}">Inicio</a> · <a href="${base}menu/">Menú</a> · <a href="${base}pasteles/">Pasteles</a> · <a href="${base}visitanos/">Visítanos</a></nav>
    </main>`;

  return template
    .replace(/<title>.*?<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${esc(page.description)}" />`)
    .replace('<!--seo-->', head)
    .replace('<!--ssr-->', body);
}

for (const page of pages) {
  const dir = path.join(dist, page.path);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), render(page));
}

// Unknown URLs: GitHub Pages serves 404.html; the app boots and shows its own 404.
await writeFile(path.join(dist, '404.html'), template.replace('<!--seo-->', '<meta name="robots" content="noindex" />').replace('<!--ssr-->', ''));

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${site}${p.path === '/' ? '/' : `${p.path}/`}</loc><lastmod>${today}</lastmod><priority>${p.path === '/' ? '1.0' : p.path.startsWith('/producto/') ? '0.7' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);

console.log(`Prerendered ${pages.length} pages → ${site}`);
