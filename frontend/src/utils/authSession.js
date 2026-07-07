/**
 * Cross-browser OAuth session helpers.
 * Avoids Supabase getSession() deadlocks during callback handling.
 */

const TOKEN_KEY = 'aiimin_session_fallback';

export function isOAuthCallbackRoute() {
  return typeof window !== 'undefined' && window.location.pathname === '/auth/callback';
}

export function persistAccessToken(token) {
  if (!token) return;
  try { localStorage.setItem(TOKEN_KEY, token); } catch (_) { /* Safari private mode */ }
  try { sessionStorage.setItem(TOKEN_KEY, token); } catch (_) {}
}

export function readAccessToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || '';
  } catch (_) {
    return '';
  }
}

export function clearAccessToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch (_) {}
  try { sessionStorage.removeItem(TOKEN_KEY); } catch (_) {}
}

export function parseOAuthHash() {
  if (typeof window === 'undefined' || !window.location.hash) return null;
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const access_token = params.get('access_token');
  const refresh_token = params.get('refresh_token');
  if (!access_token) return null;
  return { access_token, refresh_token: refresh_token || '' };
}

export function clearOAuthUrl() {
  if (typeof window === 'undefined') return;
  const clean = window.location.pathname + window.location.search;
  if (window.location.hash || window.location.search.includes('code=')) {
    window.history.replaceState(null, '', clean);
  }
}

export function withTimeout(promise, ms, label = 'Auth') {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    }),
  ]);
}

/**
 * Establish a Supabase session from OAuth redirect (hash, PKCE code, or listener).
 * Never calls getSession() — that deadlocks with onAuthStateChange on some browsers.
 */
export async function resolveOAuthSession(supabase, { searchParams, timeoutMs = 15_000 } = {}) {
  const code = searchParams?.get('code')
    || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('code') : null);

  const hashTokens = parseOAuthHash();

  // PKCE flow (?code=) — default for Supabase JS v2 in modern browsers
  if (code) {
    const { data, error } = await withTimeout(
      supabase.auth.exchangeCodeForSession(code),
      timeoutMs,
      'PKCE exchange',
    );
    if (error) throw error;
    if (data?.session?.access_token) persistAccessToken(data.session.access_token);
    clearOAuthUrl();
    return data.session;
  }

  // Implicit / hash flow (#access_token=) — still used by some Supabase configs
  if (hashTokens?.access_token) {
    persistAccessToken(hashTokens.access_token);
    if (hashTokens.refresh_token) {
      const { data, error } = await withTimeout(
        supabase.auth.setSession({
          access_token: hashTokens.access_token,
          refresh_token: hashTokens.refresh_token,
        }),
        timeoutMs,
        'setSession',
      );
      if (error) throw error;
      clearOAuthUrl();
      return data.session;
    }
    clearOAuthUrl();
    return { access_token: hashTokens.access_token };
  }

  // Supabase may have already parsed the URL — wait for SIGNED_IN (all browsers)
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      subscription?.unsubscribe();
      const cached = readAccessToken();
      if (cached) {
        resolve({ access_token: cached });
        return;
      }
      reject(new Error('OAuth session timed out'));
    }, timeoutMs);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (settled) return;
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.access_token) {
        settled = true;
        clearTimeout(timer);
        subscription.unsubscribe();
        persistAccessToken(session.access_token);
        clearOAuthUrl();
        resolve(session);
      }
    });
  });
}
