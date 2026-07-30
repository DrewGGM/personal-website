/**
 * CV generator — single source of truth: src/data/cvData.ts (EN) + src/data/cvData.es.ts (ES)
 * Builds an ATS-friendly, print-optimized HTML resume and renders it with
 * headless Chrome/Edge to:
 *   - public/Andrew_Garcia_Mosquera_CV.pdf     (English)
 *   - public/Andrew_Garcia_Mosquera_CV_ES.pdf  (Spanish)
 *
 *   npm run cv
 *
 * Conventions applied (researched, 2026 — see docs/CV-ATS.md):
 *  - ONE page for <10 years of experience; every line must earn its place.
 *  - STRICT single column (multi-column/tables/headers break older ATS parsers).
 *  - Standard section headings (Summary/Experience/Projects/Skills/Education).
 *  - XYZ-style bullets: what you built + measurable outcome, real text only.
 *  - ATS-safe typography: system font from the parser-tested list, `|` as the
 *    only field separator and a plain hyphen in date ranges.
 *
 * `npm run cv:lint` audits the produced PDF by reading back its text layer —
 * literally what a parser sees. Change the layout here, run the lint there.
 */
import { writeFileSync, existsSync, mkdtempSync, copyFileSync, rmSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import type { CVData } from '../src/types';
import { cvData } from '../src/data/cvData';
import { cvDataES } from '../src/data/cvData.es';
import { groupExperience } from '../src/i18n/translations';
import { type CVLabels, EN_LABELS, ES_LABELS, ats, formatters } from './lib/cv-labels';
import { extractPdfText } from './lib/pdf-text';
import { toJsonResume } from './lib/json-resume';
import { buildDocx } from './lib/docx';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const ACCENT = '#4f46e5';
const INK = '#111827';
const MUTED = '#4b5563';

const esc = (s: string) => ats(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));

// Toma frases completas hasta ~140 caracteres (evita descripciones demasiado escuetas o largas).
const shortDesc = (s: string) => {
  const sentences = s.split(/(?<=\.)\s+/);
  let out = '';
  for (const sen of sentences) {
    // corta al superar ~210 chars, salvo que lo acumulado sea aún muy corto (evita líneas raquíticas)
    if (out && out.length >= 80 && (out + ' ' + sen).length > 190) break;
    if (out && out.length < 80 && (out + ' ' + sen).length > 320) break;
    out = out ? `${out} ${sen}` : sen;
  }
  return out;
};

/**
 * Dos ejes de ajuste. Comprimir ESPACIO (márgenes, interlineado) no daña la
 * legibilidad; encoger la LETRA sí, y por debajo de 9pt se vuelve arriesgado
 * para los parsers ATS. Por eso `font` tiene un piso estrecho y el trabajo
 * pesado lo hace `space`.
 */
interface Fit {
  font: number;
  space: number;
}

function buildHtml(data: CVData, labels: CVLabels, fit: Fit = { font: 1, space: 1 }): string {
  // Compartidos con el .docx: las dos salidas tienen que fechar igual.
  const { fmtRange } = formatters(labels);

  // Mismo orden que la web: por fecha, con los roles de una misma empresa juntos.
  const experience = groupExperience(data.experience).flatMap((g) => g.roles);

  // Escalas: `fit` viene del ajuste automático de páginas.
  const pt = (v: number) => `${(v * fit.font).toFixed(2)}pt`;
  const px = (v: number) => `${Math.max(v * fit.space, 1).toFixed(1)}px`;
  // El interlineado se comprime mucho menos que los márgenes.
  const lineHeight = (1.26 - (1 - fit.space) * 0.32).toFixed(3);
  // Los márgenes laterales ceden a la mitad de ritmo: estrecharlos de más
  // alarga las líneas y perjudica la lectura.
  const pxSide = (v: number) => `${(v * (1 - (1 - fit.space) * 0.5)).toFixed(1)}px`;
  // La sangría de las viñetas nunca baja de 11px o el disco se sale de la caja.
  const pxList = (v: number) => `${Math.max(v * fit.space, 11).toFixed(1)}px`;

  const linkedin = data.socialNetworks.find((s) => s.network === 'LinkedIn');
  const github = data.socialNetworks.find((s) => s.network === 'GitHub');

  // Proyectos del CV: los marcados con `inCv` en cvData (máx 3 por la regla de 1 página).
  // En el CV va solo la PRIMERA frase de la descripción; el detalle vive en la web.
  const cvProjects = data.projects.filter((p) => p.inCv).slice(0, 3);

  /** Primer link de cada tipo, para la línea de enlaces del proyecto. */
  const pickLink = (p: (typeof cvProjects)[number], kinds: string[]) =>
    p.links?.find((l) => kinds.includes(l.kind))?.url;

  return `<!doctype html>
<html lang="${labels.htmlLang}">
<head>
<meta charset="utf-8">
<title>${esc(data.name)} — CV</title>
<style>
  /* Los márgenes van en @page, NO en el padding del body: el padding se aplica
     una sola vez a la caja completa, así que en la página 2 el contenido
     quedaría pegado al borde del papel. @page los repite en cada hoja. */
  @page { size: Letter; margin: ${px(20)} ${pxSide(42)}; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    /* Arial/Helvetica: de la lista corta que toda guía de ATS da por segura.
       'Segoe UI' se extraía bien, pero no está en esa lista y no aporta nada
       que compense el riesgo. */
    font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
    color: ${INK}; font-size: ${pt(9.3)}; line-height: ${lineHeight};
  }
  a { color: ${ACCENT}; text-decoration: none; }
  header { border-bottom: 2.5px solid ${ACCENT}; padding-bottom: ${px(8)}; margin-bottom: ${px(8)}; }
  h1 { font-size: ${pt(19)}; font-weight: 800; letter-spacing: -0.3px; }
  .headline { font-size: ${pt(11)}; color: ${ACCENT}; font-weight: 600; margin-top: 1px; }
  .contact { margin-top: ${px(5)}; font-size: ${pt(8.8)}; color: ${MUTED}; }
  /* El contenido generado por CSS SÍ acaba en la capa de texto del PDF, así que
     este separador lo lee el parser igual que el resto. Por eso es '|'. */
  .contact span + span::before { content: '  |  '; color: #c7cad1; }
  h2 {
    font-size: ${pt(10)}; font-weight: 800; text-transform: uppercase; letter-spacing: 1.3px;
    color: ${ACCENT}; margin: ${px(7)} 0 ${px(3)}; padding-bottom: 2px;
    border-bottom: 1px solid #e5e7eb;
    /* Un encabezado nunca queda solo al pie de una página. */
    break-after: avoid; page-break-after: avoid;
  }
  .summary { color: ${MUTED}; }
  /* Un puesto/proyecto no se parte entre dos hojas. */
  .item { margin-bottom: ${px(5)}; break-inside: avoid; page-break-inside: avoid; }
  .item-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  /* El puesto va SOLO en su línea y la empresa en la siguiente, con las fechas
     al final. Así el parser recibe un cargo limpio y una línea
     "empresa | ciudad | rango" que sabe trocear; juntándolo todo en una sola
     línea leía "Empresa Ciudad Ago 2026" como nombre de la empresa. */
  .role { font-weight: 700; font-size: ${pt(10.4)}; }
  .org { font-weight: 600; color: ${ACCENT}; font-size: ${pt(9)}; }
  .dates { font-size: ${pt(8.8)}; color: ${MUTED}; white-space: nowrap; }
  /* Las fechas van alineadas a la derecha, así que en la capa de texto quedaban
     pegadas a la ciudad ("… Colombia Aug 2026") y un parser podía tragarse el
     mes dentro de la localidad. Este separador rompe la ambigüedad. */
  .item-head .dates::before { content: '|  '; color: #c7cad1; }
  .item p { color: ${MUTED}; margin-bottom: 2px; }
  /* La sangría va en padding, no en margin: los marcadores "outside" se dibujan
     en esa zona, y con padding 0 quedaban fuera de la caja y no se veían. */
  ul { margin: 1px 0 0 0; padding-left: ${pxList(15)}; }
  li { margin-bottom: 1px; color: ${INK}; }
  /* Evita líneas sueltas de un párrafo al cambiar de hoja. */
  p, li { orphans: 2; widows: 2; }
  .proj-links { font-size: ${pt(8.8)}; }
  .skills-grid { display: grid; grid-template-columns: 1fr; gap: 2px; }
  .skill-row b { font-weight: 700; }
  .skill-row span { color: ${MUTED}; }
  .edu-line { margin-bottom: ${px(3)}; break-inside: avoid; page-break-inside: avoid; }
  .edu-line small { color: ${MUTED}; }
  .cert-line { color: ${INK}; margin-bottom: 2px; }
  .cert-line small { color: ${MUTED}; }
</style>
</head>
<body>
  <header>
    <h1>${esc(data.name)}</h1>
    <div class="headline">${esc(data.headline)}</div>
    <div class="contact">
      <span>${esc(data.location)}</span>
      <span><a href="mailto:${data.email}">${data.email}</a></span>
      <span>${esc(data.phone)}</span>
      <span><a href="${data.website}">andrewgarcia.dev</a></span>
      ${linkedin ? `<span><a href="${linkedin.url}">linkedin.com/in/${esc(linkedin.username)}</a></span>` : ''}
      ${github ? `<span><a href="${github.url}">github.com/${esc(github.username)}</a></span>` : ''}
    </div>
  </header>

  <section>
    <h2>${esc(labels.sections.summary)}</h2>
    <p class="summary">${esc(data.summary)}</p>
  </section>

  <section>
    <h2>${esc(labels.sections.experience)}</h2>
    ${experience.map((e) => `
    <div class="item">
      <div class="role">${esc(e.position)}</div>
      <div class="item-head">
        <div class="org">${esc(e.company)} | ${esc(e.location)}</div>
        <div class="dates">${fmtRange(e.startDate, e.endDate)}</div>
      </div>
      <p>${esc(e.summary)}</p>
      <ul>${e.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
    </div>`).join('')}
  </section>

  <section>
    <h2>${esc(labels.sections.projects)}</h2>
    ${cvProjects.map((p) => {
      const demoUrl = pickLink(p, ['demo', 'site']);
      const repoUrl = pickLink(p, ['repo']);
      return `
    <div class="item">
      <div class="item-head">
        <div><span class="role">${esc(p.title)}</span></div>
        <div class="proj-links">
          ${demoUrl ? `<a href="${demoUrl}">${demoUrl.replace('https://', '')}</a>` : ''}
          ${demoUrl && repoUrl ? ' | ' : ''}
          ${repoUrl ? `<a href="${repoUrl}">${repoUrl.replace('https://github.com/', 'gh:')}</a>` : ''}
        </div>
      </div>
      <p>${esc(shortDesc(p.description))} <b>${esc(labels.stack)}:</b> ${p.techStack.map(esc).join(', ')}.</p>
    </div>`;
    }).join('')}
  </section>

  <section>
    <h2>${esc(labels.sections.skills)}</h2>
    <div class="skills-grid">
      ${data.skills.map((s) => `<div class="skill-row"><b>${esc(s.label)}:</b> <span>${esc(s.details)}</span></div>`).join('')}
      <div class="skill-row"><b>${esc(labels.spokenLanguages)}:</b> <span>${data.languages.map((l) => `${esc(l.label)} (${esc(l.details)})`).join(' | ')}</span></div>
    </div>
  </section>

  <section>
    <h2>${esc(labels.sections.education)}</h2>
    ${data.education
      // el curso corto de Next U ya aparece en Certifications — en el CV de 1 página no se duplica
      .filter((ed) => ed.institution !== 'Next U')
      .map((ed) => `
    <div class="edu-line item-head">
      <div><b>${esc(ed.degree)}, ${esc(ed.area)}</b> | ${esc(ed.institution)}</div>
      <div class="dates">${fmtRange(ed.startDate, ed.endDate)}</div>
    </div>`).join('')}
  </section>

  <section>
    <h2>${esc(labels.sections.certifications)}</h2>
    <p class="cert-line">${data.certifications.map((c) => `${esc(c.title)} (${esc(c.issuer)}, ${esc(c.date.split(' ').pop() ?? c.date)})`).join(' | ')}</p>
  </section>
</body>
</html>`;
}

// Render un PDF con Chrome/Edge headless.
// CHROME_PATH permite forzar el binario (contenedores, CI, Chromium de Playwright).
const browsers = [
  ...(process.env.CHROME_PATH ? [process.env.CHROME_PATH] : []),
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium',
];
const browser = browsers.find((b) => existsSync(b));
if (!browser) {
  throw new Error(
    'No se encontró Chrome/Edge para renderizar el PDF. Instala Chrome o define CHROME_PATH.',
  );
}

/** Nº de páginas del PDF, leyendo el /Count del árbol de páginas. */
function pdfPageCount(pdfPath: string): number {
  const raw = readFileSync(pdfPath).toString('latin1');
  const counts = [...raw.matchAll(/\/Count\s+(\d+)/g)].map((m) => Number(m[1]));
  return counts.length ? Math.max(...counts) : 1;
}

function printToPdf(html: string, htmlPath: string, pdfPath: string) {
  writeFileSync(htmlPath, html);
  execFileSync(browser!, [
    '--headless', '--disable-gpu', '--no-pdf-header-footer',
    // Chrome se niega a arrancar como root con el sandbox activo (contenedores/CI).
    // Solo lo desactivamos en ese caso; en un equipo normal el sandbox sigue puesto.
    ...(process.getuid?.() === 0 ? ['--no-sandbox'] : []),
    `--print-to-pdf=${pdfPath}`,
    pathToFileURL(htmlPath).href,
  ], { stdio: 'pipe' });
}

const TARGET_PAGES = 1;

/**
 * Pasos de ajuste, del más holgado al más apretado. Primero se cede espacio en
 * blanco (barato) y solo al final se toca la letra, con un piso de font=0.97
 * → 9.3pt × 0.97 ≈ 9.02pt, justo en el mínimo legible/ATS de 9pt.
 */
const FIT_STEPS: Fit[] = [
  { font: 1, space: 1 },
  { font: 1, space: 0.9 },
  { font: 1, space: 0.8 },
  { font: 1, space: 0.7 },
  { font: 1, space: 0.6 },
  { font: 0.98, space: 0.6 },
  { font: 0.97, space: 0.55 },
];

/**
 * Ajuste automático de páginas: se queda con el PRIMER paso (el más holgado)
 * que quepa en TARGET_PAGES. Si ninguno cabe, vuelve al espaciado completo y
 * deja que fluya a varias hojas — que ya salen bien formadas gracias a @page,
 * break-inside y break-after.
 */
function renderPdf(data: CVData, labels: CVLabels, outFile: string, jsonFile: string) {
  const tmp = mkdtempSync(join(tmpdir(), 'cv-'));
  const htmlPath = join(tmp, 'cv.html');
  const pdfTmp = join(tmp, 'cv.pdf');

  let chosen: { fit: Fit; pages: number } | null = null;
  for (const fit of FIT_STEPS) {
    printToPdf(buildHtml(data, labels, fit), htmlPath, pdfTmp);
    const pages = pdfPageCount(pdfTmp);
    if (pages <= TARGET_PAGES) {
      chosen = { fit, pages };
      break;
    }
  }

  if (!chosen) {
    // No cabe: mejor varias hojas legibles que una sola ilegible.
    const fit = FIT_STEPS[0];
    printToPdf(buildHtml(data, labels, fit), htmlPath, pdfTmp);
    chosen = { fit, pages: pdfPageCount(pdfTmp) };
  }

  const outPath = join(ROOT, 'public', outFile);
  copyFileSync(pdfTmp, outPath);
  rmSync(tmp, { recursive: true, force: true });

  // El .txt NO se construye a partir del HTML, sino leyendo la capa de texto del
  // PDF recién escrito. Así no puede desviarse de lo que ve un parser: es a la
  // vez la versión para pegar en cajas de "pega aquí tu CV" y la prueba de qué
  // se extrae realmente.
  const txtPath = outPath.replace(/\.pdf$/, '.txt');
  writeFileSync(txtPath, `${extractPdfText(readFileSync(outPath)).trim()}\n`, 'utf8');

  // Word, para los formularios que piden .docx (o cuya vista previa del parser
  // sale mal con el PDF): Workday y Taleo, sobre todo.
  writeFileSync(outPath.replace(/\.pdf$/, '.docx'), buildDocx(data, labels));

  // Versión estructurada, en el esquema abierto JSON Resume.
  writeFileSync(join(ROOT, 'public', jsonFile), `${JSON.stringify(toJsonResume(data), null, 2)}\n`, 'utf8');

  const { font, space } = chosen.fit;
  const notes = [
    space < 1 ? `espaciado ${Math.round(space * 100)}%` : '',
    font < 1 ? `letra ${Math.round(font * 100)}%` : '',
  ].filter(Boolean);
  const suffix = notes.length ? ` · ${notes.join(', ')}` : '';
  console.log(`✅ ${outFile} (${chosen.pages} pág.${suffix})`);
  console.log(`   + ${outFile.replace(/\.pdf$/, '.txt')} · ${outFile.replace(/\.pdf$/, '.docx')} · ${jsonFile}`);
}

renderPdf(cvData, EN_LABELS, 'Andrew_Garcia_Mosquera_CV.pdf', 'resume.json');
renderPdf(cvDataES, ES_LABELS, 'Andrew_Garcia_Mosquera_CV_ES.pdf', 'resume.es.json');
console.log('\nAudita el resultado con: npm run cv:lint');
