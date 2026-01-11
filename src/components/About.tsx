interface AboutProps {
  summary: string;
}

export default function About({ summary }: AboutProps) {
  return (
    <section className="section">
      <h2 className="section-title">About</h2>
      <p className="summary">{summary}</p>
    </section>
  );
}
