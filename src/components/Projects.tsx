import ScrollReveal from './ScrollReveal';
import { Github, ExternalLink, Clock } from 'lucide-react';
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

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="section">
      <ScrollReveal>
        <h2 className="section-title">Projects</h2>
      </ScrollReveal>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <ScrollReveal key={`${project.title}-${index}`} delay={index * 0.1}>
            <div className="project-card">
              <div className="project-image">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} />
                ) : project.status === 'coming-soon' ? (
                  <Clock size={40} className="coming-soon-icon" aria-hidden="true" />
                ) : (
                  <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-primary)', opacity: 0.4 }}>
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
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {(project.githubUrl || project.demoUrl) && (
                  <div className="project-links">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <Github size={16} />
                        Code
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <ExternalLink size={16} />
                        Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
