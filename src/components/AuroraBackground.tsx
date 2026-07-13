/**
 * Fixed, non-interactive layer of slowly drifting gradient orbs that live
 * behind the particle network. Gives the flat dark background real depth and
 * subtle colour movement. Pure CSS animation — cheap and GPU-composited.
 */
export default function AuroraBackground() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="aurora-orb aurora-orb--1" />
      <span className="aurora-orb aurora-orb--2" />
      <span className="aurora-orb aurora-orb--3" />
      <div className="aurora-grid" />
    </div>
  );
}
