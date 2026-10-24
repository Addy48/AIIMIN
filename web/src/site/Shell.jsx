import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './site.css';

const DOMAIN = 'https://aiimin.in';

/** The AIIMIN mark (logo-symbol.svg without its tile): pale arch, ink peak, the orange sun. */
export function Mark({ size = 30, title }) {
  return (
    <svg width={size} height={size} viewBox="64 96 384 304" fill="none" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d="M80 384 C80 192 208 112 256 112 C304 112 432 192 432 384" stroke="#D1D5DB" strokeWidth="24" strokeLinecap="round" />
      <path d="M144 384 L256 176 L368 384" stroke="#1A1916" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M192 368 L256 272 L320 368" stroke="#6B7280" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="256" cy="240" r="28" fill="#FF6B35" />
    </svg>
  );
}

export const raahi = (pose) => `/site/raahi/raahi_${pose}.webp`;

/** Page meta in one place, so no public page keeps the retired "Life OS" title. */
export function Meta({ title, description, path, image = '/og-image-v4.png' }) {
  const url = `${DOMAIN}${path}`;
  return (
    <Helmet>
      <html lang="en-IN" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="theme-color" content="#F5F3EE" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="AIIMIN" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${DOMAIN}${image}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="stylesheet" href="/site/fonts.css" />
      <link rel="preload" href="/site/fonts/funnel_display.woff2" as="font" type="font/woff2" crossOrigin="" />
      <link rel="preload" href="/site/fonts/golos_text.woff2" as="font" type="font/woff2" crossOrigin="" />
    </Helmet>
  );
}

const NAV = [
  { to: '/waitlist', label: 'Home' },
  { to: '/app', label: 'Android app' },
  { to: '/brand', label: 'Raahi & brand' },
  { to: '/waitlist#plans', label: 'Plans' },
];

function Header({ cta }) {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const here = pathname === '/' ? '/waitlist' : pathname;
  return (
    <header className="s-head" data-scrolled={scrolled}>
      <div className="s-wrap s-head__row">
        <Link to="/waitlist" className="s-brand" aria-label="AIIMIN home">
          <Mark />
          <span className="s-word">AIIMIN</span>
        </Link>
        <nav className="s-nav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} aria-current={here === n.to ? 'page' : undefined}>{n.label}</Link>
          ))}
          {cta || <Link className="s-btn s-btn--sm" to="/waitlist#join">Join the beta</Link>}
        </nav>
      </div>
    </header>
  );
}

const FOOT = [
  { h: 'AIIMIN', links: [['/waitlist', 'Join the beta'], ['/app', 'Android app'], ['/brand', 'Raahi & brand'], ['/waitlist#plans', 'Plans'], ['/about', 'About']] },
  { h: 'Your data', links: [['/privacy', 'Privacy policy'], ['/data-deletion', 'Delete your data'], ['/security', 'Security'], ['/ai-disclosure', 'How Raahi uses AI'], ['/cookies', 'Cookies']] },
  { h: 'Help', links: [['/contact', 'Contact'], ['/grievance', 'Grievance officer'], ['/terms', 'Terms of use'], ['/refunds', 'Refunds'], ['/legal', 'All legal pages']] },
];

function Footer() {
  return (
    <footer className="s-foot">
      <div className="s-wrap">
        <div className="s-foot__grid">
          <div>
            <Link to="/waitlist" className="s-brand" aria-label="AIIMIN home"><Mark size={26} /><span className="s-word">AIIMIN</span></Link>
            <p className="s-foot__line">Start small. Keep going.</p>
            <p style={{ marginTop: 8, maxWidth: '36ch' }}>An Android app for your day, your money and your family's papers. Made in India.</p>
          </div>
          {FOOT.map((col) => (
            <div key={col.h}>
              <h4>{col.h}</h4>
              <ul>{col.links.map(([to, l]) => <li key={to}><Link to={to}>{l}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="s-foot__base">
          <span>© {new Date().getFullYear()} AIIMIN · <a href="mailto:support@aiimin.in">support@aiimin.in</a></span>
          <span>No ads. No analytics in the app. Your data stays on your phone.</span>
        </div>
      </div>
    </footer>
  );
}

/** Fade-and-settle for blocks marked .s-rv. Content is visible without JS or with reduced motion. */
function useReveal(ref) {
  const { pathname } = useLocation();
  useEffect(() => {
    const root = ref.current;
    if (!root || !('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    root.classList.add('s-io');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.dataset.in = 'true'; io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    root.querySelectorAll('.s-rv').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref, pathname]);
}

/** Jump to #hash targets after route changes (React Router does not). */
function useHashScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    return () => clearTimeout(t);
  }, [pathname, hash]);
}

export default function Shell({ children, cta, bare = false }) {
  const ref = useRef(null);
  // The signed-in desk scrolls inside <body>; public pages scroll the window so the header and anchors behave.
  useEffect(() => {
    document.documentElement.classList.add('site-doc');
    return () => document.documentElement.classList.remove('site-doc');
  }, []);
  useReveal(ref);
  useHashScroll();
  return (
    <div className="site" ref={ref}>
      <a className="s-skip" href="#main">Skip to content</a>
      {!bare && <Header cta={cta} />}
      <main id="main">{children}</main>
      {!bare && <Footer />}
    </div>
  );
}

/** A phone with a real app screen. Screens come from the demo profile, never a real person's data. */
export function Phone({ src, alt, tag = 'Sample data', className = '', eager = false }) {
  return (
    <div className={`s-phone ${className}`}>
      <div className="s-phone__screen">
        <img src={src} alt={alt} width="1080" height="2340" loading={eager ? 'eager' : 'lazy'} decoding={eager ? 'sync' : 'async'} fetchPriority={eager ? 'high' : undefined} />
      </div>
      {tag && <span className="s-phone__tag">{tag}</span>}
    </div>
  );
}
