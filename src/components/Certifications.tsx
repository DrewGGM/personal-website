interface CertificationsProps {
  certifications: string[];
}

export default function Certifications({ certifications }: CertificationsProps) {
  return (
    <section className="section">
      <h2 className="section-title">Certifications & Courses</h2>
      <ul className="certifications-list">
        {certifications.map((cert, index) => (
          <li key={index} className="certification-item">{cert}</li>
        ))}
      </ul>
    </section>
  );
}
