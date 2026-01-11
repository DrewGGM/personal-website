import type { CVData } from '../types';

interface HeaderProps {
  data: CVData;
}

export default function Header({ data }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <img src="/profile.jpg" alt={data.name} className="profile-photo" />
        <h1 className="name">{data.name}</h1>
        <p className="headline">{data.headline}</p>
        <p className="location">{data.location}</p>

        <div className="contact-info">
          <a href={`mailto:${data.email}`} className="contact-link">
            {data.email}
          </a>
          <span className="separator">•</span>
          <a href={`tel:${data.phone}`} className="contact-link">
            {data.phone}
          </a>
          <span className="separator">•</span>
          <a href={data.website} target="_blank" rel="noopener noreferrer" className="contact-link">
            andrewgarcia.dev
          </a>
        </div>

        <div className="social-links">
          {data.socialNetworks.map((social) => (
            <a
              key={social.network}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              {social.network}
            </a>
          ))}
          <a
            href="/Andrew_Garcia_Mosquera_CV.pdf"
            download
            className="social-link download-cv"
          >
            Download CV
          </a>
        </div>
      </div>
    </header>
  );
}
