/**
 * Escribe `public/sitemap.xml` antes de cada build.
 *
 * Se genera en vez de mantenerse a mano por `lastmod`: un sitemap con una fecha
 * congelada le enseña a Google que ese campo no es de fiar en este dominio, y a
 * partir de ahí lo ignora. La fecha sale del último commit que tocó contenido,
 * no de "hoy", para que dos builds del mismo código den el mismo sitemap.
 */
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE = 'https://andrewgarcia.dev';

/** Rutas cuyo cambio significa que el contenido visible cambió. */
const CONTENT_PATHS = ['src/data', 'src/i18n', 'index.html'];

function lastContentChange(): string {
  try {
    const iso = execSync(
      `git log -1 --format=%cI -- ${CONTENT_PATHS.join(' ')}`,
      { encoding: 'utf8' },
    ).trim();
    if (iso) return iso.slice(0, 10);
  } catch {
    // Sin git (p. ej. un tarball del código): caemos a la fecha de build.
  }
  return new Date().toISOString().slice(0, 10);
}

const lastmod = lastContentChange();

// Una sola URL: el sitio es una página con secciones ancladas, y listar
// anclas como URLs propias sólo produce duplicados a ojos del rastreador.
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/" />
    <xhtml:link rel="alternate" hreflang="es" href="${SITE}/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/" />
  </url>
</urlset>
`;

const out = resolve(process.cwd(), 'public/sitemap.xml');
writeFileSync(out, xml, 'utf8');
console.log(`sitemap.xml written (lastmod ${lastmod})`);
