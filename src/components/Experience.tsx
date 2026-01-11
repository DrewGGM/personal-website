import type { Experience as ExperienceType } from '../types';

interface ExperienceProps {
  experiences: ExperienceType[];
}

export default function Experience({ experiences }: ExperienceProps) {
  const formatDate = (date: string) => {
    if (date === 'present') return 'Present';
    const [year, month] = date.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <section className="section">
      <h2 className="section-title">Experience</h2>
      <div className="timeline">
        {experiences.map((exp, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-header">
              <div>
                <h3 className="item-title">{exp.position}</h3>
                <p className="item-subtitle">{exp.company}</p>
              </div>
              <div className="item-meta">
                <p className="item-date">
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </p>
                <p className="item-location">{exp.location}</p>
              </div>
            </div>
            <p className="item-summary">{exp.summary}</p>
            {exp.highlights.length > 0 && (
              <ul className="highlights">
                {exp.highlights.map((highlight, i) => (
                  <li key={i}>{highlight}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
