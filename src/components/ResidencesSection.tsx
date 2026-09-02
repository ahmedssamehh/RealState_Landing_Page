'use client';

import { useEffect, useRef } from 'react';
import Residence from './Residence';
import { apartments, type Apartment } from '@/data/apartments';
import { useLocale } from '@/lib/locale';
import { gsap, registerGsap, revealFade, revealLines } from '@/lib/animations';

export type ResidencesCopy = {
  index: string;
  label: string;
  headline: string[];
  note: string;
};

type Props = {
  onOpenResidence: (residence: Apartment) => void;
  onOpenPhotos: (residence: Apartment) => void;
  /** The collection to list. Defaults to the rentals. */
  items?: Apartment[];
  /** Section copy override — used by the sales collection. */
  copy?: ResidencesCopy;
};

export default function ResidencesSection({
  onOpenResidence,
  onOpenPhotos,
  items = apartments,
  copy,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const { t } = useLocale();

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      revealLines(el, '[data-section-head] .reveal-line > span', { trigger: el, start: 'top 76%' });
      revealFade(el.querySelectorAll('[data-section-fade]'), { trigger: el, start: 'top 74%' });
    }, el);

    return () => ctx.revert();
  }, []);

  const { index, label, headline, note } = copy ?? t.residences;

  return (
    <section
      ref={root}
      id="residences"
      aria-labelledby="residences-heading"
      className="relative w-full bg-ivory py-[clamp(5rem,14vh,10rem)]"
    >
      <div className="edge mx-auto max-w-edge">
        {/* Section meta */}
        <div className="mb-[clamp(2.5rem,7vh,5rem)] flex items-center gap-6">
          <span className="label text-burgundy">{index}</span>
          <span className="h-px w-12 bg-ink/20" />
          <span className="label text-ink/50">{label}</span>
        </div>

        <div
          data-section-head
          className="mb-[clamp(2rem,6vh,4rem)] flex flex-col justify-between gap-10 lg:flex-row lg:items-end"
        >
          <h2 id="residences-heading" className="display text-ink">
            {headline.map((line) => (
              <span key={line} className="reveal-line">
                <span className="block text-[clamp(2.6rem,8vw,7rem)]">{line}</span>
              </span>
            ))}
          </h2>
          <p
            data-section-fade
            className="max-w-sm font-sans text-sm font-light leading-relaxed text-ink/60 opacity-0"
          >
            {note}
          </p>
        </div>

        {/* Chapters */}
        <div>
          {items.map((residence, i) => (
            <Residence
              key={residence.id}
              residence={residence}
              index={i}
              onOpen={onOpenResidence}
              onOpenPhotos={onOpenPhotos}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
