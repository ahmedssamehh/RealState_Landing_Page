'use client';

/**
 * The 360° interaction strip beneath the villa: auto-rotate toggle, the
 * DRAG TO ROTATE hint, a progress line that tracks the actual rotation, and
 * the 360° mark.
 *
 * The progress line is driven straight from the scene's angle ref on a rAF
 * loop — it never triggers a React render.
 */

import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/lib/locale';
import type { HeroControls } from './HeroScene';

type Props = {
  controls: React.MutableRefObject<HeroControls>;
};

export default function RotationControls({ controls }: Props) {
  const { t } = useLocale();
  const [auto, setAuto] = useState(true);
  const bar = useRef<HTMLSpanElement>(null);

  /* Keep the visible line in step with the building's angle. */
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const progress = controls.current.angle / (Math.PI * 2);
      if (bar.current) bar.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [controls]);

  const toggle = () => {
    const next = !auto;
    setAuto(next);
    controls.current.autoRotate = next;
  };

  return (
    <div
      data-hero-controls
      className="pointer-events-none flex w-full items-center gap-6 opacity-0 sm:gap-10"
    >
      {/* Auto rotate */}
      <button
        type="button"
        onClick={toggle}
        aria-pressed={auto}
        aria-label={auto ? t.ui.pauseRotation : t.ui.playRotation}
        className="pointer-events-auto group flex shrink-0 items-center gap-3"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/25 transition-colors duration-200 group-hover:border-ink/60">
          {auto ? (
            <span className="flex gap-[3px]" aria-hidden>
              <span className="block h-3 w-[2px] bg-ink" />
              <span className="block h-3 w-[2px] bg-ink" />
            </span>
          ) : (
            <span
              aria-hidden
              className="ml-[2px] block h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-ink"
            />
          )}
        </span>
        <span className="label hidden text-ink/50 transition-colors duration-200 group-hover:text-ink sm:block">
          {t.ui.autoRotate}
        </span>
      </button>

      {/* Hint + progress */}
      <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
        <div className="text-center">
          <p className="label text-ink/55">{t.ui.dragToRotate}</p>
          <p className="label mt-1 text-ink/35">{t.ui.view360}</p>
        </div>
        <div className="h-px w-full max-w-md bg-ink/12">
          <span
            ref={bar}
            className="block h-px w-full origin-left bg-burgundy"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>

      {/* 360 mark */}
      <div className="shrink-0 text-center" aria-hidden>
        <p className="font-serif text-xl font-light leading-none text-ink">360&deg;</p>
        <svg width="42" height="12" viewBox="0 0 42 12" fill="none" className="mt-1">
          <path
            d="M3 4c6 6 30 6 36 0"
            stroke="currentColor"
            strokeWidth="1"
            className="text-ink/35"
            fill="none"
          />
          <path
            d="M36 1.5 39.5 4 36 6.5"
            stroke="currentColor"
            strokeWidth="1"
            className="text-ink/35"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
