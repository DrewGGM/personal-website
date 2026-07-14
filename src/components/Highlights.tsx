import type { ReactNode } from 'react';
import { Rocket, Landmark, Layers, FileCheck2, MapPin, ArrowUpRight } from 'lucide-react';
import { GlowingEffect } from './ui/glowing-effect';
import { cn } from '@/lib/utils';
import { useLanguage } from '../i18n/LanguageContext';

interface GridItemProps {
  area: string;
  icon: ReactNode;
  title: string;
  description: ReactNode;
  href?: string;
  image: string;
  imageAlt: string;
}

/**
 * A single bento cell: an AI-generated themed background (fal.ai · Nano Banana Pro,
 * matched to the indigo/violet palette) with a dark bottom gradient for legibility,
 * wrapped in the 21st.dev "Glowing Effect" border.
 */
function GridItem({ area, icon, title, description, href, image, imageAlt }: GridItemProps) {
  const inner = (
    <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-border bg-card p-6 shadow-sm">
      <img
        src={image}
        alt={imageAlt}
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a1a] from-25% via-[#0a0a1a]/75 via-55% to-[#0a0a1a]/10" />
      <div className="relative flex w-fit items-center justify-center rounded-lg border-[0.75px] border-border bg-[#0a0a1a]/70 p-2.5 text-primary backdrop-blur-sm">
        {icon}
      </div>
      <div className="relative space-y-2">
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
    <li className={cn('min-h-[15rem] list-none md:min-h-[13rem]', area)}>
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

// Layout/visuals are language-independent; the text comes from the i18n dict
// (t.highlights), matched to these cells by order.
const cells = [
  { area: 'md:[grid-area:1/5/3/9]', icon: <Rocket className="h-5 w-5" />, href: 'https://lyroo.com.co', image: '/highlights/lyroo.png' },
  { area: 'md:[grid-area:1/1/2/5]', icon: <Landmark className="h-5 w-5" />, image: '/highlights/banking.png' },
  { area: 'md:[grid-area:2/1/3/5]', icon: <Layers className="h-5 w-5" />, image: '/highlights/backend.png' },
  { area: 'md:[grid-area:1/9/2/13]', icon: <FileCheck2 className="h-5 w-5" />, image: '/highlights/dian.png' },
  { area: 'md:[grid-area:2/9/3/13]', icon: <MapPin className="h-5 w-5" />, image: '/highlights/location.png' },
] as const;

/**
 * "What I'm working on" bento grid — themed AI-generated backgrounds on the
 * 21st.dev Glowing Effect (Aceternity), all in the site's indigo/violet palette.
 */
export default function Highlights() {
  const { t } = useLanguage();
  return (
    <ul className="highlights-bento grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2">
      {cells.map((cell, i) => (
        <GridItem
          key={cell.area}
          area={cell.area}
          icon={cell.icon}
          href={'href' in cell ? cell.href : undefined}
          image={cell.image}
          imageAlt=""
          title={t.highlights[i].title}
          description={t.highlights[i].description}
        />
      ))}
    </ul>
  );
}
