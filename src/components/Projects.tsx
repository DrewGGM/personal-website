import { useMemo, useState } from 'react';
import ScrollReveal from './ScrollReveal';
import SectionTitle from './SectionTitle';
import InteractiveCard from './InteractiveCard';
import {
  Github,
  ExternalLink,
  Lock,
  ChevronLeft,
  ChevronRight,
  Rocket,
  ArrowUpRight,
  FileText,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { Project, ProjectCategory, ProjectLink, Venture } from '../types';

interface ProjectsProps {
  projects: Project[];
  ventures: Venture[];
}

const statusClass: Record<Project['status'], string> = {
  completed: 'status-completed',
  'in-progress': 'status-in-progress',
  'coming-soon': 'status-coming-soon',
};

const linkIcon: Record<ProjectLink['kind'], typeof Github> = {
  repo: Github,
  demo: ExternalLink,
  site: ExternalLink,
  docs: FileText,
};

/** Order the filter chips appear in; `all` is prepended by the component. */
const FILTER_ORDER: ProjectCategory[] = ['startup', 'product', 'academic', 'game'];

function ProjectLinks({ project, variant }: { project: Project; variant: 'featured' | 'compact' }) {
  const { t } = useLanguage();
  const links = project.links ?? [];
  if (links.length === 0 && !project.privateRepo) return null;

  const cls = variant === 'featured' ? 'project-link-btn' : 'project-link';
  const size = variant === 'featured' ? 18 : 16;

  return (
    <div className="project-links">
      {links.map((link, i) => {
        const Icon = linkIcon[link.kind];
        // The first non-repo link is the primary call to action.
        const primary = variant === 'featured' && link.kind !== 'repo' && i === 0;
        return (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cls}${primary ? ' primary' : ''}`}
          >
            <Icon size={size} />
            {link.label}
          </a>
        );
      })}
      {project.privateRepo && (
        <span className={`${cls} is-private`} title={t.projects.privateSourceTitle}>
          <Lock size={size} />
          {t.projects.privateSource}
        </span>
      )}
    </div>
  );
}

function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  };

  return (
    <div className="gallery" role="group" aria-label={t.projects.screenshotsOf(alt)} tabIndex={0} onKeyDown={onKeyDown}>
      <img src={images[current]} alt={`${alt} - ${t.projects.screenshotOf(current + 1, images.length)}`} className="gallery-img" loading="lazy" />
      <div className="gallery-overlay">
        <span className="gallery-counter" aria-live="polite">{current + 1} / {images.length}</span>
      </div>
      <button className="gallery-btn gallery-prev" onClick={prev} aria-label={t.projects.prevImage}>
        <ChevronLeft size={20} />
      </button>
      <button className="gallery-btn gallery-next" onClick={next} aria-label={t.projects.nextImage}>
        <ChevronRight size={20} />
      </button>
      <div className="gallery-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`gallery-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={t.projects.goToImage(i + 1)}
          />
        ))}
      </div>
    </div>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  const { t } = useLanguage();
  const images = project.images ?? (project.imageUrl ? [project.imageUrl] : []);

  return (
    <ScrollReveal>
      <InteractiveCard className="project-featured">
        <div className="project-featured-image">
          {images.length > 1 ? (
            <ImageGallery images={images} alt={project.title} />
          ) : images.length === 1 ? (
            <img src={images[0]} alt={project.title} loading="lazy" />
          ) : null}
        </div>
        <div className="project-featured-info">
          {/* El badge de estado vive aquí y no sobre la imagen: en las tarjetas
              con galería el overlay no se renderizaba y el estado desaparecía. */}
          <div className="project-featured-eyebrow">
            <span className="project-featured-label">{t.projects.featured}</span>
            <span className={`project-status-badge inline ${statusClass[project.status]}`}>
              {t.projects.status[project.status]}
            </span>
          </div>
          <h4 className="project-featured-title">{project.title}</h4>
          {(project.role || project.year) && (
            <p className="project-meta">
              {[project.role, project.year].filter(Boolean).join(' · ')}
            </p>
          )}
          <p className="project-featured-description">{project.description}</p>
          {project.highlights && project.highlights.length > 0 && (
            <ul className="project-highlights">
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          {project.techStack.length > 0 && (
            <div className="project-tech">
              {project.techStack.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
          )}
          <ProjectLinks project={project} variant="featured" />
        </div>
      </InteractiveCard>
    </ScrollReveal>
  );
}

/**
 * Compact card used by the filterable grid. Standardized shape for every
 * project regardless of category: title, tagline, role/year, stack, links.
 */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLanguage();
  return (
    <ScrollReveal delay={Math.min(index, 5) * 0.08}>
      <InteractiveCard className="project-card" tilt maxTilt={4}>
        <div className="project-info">
          <div className="project-card-head">
            <h4 className="project-title">{project.title}</h4>
            <span className={`project-status-badge inline ${statusClass[project.status]}`}>
              {t.projects.status[project.status]}
            </span>
          </div>
          {(project.role || project.year) && (
            <p className="project-meta">
              {[project.role, project.year].filter(Boolean).join(' · ')}
            </p>
          )}
          <p className="project-description">{project.tagline ?? project.description}</p>
          {project.techStack.length > 0 && (
            <div className="project-tech">
              {project.techStack.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
          )}
          <ProjectLinks project={project} variant="compact" />
        </div>
      </InteractiveCard>
    </ScrollReveal>
  );
}

/**
 * The venture block: one header for the company, then its product line.
 * This is what keeps LyrooPOS reading as *a product of* Lyroo rather than a
 * sibling project competing with it.
 */
function VentureBlock({ venture, projects }: { venture: Venture; projects: Project[] }) {
  const { t } = useLanguage();

  // Resolve product slugs in the order the venture declares them.
  const products = venture.products
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));

  const flagship = products.filter((p) => p.featured);
  const rest = products.filter((p) => !p.featured);

  return (
    <div className="venture">
      <ScrollReveal>
        <div className="venture-header">
          <div className="venture-badge">
            <Rocket size={16} />
            {t.projects.venture.label}
          </div>
          <div className="venture-headline">
            <h3 className="venture-name">{venture.name}</h3>
            <span className="venture-count">{t.projects.venture.productLine(products.length)}</span>
          </div>
          <p className="venture-tagline">{venture.tagline}</p>
          <p className="venture-description">{venture.description}</p>
          <div className="venture-meta">
            <span className="venture-role">{venture.role}</span>
            <a href={venture.url} target="_blank" rel="noopener noreferrer" className="venture-link">
              {t.projects.venture.visitSite}
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </ScrollReveal>

      {flagship.map((project) => (
        <FeaturedProject key={project.slug} project={project} />
      ))}

      {rest.length > 0 && (
        <div className="projects-grid venture-products">
          {rest.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Projects({ projects, ventures }: ProjectsProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all');

  // Slugs already shown inside a venture block — excluded from the grid below
  // so a product never appears twice on the page.
  const ventureSlugs = useMemo(
    () => new Set(ventures.flatMap((v) => v.products)),
    [ventures],
  );

  const standalone = useMemo(
    () => projects.filter((p) => !ventureSlugs.has(p.slug)),
    [projects, ventureSlugs],
  );

  // Only offer chips for categories that actually have projects.
  const availableFilters = useMemo(() => {
    const present = new Set(projects.map((p) => p.category));
    return FILTER_ORDER.filter((c) => present.has(c));
  }, [projects]);

  const isAll = filter === 'all';

  // The venture block owns its products' rendering, so it shows on "All" and on
  // its own category, and those slugs are always excluded from the grid below.
  const showVenture = isAll || filter === 'startup';

  // Everything not already rendered by a venture block, for the current filter.
  const visible = useMemo(
    () => (isAll ? standalone : standalone.filter((p) => p.category === filter)),
    [isAll, filter, standalone],
  );

  const featured = useMemo(() => visible.filter((p) => p.featured), [visible]);
  const gridProjects = useMemo(() => visible.filter((p) => !p.featured), [visible]);

  return (
    <section id="projects" className="section">
      <SectionTitle index={5}>{t.sections.projects}</SectionTitle>

      <ScrollReveal>
        <div className="project-filters" role="tablist" aria-label={t.projects.filterLabel}>
          {(['all', ...availableFilters] as const).map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={filter === key}
              className={`project-filter${filter === key ? ' active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {t.projects.filters[key]}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {showVenture &&
        ventures.map((venture) => (
          <VentureBlock key={venture.name} venture={venture} projects={projects} />
        ))}

      {featured.map((project) => (
        <FeaturedProject key={project.slug} project={project} />
      ))}

      {gridProjects.length > 0 && (
        <>
          {isAll && (
            <ScrollReveal>
              <h3 className="projects-subheading">{t.projects.otherWork}</h3>
            </ScrollReveal>
          )}
          <div className="projects-grid">
            {gridProjects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
