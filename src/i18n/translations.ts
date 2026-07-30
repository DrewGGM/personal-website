/**
 * i18n dictionary — English / Spanish UI strings.
 *
 * Content that lives in the data files (src/data/cvData.ts / cvData.es.ts) is
 * NOT duplicated here; this only covers the UI "chrome" (nav, buttons, section
 * titles, labels…). Access the current language's dictionary via useLanguage().
 */

export type Language = 'en' | 'es';

export interface Translation {
  meta: { title: string };
  nav: {
    home: string;
    about: string;
    experience: string;
    projects: string;
    contact: string;
  };
  hero: {
    badge: string;
    greeting: string;
    typewriter: string[];
    description: (headline: string, location: string) => string;
    downloadCv: string;
    /** Menú con el resto de formatos del CV: Word, texto plano y JSON Resume. */
    cvFormats: {
      toggle: string;
      title: string;
      pdf: string;
      pdfHint: string;
      docx: string;
      docxHint: string;
      text: string;
      textHint: string;
      json: string;
      jsonHint: string;
      copy: string;
      copied: string;
      copyFailed: string;
    };
    codeRole: string;
    codeComment: string;
    scroll: string;
    scrollAria: string;
    stats: {
      yearsCoding: string;
      projectsShipped: string;
      certifications: string;
      startupFounded: string;
    };
  };
  sections: {
    about: string;
    experience: string;
    education: string;
    skills: string;
    projects: string;
    certifications: string;
    contact: string;
  };
  about: { workingOn: string };
  highlights: { title: string; description: string }[];
  projects: {
    status: Record<'completed' | 'in-progress' | 'coming-soon', string>;
    featured: string;
    viewCode: string;
    liveDemo: string;
    code: string;
    demo: string;
    prevImage: string;
    nextImage: string;
    goToImage: (i: number) => string;
    screenshotsOf: (name: string) => string;
    screenshotOf: (i: number, total: number) => string;
    /** Filter chips over the compact grid. */
    filters: Record<'all' | 'startup' | 'product' | 'academic' | 'game', string>;
    filterLabel: string;
    privateSource: string;
    privateSourceTitle: string;
    venture: {
      label: string;
      productLine: (n: number) => string;
      visitSite: string;
    };
    otherWork: string;
  };
  certifications: { viewCertificate: string };
  contact: {
    headlinePre: string;
    headlineAccent: string;
    text: string;
  };
  footer: { rights: string };
  dates: {
    present: string;
    months: string[];
    /** Role that hasn't started yet, e.g. "Starting Aug 2026". */
    starting: (date: string) => string;
  };
}

const en: Translation = {
  meta: { title: 'Andrew Garcia | Software Engineer' },
  nav: {
    home: 'Home',
    about: 'About',
    experience: 'Experience',
    projects: 'Projects',
    contact: 'Contact',
  },
  hero: {
    badge: 'Available for opportunities',
    greeting: "Hi, I'm",
    typewriter: [
      'Backend Developer',
      'Software Engineer',
      'Startup Founder',
      'QA Engineer',
      'Problem Solver',
    ],
    description: (headline, location) =>
      `${headline} — building software for real businesses from ${location}.`,
    downloadCv: 'Download CV',
    cvFormats: {
      toggle: 'Other CV formats',
      title: 'Other formats',
      pdf: 'PDF',
      pdfHint: 'Default. Reads well for people and parsers.',
      docx: 'Word (.docx)',
      docxHint: 'For forms that ask for Word — Workday, Taleo.',
      text: 'Plain text',
      textHint: 'For "paste your resume here" boxes.',
      json: 'JSON Resume',
      jsonHint: 'Open schema, for autofill extensions and agents.',
      copy: 'Copy',
      copied: 'Copied',
      copyFailed: 'Could not copy — opening the file',
    },
    codeRole: 'Software Engineer',
    codeComment: '// Open to new challenges!',
    scroll: 'Scroll',
    scrollAria: 'Scroll to About',
    stats: {
      yearsCoding: 'Years coding',
      projectsShipped: 'Projects shipped',
      certifications: 'Certifications',
      startupFounded: 'Startup founded',
    },
  },
  sections: {
    about: 'About Me',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certifications: 'Certifications & Courses',
    contact: 'Get In Touch',
  },
  about: { workingOn: "What I'm working on" },
  highlights: [
    {
      title: 'Founder of Lyroo',
      description:
        'Building LyrooPOS — an offline-first point of sale with an embedded DIAN electronic-invoicing engine. v1.2 in production with the first active customers, plus Lyroo Build, a custom software studio.',
    },
    {
      title: 'Core banking @ COFINCAFE',
      description:
        "Developing and supporting a cooperative's core banking system on Apache Fineract & Mifos.",
    },
    {
      title: 'Backend & architecture',
      description:
        'Java · Spring Boot · Go · hexagonal architecture · microservices · clean code.',
    },
    {
      title: 'DIAN e-invoicing core',
      description:
        'Embedded UBL 2.1 engine — unlimited electronic invoicing with no per-folio fees or third-party APIs.',
    },
    {
      title: 'Armenia, Colombia',
      description: 'Remote-first · open to new opportunities.',
    },
  ],
  projects: {
    status: {
      completed: 'Completed',
      'in-progress': 'In Progress',
      'coming-soon': 'Coming Soon',
    },
    featured: 'Featured Project',
    viewCode: 'View Code',
    liveDemo: 'Live Demo',
    code: 'Code',
    demo: 'Demo',
    prevImage: 'Previous image',
    nextImage: 'Next image',
    goToImage: (i) => `Go to image ${i}`,
    screenshotsOf: (name) => `${name} screenshots`,
    screenshotOf: (i, total) => `screenshot ${i} of ${total}`,
    filters: {
      all: 'All',
      startup: 'Startup',
      product: 'Products',
      academic: 'Academic',
      game: 'Games',
    },
    filterLabel: 'Filter projects by category',
    privateSource: 'Private source',
    privateSourceTitle: 'Proprietary — the repository is not public',
    venture: {
      label: 'My startup',
      productLine: (n) => `${n} products`,
      visitSite: 'Visit site',
    },
    otherWork: 'Other work',
  },
  certifications: { viewCertificate: 'View Certificate' },
  contact: {
    headlinePre: "Let's build something",
    headlineAccent: 'great',
    text:
      "I'm currently open to new opportunities. Whether you have a question or just want to say hi, feel free to reach out!",
  },
  footer: { rights: 'All rights reserved.' },
  dates: {
    present: 'Present',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    starting: (date) => `Starting ${date}`,
  },
};

const es: Translation = {
  meta: { title: 'Andrew Garcia | Ingeniero de Software' },
  nav: {
    home: 'Inicio',
    about: 'Sobre mí',
    experience: 'Experiencia',
    projects: 'Proyectos',
    contact: 'Contacto',
  },
  hero: {
    badge: 'Disponible para oportunidades',
    greeting: 'Hola, soy',
    typewriter: [
      'Desarrollador Backend',
      'Ingeniero de Software',
      'Fundador de Startup',
      'Ingeniero QA',
      'Solucionador de Problemas',
    ],
    description: (headline, location) =>
      `${headline} — construyendo software para negocios reales desde ${location}.`,
    downloadCv: 'Descargar CV',
    cvFormats: {
      toggle: 'Otros formatos del CV',
      title: 'Otros formatos',
      pdf: 'PDF',
      pdfHint: 'El de siempre. Se lee bien a ojo y en un parser.',
      docx: 'Word (.docx)',
      docxHint: 'Para formularios que piden Word — Workday, Taleo.',
      text: 'Texto plano',
      textHint: 'Para las cajas de "pega aquí tu CV".',
      json: 'JSON Resume',
      jsonHint: 'Esquema abierto, para extensiones de autorrelleno y agentes.',
      copy: 'Copiar',
      copied: 'Copiado',
      copyFailed: 'No se pudo copiar — abriendo el fichero',
    },
    codeRole: 'Ingeniero de Software',
    codeComment: '// ¡Abierto a nuevos retos!',
    scroll: 'Desliza',
    scrollAria: 'Ir a Sobre mí',
    stats: {
      yearsCoding: 'Años programando',
      projectsShipped: 'Proyectos entregados',
      certifications: 'Certificaciones',
      startupFounded: 'Startup fundada',
    },
  },
  sections: {
    about: 'Sobre mí',
    experience: 'Experiencia',
    education: 'Educación',
    skills: 'Habilidades',
    projects: 'Proyectos',
    certifications: 'Certificaciones y Cursos',
    contact: 'Hablemos',
  },
  about: { workingOn: 'En qué estoy trabajando' },
  highlights: [
    {
      title: 'Fundador de Lyroo',
      description:
        'Desarrollo LyrooPOS — un punto de venta offline-first con un motor de facturación electrónica DIAN embebido. v1.2 en producción con los primeros clientes activos, además de Lyroo Build, un estudio de software a la medida.',
    },
    {
      title: 'Core bancario @ COFINCAFE',
      description:
        'Desarrollo y soporte del core bancario de una cooperativa sobre Apache Fineract y Mifos.',
    },
    {
      title: 'Backend y arquitectura',
      description:
        'Java · Spring Boot · Go · arquitectura hexagonal · microservicios · código limpio.',
    },
    {
      title: 'Core de facturación DIAN',
      description:
        'Motor UBL 2.1 embebido — facturación electrónica ilimitada sin costos por folio ni APIs de terceros.',
    },
    {
      title: 'Armenia, Colombia',
      description: 'Remote-first · abierto a nuevas oportunidades.',
    },
  ],
  projects: {
    status: {
      completed: 'Completado',
      'in-progress': 'En progreso',
      'coming-soon': 'Próximamente',
    },
    featured: 'Proyecto destacado',
    viewCode: 'Ver código',
    liveDemo: 'Demo en vivo',
    code: 'Código',
    demo: 'Demo',
    prevImage: 'Imagen anterior',
    nextImage: 'Imagen siguiente',
    goToImage: (i) => `Ir a la imagen ${i}`,
    screenshotsOf: (name) => `Capturas de ${name}`,
    screenshotOf: (i, total) => `captura ${i} de ${total}`,
    filters: {
      all: 'Todos',
      startup: 'Startup',
      product: 'Productos',
      academic: 'Académicos',
      game: 'Juegos',
    },
    filterLabel: 'Filtrar proyectos por categoría',
    privateSource: 'Código privado',
    privateSourceTitle: 'Propietario — el repositorio no es público',
    venture: {
      label: 'Mi startup',
      productLine: (n) => `${n} productos`,
      visitSite: 'Ver sitio',
    },
    otherWork: 'Otros proyectos',
  },
  certifications: { viewCertificate: 'Ver certificado' },
  contact: {
    headlinePre: 'Construyamos algo',
    headlineAccent: 'genial',
    text:
      'Actualmente estoy abierto a nuevas oportunidades. Si tienes una pregunta o solo quieres saludar, ¡escríbeme!',
  },
  footer: { rights: 'Todos los derechos reservados.' },
  dates: {
    present: 'Actual',
    months: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    starting: (date) => `Desde ${date}`,
  },
};

export const translations: Record<Language, Translation> = { en, es };

/** Formats an ISO-ish "YYYY-MM" (or "present") into a localized "Mon YYYY". */
export function formatDate(date: string, t: Translation): string {
  if (!date || date === 'present') return t.dates.present;
  const [year, monthStr] = date.split('-');
  const month = parseInt(monthStr, 10);
  if (!year || month < 1 || month > 12) return date;
  return `${t.dates.months[month - 1]} ${year}`;
}

/** `YYYY-MM` → comparable integer. `present` sorts after any real date. */
export function dateKey(date: string): number {
  if (!date || date === 'present') return Number.MAX_SAFE_INTEGER;
  const [year, monthStr] = date.split('-');
  return Number(year) * 12 + (parseInt(monthStr, 10) || 1);
}

/** Month-granular "now", so comparisons match the `YYYY-MM` data. */
function nowKey(now: Date): number {
  return now.getFullYear() * 12 + (now.getMonth() + 1);
}

/** A role whose start month hasn't arrived yet (signed, not yet begun). */
export function isFuture(startDate: string, now: Date = new Date()): boolean {
  return dateKey(startDate) > nowKey(now);
}

/**
 * Renders the date range for a role, derived from the current date:
 *  - not started yet  → "Starting Aug 2026"
 *  - ongoing          → "Jan 2026 – Present"
 *  - finished         → "Jan 2026 – Jul 2026"
 *
 * This is why a future role never claims to be current: once its month
 * arrives the same data renders as ongoing with no edit.
 */
export function formatRange(
  startDate: string,
  endDate: string,
  t: Translation,
  now: Date = new Date(),
): string {
  if (isFuture(startDate, now)) return t.dates.starting(formatDate(startDate, t));
  return `${formatDate(startDate, t)} — ${formatDate(endDate, t)}`;
}

/**
 * Newest first, grouping every role at the same company together so a
 * promotion reads as one continuous stint instead of scattered entries.
 * Groups are ordered by their most recent role.
 */
export function groupExperience<T extends { company: string; startDate: string }>(
  experiences: T[],
): { company: string; roles: T[] }[] {
  const groups = new Map<string, T[]>();
  for (const exp of experiences) {
    const existing = groups.get(exp.company);
    if (existing) existing.push(exp);
    else groups.set(exp.company, [exp]);
  }

  return [...groups.entries()]
    .map(([company, roles]) => ({
      company,
      roles: [...roles].sort((a, b) => dateKey(b.startDate) - dateKey(a.startDate)),
    }))
    .sort((a, b) => dateKey(b.roles[0].startDate) - dateKey(a.roles[0].startDate));
}
