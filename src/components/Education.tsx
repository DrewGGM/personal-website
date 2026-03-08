import ScrollReveal from './ScrollReveal';
import type { Education as EducationType } from '../types';

interface EducationProps {
  education: EducationType[];
}

const formatDate = (date: string) => {
  if (!date || date === 'present') return 'Present';
  const [year, monthStr] = date.split('-');
  const month = parseInt(monthStr);
  if (!year || month < 1 || month > 12) return date;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[month - 1]} ${year}`;
};

export default function Education({ education }: EducationProps) {
  return (
    <section id="education" className="section">
      <ScrollReveal>
        <h2 className="section-title">Education</h2>
      </ScrollReveal>
      <div className="timeline">
        {education.map((edu, index) => (
          <ScrollReveal key={`${edu.institution}-${edu.startDate}`} delay={index * 0.1}>
            <div className="timeline-item">
              <div className="timeline-header">
                <div>
                  <h3 className="timeline-title">{edu.degree} — {edu.area}</h3>
                  <p className="timeline-subtitle">{edu.institution}</p>
                </div>
                <div className="timeline-meta">
                  <span className="timeline-date">
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  </span>
                  <p className="timeline-location">{edu.location}</p>
                </div>
              </div>
              {edu.summary && <p className="timeline-summary">{edu.summary}</p>}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
