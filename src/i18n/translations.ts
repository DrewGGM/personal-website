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
    downloadPrimary: string;
    downloadOther: string;
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
  };
  certifications: { viewCertificate: string };
  contact: {
    headlinePre: string;
    headlineAccent: string;
    text: string;
  };
  footer: { rights: string };
  dates: { present: string; months: string[] };
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
    downloadPrimary: 'Download CV',
    downloadOther: 'CV (Español)',
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
    downloadPrimary: 'Descargar CV',
    downloadOther: 'CV (English)',
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
