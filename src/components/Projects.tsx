import { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import { Github, ExternalLink, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
}

const statusClass: Record<Project['status'], string> = {
  completed: 'status-completed',
  'in-progress': 'status-in-progress',
  'coming-soon': 'status-coming-soon',
};

const statusLabel: Record<Project['status'], string> = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  'coming-soon': 'Coming Soon',
};

function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="gallery">
      <img src={images[current]} alt={`${alt} - ${current + 1}`} className="gallery-img" />
      <div className="gallery-overlay">
        <span className="gallery-counter">{current + 1} / {images.length}</span>
      </div>
      <button className="gallery-btn gallery-prev" onClick={prev} aria-label="Previous image">
        <ChevronLeft size={20} />
      </button>
      <button className="gallery-btn gallery-next" onClick={next} aria-label="Next image">
        <ChevronRight size={20} />
      </button>
      <div className="gallery-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`gallery-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  const images = project.images ?? (project.imageUrl ? [project.imageUrl] : []);

  return (
    <ScrollReveal>
      <div className="project-featured">
        <div className="project-featured-image">
          {images.length > 1 ? (
            <ImageGallery images={images} alt={project.title} />
          ) : images.length === 1 ? (
            <img src={images[0]} alt={project.title} />
          ) : null}
          {images.length <= 1 && (
            <div className="project-featured-overlay">
              <span className={`project-status-badge ${statusClass[project.status]}`}>
                {statusLabel[project.status]}
              </span>
            </div>
          )}
        </div>
        <div className="project-featured-info">
          <span className="project-featured-label">Featured Project</span>
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
                  View Code
                </a>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="project-link-btn primary">
                  <ExternalLink size={18} />
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <ScrollReveal delay={index * 0.1}>
      <div className="project-card">
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
            {statusLabel[project.status]}
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
                  <Github size={16} /> Code
                </a>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                  <ExternalLink size={16} /> Demo
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function Projects({ projects }: ProjectsProps) {
  const featured = projects.filter((p) => p.imageUrl && p.status === 'completed');
  const others = projects.filter((p) => !p.imageUrl || p.status !== 'completed');

  return (
    <section id="projects" className="section">
      <ScrollReveal>
        <h2 className="section-title">Projects</h2>
      </ScrollReveal>

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
