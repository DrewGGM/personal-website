/**
 * Cruza una oferta concreta con el CV y dice qué ajustar.
 *
 *   npm run cv:match -- ruta/a/la-oferta.txt
 *
 * Por qué existe: el formato es condición necesaria pero no suficiente. Con el
 * PDF ya limpio, lo que más mueve la aguja es el solape de vocabulario con la
 * oferta concreta — la referencia habitual es 70-80 %, no 100 %, que se lee como
 * relleno.
 *
 * LO QUE ESTE SCRIPT NO HACE: reescribir el CV. Inyectar automáticamente las
 * palabras de la oferta es la forma más rápida de acabar afirmando algo que no
 * es cierto. Aquí se separa lo que YA tienes y no se ve, de lo que sencillamente
 * no tienes, y la decisión la tomas tú.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CVData } from '../src/types';
import { cvData } from '../src/data/cvData';
import { cvDataES } from '../src/data/cvData.es';
import { detectLanguage, extractJobTerms, mentions, normalize } from './lib/keywords';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const jobPath = process.argv[2];
if (!jobPath) {
  console.error('Uso: npm run cv:match -- <ruta-a-la-oferta.txt>');
  process.exit(2);
}
if (!existsSync(jobPath)) {
  console.error(`No existe el fichero: ${jobPath}`);
  process.exit(2);
}

const jobText = readFileSync(jobPath, 'utf8');
const lang = detectLanguage(jobText);
const data: CVData = lang === 'es' ? cvDataES : cvData;
const cvFile = lang === 'es' ? 'Andrew_Garcia_Mosquera_CV_ES.txt' : 'Andrew_Garcia_Mosquera_CV.txt';
const cvTxtPath = join(ROOT, 'public', cvFile);

if (!existsSync(cvTxtPath)) {
  console.error(`Falta ${cvFile}. Ejecuta primero: npm run cv`);
  process.exit(2);
}

/**
 * Los dos textos contra los que se contrasta:
 *  - `shipped`: lo que REALMENTE va en el CV que se envía.
 *  - `everything`: todo cvData, incluidos los 12 proyectos que no caben en una
 *    página. La diferencia entre ambos es justo el material recuperable.
 */
const shipped = normalize(readFileSync(cvTxtPath, 'utf8'));
const everything = normalize(
  [
    data.name, data.headline, data.summary,
    ...data.skills.flatMap((s) => [s.label, s.details]),
    ...data.languages.flatMap((l) => [l.label, l.details]),
    ...data.certifications.flatMap((c) => [c.title, c.issuer]),
    ...data.education.flatMap((e) => [e.institution, e.area, e.degree]),
    ...data.experience.flatMap((e) => [e.company, e.position, e.summary, ...e.highlights]),
    ...data.projects.flatMap((p) => [p.title, p.tagline ?? '', p.description, p.role ?? '', ...p.techStack]),
  ].join(' '),
);

// Vocabulario ESTRUCTURADO: tecnologías, skills, cargos y áreas. Deliberadamente
// sin prosa — ahí "with" o "build" contarían como términos del oficio.
const entries = [
  ...data.projects.flatMap((p) => p.techStack),
  ...data.skills.flatMap((s) => s.details.split(',')),
  ...data.languages.map((l) => l.label),
  ...data.education.map((e) => e.area),
  ...data.experience.map((e) => e.position),
]
  .map((s) => normalize(s))
  .filter(Boolean);

/** Entradas completas: "spring boot" sí, "spring" no. */
const atomic = new Set(entries);
/** Tokens sueltos de esas entradas, para juzgar palabra a palabra. */
const structured = new Set(entries.flatMap((e) => e.split(' ')).filter((t) => t.length >= 2));

const terms = extractJobTerms(jobText, {
  phrase: (term) => mentions(everything, term),
  token: (term) => structured.has(term),
  atomic: (term) => atomic.has(term),
});

const covered: string[] = [];
const hidden: string[] = [];
const missing: string[] = [];

for (const term of terms) {
  if (mentions(shipped, term)) covered.push(term);
  else if (mentions(everything, term)) hidden.push(term);
  else missing.push(term);
}

const total = terms.length;
const pct = total ? Math.round((covered.length / total) * 100) : 0;

/**
 * Qué 3 proyectos convienen para ESTA oferta.
 *
 * `inCv` en cvData ya elige 3 de los 15 para la página única. Es la palanca más
 * barata que existe: cambiar la selección no inventa nada, sólo reordena lo que
 * ya está escrito.
 */
const ranked = data.projects
  .map((p) => {
    const haystack = normalize([p.title, p.tagline ?? '', p.description, ...p.techStack].join(' '));
    const hits = terms.filter((t) => mentions(haystack, t));
    return { project: p, hits };
  })
  .filter((r) => r.hits.length > 0)
  .sort((a, b) => b.hits.length - a.hits.length);

const currentSlugs = data.projects.filter((p) => p.inCv).map((p) => p.slug);
const suggestedSlugs = ranked.slice(0, 3).map((r) => r.project.slug);

// ── Informe ───────────────────────────────────────────────────────────────
const list = (items: string[], limit = 18) => {
  const shown = items.slice(0, limit);
  const rest = items.length - shown.length;
  return shown.map((t) => `      · ${t}`).join('\n') + (rest > 0 ? `\n      … y ${rest} más` : '');
};

console.log(`\n  Oferta:    ${jobPath}`);
console.log(`  Idioma:    ${lang === 'es' ? 'español' : 'inglés'} → se cruza con ${cvFile}`);
console.log(`  Cobertura: ${pct}% (${covered.length}/${total} términos)`);

const verdict =
  pct >= 80
    ? 'Por encima del rango habitual — cuidado, un solape demasiado alto se lee como relleno.'
    : pct >= 70
      ? 'En el rango que se suele recomendar (70-80%). Listo para enviar.'
      : pct >= 50
        ? 'Por debajo del rango recomendado. Mira lo recuperable de aquí abajo.'
        : 'Solape bajo. O la oferta pide otro perfil, o falta subir bastante material al CV.';
console.log(`             ${verdict}`);

if (hidden.length) {
  console.log(`\n  ── YA LO TIENES, pero no está en el CV que se envía (${hidden.length})`);
  console.log('     Está en cvData —proyectos que no caben, highlights, certificaciones— pero');
  console.log('     no en el PDF. Súbelo al `summary` o a `skills`, o cambia qué proyectos');
  console.log('     llevan `inCv`. Es material real: no estás inventando nada.');
  console.log(list(hidden));
}

if (missing.length) {
  console.log(`\n  ── NO APARECE EN NINGÚN SITIO (${missing.length})`);
  console.log('     Si de verdad lo tienes, añádelo a cvData y vuelve a generar. Si no,');
  console.log('     déjalo fuera: un CV no se arregla escribiendo lo que no es.');
  console.log(list(missing));
}

if (ranked.length) {
  console.log('\n  ── PROYECTOS QUE MEJOR ENCAJAN CON ESTA OFERTA');
  for (const { project, hits } of ranked.slice(0, 5)) {
    const mark = project.inCv ? '[en el CV]' : '          ';
    console.log(`     ${mark} ${project.title}`);
    console.log(`                 ${hits.length} coincidencias: ${hits.slice(0, 6).join(', ')}`);
  }

  const sameSelection =
    suggestedSlugs.length === currentSlugs.length &&
    suggestedSlugs.every((s) => currentSlugs.includes(s));
  if (!sameSelection) {
    console.log('\n     Para esta oferta, `inCv: true` cuadraría mejor en:');
    console.log(`       ${suggestedSlugs.join(', ')}`);
    console.log(`     (ahora: ${currentSlugs.join(', ')})`);
  }
}

console.log(`\n  Términos cubiertos (${covered.length}): ${covered.slice(0, 24).join(', ')}${covered.length > 24 ? '…' : ''}\n`);
