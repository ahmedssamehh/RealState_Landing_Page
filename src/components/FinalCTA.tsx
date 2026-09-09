'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { MailIcon, PhoneIcon } from './ContactIcons';
import { useLocale } from '@/lib/locale';
import { gsap, registerGsap, revealFade, revealLines } from '@/lib/animations';

/**
 * Closing section. A full-bleed burgundy panel — the largest statement of the
 * accent colour on the site — carrying the headline and the three contact
 * channels there are. No button and no form: the phone number, WhatsApp
 * number and email address are themselves the actions.
 */
export type FinalCtaCopy = { headline: string[]; note: string };

export default function FinalCTA({ copy }: { copy?: FinalCtaCopy }) {
  const root = useRef<HTMLElement>(null);
  const { t } = useLocale();

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      revealLines(el, '.reveal-line > span', { trigger: el, start: 'top 76%' });
      revealFade(el.querySelectorAll('[data-cta-fade]'), { trigger: el, start: 'top 72%' });
    }, el);

    return () => ctx.revert();
  }, []);

  const { headline, note } = copy ?? t.finalCta;

  return (
    <section
      ref={root}
      id="contact"
      aria-labelledby="final-cta-heading"
      className="grain relative w-full bg-burgundy py-[clamp(5rem,16vh,11rem)] text-ivory"
    >
      <div className="edge mx-auto max-w-edge">
        <p data-cta-fade className="label mb-[clamp(2rem,6vh,4rem)] text-ivory/55 opacity-0">
          {note}
        </p>

        <h2 id="final-cta-heading" className="display text-ivory">
          {headline.map((line) => (
            <span key={line} className="reveal-line">
              <span className="block text-[clamp(2.6rem,10vw,9rem)]">{line}</span>
            </span>
          ))}
        </h2>

        {/*
          The three channels. The two numbers are stacked as a pair in the left
          column — they are the same kind of action and read as a set — with the
          email held alongside them in a full-height second column. Cells are
          placed explicitly rather than flowing, so the dl stays a flat list of
          dt/dd pairs. Below md everything falls into one column in order.
        */}
        <dl className="mt-[clamp(3rem,10vh,6rem)] grid grid-cols-1 border-t border-ivory/20 md:grid-cols-2">
          <div
            data-cta-fade
            className="border-b border-ivory/20 py-8 opacity-0 md:col-start-1 md:row-start-1 md:pr-10"
          >
            <dt className="label text-ivory/45">{t.ui.telephone}</dt>
            <dd className="mt-4">
              <a
                href={siteConfig.contact.phoneHref}
                className="group inline-flex items-baseline gap-4 font-serif text-[clamp(1.4rem,3vw,2.4rem)] font-light leading-none text-ivory"
              >
                <PhoneIcon size={24} className="mb-1 self-center text-ivory/70" />
                <span className="whitespace-nowrap border-b border-transparent pb-1 transition-colors duration-200 group-hover:border-ivory/60">
                  {siteConfig.contact.phone}
                </span>
                <span
                  aria-hidden
                  className="text-lg transition-transform duration-300 ease-expo group-hover:translate-x-1.5"
                >
                  &rarr;
                </span>
              </a>
            </dd>
          </div>

          <div
            data-cta-fade
            className="border-b border-ivory/20 py-8 opacity-0 md:col-start-1 md:row-start-2 md:border-b-0 md:pr-10"
          >
            <dt className="label text-ivory/45">{t.ui.whatsapp}</dt>
            <dd className="mt-4">
              <a
                href={siteConfig.contact.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-baseline gap-4 font-serif text-[clamp(1.4rem,3vw,2.4rem)] font-light leading-none text-ivory"
              >
                <Image
                  src="/images/whatsapp_Logo.png"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden
                  /* The mark is black line art — inverted to white for the burgundy panel. */
                  className="mb-1 self-center opacity-70 invert"
                />
                <span className="whitespace-nowrap border-b border-transparent pb-1 transition-colors duration-200 group-hover:border-ivory/60">
                  {siteConfig.contact.whatsapp}
                </span>
                <span
                  aria-hidden
                  className="text-lg transition-transform duration-300 ease-expo group-hover:translate-x-1.5"
                >
                  &rarr;
                </span>
              </a>
            </dd>
          </div>

          <div
            data-cta-fade
            className="py-8 opacity-0 md:col-start-2 md:row-start-1 md:row-span-2 md:flex md:flex-col md:justify-center md:border-l md:border-ivory/20 md:pl-10"
          >
            <dt className="label text-ivory/45">{t.ui.email}</dt>
            <dd className="mt-4">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="group inline-flex items-baseline gap-4 font-serif text-[clamp(1.1rem,2.4vw,1.8rem)] font-light leading-none text-ivory"
              >
                <MailIcon size={22} className="mb-1 self-center text-ivory/70" />
                <span className="border-b border-transparent pb-1 transition-colors duration-200 group-hover:border-ivory/60">
                  {siteConfig.contact.email}
                </span>
                <span
                  aria-hidden
                  className="text-lg transition-transform duration-300 ease-expo group-hover:translate-x-1.5"
                >
                  &rarr;
                </span>
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
