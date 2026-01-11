import type { Education as EducationType } from '../types';

interface EducationProps {
  education: EducationType[];
}

export default function Education({ education }: EducationProps) {
  const formatDate = (date: string) => {
    if (!date || date === 'present') return 'Present';
    const [year, month] = date.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <section className="section">
      <h2 className="section-title">Education</h2>
      <div className="timeline">
        {education.map((edu, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-header">
              <div>
                <h3 className="item-title">{edu.degree}</h3>
                <p className="item-subtitle">{edu.institution} - {edu.area}</p>
              </div>
              <div className="item-meta">
                <p className="item-date">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </p>
                <p className="item-location">{edu.location}</p>
              </div>
            </div>
            {edu.summary && <p className="item-summary">{edu.summary}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
