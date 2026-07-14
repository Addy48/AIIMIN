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

/** Client-side exp check only — server still validates via getUser(). */
export function isAccessTokenExpired(token, skewSeconds = 60) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return false;
    return Date.now() / 1000 >= payload.exp - skewSeconds;
  } catch (_) {
    return true;
  }
}

/**
 * Return a verified access token for API calls.
 * Never returns a stale aiimin_session_fallback JWT without hydrating Supabase first.
 */
export async function requireFreshAccessToken(supabase) {
  const session = await ensureSupabaseSession(supabase);
  const token = session?.access_token;
  if (!token) {
    throw new Error('No session — please sign in again');
  }
  if (isAccessTokenExpired(token)) {
    const { data, error } = await supabase.auth.refreshSession();
    if (!error && data.session?.access_token) {
      persistAccessToken(data.session.access_token);
      return data.session.access_token;
    }
    clearAccessToken();
    throw new Error('Session expired — please sign in again');
  }
  persistAccessToken(token);
  return token;
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
  const clean = window.location.pathname;
  if (window.location.hash || window.location.search) {
    window.history.replaceState(null, '', clean);
  }
}

export function readSupabaseStoredSession() {
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key?.startsWith('sb-') || !key.endsWith('-auth-token')) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed?.access_token) return parsed;
    }
  } catch (_) { /* ignore */ }
  return null;
}

/**
 * Return a usable session — hydrate Supabase client from its storage or our fallback JWT.
 */
export async function ensureSupabaseSession(supabase) {
  let { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    persistAccessToken(session.access_token);
    return session;
  }

  const stored = readSupabaseStoredSession();
  if (stored?.access_token && stored?.refresh_token) {
    const { data, error } = await supabase.auth.setSession({
      access_token: stored.access_token,
      refresh_token: stored.refresh_token,
    });
    if (!error && data.session?.access_token) {
      persistAccessToken(data.session.access_token);
      return data.session;
    }
  }

  const { data: refreshed } = await supabase.auth.refreshSession();
  if (refreshed.session?.access_token) {
    persistAccessToken(refreshed.session.access_token);
    return refreshed.session;
  }

  const cached = readAccessToken();
  if (cached && !isAccessTokenExpired(cached)) {
    return { access_token: cached };
  }

  if (cached) {
    clearAccessToken();
  }

  return null;
}

export function withTimeout(promise, ms, label = 'Auth') {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    }),
  ]);
}

function waitForAuthSession(supabase, timeoutMs) {
  return new Promise((resolve, reject) => {
    let settled = false;

    const finish = (session) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(deferredCheck);
      clearInterval(poll);
      subscription?.unsubscribe();
      if (session?.access_token) persistAccessToken(session.access_token);
      clearOAuthUrl();
      resolve(session);
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      subscription?.unsubscribe();
      clearInterval(poll);
      clearTimeout(deferredCheck);
      const cached = readAccessToken();
      if (cached) {
        resolve({ access_token: cached });
        return;
      }
      reject(new Error('OAuth session timed out'));
    }, timeoutMs);

    const poll = setInterval(() => {
      const cached = readAccessToken();
      if (cached) finish({ access_token: cached });
    }, 200);

    const deferredCheck = setTimeout(async () => {
      if (settled) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) finish(session);
      } catch (_) { /* ignore */ }
    }, 800);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.access_token) {
        finish(session);
      }
    });
  });
}

/**
 * Establish a Supabase session from OAuth redirect.
 * PKCE (?code=): rely on detectSessionInUrl — never call exchangeCodeForSession (deadlocks with auto-detect).
 */
export async function resolveOAuthSession(supabase, { searchParams, timeoutMs = 15_000 } = {}) {
  const code = searchParams?.get('code')
    || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('code') : null);
  const hashTokens = parseOAuthHash();

  const existing = readAccessToken();
  if (existing) {
    clearOAuthUrl();
    const hydrated = await ensureSupabaseSession(supabase);
    return hydrated || { access_token: existing };
  }

  if (code) {
    const waited = await waitForAuthSession(supabase, timeoutMs);
    return (await ensureSupabaseSession(supabase)) || waited;
  }

  if (hashTokens?.access_token && hashTokens.refresh_token) {
    persistAccessToken(hashTokens.access_token);
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

  if (hashTokens?.access_token) {
    persistAccessToken(hashTokens.access_token);
    clearOAuthUrl();
    return { access_token: hashTokens.access_token };
  }

  return waitForAuthSession(supabase, timeoutMs);
}
