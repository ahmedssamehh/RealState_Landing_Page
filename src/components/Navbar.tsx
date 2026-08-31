'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/data/siteConfig';
import Logo from './Logo';
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
    // The page is ivory from the hero down, so the bar only gains a surface
    // and blur once content starts passing beneath it.
    const onScroll = () => setScrolled(window.scrollY > 24);
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
            ? 'border-b border-ink/10 bg-ivory/90 py-4 backdrop-blur-md'
            : 'border-b border-transparent py-6'
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
            aria-label={siteConfig.brand.name}
            className="shrink-0 text-ink"
          >
            <Logo size={30} className="hidden sm:inline-flex" />
            <Logo size={28} iconOnly className="sm:hidden" />
          </a>

          <div className="hidden items-center gap-8 lg:flex xl:gap-10">
            <ul className="flex items-center gap-7 xl:gap-10">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={go(item.href)}
                    className="label relative text-ink/65 transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-burgundy after:transition-all after:duration-200 after:ease-expo hover:text-ink hover:after:w-full"
                  >
                    {t.nav[item.key]}
                  </a>
                </li>
              ))}
            </ul>

            {/* Language + currency */}
            <LocaleToggle tone="dark" />
          </div>

          {/* Mobile: the switches stay reachable without opening the menu. */}
          <div className="flex shrink-0 items-center gap-3 lg:hidden">
            <LocaleToggle tone={open ? 'light' : 'dark'} />

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
                  open ? 'bg-ivory' : 'bg-ink'
                } ${open ? 'w-6 translate-y-[3.5px] rotate-45' : 'w-6'}`}
              />
              <span
                className={`block h-px transition-all duration-200 ease-expo ${
                  open ? 'bg-ivory' : 'bg-ink'
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
        className="grain fixed inset-0 z-[55] flex flex-col justify-between bg-ink px-[var(--edge)] pb-12 pt-32 lg:hidden"
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
          {/* DEMO contact details — phone and email are the only channels */}
          <div className="flex flex-col gap-4">
            <a href={siteConfig.contact.phoneHref} className="label text-ivory/70">
              {siteConfig.contact.phone}
            </a>
            <a href={`mailto:${siteConfig.contact.email}`} className="label text-ivory/70">
              {siteConfig.contact.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
