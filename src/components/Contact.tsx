import ScrollReveal from './ScrollReveal';
import SectionTitle from './SectionTitle';
import { GlowingEffect } from './ui/glowing-effect';
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { CVData } from '../types';

interface ContactProps {
  data: CVData;
}

export default function Contact({ data }: ContactProps) {
  const { t } = useLanguage();
  const github = data.socialNetworks.find((s) => s.network === 'GitHub');
  const linkedin = data.socialNetworks.find((s) => s.network === 'LinkedIn');

  return (
    <section id="contact" className="section">
      <SectionTitle index={7}>{t.sections.contact}</SectionTitle>
      <ScrollReveal>
        <div className="contact-card-shell">
          <GlowingEffect
            spread={40}
            glow
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={3}
          />
          <div className="contact-content contact-card">
            <p className="contact-headline">
              {t.contact.headlinePre}{' '}
              <span className="gradient-text gradient-animate">{t.contact.headlineAccent}</span>.
            </p>
            <p className="contact-text">
              {t.contact.text}
            </p>
            <div className="contact-links">
              <a href={`mailto:${data.email}`} className="contact-item">
                <Mail size={18} />
                {data.email}
              </a>
              <a href={`tel:${data.phone}`} className="contact-item">
                <Phone size={18} />
                {data.phone}
              </a>
              <div className="contact-item">
                <MapPin size={18} />
                {data.location}
              </div>
            </div>
            <div className="contact-links">
              {github && (
                <a
                  href={github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item"
                >
                  <Github size={18} />
                  GitHub
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item"
                >
                  <Linkedin size={18} />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
