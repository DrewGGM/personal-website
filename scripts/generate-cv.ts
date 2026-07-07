/**
 * CV generator — single source of truth: src/data/cvData.ts
 * Builds an ATS-friendly, print-optimized HTML resume and renders it to
 * public/Andrew_Garcia_Mosquera_CV.pdf with headless Chrome/Edge.
 *
 *   npm run cv
 *
 * ATS notes: single column, real text (no images/tables for content), standard
 * section headings (Experience/Education/Skills), machine-readable dates.
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
const cvProjects = cvData.projects.filter((p) => p.status === 'completed' && (p.demoUrl || p.githubUrl)).slice(0, 3);

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
    color: ${INK}; font-size: 10.2pt; line-height: 1.45;
    padding: 44px 52px;
  }
  a { color: ${ACCENT}; text-decoration: none; }
  header { border-bottom: 2.5px solid ${ACCENT}; padding-bottom: 12px; margin-bottom: 14px; }
  h1 { font-size: 21pt; font-weight: 800; letter-spacing: -0.3px; }
  .headline { font-size: 11.5pt; color: ${ACCENT}; font-weight: 600; margin-top: 2px; }
  .contact { margin-top: 6px; font-size: 9pt; color: ${MUTED}; }
  .contact span + span::before { content: '  ·  '; color: #c7cad1; }
  h2 {
    font-size: 10.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 1.4px;
    color: ${ACCENT}; margin: 14px 0 7px; padding-bottom: 3px; border-bottom: 1px solid #e5e7eb;
  }
  .summary { color: ${MUTED}; }
  .item { margin-bottom: 10px; page-break-inside: avoid; }
  .item-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .role { font-weight: 700; font-size: 10.8pt; }
  .org { font-weight: 600; color: ${ACCENT}; }
  .dates { font-size: 9pt; color: ${MUTED}; white-space: nowrap; }
  .loc { font-size: 9pt; color: ${MUTED}; margin-bottom: 3px; }
  .item p { color: ${MUTED}; margin-bottom: 3px; }
  ul { margin: 2px 0 0 16px; }
  li { margin-bottom: 2px; color: ${INK}; }
  .proj-links { font-size: 9pt; }
  .skills-grid { display: grid; grid-template-columns: 1fr; gap: 3px; }
  .skill-row b { font-weight: 700; }
  .skill-row span { color: ${MUTED}; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 0 28px; }
  .cert { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 3px; }
  .cert small { color: ${MUTED}; white-space: nowrap; }
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
      <p>${esc(p.description)}</p>
      <p><b>Stack:</b> ${p.techStack.map(esc).join(', ')}</p>
    </div>`).join('')}
  </section>

  <section>
    <h2>Skills</h2>
    <div class="skills-grid">
      ${cvData.skills.map((s) => `<div class="skill-row"><b>${esc(s.label)}:</b> <span>${esc(s.details)}</span></div>`).join('')}
    </div>
  </section>

  <div class="two-col">
    <section>
      <h2>Education</h2>
      ${cvData.education.map((ed) => `
      <div class="item">
        <div class="role">${esc(ed.degree)} — ${esc(ed.area)}</div>
        <div class="loc">${esc(ed.institution)} · ${fmtDate(ed.startDate)} – ${fmtDate(ed.endDate)}</div>
      </div>`).join('')}
      <h2>Languages</h2>
      ${cvData.languages.map((l) => `<div class="skill-row"><b>${esc(l.label)}:</b> <span>${esc(l.details)}</span></div>`).join('')}
    </section>
    <section>
      <h2>Certifications</h2>
      ${cvData.certifications.map((c) => `<div class="cert"><span>${esc(c.title)} — ${esc(c.issuer)}</span><small>${esc(c.date)}</small></div>`).join('')}
    </section>
  </div>
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
