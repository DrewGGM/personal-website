/**
 * Extractor de la capa de texto de un PDF — sin dependencias.
 *
 * Existe para una sola cosa: ver EXACTAMENTE lo que ve un ATS. Los parsers de
 * Workday, Greenhouse, Lever o iCIMS no leen metadatos XMP ni adjuntos JSON-LD;
 * corren un `pdftotext` y aplican regex/NER sobre el resultado. Si algo no sale
 * aquí, para el ATS no existe.
 *
 * Alcance deliberado: PDFs generados por Chrome/Skia headless (los de `npm run
 * cv`) — objetos clásicos `N 0 obj`, sin object streams, FlateDecode, fuentes
 * Type0/Identity-H con /ToUnicode. No pretende ser un lector de PDF general.
 */
import { inflateSync } from 'node:zlib';

interface PdfObject {
  dict: string;
  /** Contenido del stream ya descomprimido, si el objeto tiene uno. */
  data: Buffer | null;
}

/** Un fragmento de texto con su posición en la página, en unidades de usuario. */
interface Run {
  text: string;
  x: number;
  y: number;
  /**
   * El fragmento abre un bloque de texto nuevo (lo posicionó un `Tm` absoluto)
   * en lugar de continuar el anterior (`Td`, que avanza el ancho de un glifo).
   *
   * Es la señal que distingue "dos cajas distintas que cayeron en la misma
   * línea" —el puesto a la izquierda y las fechas a la derecha— de "letras
   * consecutivas de la misma palabra": lo primero necesita un espacio entre
   * medias, lo segundo no.
   */
  fresh: boolean;
}

/** Divide el fichero en objetos `N 0 obj … endobj`, inflando los streams. */
function parseObjects(buf: Buffer): Map<number, PdfObject> {
  const objects = new Map<number, PdfObject>();
  const raw = buf.toString('latin1');
  const header = /(\d+)\s+\d+\s+obj/g;

  for (let m = header.exec(raw); m; m = header.exec(raw)) {
    const num = Number(m[1]);
    const bodyStart = m.index + m[0].length;
    const end = raw.indexOf('endobj', bodyStart);
    if (end === -1) continue;

    const body = raw.slice(bodyStart, end);
    const streamAt = body.indexOf('stream');
    let dict = body;
    let data: Buffer | null = null;

    if (streamAt !== -1) {
      dict = body.slice(0, streamAt);
      // Tras `stream` va CRLF o LF antes del primer byte de datos.
      let from = bodyStart + streamAt + 'stream'.length;
      if (raw[from] === '\r') from++;
      if (raw[from] === '\n') from++;
      const to = raw.indexOf('endstream', from);
      if (to !== -1) {
        const slice = buf.subarray(from, to);
        try {
          data = /\/Filter\s*\/FlateDecode/.test(dict) ? inflateSync(slice) : slice;
        } catch {
          // Stream ilegible (imagen rota, filtro no soportado): se ignora.
          data = null;
        }
      }
    }

    objects.set(num, { dict, data });
  }

  return objects;
}

/** `/Key 12 0 R` → 12 */
const refOf = (dict: string, key: string): number | null => {
  const m = new RegExp(`/${key}\\s+(\\d+)\\s+\\d+\\s+R`).exec(dict);
  return m ? Number(m[1]) : null;
};

const hexToChars = (hex: string): string => {
  // Los destinos de un bfchar/bfrange son UTF-16BE y pueden ser varios chars
  // (ligaduras: un glifo "ﬁ" mapea a la pareja "fi").
  let out = '';
  for (let i = 0; i + 3 < hex.length + 1; i += 4) out += String.fromCharCode(parseInt(hex.slice(i, i + 4), 16));
  return out;
};

/**
 * Parsea un CMap /ToUnicode a `código de glifo → texto`.
 * Sin este mapa, los bytes del stream son índices de glifo de un subset y no
 * significan nada: es justo lo que rompe la extracción en PDFs de XeLaTeX.
 */
function parseToUnicode(cmap: string): Map<number, string> {
  const map = new Map<number, string>();

  for (const block of cmap.match(/beginbfchar([\s\S]*?)endbfchar/g) ?? []) {
    const pairs = block.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g);
    for (const [, src, dst] of pairs) map.set(parseInt(src, 16), hexToChars(dst));
  }

  for (const block of cmap.match(/beginbfrange([\s\S]*?)endbfrange/g) ?? []) {
    // Forma 1: <lo> <hi> <dstInicial> — el destino se incrementa con el código.
    const ranges = block.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g);
    for (const [, lo, hi, dst] of ranges) {
      const start = parseInt(lo, 16);
      const base = parseInt(dst, 16);
      for (let c = start; c <= parseInt(hi, 16); c++) map.set(c, String.fromCharCode(base + (c - start)));
    }
    // Forma 2: <lo> <hi> [ <d0> <d1> … ] — un destino explícito por código.
    const arrays = block.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*\[([\s\S]*?)\]/g);
    for (const [, lo, , items] of arrays) {
      const start = parseInt(lo, 16);
      let i = 0;
      for (const [, dst] of items.matchAll(/<([0-9A-Fa-f]+)>/g)) map.set(start + i++, hexToChars(dst));
    }
  }

  return map;
}

/** Decodifica una cadena hex `<0041004E>` con el CMap de la fuente activa. */
const decodeHex = (hex: string, cmap: Map<number, string>): string => {
  const clean = hex.replace(/\s/g, '');
  let out = '';
  // Identity-H: dos bytes por código.
  for (let i = 0; i + 4 <= clean.length; i += 4) {
    const code = parseInt(clean.slice(i, i + 4), 16);
    out += cmap.get(code) ?? '';
  }
  return out;
};

/** Decodifica una cadena literal `(texto)`, resolviendo los escapes de PDF. */
const decodeLiteral = (lit: string, cmap: Map<number, string>): string => {
  const unescaped = lit.replace(/\\([nrtbf()\\]|[0-7]{1,3})/g, (_, e: string) => {
    const simple: Record<string, string> = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f' };
    if (simple[e]) return simple[e];
    if (/^[0-7]+$/.test(e)) return String.fromCharCode(parseInt(e, 8));
    return e;
  });
  // Con fuentes Type0 el byte es un índice de glifo, no un carácter.
  if (cmap.size === 0) return unescaped;
  let out = '';
  for (let i = 0; i + 2 <= unescaped.length; i += 2) {
    out += cmap.get((unescaped.charCodeAt(i) << 8) | unescaped.charCodeAt(i + 1)) ?? '';
  }
  return out;
};

/** Resultado de recorrer un content stream: los fragmentos y el sentido del eje Y. */
interface Scan {
  runs: Run[];
  /**
   * Skia envuelve la página en un `cm` con la Y invertida y emite los `Tm` con
   * d = -1, así que ahí la Y CRECE hacia abajo. En un PDF sin voltear crece
   * hacia arriba. De esto depende el orden de lectura de todo el documento.
   */
  yGrowsDown: boolean;
}

/** Recorre un content stream acumulando los fragmentos de texto con su posición. */
function extractRuns(content: string, fonts: Map<string, Map<number, string>>): Scan {
  const runs: Run[] = [];
  let cmap: Map<number, string> = new Map();
  let x = 0;
  let y = 0;
  // Origen de la línea actual: `Td` desplaza desde aquí, no desde el origen.
  let lineX = 0;
  let lineY = 0;
  let fresh = true;
  let yGrowsDown = false;

  // Un solo barrido: operadores de fuente, de posición y de pintado de texto.
  const ops =
    /\/(\w+)\s+[-\d.]+\s+Tf|([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+Tm|([-\d.]+)\s+([-\d.]+)\s+T[dD]|(T\*)|\[([\s\S]*?)\]\s*TJ|(<[0-9A-Fa-f\s]*>|\((?:\\.|[^\\)])*\))\s*(?:Tj|'|")/g;

  for (let m = ops.exec(content); m; m = ops.exec(content)) {
    const [, fontName, , , , tmD, tmE, tmF, tdX, tdY, star, tjArray, tjString] = m;

    if (fontName) {
      cmap = fonts.get(fontName) ?? new Map();
      continue;
    }

    // `Tm` reposiciona en absoluto: empieza una caja de texto nueva.
    if (tmE !== undefined) {
      x = lineX = Number(tmE);
      y = lineY = Number(tmF);
      if (Number(tmD) < 0) yGrowsDown = true;
      fresh = true;
      continue;
    }

    // `Td` continúa la misma caja: Skia lo usa para avanzar el ancho del glifo.
    if (tdX !== undefined) {
      x = lineX = lineX + Number(tdX);
      y = lineY = lineY + Number(tdY);
      continue;
    }

    if (star) {
      x = lineX;
      y = lineY;
      fresh = true;
      continue;
    }

    let text = '';
    if (tjArray !== undefined) {
      // En un TJ los números son ajustes de kerning en milésimas de em; un salto
      // negativo grande es como algunos generadores dibujan un espacio.
      for (const [, hex, lit, kern] of tjArray.matchAll(
        /(<[0-9A-Fa-f\s]*>)|(\((?:\\.|[^\\)])*\))|([-\d.]+)/g,
      )) {
        if (hex) text += decodeHex(hex.slice(1, -1), cmap);
        else if (lit) text += decodeLiteral(lit.slice(1, -1), cmap);
        else if (kern && Number(kern) < -100 && text && !text.endsWith(' ')) text += ' ';
      }
    } else if (tjString !== undefined) {
      text = tjString.startsWith('<')
        ? decodeHex(tjString.slice(1, -1), cmap)
        : decodeLiteral(tjString.slice(1, -1), cmap);
    }

    if (text) {
      runs.push({ text, x, y, fresh });
      fresh = false;
    }
  }

  return { runs, yGrowsDown };
}

/**
 * Agrupa los fragmentos en líneas por coordenada Y.
 *
 * Esto es lo que decide si un layout a dos columnas se lee bien o se entrelaza:
 * al ordenar por Y y luego por X, dos columnas a la misma altura se fusionan en
 * una sola línea sin sentido — exactamente el fallo que hunde esos CV.
 */
function runsToLines({ runs, yGrowsDown }: Scan): string[] {
  const rows: { y: number; runs: Run[] }[] = [];
  const TOLERANCE = 2; // absorbe pequeños ajustes de línea base dentro de una línea

  for (const run of runs) {
    const row = rows.find((r) => Math.abs(r.y - run.y) <= TOLERANCE);
    if (row) row.runs.push(run);
    else rows.push({ y: run.y, runs: [run] });
  }

  rows.sort((p, q) => (yGrowsDown ? p.y - q.y : q.y - p.y));

  return rows.map((row) => {
    const sorted = [...row.runs].sort((p, q) => p.x - q.x);
    let line = '';
    for (const run of sorted) {
      // Sólo separa cajas distintas: dentro de una palabra el espacio ya viene
      // como glifo propio y añadir otro descuartizaría el texto letra a letra.
      if (line && run.fresh && !line.endsWith(' ') && !run.text.startsWith(' ')) line += ' ';
      line += run.text;
    }
    return line.replace(/\s+/g, ' ').trim();
  });
}

/** Texto plano del PDF, una página por elemento, tal y como lo leería un ATS. */
export function extractPdfPages(buf: Buffer): string[] {
  const objects = parseObjects(buf);

  // Cachea los CMap por objeto: varias páginas comparten las mismas fuentes.
  const cmapCache = new Map<number, Map<number, string>>();
  const cmapFor = (fontObj: number): Map<number, string> => {
    const cached = cmapCache.get(fontObj);
    if (cached) return cached;
    const font = objects.get(fontObj);
    const toUnicode = font ? refOf(font.dict, 'ToUnicode') : null;
    const stream = toUnicode !== null ? objects.get(toUnicode)?.data : null;
    const parsed = stream ? parseToUnicode(stream.toString('latin1')) : new Map<number, string>();
    cmapCache.set(fontObj, parsed);
    return parsed;
  };

  const pages: string[] = [];

  for (const [, obj] of objects) {
    if (!/\/Type\s*\/Page[^s]/.test(obj.dict)) continue;

    // Mapa nombre-de-recurso → CMap, p. ej. /F1 → glifos de Arial.
    const fonts = new Map<string, Map<number, string>>();
    const fontBlock = /\/Font\s*<<([\s\S]*?)>>/.exec(obj.dict);
    if (fontBlock) {
      for (const [, name, num] of fontBlock[1].matchAll(/\/(\w+)\s+(\d+)\s+\d+\s+R/g)) {
        fonts.set(name, cmapFor(Number(num)));
      }
    }

    // /Contents puede ser un objeto o un array de objetos.
    const single = refOf(obj.dict, 'Contents');
    const contentRefs =
      single !== null
        ? [single]
        : [...(/\/Contents\s*\[([\s\S]*?)\]/.exec(obj.dict)?.[1] ?? '').matchAll(/(\d+)\s+\d+\s+R/g)].map((m) =>
            Number(m[1]),
          );

    const content = contentRefs
      .map((ref) => objects.get(ref)?.data?.toString('latin1') ?? '')
      .join('\n');

    if (content) pages.push(runsToLines(extractRuns(content, fonts)).join('\n'));
  }

  return pages;
}

/** Todo el texto del PDF en una sola cadena, con las páginas separadas. */
export const extractPdfText = (buf: Buffer): string => extractPdfPages(buf).join('\n');
