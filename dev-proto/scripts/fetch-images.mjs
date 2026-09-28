// Downloads every photo in src/content/images.json as optimized WebP
// (800w + 1600w) into public/images, and writes a tiny blurred preview
// for each into src/content/placeholders.json.
//
//   npm run images            -> fetch missing files only
//   npm run images -- --force -> re-download everything
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(await readFile(path.join(root, 'src/content/images.json'), 'utf8'));
const outDir = path.join(root, 'public/images');
const placeholdersFile = path.join(root, 'src/content/placeholders.json');
const force = process.argv.includes('--force');
const WIDTHS = [800, 1600];

await mkdir(outDir, { recursive: true });
let placeholders = {};
try { placeholders = JSON.parse(await readFile(placeholdersFile, 'utf8')); } catch {}

const exists = (p) => access(p).then(() => true, () => false);

async function baseUrl(source) {
  const [provider, id] = source.split(':');
  if (provider === 'pexels') return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb`;
  if (provider === 'unsplash') {
    const res = await fetch(`https://unsplash.com/photos/${id}/download?w=100`, { redirect: 'manual' });
    const loc = res.headers.get('location');
    if (!loc) throw new Error(`Could not resolve unsplash:${id}`);
    const u = new URL(loc);
    return `${u.origin}${u.pathname}?q=78&crop=entropy&cs=srgb`;
  }
  return null;
}

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
}

for (const [key, entry] of Object.entries(manifest)) {
  if (key.startsWith('_') || entry.source === 'local') continue;
  try {
    const targets = WIDTHS.map((w) => [w, path.join(outDir, `${key}-${w}.webp`)]);
    const missing = force || !(await Promise.all(targets.map(([, f]) => exists(f)))).every(Boolean);
    if (!missing && placeholders[key]) { console.log(`✓ ${key}`); continue; }
    const base = await baseUrl(entry.source);
    await Promise.all(targets.map(([w, f]) => download(`${base}&fm=webp&w=${w}`, f)));
    const tiny = await fetch(`${base}&fm=jpg&w=24&q=40`).then((r) => r.arrayBuffer());
    placeholders[key] = `data:image/jpeg;base64,${Buffer.from(tiny).toString('base64')}`;
    console.log(`↓ ${key}`);
  } catch (err) {
    console.error(`✗ ${key}: ${err.message}`);
  }
}

await writeFile(placeholdersFile, JSON.stringify(placeholders, null, 2) + '\n');
console.log('Done.');
