# Dulce Paraíso — website prototype

Design prototype for **Bakery Dulce Pariso LLC** (Dulce Paraíso), a Mexican panadería at
1456 Springdale Rd, Lancaster, SC. Built to show the owner what their online presence could be.
It is a showcase and info site only — no online ordering or cart.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build + one prerendered HTML page per route → dist/
```

## Everything is JSON-driven

All copy, prices, hours and photos live in `src/content/` — components never hardcode content.

| File | What it controls |
|---|---|
| `brand.json` | Name, address, phone, hours, amenities, social links |
| `products.json` | Every product: name (ES/EN), description, price, photo, badges, featured |
| `categories.json` | Menu categories and their cover photo |
| `home.json` | Homepage section copy |
| `ui.json` | Buttons, labels, small UI text (ES/EN) |
| `seo.json` | Page titles/descriptions + templates for product & category pages |
| `images.json` | Photo manifest (alt text, credit, source) |

**Swap in real photos:** put `<key>-800.webp` and `<key>-1600.webp` in `public/images/`, set that
key's `source` to `"local"` in `images.json`. Placeholder photos come from Pexels/Unsplash
(free license) via `npm run images`.

## SEO

Every product (`/producto/<id>`), category (`/menu/<id>`) and section page is its own URL.
`npm run build` prerenders each one to real HTML with its own `<title>`, description, canonical,
Open Graph tags, and schema.org JSON-LD (`Bakery` local business, `Product` with price,
`BreadcrumbList`), plus `sitemap.xml` and `robots.txt`.

## Deploy (GitHub Pages)

`.github/workflows/deploy-dev-proto.yml` (at the repo root) builds and deploys on every push to
`main` that touches `dev-proto/`. In the GitHub repo: **Settings → Pages → Source: GitHub Actions**.
The base path and site URL are detected automatically (works with a custom domain too).

## Stack

Vite · React · TypeScript · Tailwind CSS v4 · Motion · Lucide · Lenis. Light + dark themes
(follows the device, toggle in the header), Spanish-first with an English toggle.
