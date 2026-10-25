const PUBLIC_PATH_PREFIXES = [
  '/privacy', '/terms', '/contact', '/about', '/security', '/data-deletion', '/cookies',
  '/acceptable-use', '/refunds', '/ai-disclosure', '/grievance', '/subprocessors',
  '/legal', '/app', '/brand', '/proto', '/waitlist', '/empty',
];

export function isPublicSurfacePath(pathname) {
  return pathname === '/' || pathname === '/login'
    || PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function shouldShowWaitlistAccessFallback(pathname, accessLoading, isWaitlistMode) {
  return accessLoading && isWaitlistMode && !isPublicSurfacePath(pathname);
}
