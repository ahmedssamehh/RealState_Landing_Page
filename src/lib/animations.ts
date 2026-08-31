'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

/** Registers GSAP plugins exactly once, on the client. */
export function registerGsap() {
  if (typeof window === 'undefined' || registered) return gsap;
  gsap.registerPlugin(ScrollTrigger);
  // Mobile browsers resize the viewport when the URL bar shows/hides; without
  // this every one of those triggers a full ScrollTrigger recalculation.
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
  return gsap;
}

export { gsap, ScrollTrigger };

export const EASE = {
  out: 'power3.out',
  inOut: 'power3.inOut',
  expo: 'expo.out',
  strong: 'power4.out',
} as const;

/**
 * Timings are deliberately short: the design still reads as considered, but
 * nothing makes the visitor wait. Raise these if the motion ever feels rushed.
 */
export const DURATION = {
  fast: 0.3,
  base: 0.5,
  slow: 0.7,
  cinematic: 0.9,
} as const;

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Line-by-line mask reveal for elements marked `.reveal-line > span`.
 * Returns nothing — the caller owns the gsap.context lifecycle.
 */
export function revealLines(
  scope: HTMLElement,
  selector = '.reveal-line > span',
  options: { trigger?: Element; stagger?: number; delay?: number; start?: string } = {}
) {
  const targets = scope.querySelectorAll<HTMLElement>(selector);
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    gsap.set(targets, { yPercent: 0, opacity: 1 });
    return;
  }

  gsap.fromTo(
    targets,
    { yPercent: 105, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: DURATION.slow,
      ease: EASE.expo,
      stagger: options.stagger ?? 0.05,
      delay: options.delay ?? 0,
      scrollTrigger: {
        trigger: options.trigger ?? scope,
        start: options.start ?? 'top 78%',
      },
    }
  );
}

/** Soft fade + rise for supporting content. */
export function revealFade(
  targets: gsap.TweenTarget,
  options: { trigger?: Element; stagger?: number; y?: number; start?: string } = {}
) {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return;
  }
  gsap.fromTo(
    targets,
    { opacity: 0, y: options.y ?? 18 },
    {
      opacity: 1,
      y: 0,
      duration: DURATION.base,
      ease: EASE.out,
      stagger: options.stagger ?? 0.05,
      scrollTrigger: options.trigger
        ? { trigger: options.trigger, start: options.start ?? 'top 82%' }
        : undefined,
    }
  );
}

/** Slow vertical parallax on an image wrapper. */
export function parallax(target: HTMLElement, trigger: HTMLElement, amount = 12) {
  if (prefersReducedMotion()) return;
  gsap.fromTo(
    target,
    { yPercent: -amount / 2 },
    {
      yPercent: amount / 2,
      ease: 'none',
      scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true },
    }
  );
}

/**
 * Clip-path curtain reveal for large imagery.
 *
 * Deliberately no scale: these targets are full-bleed, and scaling one past
 * 1 pushes it wider than the viewport, which creates horizontal page scroll
 * for the duration of the reveal. The curtain alone reads better anyway.
 */
export function revealImage(target: HTMLElement, trigger?: HTMLElement) {
  if (prefersReducedMotion()) {
    gsap.set(target, { clipPath: 'inset(0% 0% 0% 0%)' });
    return;
  }
  gsap.fromTo(
    target,
    { clipPath: 'inset(0% 0% 100% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: DURATION.cinematic,
      ease: EASE.expo,
      scrollTrigger: { trigger: trigger ?? target, start: 'top 85%' },
    }
  );
}

/** Linear interpolation used by cursor / 3D smoothing. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
