'use client';

import { useEffect, useRef } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { useLocale } from '@/lib/locale';
import { gsap, registerGsap, revealFade, revealLines } from '@/lib/animations';

export default function LocationSection() {
  const root = useRef<HTMLElement>(null);
  const { t } = useLocale();

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      revealLines(el, '.reveal-line > span', { trigger: el, start: 'top 74%' });
      revealFade(el.querySelectorAll('[data-loc-fade]'), { trigger: el, start: 'top 70%' });
    }, el);

    return () => ctx.revert();
  }, []);

  const { index, label, headline, body, addressLines, landmarks, city, country } = t.location;
  const { coordinates, mapEmbedUrl } = siteConfig.location;

  return (
    <section
      ref={root}
      id="location"
      aria-labelledby="location-heading"
      className="relative w-full bg-ivory py-[clamp(5rem,14vh,10rem)]"
    >
      <div className="edge mx-auto max-w-edge">
        <div className="mb-[clamp(2.5rem,7vh,5rem)] flex items-center gap-6">
          <span className="label text-burgundy">{index}</span>
          <span className="h-px w-12 bg-ink/20" />
          <span className="label text-ink/50">{label}</span>
        </div>

        <div className="grid grid-cols-12 items-end gap-y-10">
          <h2 id="location-heading" className="display col-span-12 text-ink lg:col-span-7">
            {headline.map((line) => (
              <span key={line} className="reveal-line">
                <span className="block text-[clamp(2.6rem,8.5vw,7.5rem)]">{line}</span>
              </span>
            ))}
          </h2>
          <p
            data-loc-fade
            className="col-span-12 max-w-sm font-sans text-sm font-light leading-relaxed text-ink/60 opacity-0 lg:col-span-4 lg:col-start-9"
          >
            {body}
          </p>
        </div>

        {/* ------------------------------------------------ Map + address */}
        <div className="mt-[clamp(3rem,9vh,6rem)] grid grid-cols-12 gap-y-12 lg:gap-x-16">
          {/* Map: dark architectural treatment. Replace with a real embed by
              setting siteConfig.location.mapEmbedUrl. */}
          <div
            data-loc-fade
            className="col-span-12 opacity-0 lg:col-span-7"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-ink/15 bg-ink sm:aspect-[16/10]">
              {mapEmbedUrl ? (
                <iframe
                  src={mapEmbedUrl}
                  title={`Map of ${city}, ${country}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full grayscale-[0.9] invert-[0.92] contrast-[1.1]"
                />
              ) : (
                <>
                  {/* Abstract street grid */}
                  <svg
                    aria-hidden
                    className="absolute inset-0 h-full w-full text-ivory/12"
                    preserveAspectRatio="none"
                    viewBox="0 0 800 500"
                  >
                    {Array.from({ length: 9 }).map((_, i) => (
                      <line
                        key={`h${i}`}
                        x1="0"
                        x2="800"
                        y1={i * 62 + 30}
                        y2={i * 62 + 30}
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    ))}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <line
                        key={`v${i}`}
                        y1="0"
                        y2="500"
                        x1={i * 70 + 40}
                        x2={i * 70 + 40}
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    ))}
                    {/* Coastline */}
                    <path
                      d="M0 430 C 160 400, 280 460, 420 420 S 700 380, 800 410 L800 500 L0 500 Z"
                      fill="#0d0d0d"
                      stroke="rgba(216,182,164,0.25)"
                      strokeWidth="1"
                    />
                  </svg>

                  {/* Site marker */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-burgundy opacity-60" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-burgundy" />
                    </span>
                  </div>
                  <p className="label absolute bottom-6 left-6 text-champagne/45">
                    {coordinates.lat.toFixed(4)}&deg; N &nbsp;/&nbsp; {coordinates.lng.toFixed(4)}
                    &deg; E
                  </p>
                  <p className="label absolute right-6 top-6 text-champagne/30">
                    {t.ui.mapPlaceholder}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Address + landmarks */}
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <div data-loc-fade className="opacity-0">
              <p className="label mb-6 text-ink/45">{t.ui.address}</p>
              <address className="font-serif text-[clamp(1.4rem,2.2vw,1.9rem)] font-light not-italic leading-relaxed text-ink">
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>

            <div data-loc-fade className="mt-12 opacity-0">
              <p className="label mb-2 text-ink/45">{t.ui.nearby}</p>
              <ul>
                {landmarks.map((l) => (
                  <li
                    key={l.name}
                    className="flex items-baseline justify-between border-b border-ink/15 py-4"
                  >
                    <span className="font-sans text-sm font-light tracking-wide text-ink/85">
                      {l.name}
                    </span>
                    <span className="label text-burgundy">{l.distance}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
