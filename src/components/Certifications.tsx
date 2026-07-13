import ScrollReveal from './ScrollReveal';
import SectionTitle from './SectionTitle';
import InteractiveCard from './InteractiveCard';
import { ExternalLink } from 'lucide-react';
import type { Certification } from '../types';

interface CertificationsProps {
  certifications: Certification[];
}

export default function Certifications({ certifications }: CertificationsProps) {
  return (
    <section id="certifications" className="section">
      <SectionTitle index={6}>Certifications &amp; Courses</SectionTitle>
      <div className="certifications-grid">
        {certifications.map((cert, index) => (
          <ScrollReveal key={cert.title} delay={index * 0.08}>
            <InteractiveCard className="certification-card">
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
            </InteractiveCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
