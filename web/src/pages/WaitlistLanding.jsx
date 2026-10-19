import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sparkle, Clock, CalendarCheck } from '@phosphor-icons/react';
import useWaitlistSurfaceTheme from '../hooks/useWaitlistSurfaceTheme';
import { API_URL } from '../utils/api';
import WaitlistErrorBoundary from '../components/waitlist/landing/WaitlistErrorBoundary';
import WaitlistHeroSection from '../components/waitlist/landing/WaitlistHeroSection';
import WaitlistPersonasSection from '../components/waitlist/landing/WaitlistPersonasSection';
import WaitlistPricingSection from '../components/waitlist/landing/WaitlistPricingSection';
import WaitlistLaunchJourney from '../components/waitlist/landing/WaitlistLaunchJourney';
import WaitlistAndroidSection from '../components/waitlist/landing/WaitlistAndroidSection';
import WaitlistPreviewScreensSection from '../components/waitlist/landing/WaitlistPreviewScreensSection';
import WaitlistAccessTiersSection from '../components/waitlist/landing/WaitlistAccessTiersSection';
import WaitlistTestimonialsSection from '../components/waitlist/landing/WaitlistTestimonialsSection';
import WaitlistFaqSection from '../components/waitlist/landing/WaitlistFaqSection';
import WaitlistSecondaryCta from '../components/waitlist/landing/WaitlistSecondaryCta';
import WaitlistFooter from '../components/waitlist/landing/WaitlistFooter';
import WaitlistAnnouncementBar from '../components/waitlist/landing/WaitlistAnnouncementBar';
import { PAGE_META } from '../components/waitlist/landing/waitlistLandingData';
import '../styles/waitlistLanding.css';
import { useAnyPopupOpen } from '../utils/popupQueue';

function WaitlistLandingContent() {
  const { isLight, toggleWaitlistTheme } = useWaitlistSurfaceTheme();
  const [count, setCount] = useState(null);
  const [stickyHidden, setStickyHidden] = useState(false);
  // Floating buttons step aside while a popup (e.g. the consent bar) is showing.
  const popupOpen = useAnyPopupOpen();
  const faqRef = useRef(null);
  const footerRef = useRef(null);

  const launchStructuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AIIMIN',
    description: "Your day, your money and your family's papers, in one calm place. AIIMIN reads your bank SMS on your phone, keeps your documents ready offline, and only ever compares you with you.",
    url: 'https://aiimin.in',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web, Android (companion — closed testing)',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '0',
      highPrice: '99',
      priceCurrency: 'INR',
      offerCount: '4',
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'People in India running a busy life or a household',
    },
    author: { '@type': 'Organization', name: 'AIIMIN', url: 'https://aiimin.in' },
  }), []);

  const fetchCount = async () => {
    try {
      const response = await fetch(`${API_URL}/waitlist/count`);
      if (!response.ok) throw new Error(`count failed (${response.status})`);
      const data = await response.json();
      // null means "unknown", not "zero" — the social-proof block hides itself
      // rather than claiming nobody has signed up.
      setCount(typeof data.count === 'number' ? data.count : null);
    } catch {
      setCount(null);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  useEffect(() => {
    const targets = [faqRef.current, footerRef.current].filter(Boolean);
    if (!targets.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const shouldHide = entries.some((entry) => entry.isIntersecting);
        setStickyHidden(shouldHide);
      },
      { threshold: 0.08 },
    );

    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="waitlist-page" id="top">
      <Helmet>
        <html lang="en" />
        <title>AIIMIN: your day, your money and your family's papers, in one calm place</title>
        <meta
          name="description"
          content="One calm app for your day, your money and your family&apos;s papers. Bank SMS become a clear month on your phone, never uploaded. Free for one person. Join the beta waitlist."
        />
        <link rel="canonical" href={PAGE_META.pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AIIMIN: one calm place for your day, your money and your papers" />
        <meta
          property="og:description"
          content="Bank SMS become a clear month on your phone, never uploaded. Tasks, focus, documents and an emergency card for your family. Free for one person; Plus ₹49, Pro ₹99, Family ₹179 a month."
        />
        <meta property="og:url" content={PAGE_META.pageUrl} />
        <meta property="og:image" content={PAGE_META.imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIIMIN: one calm place for your day, your money and your papers" />
        <meta
          name="twitter:description"
          content="Bank SMS become a clear month on your phone, never uploaded. Tasks, focus, documents and an emergency card for your family. Free for one person; Plus ₹49, Pro ₹99, Family ₹179 a month."
        />
        <meta name="twitter:image" content={PAGE_META.imageUrl} />
        <script type="application/ld+json">{JSON.stringify(launchStructuredData)}</script>
      </Helmet>

      <WaitlistAnnouncementBar />

      <WaitlistHeroSection
        count={count}
        onSignupSuccess={fetchCount}
        isLight={isLight}
        onToggleTheme={toggleWaitlistTheme}
      />

      {/* Feature marquee off until rebuilt with v4 features: it advertised v2 modules the app no longer has (master plan §1C). */}

      <main className="waitlist-main">
        <section className="waitlist-mobile-only waitlist-mobile-essentials">
          <ul className="waitlist-mobile-perk-list">
            <li><Clock size={14} weight="bold" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Tester cutoff: 31 October</li>
            <li><CalendarCheck size={14} weight="bold" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Go-live: end of November 2026</li>
          </ul>
        </section>

        <WaitlistPersonasSection />
        <WaitlistPricingSection />
        <WaitlistLaunchJourney />
        <WaitlistAndroidSection />
        <WaitlistPreviewScreensSection />
        <WaitlistAccessTiersSection />
        <WaitlistTestimonialsSection />
        <WaitlistFaqSection ref={faqRef} />
        <WaitlistSecondaryCta onSignupSuccess={fetchCount} />
      </main>

      <WaitlistFooter ref={footerRef} isLight={isLight} onToggleTheme={toggleWaitlistTheme} />

      <a
        href="#waitlist-join"
        className={`waitlist-mobile-cta waitlist-btn waitlist-btn-primary sticky-cta ${stickyHidden || popupOpen ? 'hidden' : ''}`}
      >
        <Sparkle size={15} weight="fill" />
        Reserve my spot
      </a>

    </div>
  );
}

export default function WaitlistLanding() {
  return (
    <WaitlistErrorBoundary>
      <WaitlistLandingContent />
    </WaitlistErrorBoundary>
  );
}
