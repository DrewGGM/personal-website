/**
 * Auditoría ATS de los PDF generados por `npm run cv`.
 *
 *   npm run cv:lint
 *
 * No opina sobre el HTML de origen: abre el PDF final, le extrae la capa de
 * texto y comprueba sobre ESE texto —el mismo que obtiene un `pdftotext`, que
 * es literalmente lo que hacen Workday, Greenhouse, Lever o iCIMS— que sigue
 * estando todo lo que un parser necesita para rellenar un formulario.
 *
 * Sale con código 1 si falla algún check, para poder colgarlo de CI.
 */
import { readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CVData } from '../src/types';
import { cvData } from '../src/data/cvData';
import { cvDataES } from '../src/data/cvData.es';
import { extractPdfPages } from './lib/pdf-text';
import { readZipEntry } from './lib/zip';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

type Level = 'fail' | 'warn';

interface Issue {
  level: Level;
  check: string;
  detail: string;
}

/** Normaliza para comparar: sin acentos, sin puntuación tipográfica, minúsculas. */
const norm = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[·•]/g, '|')
    .replace(/[–—]/g, '-')
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();

/** Meses reconocidos en los dos idiomas que emite el generador. */
const MONTHS =
  '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|ene|abr|ago|dic)';
/**
 * El patrón que buscan los parsers para construir la cronología laboral.
 * Deliberadamente NO acepta raya (–) ni "Desde X": si el CV emite eso, esto
 * falla, que es justo lo que queremos detectar.
 */
const DATE_RANGE = new RegExp(`${MONTHS}\\s+\\d{4}\\s+-\\s+(?:${MONTHS}\\s+\\d{4}|present|actual)`, 'i');

/**
 * Texto de un .docx, leyendo `word/document.xml` del paquete.
 *
 * Un párrafo de OOXML puede venir troceado en varios `<w:t>` (un cambio de
 * negrita basta), así que se concatenan y el corte de línea sólo llega en
 * `</w:p>` — igual que lo reconstruye el parser de un ATS.
 */
function extractDocxText(buf: Buffer): string {
  const xml = readZipEntry(buf, 'word/document.xml')?.toString('utf8') ?? '';
  return xml
    .replace(/<w:p\b[^>]*\/>/g, '\n')
    .replace(/<\/w:p>/g, '\n')
    .replace(/<w:tab\b[^>]*\/>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

/** Lo que la auditoría necesita de un fichero, sea PDF o DOCX. */
interface Artifact {
  label: string;
  /** Texto tal y como lo obtendría el parser. */
  text: string;
  /** Páginas del PDF; en un .docx la paginación la decide Word, así que va nulo. */
  pages: string[] | null;
  sizeKb: number;
}

function audit(artifact: Artifact, data: CVData): Issue[] {
  const issues: Issue[] = [];
  const add = (level: Level, check: string, detail: string) => issues.push({ level, check, detail });

  const { text, pages, sizeKb } = artifact;
  const flat = norm(text);

  // ── El fichero tiene texto extraíble ────────────────────────────────────
  // Un PDF que es una imagen escaneada extrae ~0 caracteres y ningún ATS lo lee.
  if (text.length < 1500) {
    add('fail', 'capa de texto', `sólo ${text.length} caracteres extraídos — ¿fichero rasterizado o vacío?`);
    return issues; // sin texto, el resto de checks no dice nada útil
  }

  // ── Contacto: los campos que TODO formulario autorrellena ───────────────
  const contact: [string, string][] = [
    ['nombre', data.name],
    ['email', data.email],
    ['teléfono', data.phone],
    ['web', data.website.replace(/^https?:\/\//, '')],
  ];
  for (const [field, value] of contact) {
    if (!flat.includes(norm(value))) add('fail', `contacto: ${field}`, `"${value}" no aparece en el texto`);
  }
  for (const social of data.socialNetworks) {
    const handle = norm(social.username);
    if (!flat.includes(handle)) add('fail', `contacto: ${social.network}`, `usuario "${social.username}" no aparece`);
  }

  // El contacto debe ir en el CUERPO. Si vive en el header/footer del papel,
  // muchos parsers ni lo miran — y aquí eso se traduce en no estar en la 1ª página.
  if (pages && !norm(pages[0]).includes(norm(data.email))) {
    add('fail', 'contacto en el cuerpo', 'el email no está en la primera página');
  }

  // ── Encabezados de sección estándar ─────────────────────────────────────
  // Los parsers segmentan el CV por estos títulos; uno creativo ("Mi trayecto")
  // hace que toda la sección caiga en el saco de "texto suelto".
  const headings = [
    ['experiencia', /\b(experience|experiencia)\b/i],
    ['formación', /\b(education|educacion|formacion)\b/i],
    ['habilidades', /\b(skills|habilidades)\b/i],
  ] as const;
  // Contra el texto normalizado: si no, "EDUCACIÓN" no casa con /educacion/.
  for (const [name, re] of headings) {
    if (!re.test(flat)) add('fail', `sección: ${name}`, 'no se encontró el encabezado estándar');
  }

  // ── Historial laboral completo y fechable ───────────────────────────────
  for (const job of data.experience) {
    if (!flat.includes(norm(job.position))) {
      add('fail', 'puesto perdido', `"${job.position}" no aparece en el texto`);
    }
    if (!flat.includes(norm(job.company))) {
      add('fail', 'empresa perdida', `"${job.company}" no aparece en el texto`);
    }
  }

  const ranges = text.match(new RegExp(DATE_RANGE, 'gi')) ?? [];
  if (ranges.length < data.experience.length) {
    add(
      'fail',
      'rangos de fecha',
      `${ranges.length} rangos parseables para ${data.experience.length} puestos — algún puesto quedará sin fechar`,
    );
  }

  // Separadores que los parsers antiguos no reconocen como rango de fechas.
  const badRange = text.match(new RegExp(`${MONTHS}\\s+\\d{4}\\s*[–—/]\\s*\\S`, 'i'));
  if (badRange) add('fail', 'separador de fechas', `usa raya o barra: "${badRange[0]}" — debe ser " - "`);
  if (/\b(starting|desde|since)\s+\w{3}\s+\d{4}/i.test(text)) {
    add('fail', 'rango incompleto', 'hay fechas tipo "Starting Aug 2026" que no forman un rango parseable');
  }

  // ── Formación ───────────────────────────────────────────────────────────
  // Se avisa, no se falla: el CV de una página omite entradas a propósito.
  for (const edu of data.education) {
    if (!flat.includes(norm(edu.institution))) {
      add('warn', 'formación omitida', `"${edu.institution}" no aparece (¿recorte de una página?)`);
    }
  }

  // ── Símbolos que ensucian la extracción ─────────────────────────────────
  const symbols = [...new Set(text.match(/[·•–—…“”’]/g) ?? [])];
  if (symbols.length) {
    add('warn', 'puntuación tipográfica', `quedan símbolos no-ASCII: ${symbols.join(' ')}`);
  }

  // ── Riesgos de reconocimiento de entidades ──────────────────────────────
  // Un nombre en MAYÚSCULAS SOSTENIDAS degrada el NER que identifica empresas,
  // y un " - " dentro del nombre parece un separador de campo o de rango.
  for (const job of data.experience) {
    const letters = job.company.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]/g, '');
    const upper = letters.replace(/[^A-ZÁÉÍÓÚÑ]/g, '').length;
    if (letters.length > 6 && upper / letters.length > 0.7) {
      add('warn', 'empresa en mayúsculas', `"${job.company}" — en Type Case parsea mejor`);
    }
    if (/\s-\s/.test(job.company)) {
      add('warn', 'guion en el nombre', `"${job.company}" — el " - " se confunde con un separador de campo`);
    }
  }

  // ── Legibilidad y peso ──────────────────────────────────────────────────
  if (pages && pages.length > 2) {
    add('warn', 'longitud', `${pages.length} páginas — a partir de 3 baja la tasa de paso`);
  }
  if (sizeKb > 1024) add('warn', 'tamaño', `${sizeKb} KB — algunos ATS truncan por encima de 1 MB`);

  const extent = pages ? `${pages.length} pág.` : 'paginado por Word';
  console.log(`\n── ${artifact.label} · ${extent} · ${sizeKb} KB · ${text.length} caracteres extraídos`);
  return issues;
}

const kb = (path: string) => Math.round(statSync(path).size / 1024);

/** Los dos ficheros que se suben a un formulario, por idioma. */
function artifactsFor(pdfFile: string, label: string): Artifact[] {
  const pdfPath = join(ROOT, 'public', pdfFile);
  const docxPath = pdfPath.replace(/\.pdf$/, '.docx');
  const pages = extractPdfPages(readFileSync(pdfPath));

  return [
    { label: `${label} · PDF`, text: pages.join('\n'), pages, sizeKb: kb(pdfPath) },
    {
      label: `${label} · DOCX`,
      text: extractDocxText(readFileSync(docxPath)),
      pages: null,
      sizeKb: kb(docxPath),
    },
  ];
}

const targets: Artifact[] = [
  ...artifactsFor('Andrew_Garcia_Mosquera_CV.pdf', 'CV inglés').map((a) => a),
  ...artifactsFor('Andrew_Garcia_Mosquera_CV_ES.pdf', 'CV español'),
];

let failures = 0;

for (const artifact of targets) {
  const data = artifact.label.includes('español') ? cvDataES : cvData;
  const issues = audit(artifact, data);
  if (!issues.length) {
    console.log('   ✅ sin incidencias');
    continue;
  }
  for (const issue of issues) {
    console.log(`   ${issue.level === 'fail' ? '❌' : '⚠️ '} ${issue.check}: ${issue.detail}`);
  }
  failures += issues.filter((i) => i.level === 'fail').length;
}

console.log(
  failures
    ? `\n${failures} check(s) en rojo. El CV NO está listo para enviarse.\n`
    : '\nSin errores. Los avisos son recomendaciones, no bloqueantes.\n',
);
process.exit(failures ? 1 : 0);
