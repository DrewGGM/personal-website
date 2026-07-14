/**
 * CV generator — single source of truth: src/data/cvData.ts (EN) + src/data/cvData.es.ts (ES)
 * Builds an ATS-friendly, print-optimized HTML resume and renders it with
 * headless Chrome/Edge to:
 *   - public/Andrew_Garcia_Mosquera_CV.pdf     (English)
 *   - public/Andrew_Garcia_Mosquera_CV_ES.pdf  (Spanish)
 *
 *   npm run cv
 *
 * Conventions applied (researched, 2026):
 *  - ONE page for <10 years of experience; every line must earn its place.
 *  - STRICT single column (multi-column/tables/headers break older ATS parsers).
 *  - Standard section headings (Summary/Experience/Projects/Skills/Education).
 *  - XYZ-style bullets: what you built + measurable outcome, real text only.
 */
import { writeFileSync, existsSync, mkdtempSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import type { CVData } from '../src/types';
import { cvData } from '../src/data/cvData';
import { cvDataES } from '../src/data/cvData.es';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const ACCENT = '#4f46e5';
const INK = '#111827';
const MUTED = '#4b5563';

// Etiquetas i18n: todo lo que no vive en cvData (títulos de sección, meses, "Presente").
interface CVLabels {
  htmlLang: string;
  present: string;
  months: string[];
  sections: {
    summary: string;
    experience: string;
    projects: string;
    skills: string;
    education: string;
    certifications: string;
  };
  spokenLanguages: string;
  stack: string;
}

const EN_LABELS: CVLabels = {
  htmlLang: 'en',
  present: 'Present',
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  sections: {
    summary: 'Summary',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
    education: 'Education',
    certifications: 'Certifications',
  },
  spokenLanguages: 'Spoken Languages',
  stack: 'Stack',
};

const ES_LABELS: CVLabels = {
  htmlLang: 'es',
  present: 'Actual',
  months: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  sections: {
    summary: 'Perfil',
    experience: 'Experiencia',
    projects: 'Proyectos',
    skills: 'Habilidades',
    education: 'Educación',
    certifications: 'Certificaciones',
  },
  spokenLanguages: 'Idiomas',
  stack: 'Stack',
};

const esc = (s: string) => (s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));

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

function buildHtml(data: CVData, labels: CVLabels): string {
  const fmtDate = (d: string): string => {
    if (!d || d === 'present') return labels.present;
    const [y, m] = d.split('-');
    return m ? `${labels.months[Number(m) - 1]} ${y}` : y;
  };

  const linkedin = data.socialNetworks.find((s) => s.network === 'LinkedIn');
  const github = data.socialNetworks.find((s) => s.network === 'GitHub');

  // Proyectos destacados en el CV: los completados con link (máx 3).
  // En el CV va solo la PRIMERA frase de la descripción (regla de 1 página); el detalle vive en la web.
  const cvProjects = data.projects.filter((p) => p.status === 'completed' && (p.demoUrl || p.githubUrl)).slice(0, 3);

  return `<!doctype html>
<html lang="${labels.htmlLang}">
<head>
<meta charset="utf-8">
<title>${esc(data.name)} — CV</title>
<style>
  @page { size: Letter; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    color: ${INK}; font-size: 9.3pt; line-height: 1.26;
    padding: 20px 42px 16px;
  }
  a { color: ${ACCENT}; text-decoration: none; }
  header { border-bottom: 2.5px solid ${ACCENT}; padding-bottom: 8px; margin-bottom: 8px; }
  h1 { font-size: 19pt; font-weight: 800; letter-spacing: -0.3px; }
  .headline { font-size: 11pt; color: ${ACCENT}; font-weight: 600; margin-top: 1px; }
  .contact { margin-top: 5px; font-size: 8.8pt; color: ${MUTED}; }
  .contact span + span::before { content: '  ·  '; color: #c7cad1; }
  h2 {
    font-size: 10pt; font-weight: 800; text-transform: uppercase; letter-spacing: 1.3px;
    color: ${ACCENT}; margin: 7px 0 3px; padding-bottom: 2px; border-bottom: 1px solid #e5e7eb;
  }
  .summary { color: ${MUTED}; }
  .item { margin-bottom: 5px; page-break-inside: avoid; }
  .item-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .role { font-weight: 700; font-size: 10.4pt; }
  .org { font-weight: 600; color: ${ACCENT}; }
  .dates { font-size: 8.8pt; color: ${MUTED}; white-space: nowrap; }
  .loc { font-size: 8.8pt; color: ${MUTED}; margin-bottom: 2px; }
  .item p { color: ${MUTED}; margin-bottom: 2px; }
  ul { margin: 1px 0 0 15px; }
  li { margin-bottom: 1px; color: ${INK}; }
  .proj-links { font-size: 8.8pt; }
  .skills-grid { display: grid; grid-template-columns: 1fr; gap: 2px; }
  .skill-row b { font-weight: 700; }
  .skill-row span { color: ${MUTED}; }
  .edu-line { margin-bottom: 3px; }
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
    ${data.experience.map((e) => `
    <div class="item">
      <div class="item-head">
        <div><span class="role">${esc(e.position)}</span> — <span class="org">${esc(e.company)}</span></div>
        <div class="dates">${fmtDate(e.startDate)} – ${fmtDate(e.endDate)}</div>
      </div>
      <div class="loc">${esc(e.location)}</div>
      <p>${esc(e.summary)}</p>
      <ul>${e.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
    </div>`).join('')}
  </section>

  <section>
    <h2>${esc(labels.sections.projects)}</h2>
    ${cvProjects.map((p) => `
    <div class="item">
      <div class="item-head">
        <div><span class="role">${esc(p.title)}</span></div>
        <div class="proj-links">
          ${p.demoUrl ? `<a href="${p.demoUrl}">${p.demoUrl.replace('https://', '')}</a>` : ''}
          ${p.demoUrl && p.githubUrl ? ' · ' : ''}
          ${p.githubUrl ? `<a href="${p.githubUrl}">${p.githubUrl.replace('https://github.com/', 'gh:')}</a>` : ''}
        </div>
      </div>
      <p>${esc(shortDesc(p.description))} <b>${esc(labels.stack)}:</b> ${p.techStack.map(esc).join(', ')}.</p>
    </div>`).join('')}
  </section>

  <section>
    <h2>${esc(labels.sections.skills)}</h2>
    <div class="skills-grid">
      ${data.skills.map((s) => `<div class="skill-row"><b>${esc(s.label)}:</b> <span>${esc(s.details)}</span></div>`).join('')}
      <div class="skill-row"><b>${esc(labels.spokenLanguages)}:</b> <span>${data.languages.map((l) => `${esc(l.label)} (${esc(l.details)})`).join(' · ')}</span></div>
    </div>
  </section>

  <section>
    <h2>${esc(labels.sections.education)}</h2>
    ${data.education
      // el curso corto de Next U ya aparece en Certifications — en el CV de 1 página no se duplica
      .filter((ed) => ed.institution !== 'Next U')
      .map((ed) => `
    <div class="edu-line"><b>${esc(ed.degree)} — ${esc(ed.area)}</b>, ${esc(ed.institution)} <small>· ${fmtDate(ed.startDate)} – ${fmtDate(ed.endDate)}</small></div>`).join('')}
  </section>

  <section>
    <h2>${esc(labels.sections.certifications)}</h2>
    <p class="cert-line">${data.certifications.map((c) => `${esc(c.title)} (${esc(c.issuer)}, ${esc(c.date.split(' ').pop() ?? c.date)})`).join(' · ')}</p>
  </section>
</body>
</html>`;
}

// Render un PDF con Chrome/Edge headless.
const browsers = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium',
];
const browser = browsers.find((b) => existsSync(b));
if (!browser) throw new Error('No se encontró Chrome/Edge para renderizar el PDF');

function renderPdf(data: CVData, labels: CVLabels, outFile: string) {
  const tmp = mkdtempSync(join(tmpdir(), 'cv-'));
  const htmlPath = join(tmp, 'cv.html');
  writeFileSync(htmlPath, buildHtml(data, labels));

  const pdfTmp = join(tmp, 'cv.pdf');
  execFileSync(browser!, [
    '--headless', '--disable-gpu', '--no-pdf-header-footer',
    `--print-to-pdf=${pdfTmp}`,
    pathToFileURL(htmlPath).href,
  ], { stdio: 'pipe' });

  const outPath = join(ROOT, 'public', outFile);
  copyFileSync(pdfTmp, outPath);
  rmSync(tmp, { recursive: true, force: true });
  console.log(`✅ CV regenerado → ${outPath}`);
}

renderPdf(cvData, EN_LABELS, 'Andrew_Garcia_Mosquera_CV.pdf');
renderPdf(cvDataES, ES_LABELS, 'Andrew_Garcia_Mosquera_CV_ES.pdf');
