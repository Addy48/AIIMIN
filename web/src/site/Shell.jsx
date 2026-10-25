import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './site.css';

const DOMAIN = 'https://aiimin.in';

/** The AIIMIN mark (logo-symbol.svg without its tile): pale arch, ink peak, the orange sun. `tone="dark"` matches AIIMIN_logo_dark.svg. */
const MARK_TONES = {
  light: ['#D1D5DB', 1, '#1A1916', '#6B7280'],
  dark: ['#6B7280', 0.65, '#EDE4D3', '#B9AF9E'],
};
export function Mark({ size = 30, title, tone = 'light' }) {
  const [arch, archOpacity, peak, far] = MARK_TONES[tone] || MARK_TONES.light;
  return (
    <svg width={size} height={size} viewBox="64 96 384 304" fill="none" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d="M80 384 C80 192 208 112 256 112 C304 112 432 192 432 384" stroke={arch} strokeOpacity={archOpacity} strokeWidth="24" strokeLinecap="round" />
      <path d="M144 384 L256 176 L368 384" stroke={peak} strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M192 368 L256 272 L320 368" stroke={far} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="s-mark-sun" cx="256" cy="240" r="28" fill="#FF6B35" />
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
  { to: '/brand', label: 'Meet Raahi' },
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
          {cta || <Link className="s-btn s-btn--sm" to="/waitlist#join">Get early access</Link>}
        </nav>
      </div>
    </header>
  );
}

const FOOT = [
  { h: 'AIIMIN', links: [['/waitlist', 'Get early access'], ['/app', 'Android app'], ['/brand', 'Meet Raahi'], ['/waitlist#plans', 'Plans'], ['/about', 'About']] },
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
          <span className="s-foot__note">App screens on this site show a sample profile, Meera. Your own app starts empty.</span>
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
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    const t = setTimeout(() => {
      const el = document.getElementById(hash.slice(1));
      if (!el) return;
      el.scrollIntoView({ behavior, block: 'start' });
      // "Get early access" links land on the form: put the cursor in the email field too.
      el.querySelector?.('input[type="email"]')?.focus({ preventScroll: true });
    }, 60);
    return () => clearTimeout(t);
  }, [pathname, hash, key]); // key: clicking the same #link twice still scrolls back to it
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

/**
 * The one device on the site: a Galaxy S25 Ultra with a real app screen. Screens come from the demo profile, never
 * a real person's data; the footer says so once for the whole site, so the phones carry no caption by default.
 */
export function Phone({ src, alt, caption = null, className = '', eager = false }) {
  return (
    <figure className={`s-device ${className}`}>
      <div className="s-phone">
        <div className="s-phone__screen">
          <img src={src} alt={alt} width="1440" height="2960" loading={eager ? 'eager' : 'lazy'} decoding={eager ? 'sync' : 'async'} fetchPriority={eager ? 'high' : undefined} />
        </div>
      </div>
      {caption && <figcaption className="s-device__cap">{caption}</figcaption>}
    </figure>
  );
}
