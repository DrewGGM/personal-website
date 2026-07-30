/**
 * Exporta `cvData` al esquema abierto JSON Resume v1.
 *
 * Para qué sirve, siendo honestos: NINGÚN ATS descarga este fichero solo. Lo
 * que hace útil publicarlo en /resume.json es todo lo demás — las extensiones
 * de autorrelleno (Simplify y compañía), los agentes y scripts que preparan
 * candidaturas, y uno mismo cuando necesita el dato exacto sin recortarlo del
 * PDF. El PDF sigue siendo lo que se sube; esto es la versión que lee una
 * máquina sin tener que adivinar nada.
 */
import type { CVData } from '../../src/types';

/** `present` no es una fecha: en JSON Resume el puesto en curso omite `endDate`. */
const iso = (d: string): string | undefined => (!d || d === 'present' ? undefined : d);

/**
 * "Dec 2024 - Jun 2025" / "Feb 2024" → "2025-06" / "2024-02".
 * Las certificaciones guardan la fecha como texto libre; aquí se lleva al
 * formato del esquema quedándose con la ÚLTIMA fecha (la de obtención).
 */
function certDate(raw: string): string | undefined {
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const found = [...raw.matchAll(/([A-Za-z]{3})[a-z]*\s+(\d{4})/g)];
  const last = found.at(-1);
  if (!last) return /^\d{4}$/.test(raw.trim()) ? raw.trim() : undefined;
  const month = months.indexOf(last[1].toLowerCase());
  return month === -1 ? last[2] : `${last[2]}-${String(month + 1).padStart(2, '0')}`;
}

/** "Armenia, Quindio, Colombia" → sus partes; el país siempre va al final. */
function splitLocation(location: string) {
  const parts = location.split(',').map((p) => p.trim()).filter(Boolean);
  return {
    city: parts[0],
    region: parts.length > 2 ? parts[1] : undefined,
    // El esquema pide ISO 3166-1 alfa-2 y este CV es de un único país.
    countryCode: /colombia/i.test(location) ? 'CO' : undefined,
  };
}

export function toJsonResume(data: CVData) {
  return {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: data.name,
      label: data.headline,
      email: data.email,
      phone: data.phone,
      url: data.website,
      summary: data.summary,
      location: splitLocation(data.location),
      profiles: data.socialNetworks.map((s) => ({
        network: s.network,
        username: s.username,
        url: s.url,
      })),
    },
    work: data.experience.map((e) => ({
      name: e.company,
      position: e.position,
      location: e.location,
      startDate: iso(e.startDate),
      endDate: iso(e.endDate),
      summary: e.summary,
      highlights: e.highlights,
    })),
    education: data.education.map((ed) => ({
      institution: ed.institution,
      area: ed.area,
      studyType: ed.degree,
      startDate: iso(ed.startDate),
      endDate: iso(ed.endDate),
    })),
    certificates: data.certifications.map((c) => ({
      name: c.title,
      issuer: c.issuer,
      date: certDate(c.date),
    })),
    // `details` es una lista separada por comas en `cvData`; `keywords` es lo
    // que consultan los buscadores por skill, así que se devuelve troceada.
    skills: data.skills.map((s) => ({
      name: s.label,
      keywords: s.details.split(',').map((k) => k.trim()).filter(Boolean),
    })),
    languages: data.languages.map((l) => ({ language: l.label, fluency: l.details })),
    projects: data.projects.map((p) => ({
      name: p.title,
      description: p.description,
      keywords: p.techStack,
      roles: p.role ? [p.role] : undefined,
      url: p.links?.find((l) => l.kind === 'demo' || l.kind === 'site')?.url,
      entity: p.category === 'startup' ? 'Lyroo S.A.S' : undefined,
    })),
  };
}
