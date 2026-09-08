import React from 'react';
import { Helmet } from 'react-helmet-async';

const DOMAIN = 'https://aiimin.in';
const DEFAULT_TITLE = 'AIIMIN — Personal Life OS for High Agency Living';
const DEFAULT_DESCRIPTION =
  'AIIMIN is a data-dense personal Life OS for ambitious builders, operators, and high performers. Track habits, money, focus, and mood in one unified screen.';
const DEFAULT_OG_IMAGE = 'https://aiimin.in/og-image-v2.png';

/**
 * Universal SEO & Social Metadata Component
 * Provides complete Title, Description, Canonical, OG, Twitter, and JSON-LD structured data.
 */
export default function SEO({
  title,
  description,
  canonicalPath = '',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noIndex = false,
  jsonLd,
}) {
  const fullTitle = title
    ? `${title} | AIIMIN — Personal Life OS`
    : DEFAULT_TITLE;

  const metaDescription = description || DEFAULT_DESCRIPTION;

  // Clean canonical path (always leading slash, no trailing slash unless root)
  const normalizedPath = canonicalPath
    ? (canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`)
    : '';
  const canonicalUrl = normalizedPath === '/' || normalizedPath === ''
    ? `${DOMAIN}/`
    : `${DOMAIN}${normalizedPath}`;

  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: fullTitle,
    description: metaDescription,
    url: canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: 'AIIMIN',
      url: DOMAIN,
    },
  };

  const schemaToRender = jsonLd || defaultStructuredData;

  return (
    <Helmet>
      {/* HTML Language Attribution */}
      <html lang="en" />

      {/* Document Title */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />

      {/* Robots Directives */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* OpenGraph Metadata */}
      <meta property="og:site_name" content="AIIMIN" />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content="AIIMIN Life OS Interface and Analytics" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card Metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@aiimin_os" />
      <meta name="twitter:creator" content="@aiimin_os" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="AIIMIN Life OS" />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(schemaToRender)}
      </script>
    </Helmet>
  );
}
