'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { useLocale } from '@/lib/locale';
import LocaleToggle from './LocaleToggle';
import { useSmoothScroll } from './SmoothScroll';
import { EASE, prefersReducedMotion, registerGsap } from '@/lib/animations';

export default function Navbar({ ready }: { ready: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const { lock, unlock, scrollTo } = useSmoothScroll();
  const { t } = useLocale();

  /* Solidify the bar once the hero starts leaving. */
  useEffect(() => {
    // Flip tone as the black hero leaves and the ivory page arrives.
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Reveal the bar after the loading curtain. */
  useEffect(() => {
    if (!ready || !bar.current) return;
    const gsap = registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1.2, ease: EASE.out, delay: 0.35 }
      );
    });
    return () => ctx.revert();
  }, [ready]);

  /* Mobile menu choreography + scroll lock. */
  useEffect(() => {
    const gsap = registerGsap();
    const el = menu.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (open) {
        lock();
        gsap
          .timeline({ defaults: { ease: EASE.expo } })
          .set(el, { pointerEvents: 'auto' })
          .fromTo(
            el,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: prefersReducedMotion() ? 0.01 : 0.9 }
          )
          .fromTo(
            '[data-menu-item]',
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.07 },
            '-=0.55'
          )
          .fromTo('[data-menu-foot]', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.4');
      } else {
        unlock();
        gsap.to(el, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: prefersReducedMotion() ? 0.01 : 0.7,
          ease: 'power4.inOut',
          onComplete: () => gsap.set(el, { pointerEvents: 'none' }),
        });
      }
    }, el);

    return () => ctx.revert();
  }, [open, lock, unlock]);

  /* Escape closes the menu. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = useCallback(
    (href: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      setOpen(false);
      // Let the menu begin closing before the page moves.
      window.setTimeout(() => scrollTo(href), open ? 220 : 0);
    },
    [scrollTo, open]
  );

  return (
    <>
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-[60] opacity-0 transition-[background-color,backdrop-filter,border-color,padding] duration-300 ease-expo ${
          scrolled
            ? 'border-b border-ink/10 bg-ivory/85 py-4 backdrop-blur-md'
            : 'border-b border-transparent py-7'
        }`}
      >
        <nav
          className="edge mx-auto flex max-w-edge items-center justify-between gap-6"
          aria-label="Primary"
        >
          {/* DEMO wordmark */}
          <a
            href="#hero"
            onClick={go('#hero')}
            data-cursor="button"
            className={`shrink-0 whitespace-nowrap font-sans text-[0.625rem] font-medium uppercase tracking-label transition-colors duration-200 sm:text-xs ${
              scrolled ? 'text-ink' : 'text-ivory'
            }`}
          >
            {siteConfig.brand.name}
          </a>

          <div className="hidden items-center gap-10 md:flex">
            <ul className="flex items-center gap-10">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={go(item.href)}
                    data-cursor="button"
                    className={`label relative transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-burgundy after:transition-all after:duration-200 after:ease-expo hover:after:w-full ${
                      scrolled ? 'text-ink/70 hover:text-ink' : 'text-champagne hover:text-ivory'
                    }`}
                  >
                    {t.nav[item.key]}
                  </a>
                </li>
              ))}
            </ul>

            {/* Language + currency */}
            <LocaleToggle tone={scrolled ? 'dark' : 'light'} />

            <a
              href="#contact"
              onClick={go('#contact')}
              data-cursor="button"
              className={`label px-6 py-3 transition-colors duration-200 ${
                scrolled
                  ? 'bg-burgundy text-ivory hover:bg-burgundy-soft'
                  : 'border border-ivory/30 text-ivory hover:border-burgundy hover:bg-burgundy'
              }`}
            >
              {t.cta.primary}
            </a>
          </div>

          {/* Mobile: the switches stay reachable without opening the menu. */}
          <div className="flex shrink-0 items-center gap-3 md:hidden">
            <LocaleToggle tone={scrolled && !open ? 'dark' : 'light'} />

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.ui.menuClose : t.ui.menuOpen}
              className="relative flex h-10 w-8 flex-col items-end justify-center gap-[6px]"
            >
              <span
                className={`block h-px transition-all duration-200 ease-expo ${
                  scrolled && !open ? 'bg-ink' : 'bg-ivory'
                } ${open ? 'w-6 translate-y-[3.5px] rotate-45' : 'w-6'}`}
              />
              <span
                className={`block h-px transition-all duration-200 ease-expo ${
                  scrolled && !open ? 'bg-ink' : 'bg-ivory'
                } ${open ? 'w-6 -translate-y-[3.5px] -rotate-45' : 'w-4'}`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={menu}
        className="grain fixed inset-0 z-[55] flex flex-col justify-between bg-ink px-[var(--edge)] pb-12 pt-32 md:hidden"
        style={{ clipPath: 'inset(0% 0% 100% 0%)', pointerEvents: 'none' }}
      >
        <ul className="flex flex-col gap-2">
          {siteConfig.nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <a
                data-menu-item
                href={item.href}
                onClick={go(item.href)}
                className="display flex items-baseline gap-5 py-3 text-[clamp(2.2rem,11vw,4.5rem)] text-ivory"
              >
                <span className="label text-burgundy/80">0{i + 1}</span>
                {t.nav[item.key]}
              </a>
            </li>
          ))}
        </ul>

        <div data-menu-foot className="opacity-0">
          <LocaleToggle variant="stacked" className="mb-8" />

          <div className="rule mb-6 text-ivory" />
          <a
            href="#contact"
            onClick={go('#contact')}
            className="label block bg-burgundy px-6 py-5 text-center text-ivory"
          >
            {t.cta.primary}
          </a>
          {/* DEMO contact details */}
          <div className="mt-8 flex items-center justify-between">
            <a href={siteConfig.contact.phoneHref} className="label text-champagne/70">
              {siteConfig.contact.phone}
            </a>
            <a
              href={siteConfig.contact.websiteHref}
              className="label text-champagne/70"
              target="_blank"
              rel="noreferrer"
            >
              {siteConfig.contact.website}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
