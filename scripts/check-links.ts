/**
 * Comprueba que todas las URLs del portafolio siguen vivas.
 *
 * Existe porque `qr-permanente.pages.dev` estuvo enlazado como "Live site"
 * despues de que el despliegue dejara de existir: el dominio daba NXDOMAIN y
 * la tarjeta invitaba a visitarlo. Un enlace muerto en un portafolio resta mas
 * de lo que suma, y no hay forma de notarlo sin pincharlos todos.
 *
 *   npm run links:check
 *
 * Sale con codigo 1 si algo falla, para poder colgarlo de CI.
 */
import { cvData } from '../src/data/cvData';
import { cvDataES } from '../src/data/cvData.es';

interface Target {
  url: string;
  where: string;
}

function collect(): Target[] {
  const seen = new Map<string, string>();
  const add = (url: string | undefined, where: string) => {
    if (!url || !url.startsWith('http')) return;
    if (!seen.has(url)) seen.set(url, where);
  };

  for (const [label, data] of [['en', cvData], ['es', cvDataES]] as const) {
    add(data.website, `${label}:website`);
    for (const s of data.socialNetworks) add(s.url, `${label}:social/${s.network}`);
    for (const v of data.ventures) add(v.url, `${label}:venture/${v.name}`);
    for (const p of data.projects) {
      for (const l of p.links ?? []) add(l.url, `${label}:${p.slug}/${l.kind}`);
    }
    // Los certificados se sirven desde /public, no por red: fuera de alcance.
  }

  return [...seen].map(([url, where]) => ({ url, where }));
}

/** HEAD primero; algunos hosts responden 405 a HEAD, y ahi se reintenta con GET. */
async function probe(url: string): Promise<{ ok: boolean; detail: string }> {
  for (const method of ['HEAD', 'GET'] as const) {
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        signal: AbortSignal.timeout(20_000),
        headers: { 'user-agent': 'portfolio-link-check' },
      });
      if (res.ok) return { ok: true, detail: String(res.status) };
      if (method === 'GET' || (res.status !== 405 && res.status !== 403)) {
        return { ok: false, detail: `HTTP ${res.status}` };
      }
    } catch (err) {
      if (method === 'GET') {
        return { ok: false, detail: (err as Error).message.split('\n')[0] };
      }
    }
  }
  return { ok: false, detail: 'unreachable' };
}

const targets = collect();
console.log(`Comprobando ${targets.length} URLs...\n`);

const results = await Promise.all(
  targets.map(async (t) => ({ ...t, ...(await probe(t.url)) })),
);

const failed = results.filter((r) => !r.ok);
for (const r of results.sort((a, b) => Number(a.ok) - Number(b.ok))) {
  console.log(`${r.ok ? 'OK  ' : 'FAIL'}  ${r.url.padEnd(58)} ${r.detail}  (${r.where})`);
}

if (failed.length > 0) {
  console.error(`\n${failed.length} enlace(s) rotos.`);
  process.exit(1);
}
console.log('\nTodos los enlaces responden.');
