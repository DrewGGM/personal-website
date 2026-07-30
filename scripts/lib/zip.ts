/**
 * Escritor ZIP mínimo — lo justo para empaquetar un .docx.
 *
 * Un .docx es un ZIP con XML dentro. Node trae `zlib` pero no un escritor de
 * ZIP, y meter una dependencia entera para juntar seis ficheros de texto no
 * compensa: el formato son dos cabeceras y un índice al final.
 *
 * Las marcas de tiempo son FIJAS a propósito. Los ficheros generados se
 * versionan, y un timestamp real haría que cada build produjese bytes distintos
 * aunque el contenido fuese idéntico.
 */
import { deflateRawSync, inflateRawSync } from 'node:zlib';

export interface ZipEntry {
  /** Ruta dentro del ZIP, con '/' y sin barra inicial. */
  path: string;
  data: Buffer | string;
}

/**
 * Lee UNA entrada de un ZIP recorriendo su índice central.
 *
 * Sólo existe para que la auditoría pueda abrir el .docx que acaba de escribir
 * y comprobar el texto que contiene, en vez de fiarse de que salió bien.
 */
export function readZipEntry(zip: Buffer, path: string): Buffer | null {
  // El índice central se localiza desde el final: la firma EOCD dice dónde está.
  const eocd = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd === -1) return null;
  let at = zip.readUInt32LE(eocd + 16);
  const count = zip.readUInt16LE(eocd + 10);

  for (let i = 0; i < count; i++) {
    const nameLen = zip.readUInt16LE(at + 28);
    const extraLen = zip.readUInt16LE(at + 30);
    const commentLen = zip.readUInt16LE(at + 32);
    const name = zip.subarray(at + 46, at + 46 + nameLen).toString('utf8');

    if (name === path) {
      const method = zip.readUInt16LE(at + 10);
      const size = zip.readUInt32LE(at + 20);
      const localAt = zip.readUInt32LE(at + 42);
      // La cabecera local repite los nombres con longitudes PROPIAS, que pueden
      // no coincidir con las del índice: hay que releerlas aquí.
      const dataAt =
        localAt + 30 + zip.readUInt16LE(localAt + 26) + zip.readUInt16LE(localAt + 28);
      const raw = zip.subarray(dataAt, dataAt + size);
      return method === 0 ? Buffer.from(raw) : inflateRawSync(raw);
    }

    at += 46 + nameLen + extraLen + commentLen;
  }

  return null;
}

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let bit = 0; bit < 8; bit++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let c = -1;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

// 1980-01-01 00:00 en el formato de fecha/hora de MS-DOS que usa el ZIP.
const DOS_TIME = 0;
const DOS_DATE = 0x0021;

/** Bit 11 de los flags: los nombres de fichero van en UTF-8. */
const UTF8_FLAG = 0x0800;
const DEFLATED = 8;

export function createZip(entries: ZipEntry[]): Buffer {
  const locals: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.path, 'utf8');
    const raw = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(entry.data, 'utf8');
    const deflated = deflateRawSync(raw, { level: 9 });
    const crc = crc32(raw);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); // firma de cabecera local
    local.writeUInt16LE(20, 4); // versión necesaria para extraer: 2.0
    local.writeUInt16LE(UTF8_FLAG, 6);
    local.writeUInt16LE(DEFLATED, 8);
    local.writeUInt16LE(DOS_TIME, 10);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(deflated.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28); // sin campo extra
    locals.push(local, name, deflated);

    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0); // firma de entrada del índice central
    dir.writeUInt16LE(20, 4); // versión del creador
    dir.writeUInt16LE(20, 6); // versión necesaria
    dir.writeUInt16LE(UTF8_FLAG, 8);
    dir.writeUInt16LE(DEFLATED, 10);
    dir.writeUInt16LE(DOS_TIME, 12);
    dir.writeUInt16LE(DOS_DATE, 14);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(deflated.length, 20);
    dir.writeUInt32LE(raw.length, 24);
    dir.writeUInt16LE(name.length, 28);
    // extra, comentario, disco, atributos internos y externos: todos a cero
    dir.writeUInt32LE(offset, 42); // dónde empieza su cabecera local
    central.push(dir, name);

    offset += local.length + name.length + deflated.length;
  }

  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); // firma de fin de índice central
  end.writeUInt16LE(entries.length, 8); // entradas en este disco
  end.writeUInt16LE(entries.length, 10); // entradas en total
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);

  return Buffer.concat([...locals, centralBuf, end]);
}
