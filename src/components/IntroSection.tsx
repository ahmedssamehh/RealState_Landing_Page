'use client';

import { useEffect, useRef } from 'react';
import { apartments, type Apartment } from '@/data/apartments';
import { useLocale } from '@/lib/locale';
import { gsap, registerGsap, revealFade, revealLines } from '@/lib/animations';

export type IntroCopy = {
  index: string;
  label: string;
  headline: string[];
  body: string;
  note: string;
  stats: ReadonlyArray<{ value: string; label: string }>;
};

type Props = {
  /** The collection the AUTO_COUNT stat counts. Defaults to the rentals. */
  items?: Apartment[];
  /** Section copy override — used by the sales collection. */
  copy?: IntroCopy;
};

export default function IntroSection({ items = apartments, copy }: Props) {
  const root = useRef<HTMLElement>(null);
  const { t } = useLocale();

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      revealLines(el, '.reveal-line > span', { trigger: el, start: 'top 72%' });
      revealFade(el.querySelectorAll('[data-intro-fade]'), { trigger: el, start: 'top 68%' });
    }, el);

    return () => ctx.revert();
  }, []);

  const { index, label, headline, body, note, stats } = copy ?? t.intro;

  return (
    <section
      ref={root}
      id="intro"
      aria-labelledby="intro-heading"
      className="relative w-full bg-ivory py-[clamp(6rem,16vh,12rem)] text-ink"
    >
      <div className="edge mx-auto max-w-edge">
        {/* Section meta */}
        <div className="mb-[clamp(3rem,8vh,6rem)] flex items-center gap-6">
          <span className="label text-burgundy">{index}</span>
          <span className="h-px w-12 bg-ink/20" />
          <span className="label text-ink/50">{label}</span>
        </div>

        <div className="grid grid-cols-12 gap-y-14">
          <h2 id="intro-heading" className="display col-span-12 lg:col-span-8">
            {headline.map((line) => (
              <span key={line} className="reveal-line">
                <span className="block text-[clamp(2.6rem,8.6vw,8rem)]">{line}</span>
              </span>
            ))}
          </h2>

          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <p
              data-intro-fade
              className="font-serif text-[clamp(1.35rem,2.4vw,2rem)] font-light leading-[1.45] text-ink/85"
            >
              {body}
            </p>
            <p
              data-intro-fade
              className="mt-8 max-w-md font-sans text-sm font-light leading-relaxed text-ink/55"
            >
              {note}
            </p>
          </div>
        </div>

        {/* Vitals */}
        <dl className="mt-[clamp(4rem,12vh,9rem)] grid grid-cols-1 gap-px border-t border-ink/15 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} data-intro-fade className="border-b border-ink/15 py-8 sm:border-b-0 sm:pr-8">
              <dt className="label mb-4 text-ink/45">{s.label}</dt>
              <dd className="display text-[clamp(2.2rem,4.4vw,3.6rem)] text-ink">
                {s.value === 'AUTO_COUNT'
                  ? String(items.length).padStart(2, '0')
                  : s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
