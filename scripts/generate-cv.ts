/**
 * CV generator — single source of truth: src/data/cvData.ts
 * Builds an ATS-friendly, print-optimized HTML resume and renders it to
 * public/Andrew_Garcia_Mosquera_CV.pdf with headless Chrome/Edge.
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
import { cvData } from '../src/data/cvData';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_PDF = join(ROOT, 'public', 'Andrew_Garcia_Mosquera_CV.pdf');

const ACCENT = '#4f46e5';
const INK = '#111827';
const MUTED = '#4b5563';

function fmtDate(d: string): string {
  if (!d || d === 'present') return 'Present';
  const [y, m] = d.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return m ? `${months[Number(m) - 1]} ${y}` : y;
}
const esc = (s: string) => (s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));

const linkedin = cvData.socialNetworks.find((s) => s.network === 'LinkedIn');
const github = cvData.socialNetworks.find((s) => s.network === 'GitHub');

// Proyectos destacados en el CV: los completados con link (máx 3).
// En el CV va solo la PRIMERA frase de la descripción (regla de 1 página); el detalle vive en la web.
const cvProjects = cvData.projects.filter((p) => p.status === 'completed' && (p.demoUrl || p.githubUrl)).slice(0, 3);
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

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(cvData.name)} — CV</title>
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
    <h1>${esc(cvData.name)}</h1>
    <div class="headline">${esc(cvData.headline)}</div>
    <div class="contact">
      <span>${esc(cvData.location)}</span>
      <span><a href="mailto:${cvData.email}">${cvData.email}</a></span>
      <span>${esc(cvData.phone)}</span>
      <span><a href="${cvData.website}">andrewgarcia.dev</a></span>
      ${linkedin ? `<span><a href="${linkedin.url}">linkedin.com/in/${esc(linkedin.username)}</a></span>` : ''}
      ${github ? `<span><a href="${github.url}">github.com/${esc(github.username)}</a></span>` : ''}
    </div>
  </header>

  <section>
    <h2>Summary</h2>
    <p class="summary">${esc(cvData.summary)}</p>
  </section>

  <section>
    <h2>Experience</h2>
    ${cvData.experience.map((e) => `
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
    <h2>Projects</h2>
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
      <p>${esc(shortDesc(p.description))} <b>Stack:</b> ${p.techStack.map(esc).join(', ')}.</p>
    </div>`).join('')}
  </section>

  <section>
    <h2>Skills</h2>
    <div class="skills-grid">
      ${cvData.skills.map((s) => `<div class="skill-row"><b>${esc(s.label)}:</b> <span>${esc(s.details)}</span></div>`).join('')}
      <div class="skill-row"><b>Spoken Languages:</b> <span>${cvData.languages.map((l) => `${esc(l.label)} (${esc(l.details)})`).join(' · ')}</span></div>
    </div>
  </section>

  <section>
    <h2>Education</h2>
    ${cvData.education
      // el curso corto de Next U ya aparece en Certifications — en el CV de 1 página no se duplica
      .filter((ed) => ed.institution !== 'Next U')
      .map((ed) => `
    <div class="edu-line"><b>${esc(ed.degree)} — ${esc(ed.area)}</b>, ${esc(ed.institution)} <small>· ${fmtDate(ed.startDate)} – ${fmtDate(ed.endDate)}</small></div>`).join('')}
  </section>

  <section>
    <h2>Certifications</h2>
    <p class="cert-line">${cvData.certifications.map((c) => `${esc(c.title)} (${esc(c.issuer)}, ${esc(c.date.split(' ').pop() ?? c.date)})`).join(' · ')}</p>
  </section>
</body>
</html>`;

// Render a PDF con Chrome/Edge headless.
const tmp = mkdtempSync(join(tmpdir(), 'cv-'));
const htmlPath = join(tmp, 'cv.html');
writeFileSync(htmlPath, html);

const browsers = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium',
];
const browser = browsers.find((b) => existsSync(b));
if (!browser) throw new Error('No se encontró Chrome/Edge para renderizar el PDF');

const pdfTmp = join(tmp, 'cv.pdf');
execFileSync(browser, [
  '--headless', '--disable-gpu', '--no-pdf-header-footer',
  `--print-to-pdf=${pdfTmp}`,
  pathToFileURL(htmlPath).href,
], { stdio: 'pipe' });

copyFileSync(pdfTmp, OUT_PDF);
rmSync(tmp, { recursive: true, force: true });
console.log(`✅ CV regenerado desde cvData.ts → ${OUT_PDF}`);
