import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sparkles } from 'lucide-react';
import useWaitlistSurfaceTheme from '../hooks/useWaitlistSurfaceTheme';
import { API_URL } from '../utils/api';
import WaitlistThemeToggle from '../components/waitlist/landing/WaitlistThemeToggle';
import WaitlistErrorBoundary from '../components/waitlist/landing/WaitlistErrorBoundary';
import WaitlistHeroSection from '../components/waitlist/landing/WaitlistHeroSection';
import WaitlistPersonasSection from '../components/waitlist/landing/WaitlistPersonasSection';
import WaitlistPricingSection from '../components/waitlist/landing/WaitlistPricingSection';
import WaitlistLaunchJourney from '../components/waitlist/landing/WaitlistLaunchJourney';
import WaitlistPreviewScreensSection from '../components/waitlist/landing/WaitlistPreviewScreensSection';
import WaitlistAccessTiersSection from '../components/waitlist/landing/WaitlistAccessTiersSection';
import WaitlistTestimonialsSection from '../components/waitlist/landing/WaitlistTestimonialsSection';
import WaitlistFaqSection from '../components/waitlist/landing/WaitlistFaqSection';
import WaitlistSecondaryCta from '../components/waitlist/landing/WaitlistSecondaryCta';
import WaitlistFooter from '../components/waitlist/landing/WaitlistFooter';
import { PAGE_META } from '../components/waitlist/landing/waitlistLandingData';
import '../styles/waitlistLanding.css';

function WaitlistLandingContent() {
  const { isLight, toggleWaitlistTheme } = useWaitlistSurfaceTheme();
  const [count, setCount] = useState(null);
  const [stickyHidden, setStickyHidden] = useState(false);
  const faqRef = useRef(null);
  const footerRef = useRef(null);

  const launchStructuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AIIMIN',
    description: 'A data-dense personal Life OS for daily accountability, behavioral insights, money tracking, and habit building. Built for Indian students and early professionals.',
    url: 'https://aiimin.in',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Desktop Web',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '0',
      highPrice: '99',
      priceCurrency: 'INR',
      offerCount: '4',
    },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      geographicArea: { '@type': 'Country', name: 'India' },
    },
    author: { '@type': 'Organization', name: 'AIIMIN', url: 'https://aiimin.in' },
  }), []);

  const fetchCount = async () => {
    try {
      const response = await fetch(`${API_URL}/waitlist/count`);
      const data = await response.json();
      setCount(typeof data.count === 'number' ? data.count : 0);
    } catch {
      setCount(0);
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
      <WaitlistThemeToggle
        isLight={isLight}
        onToggle={toggleWaitlistTheme}
        className="waitlist-theme-icon-btn--mobile-fixed waitlist-mobile-only"
      />

      <Helmet>
        <title>AIIMIN — Personal Life OS | Join the Waitlist</title>
        <meta
          name="description"
          content="AIIMIN is a data-dense personal Life OS for Indian students and young professionals. Track habits, money, focus, and mood in one screen. Join the waitlist — launching September 2026."
        />
        <link rel="canonical" href={PAGE_META.pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AIIMIN — Life OS from ₹0, Pro founding ₹49/mo" />
        <meta
          property="og:description"
          content="Track habits, money, focus, and mood in one Life OS. Explore free, Core ₹29/mo, Pro ₹49 founding price, Elite ₹79 for waitlist. Built for Indian students."
        />
        <meta property="og:url" content={PAGE_META.pageUrl} />
        <meta property="og:image" content={PAGE_META.imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIIMIN — Life OS from ₹0, Pro founding ₹49/mo" />
        <meta
          name="twitter:description"
          content="Track habits, money, focus, and mood in one Life OS. Explore free, Core ₹29/mo, Pro ₹49 founding price, Elite ₹79 for waitlist. Built for Indian students."
        />
        <meta name="twitter:image" content={PAGE_META.imageUrl} />
        <script type="application/ld+json">{JSON.stringify(launchStructuredData)}</script>
      </Helmet>

      <WaitlistHeroSection
        count={count}
        onSignupSuccess={fetchCount}
        isLight={isLight}
        onToggleTheme={toggleWaitlistTheme}
      />

      <main className="waitlist-main">
        <section className="waitlist-mobile-only waitlist-mobile-essentials">
          <ul className="waitlist-mobile-perk-list">
            <li>⏰ Tester cutoff: 31 July</li>
            <li>📅 Go-live: end of September 2026</li>
          </ul>
        </section>

        <WaitlistPersonasSection />
        <WaitlistPricingSection />
        <WaitlistLaunchJourney />
        <WaitlistPreviewScreensSection />
        <WaitlistAccessTiersSection />
        <WaitlistTestimonialsSection />
        <WaitlistFaqSection ref={faqRef} />
        <WaitlistSecondaryCta onSignupSuccess={fetchCount} />
      </main>

      <WaitlistFooter ref={footerRef} />

      <a
        href="#waitlist-join"
        className={`waitlist-mobile-cta waitlist-btn waitlist-btn-primary sticky-cta ${stickyHidden ? 'hidden' : ''}`}
      >
        <Sparkles size={15} />
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
