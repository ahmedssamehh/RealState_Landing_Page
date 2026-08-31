'use client';

/**
 * ---------------------------------------------------------------------------
 * BRAND MARK
 * ---------------------------------------------------------------------------
 * Circular icon (outer ring, inner disc, stylised wave) followed by a
 * two-line wordmark.
 *
 * Two variants:
 *   'mono'  — drawn in the site palette (ivory / burgundy / black).
 *             Used across the UI so the mark sits inside the existing brand
 *             system rather than fighting it.
 *   'brand' — the literal logo colours (green ring, dark grey disc, blue wave,
 *             charcoal type) for light backgrounds, print and the favicon.
 *
 * Swap any usage with <Logo variant="brand" /> to get the full-colour mark.
 * ---------------------------------------------------------------------------
 */

import { siteConfig } from '@/data/siteConfig';

/** DEMO — literal brand colours, kept out of the Tailwind palette on purpose. */
const BRAND = {
  ring: '#2E7D5B',
  disc: '#3A3A3A',
  wave: '#2F6FB0',
  text: '#22252A',
} as const;

type Props = {
  variant?: 'mono' | 'brand';
  /** Height of the circular icon in px; the wordmark scales with it. */
  size?: number;
  /** Hides the wordmark, leaving the icon alone (tight headers, favicons). */
  iconOnly?: boolean;
  className?: string;
};

export default function Logo({
  variant = 'mono',
  size = 34,
  iconOnly = false,
  className = '',
}: Props) {
  const mono = variant === 'mono';

  const ring = mono ? 'currentColor' : BRAND.ring;
  const disc = mono ? 'none' : BRAND.disc;
  const wave = mono ? 'currentColor' : BRAND.wave;

  return (
    <span
      className={`inline-flex items-center gap-3 ${className}`}
      style={mono ? undefined : { color: BRAND.text }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        {/* Outer ring */}
        <circle cx="24" cy="24" r="22" stroke={ring} strokeWidth={mono ? 1.25 : 3} fill="none" />
        {/* Inner disc */}
        <circle
          cx="24"
          cy="24"
          r="16"
          fill={disc}
          stroke={mono ? 'currentColor' : 'none'}
          strokeOpacity={mono ? 0.35 : 0}
          strokeWidth={mono ? 1 : 0}
        />
        {/* Wave */}
        <path
          d="M13 26.5c2.6 0 2.6-4 5.2-4s2.6 4 5.2 4 2.6-4 5.2-4 2.6 4 5.2 4"
          stroke={wave}
          strokeWidth={mono ? 1.6 : 2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {!iconOnly && (
        <span className="flex flex-col justify-center leading-none">
          {/* DEMO wordmark — replace via siteConfig.brand */}
          <span
            className="font-sans font-semibold uppercase tracking-[0.18em]"
            style={{ fontSize: size * 0.34 }}
          >
            {siteConfig.brand.nameLines[0]}
          </span>
          <span
            className="font-sans font-medium uppercase tracking-[0.3em] opacity-70"
            style={{ fontSize: size * 0.22, marginTop: size * 0.1 }}
          >
            {siteConfig.brand.nameLines[1]}
          </span>
        </span>
      )}
    </span>
  );
}
