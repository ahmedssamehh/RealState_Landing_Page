'use client';

/**
 * ---------------------------------------------------------------------------
 * HERO VISUAL - the single switch between the 3D scene and a cinematic video.
 * ---------------------------------------------------------------------------
 * Controlled from `siteConfig.hero`:
 *   mode: 'scene'  -> interactive React Three Fiber architecture (default)
 *   mode: 'video'  -> background film; add sources to siteConfig.hero.video
 *                     (WebM is preferred, MP4 is the fallback, poster shows
 *                     until the first frame is decoded).
 *
 * The 3D bundle is dynamically imported so it never ships to visitors who see
 * the video, and never blocks first paint for those who see the scene.
 * ---------------------------------------------------------------------------
 */

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { useIsMobile, useReducedMotion } from '@/lib/useMediaQuery';

const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-ink" aria-hidden />,
});

type Props = {
  /** Live 0-1 hero scroll progress, shared with the 3D rig. */
  scrollRef: React.MutableRefObject<number>;
  /** Optional .glb/.gltf override forwarded to HeroScene. */
  modelUrl?: string;
};

function HeroVideo() {
  const { webm, mp4, poster } = siteConfig.hero.video;
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Autoplay can be rejected on some mobile browsers; the poster then stands in.
    ref.current?.play().catch(() => {});
  }, []);

  if (!webm && !mp4) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-ink">
        <p className="label text-champagne/40">HERO FILM NOT YET SUPPLIED</p>
      </div>
    );
  }

  return (
    <video
      ref={ref}
      className="h-full w-full object-cover"
      poster={poster || undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    >
      {webm ? <source src={webm} type="video/webm" /> : null}
      {mp4 ? <source src={mp4} type="video/mp4" /> : null}
    </video>
  );
}

export default function HeroVisual({ scrollRef, modelUrl }: Props) {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  return (
    <div className="absolute inset-0" aria-hidden>
      {siteConfig.hero.mode === 'video' ? (
        <HeroVideo />
      ) : (
        <HeroScene scrollRef={scrollRef} modelUrl={modelUrl} lowPower={isMobile || reduced} />
      )}
    </div>
  );
}
