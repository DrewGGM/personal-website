interface Tech {
  name: string;
  file: string;
}

/** Tech stack with real brand SVGs (sourced via 21st.dev logo search, stored in /public/tech). */
const TECH: Tech[] = [
  { name: 'Java', file: 'java' },
  { name: 'Go', file: 'go' },
  { name: 'TypeScript', file: 'typescript' },
  { name: 'Python', file: 'python' },
  { name: 'React', file: 'react' },
  { name: 'Node.js', file: 'nodejs' },
  { name: 'Next.js', file: 'nextjs' },
  { name: 'Angular', file: 'angular' },
  { name: 'PostgreSQL', file: 'postgresql' },
  { name: 'Docker', file: 'docker' },
  { name: 'Cloudflare', file: 'cloudflare' },
];

/**
 * Edge-faded infinite marquee of the tech stack rendered with real brand logos.
 * The list is duplicated so the CSS translate loop is seamless; pauses on hover.
 */
export default function TechLogos() {
  return (
    <div className="marquee logo-marquee" aria-label="Tech stack">
      <div className="marquee__track">
        {[...TECH, ...TECH].map((tech, i) => (
          <span key={i} className="logo-chip" aria-hidden={i >= TECH.length}>
            <img
              src={`/tech/${tech.file}.svg`}
              alt={tech.name}
              className="logo-chip__img"
              loading="lazy"
              width={26}
              height={26}
            />
            <span className="logo-chip__name">{tech.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
