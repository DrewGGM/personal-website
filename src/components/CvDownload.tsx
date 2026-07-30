import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Copy, Download, FileJson, FileText, FileType } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Descarga del CV con el resto de formatos detrás de un desplegable.
 *
 * El PDF sigue siendo la acción primaria porque es lo que sirve el 90 % de las
 * veces. Los otros tres existen para casos concretos y reales:
 *  - .docx  → formularios que piden Word (Workday, Taleo).
 *  - .txt   → las cajas de "pega aquí tu CV", donde subir un fichero no es opción.
 *  - .json  → JSON Resume, para extensiones de autorrelleno y agentes.
 *
 * Los cuatro los genera `npm run cv` desde la misma fuente, así que no pueden
 * contradecirse entre ellos.
 */

/** Rutas en /public, por idioma. Las escribe `scripts/generate-cv.ts`. */
const FILES = {
  en: {
    pdf: '/Andrew_Garcia_Mosquera_CV.pdf',
    docx: '/Andrew_Garcia_Mosquera_CV.docx',
    txt: '/Andrew_Garcia_Mosquera_CV.txt',
    json: '/resume.json',
  },
  es: {
    pdf: '/Andrew_Garcia_Mosquera_CV_ES.pdf',
    docx: '/Andrew_Garcia_Mosquera_CV_ES.docx',
    txt: '/Andrew_Garcia_Mosquera_CV_ES.txt',
    json: '/resume.es.json',
  },
} as const;

type CopyState = 'idle' | 'copied' | 'failed';

export default function CvDownload() {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const files = FILES[lang];
  const labels = t.hero.cvFormats;

  // Cerrar con Escape o al pulsar fuera. Se devuelve el foco al disparador:
  // si no, al cerrar con Escape el foco se pierde en el body.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  // El acuse de "Copiado" se borra solo; se reinicia si se vuelve a pulsar.
  useEffect(() => {
    if (copyState === 'idle') return;
    const timer = setTimeout(() => setCopyState('idle'), 2200);
    return () => clearTimeout(timer);
  }, [copyState]);

  const copyPlainText = async () => {
    try {
      const res = await fetch(files.txt);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await navigator.clipboard.writeText(await res.text());
      setCopyState('copied');
    } catch {
      // Sin permiso de portapapeles (o sin HTTPS) no hay reintento posible:
      // se abre el .txt para que se pueda copiar a mano.
      setCopyState('failed');
      window.open(files.txt, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="cv-download" ref={wrapperRef}>
      <MagneticButton strength={0.25}>
        <a href={files.pdf} download className="btn-primary cv-download-main">
          <Download size={18} />
          {t.hero.downloadCv}
        </a>
      </MagneticButton>

      <button
        ref={toggleRef}
        type="button"
        className="cv-download-toggle"
        aria-label={labels.toggle}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronDown size={16} className={open ? 'cv-chevron-open' : undefined} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="cv-formats"
            role="menu"
            aria-label={labels.title}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <p className="cv-formats-title">{labels.title}</p>

            <a href={files.pdf} download className="cv-format" role="menuitem">
              <FileType size={16} />
              <span>
                <b>{labels.pdf}</b>
                <small>{labels.pdfHint}</small>
              </span>
            </a>

            <a href={files.docx} download className="cv-format" role="menuitem">
              <FileText size={16} />
              <span>
                <b>{labels.docx}</b>
                <small>{labels.docxHint}</small>
              </span>
            </a>

            <button type="button" className="cv-format" role="menuitem" onClick={copyPlainText}>
              {copyState === 'copied' ? <Check size={16} /> : <Copy size={16} />}
              <span>
                <b>
                  {labels.text}
                  <em className="cv-format-action">
                    {copyState === 'copied'
                      ? labels.copied
                      : copyState === 'failed'
                        ? labels.copyFailed
                        : labels.copy}
                  </em>
                </b>
                <small>{labels.textHint}</small>
              </span>
            </button>

            <a
              href={files.json}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-format"
              role="menuitem"
            >
              <FileJson size={16} />
              <span>
                <b>{labels.json}</b>
                <small>{labels.jsonHint}</small>
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Los lectores de pantalla no anuncian el cambio de icono ni el texto del
          botón por sí solos; esta región sí lo hace. */}
      <span className="sr-only" role="status" aria-live="polite">
        {copyState === 'copied' ? labels.copied : copyState === 'failed' ? labels.copyFailed : ''}
      </span>
    </div>
  );
}
