'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PhotoSection, ResidenceImage } from '@/data/apartments';
import type { Locale } from '@/data/siteConfig';
import { EASE, gsap, prefersReducedMotion, registerGsap } from '@/lib/animations';

type Props = {
  open: boolean;
  residenceName: string;
  sections: PhotoSection[];
  locale: Locale;
  onClose: () => void;
};

export default function PhotoTour({ open, residenceName, sections, locale, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const visibleSections = useMemo(
    () => sections.filter((section) => section.images.length > 0),
    [sections]
  );
  const allImages = useMemo(
    () => visibleSections.flatMap((section) => section.images),
    [visibleSections]
  );

  const closeLightbox = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!open) return;
    setActiveSection(visibleSections[0]?.id ?? '');
    setProgress(0);
    setSelected(null);
  }, [open, visibleSections]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (selected != null) closeLightbox();
        else onClose();
      }
      if (selected != null && event.key === 'ArrowRight') {
        setSelected((selected + 1) % allImages.length);
      }
      if (selected != null && event.key === 'ArrowLeft') {
        setSelected((selected - 1 + allImages.length) % allImages.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, selected, allImages.length, closeLightbox, onClose]);

  /* Native overlay scroll, isolated from the stopped page-level Lenis instance. */
  useEffect(() => {
    const scroller = root.current;
    if (!open || !scroller) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = scroller.scrollHeight - scroller.clientHeight;
        setProgress(max > 0 ? scroller.scrollTop / max : 0);

        const marker = scroller.clientHeight * 0.34;
        let current = visibleSections[0]?.id ?? '';
        visibleSections.forEach((section) => {
          const node = scroller.querySelector<HTMLElement>(`#photo-${section.id}`);
          if (node && node.offsetTop - scroller.scrollTop <= marker) current = section.id;
        });
        setActiveSection((previous) => (previous === current ? previous : current));
      });
    };
    scroller.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      scroller.removeEventListener('scroll', update);
      cancelAnimationFrame(frame);
    };
  }, [open, visibleSections]);

  /* Restrained entrance and section reveals. */
  useEffect(() => {
    const scroller = root.current;
    if (!open || !scroller || prefersReducedMotion()) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(scroller, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: EASE.out });
      gsap.fromTo('[data-tour-header]', { y: -18 }, { y: 0, duration: 0.65, ease: EASE.expo });
      gsap.fromTo(
        '[data-tour-intro]',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: EASE.expo, delay: 0.12 }
      );
      scroller.querySelectorAll<HTMLElement>('[data-photo-section]').forEach((section) => {
        gsap.fromTo(
          section.querySelectorAll('[data-section-reveal]'),
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: EASE.expo,
            scrollTrigger: { trigger: section, scroller, start: 'top 82%', once: true },
          }
        );
      });
    }, scroller);
    return () => ctx.revert();
  }, [open]);

  const jumpTo = (id: string) => {
    const scroller = root.current;
    const target = scroller?.querySelector<HTMLElement>(`#photo-${id}`);
    if (!scroller || !target) return;
    scroller.scrollTo({ top: target.offsetTop - 132, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const openImage = (image: ResidenceImage) => {
    const index = allImages.findIndex((item) => item.src === image.src);
    if (index >= 0) setSelected(index);
  };

  if (!open) return null;

  return (
    <div
      ref={root}
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
      role="dialog"
      aria-modal="true"
      aria-label={`${residenceName} ${locale === 'el' ? 'περιήγηση φωτογραφιών' : 'photo tour'}`}
      className="fixed inset-0 z-[110] h-svh touch-pan-y overflow-y-scroll overscroll-contain bg-ivory text-ink"
    >
      <div className="fixed left-0 top-0 z-[125] h-[2px] w-full bg-ink/10">
        <div className="h-full origin-left bg-burgundy" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <header data-tour-header className="sticky top-0 z-30 border-b border-ink/10 bg-ivory/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[78px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-10">
          <div className="min-w-0">
            <p className="label text-burgundy">{locale === 'el' ? 'ΠΕΡΙΗΓΗΣΗ ΦΩΤΟΓΡΑΦΙΩΝ' : 'PHOTO TOUR'}</p>
            <h2 className="mt-1 truncate font-serif text-lg font-light sm:text-2xl">{residenceName}</h2>
          </div>
          <div className="flex items-center gap-5">
            <p className="label hidden text-ink/45 sm:block">
              {String(allImages.length).padStart(2, '0')} {locale === 'el' ? 'ΦΩΤΟΓΡΑΦΙΕΣ' : 'PHOTOS'}
            </p>
            <button
              data-tour-close
              type="button"
              onClick={onClose}
              className="label flex min-h-11 items-center gap-3 border border-burgundy bg-burgundy px-4 text-ivory transition-colors hover:border-ink hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
            >
              <span aria-hidden className="text-lg">×</span>
              {locale === 'el' ? 'ΚΛΕΙΣΙΜΟ' : 'CLOSE'}
            </button>
          </div>
        </div>

        <nav aria-label={locale === 'el' ? 'Ενότητες φωτογραφιών' : 'Photo sections'} className="border-t border-ink/10">
          <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-5 [scrollbar-width:none] sm:px-10 [&::-webkit-scrollbar]:hidden">
            {visibleSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => jumpTo(section.id)}
                aria-current={activeSection === section.id ? 'true' : undefined}
                className={`label relative min-h-12 shrink-0 transition-colors ${activeSection === section.id ? 'text-burgundy' : 'text-ink/45 hover:text-ink'}`}
              >
                {section.i18n[locale].title}
                <span className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-burgundy transition-transform duration-300 ${activeSection === section.id ? 'scale-x-100' : 'scale-x-0'}`} />
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-28 pt-10 sm:px-10 sm:pt-14">
        <div className="mb-20 grid gap-8 border-b border-ink/15 pb-14 lg:grid-cols-[1fr_2fr] lg:items-end">
          <div data-tour-intro>
            <p className="label text-burgundy">{locale === 'el' ? 'ΕΞΕΡΕΥΝΗΣΤΕ ΤΟΝ ΧΩΡΟ' : 'EXPLORE THE RESIDENCE'}</p>
            <h3 className="mt-5 font-serif text-[clamp(2.8rem,6vw,5.8rem)] font-light leading-[0.9]">
              {locale === 'el' ? 'Κάθε χώρος.\nΚάθε λεπτομέρεια.' : 'Every room.\nEvery detail.'}
            </h3>
          </div>
          <div data-tour-intro className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {visibleSections.map((section) => (
              <button key={section.id} type="button" onClick={() => jumpTo(section.id)} className="group text-left">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink/10">
                  <Image src={section.images[0].src} alt="" fill sizes="(max-width: 640px) 50vw, 220px" className="object-contain transition-opacity duration-300 group-hover:opacity-90" />
                  <span className="absolute right-2 top-2 bg-ink/60 px-2 py-1 text-[9px] tracking-widest text-ivory backdrop-blur-sm">{String(section.images.length).padStart(2, '0')}</span>
                </div>
                <span className="label mt-3 block text-ink/65 group-hover:text-burgundy">{section.i18n[locale].title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-24 sm:space-y-36">
          {visibleSections.map((section, sectionIndex) => {
            const copy = section.i18n[locale];
            const [lead, ...rest] = section.images;
            const fourUp = section.images.length === 4;
            return (
              <section key={section.id} id={`photo-${section.id}`} data-photo-section className="scroll-mt-36 border-t border-ink/15 pt-8 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
                <div data-section-reveal className="mb-8 lg:sticky lg:top-36 lg:mb-0 lg:self-start">
                  <p className="label text-burgundy">{String(sectionIndex + 1).padStart(2, '0')}</p>
                  <h3 className="mt-5 font-serif text-3xl font-light sm:text-5xl">{copy.title}</h3>
                  <p className="label mt-4 text-ink/40">{String(section.images.length).padStart(2, '0')} {locale === 'el' ? 'ΦΩΤΟΓΡΑΦΙΕΣ' : 'PHOTOS'}</p>
                  <p className="mt-6 max-w-sm font-sans text-sm font-light leading-relaxed text-ink/55">{copy.details}</p>
                  <p className="label mt-7 text-burgundy/70">{locale === 'el' ? 'ΠΑΤΗΣΤΕ ΜΙΑ ΦΩΤΟΓΡΑΦΙΑ ΓΙΑ ΠΡΟΒΟΛΗ' : 'SELECT A PHOTO TO EXPLORE'}</p>
                </div>

                <div data-section-reveal className={`grid auto-rows-[280px] grid-cols-1 gap-2 sm:auto-rows-[380px] sm:grid-cols-2 lg:auto-rows-[430px] ${fourUp ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
                  <button type="button" onClick={() => openImage(lead)} aria-label={locale === 'el' ? 'Μεγέθυνση φωτογραφίας' : 'Enlarge photo'} className={`group relative overflow-hidden bg-ink/[0.055] text-left ${fourUp ? '' : 'sm:row-span-2 lg:col-span-2'}`}>
                    <Image src={lead.src} alt={lead.alt} fill sizes="(max-width: 640px) 100vw, 66vw" className="object-contain transition-opacity duration-300 group-hover:opacity-90" />
                    <span className="label absolute bottom-4 right-4 translate-y-2 bg-ink/65 px-3 py-2 text-ivory opacity-0 backdrop-blur-sm transition-all group-hover:translate-y-0 group-hover:opacity-100">{locale === 'el' ? 'ΠΡΟΒΟΛΗ' : 'VIEW'} ↗</span>
                  </button>
                  {rest.map((image, index) => (
                    <button key={`${image.src}-${index}`} type="button" onClick={() => openImage(image)} aria-label={locale === 'el' ? 'Μεγέθυνση φωτογραφίας' : 'Enlarge photo'} className="group relative overflow-hidden bg-ink/[0.055] text-left">
                      <Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, 34vw" className="object-contain transition-opacity duration-300 group-hover:opacity-90" loading="lazy" />
                      <span className="label absolute bottom-4 right-4 translate-y-2 bg-ink/65 px-3 py-2 text-ivory opacity-0 backdrop-blur-sm transition-all group-hover:translate-y-0 group-hover:opacity-100">{locale === 'el' ? 'ΠΡΟΒΟΛΗ' : 'VIEW'} ↗</span>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {selected != null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={locale === 'el' ? 'Μεγέθυνση φωτογραφίας' : 'Fullscreen photo'}
          onPointerDown={(event) => { swipeStart.current = event.clientX; }}
          onPointerUp={(event) => {
            if (swipeStart.current == null) return;
            const distance = event.clientX - swipeStart.current;
            swipeStart.current = null;
            if (Math.abs(distance) < 55) return;
            setSelected(distance < 0 ? (selected + 1) % allImages.length : (selected - 1 + allImages.length) % allImages.length);
          }}
          className="fixed inset-0 z-[140] flex touch-pan-y items-center justify-center bg-ink/95"
        >
          <div className="absolute inset-x-4 bottom-24 top-20 sm:inset-x-16 sm:bottom-28 sm:top-24">
            <Image src={allImages[selected].src} alt={allImages[selected].alt} fill sizes="100vw" className="select-none object-contain" priority draggable={false} />
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex items-center justify-between bg-gradient-to-b from-ink/70 to-transparent p-5 sm:p-8">
            <span className="label text-ivory">{String(selected + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}</span>
            <button type="button" onClick={closeLightbox} className="pointer-events-auto label min-h-11 border border-burgundy bg-burgundy px-4 text-ivory backdrop-blur-sm transition-colors hover:border-ivory hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy">× {locale === 'el' ? 'ΚΛΕΙΣΙΜΟ' : 'CLOSE'}</button>
          </div>
          <button type="button" onClick={() => setSelected((selected - 1 + allImages.length) % allImages.length)} aria-label={locale === 'el' ? 'Προηγούμενη φωτογραφία' : 'Previous photo'} className="absolute left-3 top-1/2 z-[2] flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-ivory/35 bg-ink/45 text-ivory backdrop-blur-sm hover:bg-burgundy sm:left-8">←</button>
          <button type="button" onClick={() => setSelected((selected + 1) % allImages.length)} aria-label={locale === 'el' ? 'Επόμενη φωτογραφία' : 'Next photo'} className="absolute right-3 top-1/2 z-[2] flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-ivory/35 bg-ink/45 text-ivory backdrop-blur-sm hover:bg-burgundy sm:right-8">→</button>
          <div className="absolute inset-x-0 bottom-0 z-[3] flex justify-center bg-gradient-to-t from-ink via-ink/90 to-transparent px-4 pb-4 pt-8">
            <div className="flex max-w-full gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {allImages.map((image, index) => (
                <button
                  key={`${image.src}-thumb`}
                  type="button"
                  onClick={() => setSelected(index)}
                  aria-label={`${locale === 'el' ? 'Φωτογραφία' : 'Photo'} ${index + 1}`}
                  aria-current={selected === index}
                  className={`relative h-14 w-20 shrink-0 border transition-all sm:h-16 sm:w-24 ${selected === index ? 'border-ivory opacity-100' : 'border-transparent opacity-45 hover:opacity-80'}`}
                >
                  <Image src={image.src} alt="" fill sizes="96px" className="object-contain" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
