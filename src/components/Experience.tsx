import ScrollReveal from './ScrollReveal';
import type { Experience as ExperienceType } from '../types';

interface ExperienceProps {
  experiences: ExperienceType[];
}

const formatDate = (date: string) => {
  if (date === 'present') return 'Present';
  const [year, monthStr] = date.split('-');
  const month = parseInt(monthStr);
  if (!year || month < 1 || month > 12) return date;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[month - 1]} ${year}`;
};

export default function Experience({ experiences }: ExperienceProps) {
  return (
    <section id="experience" className="section">
      <ScrollReveal>
        <h2 className="section-title">Experience</h2>
      </ScrollReveal>
      <div className="timeline">
        {experiences.map((exp, index) => (
          <ScrollReveal key={`${exp.company}-${exp.startDate}`} delay={index * 0.1}>
            <div className="timeline-item">
              <div className="timeline-header">
                <div>
                  <h3 className="timeline-title">{exp.position}</h3>
                  <p className="timeline-subtitle">{exp.company}</p>
                </div>
                <div className="timeline-meta">
                  <span className="timeline-date">
                    {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                  </span>
                  <p className="timeline-location">{exp.location}</p>
                </div>
              </div>
              <p className="timeline-summary">{exp.summary}</p>
              {exp.highlights.length > 0 && (
                <ul className="timeline-highlights">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
