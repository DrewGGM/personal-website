import ScrollReveal from './ScrollReveal';
import { ExternalLink } from 'lucide-react';
import type { Certification } from '../types';

interface CertificationsProps {
  certifications: Certification[];
}

export default function Certifications({ certifications }: CertificationsProps) {
  return (
    <section id="certifications" className="section">
      <ScrollReveal>
        <h2 className="section-title">Certifications & Courses</h2>
      </ScrollReveal>
      <div className="certifications-grid">
        {certifications.map((cert, index) => (
          <ScrollReveal key={cert.title} delay={index * 0.08}>
            <div className="certification-card">
              <div>
                <h3 className="certification-title">{cert.title}</h3>
                <p className="certification-issuer">{cert.issuer}</p>
                <p className="certification-date">{cert.date}</p>
              </div>
              {cert.certificateUrl && (
                <a
                  href={cert.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-certificate"
                >
                  <ExternalLink size={16} />
                  View Certificate
                </a>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
