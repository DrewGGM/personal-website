/**
 * Genera el CV en .docx (OOXML) desde `cvData`, sin dependencias.
 *
 * Por qué existe habiendo ya un PDF: varias mediciones de 2026 dan mejor tasa
 * de extracción a DOCX que a PDF en la mayoría de los ATS probados, y Workday y
 * Taleo en particular vienen de un linaje que prefiere Word. El PDF sigue siendo
 * lo que se manda cuando el formulario no opina; el .docx es el que se sube
 * cuando el formulario dice "Word preferido" o cuando la vista previa del
 * parser sale mal.
 *
 * Mismo contenido, mismas etiquetas y mismo formato de fecha que el PDF: todo
 * sale de `cv-labels.ts` para que las dos salidas no puedan divergir.
 */
import type { CVData } from '../../src/types';
import { groupExperience } from '../../src/i18n/translations';
import { type CVLabels, ats, formatters } from './cv-labels';
import { createZip } from './zip';

/** Escapa para XML. Se aplica DESPUÉS de normalizar la puntuación. */
const x = (s: string): string =>
  ats(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

/** Un fragmento de texto con formato dentro de un párrafo. */
interface RunOpts {
  bold?: boolean;
  /** Tamaño en puntos; OOXML lo quiere en medios puntos. */
  size?: number;
  color?: string;
}

const run = (text: string, o: RunOpts = {}): string => {
  const props = [
    o.bold ? '<w:b/>' : '',
    o.color ? `<w:color w:val="${o.color}"/>` : '',
    o.size ? `<w:sz w:val="${Math.round(o.size * 2)}"/>` : '',
  ].join('');
  // xml:space="preserve" o Word se come los espacios de los extremos, que es
  // justo donde viven los separadores " | ".
  return `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ''}<w:t xml:space="preserve">${x(text)}</w:t></w:r>`;
};

interface ParaOpts {
  /** Espacio inferior en puntos. */
  after?: number;
  /** Viñeta con el formato de lista nativo de Word. */
  bullet?: boolean;
  /** Filete inferior, para los títulos de sección. */
  rule?: boolean;
}

const para = (runs: string, o: ParaOpts = {}): string => {
  const props = [
    o.bullet ? '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>' : '',
    o.bullet ? '<w:ind w:left="284" w:hanging="170"/>' : '',
    o.rule ? '<w:pBdr><w:bottom w:val="single" w:sz="4" w:space="1" w:color="D9DCE1"/></w:pBdr>' : '',
    `<w:spacing w:before="0" w:after="${Math.round((o.after ?? 0) * 20)}" w:line="240" w:lineRule="auto"/>`,
  ].join('');
  return `<w:p><w:pPr>${props}</w:pPr>${runs}</w:p>`;
};

const ACCENT = '4F46E5';
const MUTED = '4B5563';
const BODY = 9.5;

function buildDocumentXml(data: CVData, labels: CVLabels): string {
  const { fmtDate, fmtRange } = formatters(labels);
  const experience = groupExperience(data.experience).flatMap((g) => g.roles);
  const projects = data.projects.filter((p) => p.inCv).slice(0, 3);

  const heading = (text: string) =>
    para(run(text.toUpperCase(), { bold: true, size: 10.5, color: ACCENT }), { after: 3, rule: true });

  const body: string[] = [
    // ── Cabecera ──────────────────────────────────────────────────────────
    para(run(data.name, { bold: true, size: 19 })),
    para(run(data.headline, { bold: true, size: 11, color: ACCENT }), { after: 2 }),
    // Contacto en una sola línea del CUERPO, nunca en el header del documento:
    // lo que va en el header de Word muchos parsers ni lo miran.
    para(
      run(
        [
          data.location,
          data.email,
          data.phone,
          data.website.replace(/^https?:\/\//, ''),
          ...data.socialNetworks.map((s) =>
            `${s.url.replace(/^https?:\/\/(www\.)?/, '')}`,
          ),
        ].join('  |  '),
        { size: 8.8, color: MUTED },
      ),
      { after: 8 },
    ),

    // ── Perfil ────────────────────────────────────────────────────────────
    heading(labels.sections.summary),
    para(run(data.summary, { size: BODY, color: MUTED }), { after: 6 }),

    // ── Experiencia ───────────────────────────────────────────────────────
    heading(labels.sections.experience),
    ...experience.flatMap((e) => [
      para(run(e.position, { bold: true, size: 10.4 })),
      // Empresa, ciudad y rango en una línea separados por '|', y el cargo solo
      // en la suya: es el reparto que un parser trocea sin ambigüedad.
      para(
        run(`${e.company} | ${e.location} | `, { bold: true, size: BODY, color: ACCENT }) +
          run(fmtRange(e.startDate, e.endDate), { size: 8.8, color: MUTED }),
        { after: 1 },
      ),
      para(run(e.summary, { size: BODY, color: MUTED }), { after: 1 }),
      ...e.highlights.map((h) => para(run(h, { size: BODY }), { bullet: true })),
      para('', { after: 4 }),
    ]),

    // ── Proyectos ─────────────────────────────────────────────────────────
    heading(labels.sections.projects),
    ...projects.flatMap((p) => [
      para(run(p.title, { bold: true, size: 10.4 })),
      para(
        run(`${p.description.split(/(?<=\.)\s+/)[0]} `, { size: BODY, color: MUTED }) +
          run(`${labels.stack}: `, { bold: true, size: BODY }) +
          run(`${p.techStack.join(', ')}.`, { size: BODY, color: MUTED }),
        { after: 4 },
      ),
    ]),

    // ── Habilidades ───────────────────────────────────────────────────────
    heading(labels.sections.skills),
    ...data.skills.map((s) =>
      para(run(`${s.label}: `, { bold: true, size: BODY }) + run(s.details, { size: BODY, color: MUTED })),
    ),
    para(
      run(`${labels.spokenLanguages}: `, { bold: true, size: BODY }) +
        run(data.languages.map((l) => `${l.label} (${l.details})`).join(' | '), { size: BODY, color: MUTED }),
      { after: 6 },
    ),

    // ── Formación ─────────────────────────────────────────────────────────
    heading(labels.sections.education),
    ...data.education
      // el curso corto de Next U ya aparece en Certificaciones — no se duplica
      .filter((ed) => ed.institution !== 'Next U')
      .map((ed) =>
        para(
          run(`${ed.degree}, ${ed.area}`, { bold: true, size: BODY }) +
            run(` | ${ed.institution} | `, { size: BODY }) +
            run(`${fmtDate(ed.startDate)} - ${fmtDate(ed.endDate)}`, { size: 8.8, color: MUTED }),
          { after: 2 },
        ),
      ),
    para('', { after: 4 }),

    // ── Certificaciones ───────────────────────────────────────────────────
    heading(labels.sections.certifications),
    para(
      run(
        data.certifications
          .map((c) => `${c.title} (${c.issuer}, ${c.date.split(' ').pop() ?? c.date})`)
          .join(' | '),
        { size: BODY },
      ),
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>${body.join('')}
<w:sectPr>
  <w:pgSz w:w="12240" w:h="15840"/>
  <w:pgMar w:top="720" w:right="900" w:bottom="720" w:left="900" w:header="0" w:footer="0" w:gutter="0"/>
</w:sectPr>
</w:body>
</w:document>`;
}

// Una sola definición de viñeta. Es la lista NATIVA de Word: los parsers la
// entienden como tal, a diferencia de un "-" escrito a mano al principio de la
// línea, que se confunde con un guion cualquiera.
const NUMBERING_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:abstractNum w:abstractNumId="0">
    <w:lvl w:ilvl="0">
      <w:start w:val="1"/>
      <w:numFmt w:val="bullet"/>
      <w:lvlText w:val="&#xF0B7;"/>
      <w:lvlJc w:val="left"/>
      <w:pPr><w:ind w:left="284" w:hanging="170"/></w:pPr>
      <w:rPr><w:rFonts w:ascii="Symbol" w:hAnsi="Symbol" w:hint="default"/></w:rPr>
    </w:lvl>
  </w:abstractNum>
  <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
</w:numbering>`;

// Arial en todo el documento: de la lista corta que las guías de ATS dan por
// segura, y la misma familia que usa el PDF.
const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault><w:rPr>
      <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
      <w:sz w:val="19"/><w:szCs w:val="19"/>
      <w:color w:val="111827"/>
    </w:rPr></w:rPrDefault>
    <w:pPrDefault><w:pPr>
      <w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/>
    </w:pPr></w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/><w:qFormat/>
  </w:style>
</w:styles>`;

const CONTENT_TYPES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
</Types>`;

const ROOT_RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
</Relationships>`;

const DOC_RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
</Relationships>`;

/** El .docx completo, listo para escribir a disco. */
export function buildDocx(data: CVData, labels: CVLabels): Buffer {
  const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:title>${x(data.name)} - CV</dc:title>
  <dc:creator>${x(data.name)}</dc:creator>
  <dc:language>${labels.htmlLang}</dc:language>
</cp:coreProperties>`;

  return createZip([
    { path: '[Content_Types].xml', data: CONTENT_TYPES_XML },
    { path: '_rels/.rels', data: ROOT_RELS_XML },
    { path: 'docProps/core.xml', data: core },
    { path: 'word/document.xml', data: buildDocumentXml(data, labels) },
    { path: 'word/styles.xml', data: STYLES_XML },
    { path: 'word/numbering.xml', data: NUMBERING_XML },
    { path: 'word/_rels/document.xml.rels', data: DOC_RELS_XML },
  ]);
}
