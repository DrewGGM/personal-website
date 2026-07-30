/**
 * Etiquetas i18n del CV y utilidades de texto compartidas.
 *
 * Vive aparte de `generate-cv.ts` porque lo consumen tres salidas —el PDF, el
 * .docx y la auditoría— y todas tienen que emitir EXACTAMENTE los mismos
 * títulos de sección y el mismo formato de fecha. Si se desincronizan, el .docx
 * y el PDF dejan de ser el mismo CV.
 */
import { dateKey } from '../../src/i18n/translations';

export interface CVLabels {
  htmlLang: string;
  present: string;
  /**
   * Rol firmado que aún no empieza. Antes decía "Desde ago 2026", que para un
   * parser NO es un rango de fechas: el puesto se caía del historial o se
   * fechaba mal. Ahora se emite un rango válido y la salvedad va entre
   * paréntesis, donde la lee una persona sin estorbar a la máquina.
   */
  starting: (date: string) => string;
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

export const EN_LABELS: CVLabels = {
  htmlLang: 'en',
  present: 'Present',
  starting: (date) => `${date} - Present (incoming)`,
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

export const ES_LABELS: CVLabels = {
  htmlLang: 'es',
  present: 'Actual',
  starting: (date) => `${date} - Actual (previsto)`,
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

/**
 * Puntuación tipográfica → ASCII.
 *
 * Los datos de `cvData` se escriben bonitos porque la web los luce: raya larga,
 * punto medio, comillas curvas, puntos suspensivos. En el CV eso viaja tal cual
 * a la capa de texto y las guías de ATS coinciden en señalar los símbolos raros
 * como causa de campos partidos o líneas descartadas.
 *
 * Se normaliza SÓLO la puntuación. Las letras acentuadas (á, ñ, í) se quedan:
 * son texto legítimo, los parsers las manejan sin problema y quitarlas
 * destrozaría nombres propios en español.
 */
export const ats = (s: string): string =>
  (s ?? '')
    .replace(/[·•]/g, '|')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/ /g, ' ');

/** Formateadores de fecha para un idioma. Una única definición para PDF y .docx. */
export function formatters(labels: CVLabels) {
  const fmtDate = (d: string): string => {
    if (!d || d === 'present') return labels.present;
    const [y, m] = d.split('-');
    return m ? `${labels.months[Number(m) - 1]} ${y}` : y;
  };

  // Un rol cuyo mes de inicio aún no llega no puede presentarse como actual.
  // Al llegar ese mes, el mismo dato pasa solo a "inicio - Actual".
  const now = new Date();
  const nowKey = now.getFullYear() * 12 + (now.getMonth() + 1);

  // Guion simple, no raya (–) ni guion largo (—): los parsers antiguos sólo
  // reconocen el hyphen-minus como separador de rango.
  const fmtRange = (start: string, end: string): string =>
    dateKey(start) > nowKey ? labels.starting(fmtDate(start)) : `${fmtDate(start)} - ${fmtDate(end)}`;

  return { fmtDate, fmtRange };
}
