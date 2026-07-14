import { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import SectionTitle from './SectionTitle';
import InteractiveCard from './InteractiveCard';
import { Github, ExternalLink, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
}

const statusClass: Record<Project['status'], string> = {
  completed: 'status-completed',
  'in-progress': 'status-in-progress',
  'coming-soon': 'status-coming-soon',
};

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
          {images.length <= 1 && (
            <div className="project-featured-overlay">
              <span className={`project-status-badge ${statusClass[project.status]}`}>
                {t.projects.status[project.status]}
              </span>
            </div>
          )}
        </div>
        <div className="project-featured-info">
          <span className="project-featured-label">{t.projects.featured}</span>
          <h3 className="project-featured-title">{project.title}</h3>
          <p className="project-featured-description">{project.description}</p>
          {project.techStack.length > 0 && (
            <div className="project-tech">
              {project.techStack.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          )}
          {(project.githubUrl || project.demoUrl) && (
            <div className="project-links">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link-btn">
                  <Github size={18} />
                  {t.projects.viewCode}
                </a>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="project-link-btn primary">
                  <ExternalLink size={18} />
                  {t.projects.liveDemo}
                </a>
              )}
            </div>
          )}
        </div>
      </InteractiveCard>
    </ScrollReveal>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useLanguage();
  return (
    <ScrollReveal delay={index * 0.1}>
      <InteractiveCard className="project-card" tilt maxTilt={4}>
        <div className="project-image">
          {project.imageUrl ? (
            <img src={project.imageUrl} alt={project.title} />
          ) : project.status === 'coming-soon' ? (
            <Clock size={40} className="coming-soon-icon" aria-hidden="true" />
          ) : (
            <span className="project-initials">
              {project.title.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </span>
          )}
          <span className={`project-status-badge ${statusClass[project.status]}`}>
            {t.projects.status[project.status]}
          </span>
        </div>
        <div className="project-info">
          <h3 className="project-title">{project.title}</h3>
          <p className="project-description">{project.description}</p>
          {project.techStack.length > 0 && (
            <div className="project-tech">
              {project.techStack.map((tech) => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
          )}
          {(project.githubUrl || project.demoUrl) && (
            <div className="project-links">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                  <Github size={16} /> {t.projects.code}
                </a>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                  <ExternalLink size={16} /> {t.projects.demo}
                </a>
              )}
            </div>
          )}
        </div>
      </InteractiveCard>
    </ScrollReveal>
  );
}

export default function Projects({ projects }: ProjectsProps) {
  const { t } = useLanguage();
  const featured = projects.filter((p) => p.imageUrl && p.status === 'completed');
  const others = projects.filter((p) => !p.imageUrl || p.status !== 'completed');

  return (
    <section id="projects" className="section">
      <SectionTitle index={5}>{t.sections.projects}</SectionTitle>

      {featured.map((project, index) => (
        <FeaturedProject key={`featured-${project.title}-${index}`} project={project} />
      ))}

      {others.length > 0 && (
        <div className="projects-grid">
          {others.map((project, index) => (
            <ProjectCard key={`${project.title}-${index}`} project={project} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
