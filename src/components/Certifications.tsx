import type { Certification } from '../types';

interface CertificationsProps {
  certifications: Certification[];
}

export default function Certifications({ certifications }: CertificationsProps) {
  return (
    <section className="section">
      <h2 className="section-title">Certifications & Courses</h2>
      <div className="certifications-grid">
        {certifications.map((cert, index) => (
          <div key={index} className="certification-card">
            <div className="certification-header">
              <h3 className="certification-title">{cert.title}</h3>
              <p className="certification-issuer">{cert.issuer}</p>
              <p className="certification-date">{cert.date}</p>
            </div>
            {cert.certificateUrl && (
              <a
                href={cert.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="view-certificate-btn"
              >
                View Certificate
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
