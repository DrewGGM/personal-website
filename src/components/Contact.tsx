import ScrollReveal from './ScrollReveal';
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import type { CVData } from '../types';

interface ContactProps {
  data: CVData;
}

export default function Contact({ data }: ContactProps) {
  const github = data.socialNetworks.find((s) => s.network === 'GitHub');
  const linkedin = data.socialNetworks.find((s) => s.network === 'LinkedIn');

  return (
    <section id="contact" className="section">
      <ScrollReveal>
        <h2 className="section-title">Get In Touch</h2>
      </ScrollReveal>
      <div className="contact-content">
        <ScrollReveal delay={0.1}>
          <p className="contact-text">
            I'm currently open to new opportunities. Whether you have a question or just want to say hi, feel free to reach out!
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
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
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
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
        </ScrollReveal>
      </div>
    </section>
  );
}
