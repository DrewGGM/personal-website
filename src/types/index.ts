export interface SocialNetwork {
  network: string;
  username: string;
  url: string;
}

export interface Education {
  institution: string;
  area: string;
  degree: string;
  startDate: string;
  endDate: string;
  location: string;
  summary?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  summary: string;
  highlights: string[];
}

export interface Skill {
  label: string;
  details: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  certificateUrl?: string;
}

export type ProjectStatus = 'completed' | 'in-progress' | 'coming-soon';

/**
 * Buckets the Projects section renders (and filters) by:
 *  - `startup`  — products built under the Lyroo venture
 *  - `product`  — independent products & open-source I own end to end
 *  - `academic` — university / earlier work
 *  - `game`     — Unity game dev
 */
export type ProjectCategory = 'startup' | 'product' | 'academic' | 'game';

/**
 * An outbound link on a project card. A project can carry several — a
 * front-end repo and an API repo, a live site and a demo, etc.
 *
 * IMPORTANT: only add a `repo` link when the repository is actually public.
 * Private repos render as a 404 to visitors; use `privateRepo` instead so the
 * card shows a "private source" note rather than a broken link.
 */
export interface ProjectLink {
  label: string;
  url: string;
  kind: 'repo' | 'demo' | 'site' | 'docs';
}

export interface Project {
  /** Stable key for React lists and filtering. */
  slug: string;
  title: string;
  /** One-liner used by the compact cards; `description` is the long form. */
  tagline?: string;
  /**
   * What the project is, in 2-3 sentences. Keep it under ~450 characters: past
   * that the featured card turns into a wall of text nobody reads. Technical
   * depth and outcomes belong in `highlights`, which is scannable.
   */
  description: string;
  /**
   * Up to 3 short bullets shown under `description` on featured cards — the
   * interesting engineering decision, the hard constraint, the result.
   */
  highlights?: string[];
  /** e.g. "Solo" / "Equipo de 4 · IA y Finanzas" — shown on compact cards. */
  role?: string;
  /** e.g. "2025" or "2024–2025". */
  year?: string;
  techStack: string[];
  links?: ProjectLink[];
  /** Source is closed — render a lock note instead of a repo link. */
  privateRepo?: boolean;
  imageUrl?: string;
  images?: string[];
  status: ProjectStatus;
  category: ProjectCategory;
  /** Render as a large hero card instead of a compact grid cell. */
  featured?: boolean;
  /** Include in the generated one-page PDF CV (max 3 — see scripts/generate-cv.ts). */
  inCv?: boolean;
}

/**
 * A company/startup that owns several projects. Rendered as one block with the
 * product line nested beneath it, so the venture reads as a single story
 * instead of N unrelated sibling cards.
 */
export interface Venture {
  name: string;
  tagline: string;
  description: string;
  url: string;
  role: string;
  /** Slugs of the `startup` projects that belong to this venture, in order. */
  products: string[];
}

export interface CVData {
  name: string;
  headline: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  socialNetworks: SocialNetwork[];
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  languages: Skill[];
  ventures: Venture[];
  projects: Project[];
}
