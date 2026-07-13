import type { ReactNode } from 'react';
import { Rocket, Landmark, Layers, FileCheck2, MapPin, ArrowUpRight } from 'lucide-react';
import { GlowingEffect } from './ui/glowing-effect';
import { cn } from '@/lib/utils';

interface GridItemProps {
  area: string;
  icon: ReactNode;
  title: string;
  description: ReactNode;
  href?: string;
}

/** A single bento cell wrapped in the 21st.dev "Glowing Effect" border. */
function GridItem({ area, icon, title, description, href }: GridItemProps) {
  const inner = (
    <div className="relative flex h-full flex-col justify-center gap-4 overflow-hidden rounded-xl border-[0.75px] border-border bg-card/60 p-6 shadow-sm">
      <div className="flex w-fit items-center justify-center rounded-lg border-[0.75px] border-border bg-muted p-2.5 text-primary">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="flex items-center gap-1.5 text-xl font-semibold tracking-[-0.02em] text-foreground md:text-2xl">
          {title}
          {href && <ArrowUpRight className="h-4 w-4 text-primary" />}
        </h3>
        <p className="font-sans text-sm leading-[1.35rem] text-muted-foreground md:text-[0.95rem]">
          {description}
        </p>
      </div>
    </div>
  );

  return (
    <li className={cn('list-none md:min-h-[13rem]', area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full transition-transform duration-300 hover:-translate-y-0.5"
          >
            {inner}
          </a>
        ) : (
          inner
        )}
      </div>
    </li>
  );
}

/**
 * "What I'm working on" bento grid. Built on the 21st.dev Glowing Effect
 * (Aceternity) with the site's own content and indigo/violet palette.
 */
export default function Highlights() {
  return (
    <ul className="highlights-bento grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/5/3/9]"
        icon={<Rocket className="h-5 w-5" />}
        title="Founder of Lyroo"
        href="https://lyroo.com.co"
        description="Building LyrooPOS — an offline-first point of sale with an embedded DIAN electronic-invoicing engine. v1.2 in production with the first active customers, plus Lyroo Build, a custom software studio."
      />
      <GridItem
        area="md:[grid-area:1/1/2/5]"
        icon={<Landmark className="h-5 w-5" />}
        title="Core banking @ COFINCAFE"
        description="Developing and supporting a cooperative's core banking system on Apache Fineract & Mifos."
      />
      <GridItem
        area="md:[grid-area:2/1/3/5]"
        icon={<Layers className="h-5 w-5" />}
        title="Backend & architecture"
        description="Java · Spring Boot · Go · hexagonal architecture · microservices · clean code."
      />
      <GridItem
        area="md:[grid-area:1/9/2/13]"
        icon={<FileCheck2 className="h-5 w-5" />}
        title="DIAN e-invoicing core"
        description="Embedded UBL 2.1 engine — unlimited electronic invoicing with no per-folio fees or third-party APIs."
      />
      <GridItem
        area="md:[grid-area:2/9/3/13]"
        icon={<MapPin className="h-5 w-5" />}
        title="Armenia, Colombia"
        description="Remote-first · open to new opportunities."
      />
    </ul>
  );
}
