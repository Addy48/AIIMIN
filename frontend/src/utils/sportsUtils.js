/** Prioritize matches involving user's favorite teams / sports. */
export function prioritizeMatches(events, profile = {}) {
  const teamNames = [];
  const teamsObj = profile.favorite_teams || {};
  Object.values(teamsObj).forEach((val) => {
    if (Array.isArray(val)) teamNames.push(...val);
    else if (typeof val === 'string' && val.trim()) teamNames.push(val);
  });
  const favorites = teamNames.map((t) => t.toLowerCase().trim()).filter(Boolean);
  const sports = (profile.favorite_sports || []).map((s) => s.toLowerCase());

  const score = (match) => {
    let s = 0;
    const blob = `${match.home?.name || ''} ${match.away?.name || ''} ${match.name || ''} ${match.league || ''}`.toLowerCase();
    if (match.isLive) s += 100;
    favorites.forEach((f) => { if (blob.includes(f)) s += 50; });
    sports.forEach((sp) => { if (blob.includes(sp)) s += 10; });
    return s;
  };

  return [...events].sort((a, b) => score(b) - score(a));
}

const normalizeFavoriteSports = (profile = {}) => (
  (profile.favorite_sports || []).map((sport) => String(sport || '').toLowerCase().trim()).filter(Boolean)
);

const matchBelongsToFavoriteSport = (match, leagueItem, favoriteSports) => {
  if (!favoriteSports.length) return false;
  const sportBlob = [
    match.sport,
    leagueItem?.sport,
    match.league,
    leagueItem?.league?.name,
  ].filter(Boolean).join(' ').toLowerCase();
  return favoriteSports.some((sport) => sportBlob.includes(sport));
};

export function filterMyFeed(leagues, profile) {
  const teamNames = [];
  const teamsObj = profile.favorite_teams || {};
  Object.values(teamsObj).forEach((val) => {
    if (Array.isArray(val)) teamNames.push(...val);
    else if (typeof val === 'string' && val.trim()) teamNames.push(val);
  });
  const favorites = teamNames.map((t) => t.toLowerCase().trim()).filter(Boolean);
  const favoriteSports = normalizeFavoriteSports(profile);
  const hasPrefs = favorites.length > 0 || favoriteSports.length > 0;

  if (!hasPrefs) return { leagues: [], hasPrefs: false };

  const out = [];
  (leagues || []).forEach((leagueItem) => {
    const events = (leagueItem.events || []).filter((match) => {
      const blob = `${match.home?.name || ''} ${match.away?.name || ''} ${match.name || ''}`.toLowerCase();
      const teamMatch = favorites.some((f) => blob.includes(f));
      const sportMatch = matchBelongsToFavoriteSport(match, leagueItem, favoriteSports);
      return teamMatch || sportMatch;
    });
    if (events.length) out.push({ ...leagueItem, events: prioritizeMatches(events, profile) });
  });
  return { leagues: out, hasPrefs: true };
}

export function flattenLeagues(leagues) {
  const all = [];
  (leagues || []).forEach((l) => {
    (l.events || []).forEach((e) => all.push({ ...e, league: e.league || l.league?.name, sport: l.sport }));
  });
  return all;
}

/** Deterministic preview from ESPN match fields — no AI hallucination. */
export function buildSportsPreviewFallback(match, sport = 'Sports') {
  const home = match.home?.name || 'TBD';
  const away = match.away?.name || 'TBD';
  const league = match.league || sport;
  const venue = match.venue ? ` at ${match.venue}` : '';

  if (match.isFinished) {
    const hScore = match.home?.score ?? '–';
    const aScore = match.away?.score ?? '–';
    const detail = match.statusDetail && match.statusDetail !== 'Final' ? ` (${match.statusDetail})` : '';
    return `${home} ${hScore}–${aScore} ${away}${detail}. Full time — ${league}${venue}.`;
  }

  if (match.isLive) {
    const hScore = match.home?.score ?? '0';
    const aScore = match.away?.score ?? '0';
    const clock = match.clock ? `, ${match.clock}` : '';
    const period = match.period ? ` (${match.period})` : '';
    return `Live: ${home} ${hScore}–${aScore} ${away}${clock}${period}. ${match.statusDetail || 'In progress'} — ${league}.`;
  }

  const kickoff = match.date
    ? `${new Date(match.date).toLocaleString('en-IN', {
        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata',
      })} IST`
    : (match.statusShort || 'TBD');

  const homeForm = (match.home?.records || []).slice(0, 1).join('');
  const awayForm = (match.away?.records || []).slice(0, 1).join('');
  const formBit = homeForm || awayForm
    ? ` ${home}${homeForm ? `: ${homeForm}` : ''}${awayForm ? ` · ${away}: ${awayForm}` : ''}.`
    : '';

  return `${home} vs ${away} — ${league}${venue}. Kickoff ${kickoff}.${formBit}`;
}

export function matchPreviewCacheKey(match) {
  const state = match.isLive ? 'live' : match.isFinished ? 'ft' : 'pre';
  const scores = `${match.home?.score ?? ''}-${match.away?.score ?? ''}`;
  return `aiimin_sports_preview_v2_${match.id}_${state}_${scores}`;
}
