'use client';

/**
 * ---------------------------------------------------------------------------
 * BRAND MARK — GS Luxury Residence
 * ---------------------------------------------------------------------------
 * Renders the real brand-kit artwork (gold on transparent) rather than a
 * redrawn approximation. Four lockups, chosen with `mark`:
 *   'full'    — horizontal "GS · GS LUXURY RESIDENCE" lockup. Main nav / header.
 *   'icon'    — bare "GS" monogram. Tight spaces (mobile header, favicon-size).
 *   'stacked' — icon over the two-line wordmark. Footer / mobile menu.
 *   'emblem'  — icon centered over "LUXURY RESIDENCE". Standalone centered
 *               placements (chooser eyebrow, splash-style moments).
 *
 * `size` sets the rendered height in px; width follows the source aspect
 * ratio. Source files live in /public/images/logo and are already exported
 * at 3x for crisp rendering on high-DPI screens.
 * ---------------------------------------------------------------------------
 */

import Image from 'next/image';
import { siteConfig } from '@/data/siteConfig';

type Mark = 'full' | 'icon' | 'stacked' | 'emblem';

const SOURCES: Record<Mark, { src: string; width: number; height: number }> = {
  full: { src: '/images/logo/gs-lockup-serif.png', width: 1149, height: 186 },
  icon: { src: '/images/logo/gs-monogram.png', width: 546, height: 378 },
  stacked: { src: '/images/logo/gs-footer-mark.png', width: 543, height: 441 },
  emblem: { src: '/images/logo/gs-full-mark.png', width: 1005, height: 510 },
};

type Props = {
  mark?: Mark;
  /** Rendered height in px; width follows the source aspect ratio. */
  size?: number;
  className?: string;
};

export default function Logo({ mark = 'full', size = 34, className = '' }: Props) {
  const { src, width, height } = SOURCES[mark];

  return (
    <Image
      src={src}
      alt={siteConfig.brand.name}
      width={width}
      height={height}
      style={{ height: size, width: 'auto' }}
      className={`inline-block shrink-0 ${className}`}
    />
  );
}
