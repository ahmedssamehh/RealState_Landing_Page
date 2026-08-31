'use client';

/**
 * Hero shell. Owns the layout, the entrance choreography and the scroll
 * response; the 3D lives in HeroScene and the UI in HeroContent and
 * RotationControls.
 *
 * Desktop: type left, villa right, 360 controls under the villa.
 * Mobile: headline, villa, CTA, controls — stacked.
 */

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import HeroCta, { HeroLead } from './HeroContent';
import RotationControls from './RotationControls';
import type { HeroControls } from './HeroScene';
import { useIsMobile, useReducedMotion } from '@/lib/useMediaQuery';
import {
  DURATION,
  EASE,
  ScrollTrigger,
  prefersReducedMotion,
  registerGsap,
} from '@/lib/animations';

/** The 3D bundle never blocks first paint. */
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => <div className="h-full w-full" aria-hidden />,
});

export default function Hero({
  ready,
  onSceneReady,
}: {
  ready: boolean;
  onSceneReady?: () => void;
}) {
  const root = useRef<HTMLElement>(null);
  const sceneBox = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  /** Drives HeroScene's render loop — see the `active` prop there. */
  const [sceneVisible, setSceneVisible] = useState(true);
  /**
   * The loading screen waits for the scene's first frame, so the render loop
   * must be allowed to run at least once regardless of what the visibility
   * check thinks. Without this a bad early reading could suppress the first
   * frame, the ready signal would never fire, and the loader would sit there
   * until its safety timeout.
   */
  const [sceneRendered, setSceneRendered] = useState(false);

  /** The only channel between the UI and the 3D scene. */
  const controls = useRef<HeroControls>({
    autoRotate: true,
    angle: 0,
    dragging: false,
    scroll: 0,
    pointer: { x: 0, y: 0 },
  });

  /*
   * Stop drawing the villa once it leaves the screen.
   *
   * Deliberately a scroll/resize check rather than an IntersectionObserver:
   * the observer only fires on change, so a single bad initial reading (taken
   * while the loading screen still owns the viewport) latched the render loop
   * off with nothing to switch it back on. This re-evaluates from the live
   * geometry and can never get stuck.
   */
  useEffect(() => {
    const check = () => {
      const el = sceneBox.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const margin = 200;
      setSceneVisible(rect.bottom > -margin && rect.top < window.innerHeight + margin);
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  /* Pointer parallax — a plain listener, no library, no re-render. */
  useEffect(() => {
    if (isMobile || reduced) return;
    const onMove = (e: PointerEvent) => {
      controls.current.pointer = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [isMobile, reduced]);

  /* Scroll response: the scene drifts, the type lifts away. */
  useEffect(() => {
    const gsap = registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          controls.current.scroll = self.progress;
        },
      });

      if (!prefersReducedMotion()) {
        gsap.fromTo(
          '[data-hero-editorial]',
          { y: 0, opacity: 1 },
          {
            y: -70,
            opacity: 0,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: { trigger: el, start: 'top top', end: '70% top', scrub: true },
          }
        );
        /**
         * fromTo with an explicit start, not `to`. A plain `to` captures its
         * start value when the tween is built — which is the element's initial
         * `opacity-0` class — so scrubbing back up returned it to 0 and the
         * controls never reappeared.
         */
        gsap.fromTo(
          '[data-hero-controls]',
          { opacity: 1 },
          {
            opacity: 0,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: { trigger: el, start: '20% top', end: '60% top', scrub: true },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  /* Entrance, held until the loading curtain lifts. */
  useEffect(() => {
    if (!ready) return;
    const gsap = registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const targets =
        '[data-hero-line] > span, [data-hero-fade], [data-hero-scene], [data-hero-controls]';

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, yPercent: 0, y: 0, scale: 1 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: EASE.expo } })
        // typography first, then the building resolves behind it
        .fromTo(
          '[data-hero-line] > span',
          { yPercent: 112 },
          { yPercent: 0, duration: DURATION.slow, stagger: 0.07 }
        )
        .fromTo(
          '[data-hero-scene]',
          { opacity: 0 },
          { opacity: 1, duration: DURATION.cinematic },
          '-=0.55'
        )
        .fromTo(
          '[data-hero-fade]',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: DURATION.base, stagger: 0.05 },
          '-=0.7'
        )
        .fromTo(
          '[data-hero-controls]',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: DURATION.base },
          '-=0.35'
        )
        ;
    }, el);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={root}
      id="hero"
      aria-label="Introduction"
      className="grain relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-ivory"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Stage                                                            */}
      {/* ---------------------------------------------------------------- */}
      {/*
        Mobile stacks headline -> villa -> CTA with flex order, so the 3D never
        sits on top of the type. From lg the villa runs full height on the
        right and the editorial column sits down the left.
      */}
      <div className="relative flex flex-1 flex-col justify-center lg:block">
        <div
          data-hero-editorial
          className="edge pointer-events-none relative z-10 order-1 mx-auto w-full max-w-edge pt-[7.5rem] sm:pt-32 lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[6.5rem] lg:mx-auto lg:flex lg:flex-col lg:justify-center lg:pb-16 lg:pt-0"
        >
          <HeroLead />
          <div className="hidden lg:block">
            <HeroCta />
          </div>
        </div>

        {/* Villa */}
        <div
          ref={sceneBox}
          data-hero-scene
          className="relative order-2 h-[38svh] w-full shrink-0 overflow-hidden opacity-0 sm:h-[44svh] lg:absolute lg:bottom-[5.5rem] lg:left-[36%] lg:right-0 lg:top-[4.5rem] lg:order-none lg:h-auto lg:w-auto"
        >
          <HeroScene
            controls={controls}
            lowPower={isMobile || reduced}
            active={!sceneRendered || sceneVisible}
            onReady={() => {
              setSceneRendered(true);
              onSceneReady?.();
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-ivory to-transparent"
          />
        </div>

        {/* CTA below the villa on mobile only */}
        <div
          data-hero-editorial
          className="edge relative z-10 order-3 mx-auto w-full max-w-edge lg:hidden"
        >
          <HeroCta />
        </div>
      </div>
      {/* ---------------------------------------------------------------- */}
      {/* 360 controls                                                     */}
      {/* ---------------------------------------------------------------- */}
      <div className="edge relative z-10 mx-auto w-full max-w-edge pb-8 pt-4 lg:pb-10">
        <div className="lg:ml-[36%] lg:w-[calc(64%-2rem)]">
          <RotationControls controls={controls} />
        </div>
      </div>
    </section>
  );
}
