'use client';

/**
 * Minimal desktop cursor. Elements opt in with `data-cursor`:
 *   data-cursor="view"   -> expands and reads VIEW (imagery)
 *   data-cursor="button" -> slight expansion (links, buttons)
 * Disabled entirely on touch devices and under reduced motion.
 */

import { useEffect, useRef, useState } from 'react';
import { lerp } from '@/lib/animations';
import { useIsTouch, useReducedMotion } from '@/lib/useMediaQuery';

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'default' | 'view' | 'button'>('default');
  const [visible, setVisible] = useState(false);
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();
  const enabled = !isTouch && !reduced;

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-custom-cursor');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);

      const el = (e.target as HTMLElement | null)?.closest?.('[data-cursor]');
      const next = el?.getAttribute('data-cursor');
      setMode(next === 'view' ? 'view' : next === 'button' ? 'button' : 'default');
    };

    const onLeave = () => setVisible(false);

    const render = () => {
      pos.x = lerp(pos.x, target.x, 0.16);
      pos.y = lerp(pos.y, target.y, 0.16);
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    frame = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = mode === 'view' ? 92 : mode === 'button' ? 42 : 14;

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[95] flex items-center justify-center rounded-full border border-ivory/70 transition-[width,height,background-color,border-color] duration-200 ease-expo mix-blend-difference"
      style={{
        width: size,
        height: size,
        opacity: visible ? 1 : 0,
        backgroundColor: mode === 'default' ? 'rgba(238,235,221,0.9)' : 'transparent',
      }}
    >
      <span
        className="label text-ivory transition-opacity duration-300"
        style={{ opacity: mode === 'view' ? 1 : 0 }}
      >
        VIEW
      </span>
    </div>
  );
}
