/**
 * Cross-browser OAuth session helpers.
 * Avoids Supabase getSession() deadlocks during callback handling.
 */

const TOKEN_KEY = 'aiimin_session_fallback';
const DEBUG_ENDPOINT = 'http://127.0.0.1:7876/ingest/b474fe90-afd9-4287-984e-04e80c19b46c';
const DEBUG_SESSION = '40de69';

function debugLog(location, message, data = {}, hypothesisId = '') {
  // #region agent log
  fetch(DEBUG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': DEBUG_SESSION },
    body: JSON.stringify({
      sessionId: DEBUG_SESSION,
      location,
      message,
      data,
      hypothesisId,
      timestamp: Date.now(),
      runId: 'pkce-debug',
    }),
  }).catch(() => {});
  // #endregion
}

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
    debugLog('authSession.js:ensure', 'getSession ok', {}, 'H5');
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
      debugLog('authSession.js:ensure', 'hydrated from sb storage', {}, 'H5');
      return data.session;
    }
  }

  const { data: refreshed } = await supabase.auth.refreshSession();
  if (refreshed.session?.access_token) {
    persistAccessToken(refreshed.session.access_token);
    debugLog('authSession.js:ensure', 'refreshSession ok', {}, 'H5');
    return refreshed.session;
  }

  const cached = readAccessToken();
  if (cached) {
    persistAccessToken(cached);
    debugLog('authSession.js:ensure', 'fallback JWT only', { len: cached.length }, 'H5');
    return { access_token: cached };
  }

  debugLog('authSession.js:ensure', 'no session found', {}, 'H5');
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

    const finish = (session, source) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(deferredCheck);
      clearInterval(poll);
      subscription?.unsubscribe();
      if (session?.access_token) persistAccessToken(session.access_token);
      clearOAuthUrl();
      debugLog('authSession.js:finish', 'session resolved', { source, hasToken: Boolean(session?.access_token) }, 'H3');
      resolve(session);
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      subscription?.unsubscribe();
      clearInterval(poll);
      clearTimeout(deferredCheck);
      const cached = readAccessToken();
      debugLog('authSession.js:timeout', 'wait timed out', { hasCached: Boolean(cached) }, 'H1');
      if (cached) {
        resolve({ access_token: cached });
        return;
      }
      reject(new Error('OAuth session timed out'));
    }, timeoutMs);

    const poll = setInterval(() => {
      const cached = readAccessToken();
      if (cached) {
        debugLog('authSession.js:poll', 'token found via poll', {}, 'H3');
        finish({ access_token: cached }, 'poll');
      }
    }, 200);

    // detectSessionInUrl may finish before this listener mounts — deferred getSession is safe here
    const deferredCheck = setTimeout(async () => {
      if (settled) return;
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        debugLog('authSession.js:deferredGetSession', 'deferred getSession', {
          hasSession: Boolean(session?.access_token),
          err: error?.message || null,
        }, 'H3');
        if (session?.access_token) finish(session, 'deferred-getSession');
      } catch (err) {
        debugLog('authSession.js:deferredGetSession', 'deferred getSession threw', { err: err?.message }, 'H3');
      }
    }, 800);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      debugLog('authSession.js:onAuthStateChange', 'auth event', { event, hasSession: Boolean(session?.access_token) }, 'H3');
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.access_token) {
        finish(session, `event:${event}`);
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

  debugLog('authSession.js:resolveOAuthSession', 'entry', {
    hasCode: Boolean(code),
    hasHashTokens: Boolean(hashTokens?.access_token),
    path: typeof window !== 'undefined' ? window.location.pathname + window.location.search.slice(0, 20) : '',
  }, 'H1');

  // Already persisted by AuthContext detectSessionInUrl handler
  const existing = readAccessToken();
  if (existing) {
    debugLog('authSession.js:existing', 'cached token found immediately', {}, 'H3');
    clearOAuthUrl();
    const hydrated = await ensureSupabaseSession(supabase);
    return hydrated || { access_token: existing };
  }

  // PKCE (?code=): detectSessionInUrl auto-exchanges on client init — only wait for session event
  if (code) {
    debugLog('authSession.js:pkce', 'waiting for detectSessionInUrl (no manual exchange)', { codeLen: code.length }, 'H1');
    const waited = await waitForAuthSession(supabase, timeoutMs);
    return (await ensureSupabaseSession(supabase)) || waited;
  }

  // Implicit hash flow (#access_token=)
  if (hashTokens?.access_token && hashTokens.refresh_token) {
    debugLog('authSession.js:hash', 'setSession from hash', {}, 'H2');
    persistAccessToken(hashTokens.access_token);
    const { data, error } = await withTimeout(
      supabase.auth.setSession({
        access_token: hashTokens.access_token,
        refresh_token: hashTokens.refresh_token,
      }),
      timeoutMs,
      'setSession',
    );
    if (error) {
      debugLog('authSession.js:hashError', 'setSession failed', { err: error.message }, 'H2');
      throw error;
    }
    clearOAuthUrl();
    return data.session;
  }

  if (hashTokens?.access_token) {
    persistAccessToken(hashTokens.access_token);
    clearOAuthUrl();
    return { access_token: hashTokens.access_token };
  }

  debugLog('authSession.js:fallback', 'no code/hash — wait for event', {}, 'H3');
  return waitForAuthSession(supabase, timeoutMs);
}
