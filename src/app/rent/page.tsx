'use client';

import { useCallback, useEffect, useState } from 'react';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import IntroSection from '@/components/IntroSection';
import LifestyleSection from '@/components/LifestyleSection';
import Navbar from '@/components/Navbar';
import ResidenceDetails from '@/components/ResidenceDetails';
import ResidencesSection from '@/components/ResidencesSection';
import SmoothScroll from '@/components/SmoothScroll';
import type { Apartment } from '@/data/apartments';

/**
 * The rental collection. One-page experience:
 * hero -> introduction -> residences -> architecture -> location -> contact.
 *
 * Reached from the chooser at `/`. Locale and currency come from the provider
 * in the root layout, so a choice made on the chooser carries through.
 */
function Page() {
  /* Entrance animations run as soon as the page mounts. */
  const [ready, setReady] = useState(false);

  const [detail, setDetail] = useState<Apartment | null>(null);
  const [detailView, setDetailView] = useState<'details' | 'photos'>('details');

  useEffect(() => {
    setReady(true);
  }, []);

  const openResidence = useCallback((residence: Apartment) => {
    setDetailView('details');
    setDetail(residence);
  }, []);

  const openPhotos = useCallback((residence: Apartment) => {
    setDetailView('photos');
    setDetail(residence);
  }, []);

  const closeResidence = useCallback(() => setDetail(null), []);

  return (
    <>
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
          <Hero ready={ready} />
          <IntroSection />
          <ResidencesSection onOpenResidence={openResidence} onOpenPhotos={openPhotos} />
          <LifestyleSection />
          <FinalCTA />
        </main>

        <Footer />
      </div>

      <ResidenceDetails residence={detail} initialView={detailView} onClose={closeResidence} />
    </>
  );
}

export default function RentPage() {
  return (
    <SmoothScroll>
      <Page />
    </SmoothScroll>
  );
}
