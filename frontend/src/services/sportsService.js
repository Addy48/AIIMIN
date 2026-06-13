/**
 * sportsService.js — High-Performance Client-Side Aggregator
 * Relies exclusively on reliable, fast ESPN & Ergast public APIs with NO CORS issues.
 * Implements strict timeouts to prevent UI hanging.
 */

const ESPN = 'https://site.api.espn.com/apis/site/v2/sports';
const ERGAST = 'https://api.jolpi.ca/ergast/f1';

/* ── Fetch with AbortController ──────────────────────────────── */
const fetchJSON = async (url, timeout = 6000) => {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
};

/* ── ESPN Scoreboard Parser (Universal) ──────────────────────── */
const parseESPNEvents = (data) => {
  if (!data?.events?.length) return [];
  return data.events.map(ev => {
    const comp = ev.competitions?.[0] || {};
    const home = comp.competitors?.find(c => c.homeAway === 'home') || comp.competitors?.[0] || {};
    const away = comp.competitors?.find(c => c.homeAway === 'away') || comp.competitors?.[1] || {};
    const status = comp.status?.type || {};
    const statusDetail = comp.status?.type?.shortDetail || comp.status?.type?.detail || '';
    
    return {
      id: ev.id,
      date: ev.date,
      name: ev.name || ev.shortName,
      status: status.name,
      statusShort: status.completed ? 'FT' : (
        status.state === 'pre' && ev.date
          ? new Date(ev.date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          : statusDetail
      ),
      statusDetail: comp.status?.type?.detail || '',
      clock: comp.status?.displayClock,
      period: comp.status?.period,
      isLive: status.state === 'in',
      isFinished: status.completed || status.state === 'post',
      venue: comp.venue?.fullName || '',
      notes: comp.notes?.map(n => n.headline || n.text).filter(Boolean) || [],
      home: {
        name: home.team?.displayName || home.team?.name || 'TBD',
        short: home.team?.shortDisplayName || home.team?.abbreviation || home.team?.name?.substring(0,3)?.toUpperCase(),
        logo: home.team?.logo || '',
        score: home.score || '',
        winner: home.winner,
      },
      away: {
        name: away.team?.displayName || away.team?.name || 'TBD',
        short: away.team?.shortDisplayName || away.team?.abbreviation || away.team?.name?.substring(0,3)?.toUpperCase(),
        logo: away.team?.logo || '',
        score: away.score || '',
        winner: away.winner,
      },
      league: data.leagues?.[0]?.name || '',
    };
  });
};

/* ── Sorting Events ── */
const sortEvents = (events) => {
  return events.sort((a, b) => {
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    const aUpcoming = !a.isLive && !a.isFinished;
    const bUpcoming = !b.isLive && !b.isFinished;
    if (aUpcoming && !bUpcoming) return -1;
    if (!aUpcoming && bUpcoming) return 1;
    const tA = new Date(a.date).getTime();
    const tB = new Date(b.date).getTime();
    return aUpcoming ? tA - tB : tB - tA;
  });
};

/* ── Football (Soccer) ── */
export const fetchFootball = async () => {
  const leagues = [
    { slug: 'eng.1', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { slug: 'UEFA.CHAMPIONS', name: 'Champions League', flag: '⭐' },
    { slug: 'esp.1', name: 'La Liga', flag: '🇪🇸' },
    { slug: 'ita.1', name: 'Serie A', flag: '🇮🇹' },
    { slug: 'ger.1', name: 'Bundesliga', flag: '🇩🇪' },
    { slug: 'fra.1', name: 'Ligue 1', flag: '🇫🇷' },
    { slug: 'usa.1', name: 'MLS', flag: '🇺🇸' },
  ];

  const results = await Promise.allSettled(
    leagues.map(l => fetchJSON(`${ESPN}/soccer/${l.slug}/scoreboard`)
      .then(d => {
        let events = parseESPNEvents(d);
        events = sortEvents(events).slice(0, 8); // Top 8 matches per league
        return { league: l, events };
      })
    )
  );

  return results.filter(r => r.status === 'fulfilled' && r.value.events.length > 0).map(r => r.value);
};

/* ── Cricket ── */
export const fetchCricket = async () => {
  try {
    const data = await fetchJSON(`https://site.api.espn.com/apis/v2/scoreboard/header?sport=cricket`);
    let leagues = [];
    if (data?.sports?.[0]?.leagues) {
      leagues = data.sports[0].leagues.map(league => {
        let events = league.events ? league.events.map(ev => {
          const home = ev.competitors?.find(c => c.homeAway === 'home') || ev.competitors?.[0] || {};
          const away = ev.competitors?.find(c => c.homeAway === 'away') || ev.competitors?.[1] || {};
          return {
            id: ev.id,
            date: ev.date,
            name: ev.name || ev.shortName,
            statusShort: ev.fullStatus?.type?.shortDetail || ev.summary || ev.status,
            statusDetail: ev.fullStatus?.type?.detail || ev.summary || '',
            isLive: ev.status === 'in',
            isFinished: ev.status === 'post',
            venue: ev.location || '',
            home: {
              name: home.displayName || home.name,
              score: home.score || '',
              logo: home.logo || '',
            },
            away: {
              name: away.displayName || away.name,
              score: away.score || '',
              logo: away.logo || '',
            }
          };
        }) : [];
        events = sortEvents(events).slice(0, 6);
        return {
          league: { name: league.name, flag: '🏏' },
          events
        };
      }).filter(l => l.events.length > 0);
    }
    return leagues;
  } catch (err) {
    console.error('Cricket fetch failed:', err);
    return [];
  }
};

/* ── Basketball ── */
export const fetchBasketball = async () => {
  try {
    const leagues = [
      { slug: 'nba', name: 'NBA', flag: '🏀' },
      { slug: 'mens-college-basketball', name: 'NCAA Men', flag: '🎓' }
    ];

    const results = await Promise.allSettled(
      leagues.map(l => fetchJSON(`${ESPN}/basketball/${l.slug}/scoreboard`)
        .then(d => {
          let events = parseESPNEvents(d);
          events = sortEvents(events).slice(0, 10);
          return { league: l, events };
        })
      )
    );
    return results.filter(r => r.status === 'fulfilled' && r.value.events.length > 0).map(r => r.value);
  } catch (err) {
    return [];
  }
};

/* ── F1 ── */
export const fetchF1 = async () => {
  try {
    // ESPN provides F1 events without CORS issues, Ergast is too slow.
    const data = await fetchJSON(`${ESPN}/racing/f1/scoreboard`);
    let events = parseESPNEvents(data);
    events = sortEvents(events);
    return {
      upcoming: events,
      next: events.find(e => !e.isFinished) || null,
      last: [...events].reverse().find(e => e.isFinished) || null
    };
  } catch (err) {
    console.error("F1 fetch failed:", err);
    return { upcoming: [], next: null, last: null };
  }
};

/* ── Aggregated Call ── */
export const fetchAllSports = async () => {
  const [football, cricket, basketball, f1] = await Promise.allSettled([
    fetchFootball(),
    fetchCricket(),
    fetchBasketball(),
    fetchF1(),
  ]);

  return {
    football: football.status === 'fulfilled' ? football.value : [],
    cricket: cricket.status === 'fulfilled' ? cricket.value : [],
    basketball: basketball.status === 'fulfilled' ? basketball.value : [],
    f1: f1.status === 'fulfilled' ? f1.value : { upcoming: [], next: null, last: null },
  };
};

export const sportsService = {
  getAggregatedSports: fetchAllSports
};
