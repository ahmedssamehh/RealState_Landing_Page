'use client';

import { useCallback, useState } from 'react';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import IntroSection from '@/components/IntroSection';
import LifestyleSection from '@/components/LifestyleSection';
import LoadingScreen from '@/components/LoadingScreen';
import LocationSection from '@/components/LocationSection';
import Navbar from '@/components/Navbar';
import ResidenceDetails from '@/components/ResidenceDetails';
import ResidencesSection from '@/components/ResidencesSection';
import SmoothScroll from '@/components/SmoothScroll';
import { LocaleProvider } from '@/lib/locale';
import type { Apartment } from '@/data/apartments';

/**
 * One-page experience:
 * loading -> hero -> introduction -> four residences -> interlude ->
 * architecture -> location -> final call -> enquiry -> footer.
 */
function Page() {
  const [ready, setReady] = useState(false);
  /** HeroScene reports its first painted frame; the loader waits for it. */
  const [sceneReady, setSceneReady] = useState(false);
  const [detail, setDetail] = useState<Apartment | null>(null);

  const openResidence = useCallback((residence: Apartment) => {
    setDetail(residence);
  }, []);

  const closeResidence = useCallback(() => setDetail(null), []);

  return (
    <>
      <LoadingScreen onComplete={() => setReady(true)} sceneReady={sceneReady} />

      {/*
        Everything except the popup lives in this shell. When a residence is
        open the shell is blurred and pushed back, so the popup reads as a
        layer above the page rather than a new screen.
      */}
      <div
        data-page-shell
        aria-hidden={detail ? true : undefined}
        className={`transition-[filter,transform,opacity] duration-300 ease-expo ${
          detail ? 'pointer-events-none scale-[0.995] blur-[6px]' : ''
        }`}
      >
        <Navbar ready={ready} />

        <main id="main">
          <Hero ready={ready} onSceneReady={() => setSceneReady(true)} />
          <IntroSection />
          <ResidencesSection onOpenResidence={openResidence} />
          <LifestyleSection />
          <LocationSection />
          <FinalCTA />
        </main>

        <Footer />
      </div>

      <ResidenceDetails residence={detail} onClose={closeResidence} />
    </>
  );
}

export default function Home() {
  return (
    <LocaleProvider>
      <SmoothScroll>
        <Page />
      </SmoothScroll>
    </LocaleProvider>
  );
}
