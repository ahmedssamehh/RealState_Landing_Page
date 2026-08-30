'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { useLocale } from '@/lib/locale';
import { gsap, parallax, registerGsap, revealFade, revealImage, revealLines } from '@/lib/animations';

export default function LifestyleSection() {
  const root = useRef<HTMLElement>(null);
  const { t } = useLocale();
  const figure = useRef<HTMLDivElement>(null);
  const imageWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      revealLines(el, '.reveal-line > span', { trigger: el, start: 'top 74%' });
      revealFade(el.querySelectorAll('[data-life-fade]'), { trigger: el, start: 'top 70%' });
      if (figure.current) revealImage(figure.current, el);
      if (imageWrap.current) parallax(imageWrap.current, el, 14);
    }, el);

    return () => ctx.revert();
  }, []);

  const { index, label, headline, body, pillars, image, imageAlt } = t.lifestyle;

  return (
    <section
      ref={root}
      aria-labelledby="lifestyle-heading"
      className="relative w-full bg-champagne py-[clamp(5rem,14vh,10rem)]"
    >
      {/* Full-bleed architectural plate */}
      <div ref={figure} className="relative h-[62svh] min-h-[380px] w-full overflow-hidden">
        <div ref={imageWrap} className="absolute inset-[-8%]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-ink/35" />

        <div className="edge absolute inset-0 z-10 mx-auto flex max-w-edge flex-col justify-end pb-[clamp(2rem,6vh,4rem)]">
          <h2 id="lifestyle-heading" className="display text-ivory">
            {headline.map((line) => (
              <span key={line} className="reveal-line">
                <span className="block text-[clamp(2.6rem,9vw,8rem)]">{line}</span>
              </span>
            ))}
          </h2>
        </div>
      </div>

      <div className="edge mx-auto max-w-edge pt-[clamp(3rem,9vh,7rem)]">
        <div className="grid grid-cols-12 gap-y-12 lg:gap-x-16">
          <div data-life-fade className="col-span-12 opacity-0 lg:col-span-4">
            <div className="mb-8 flex items-center gap-6">
              <span className="label text-burgundy">{index}</span>
              <span className="h-px w-12 bg-ink/25" />
              <span className="label text-ink/55">{label}</span>
            </div>
            <p className="font-serif text-[clamp(1.3rem,2.3vw,1.9rem)] font-light leading-[1.5] text-ink/85">
              {body}
            </p>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-12">
              {pillars.map((p) => (
                <div
                  key={p.title}
                  data-life-fade
                  className="border-t border-ink/20 py-8 opacity-0"
                >
                  <dt className="label text-ink">{p.title}</dt>
                  <dd className="mt-4 font-sans text-sm font-light leading-relaxed text-ink/60">
                    {p.text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
