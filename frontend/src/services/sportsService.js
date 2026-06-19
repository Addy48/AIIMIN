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
          ? new Date(ev.date).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST'
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
        name: home.team?.displayName || home.team?.name || home.competitor?.displayName || 'TBD',
        short: home.team?.shortDisplayName || home.team?.abbreviation || home.team?.name?.substring(0,3)?.toUpperCase() || home.competitor?.abbreviation || 'TBD',
        logo: home.team?.logo || home.competitor?.logo || '',
        score: home.score || '',
        winner: home.winner,
      },
      away: {
        name: away.team?.displayName || away.team?.name || away.competitor?.displayName || 'TBD',
        short: away.team?.shortDisplayName || away.team?.abbreviation || away.team?.name?.substring(0,3)?.toUpperCase() || away.competitor?.abbreviation || 'TBD',
        logo: away.team?.logo || away.competitor?.logo || '',
        score: away.score || '',
        winner: away.winner,
      },
      league: data.leagues?.[0]?.name || '',
    };
  });
};

/* ── Filter Stale Finished Matches (approx start + duration + 30m) ── */
const filterStale = (events, durationHrs = 2) => {
  const now = Date.now();
  // Match duration + 30 minutes delay
  const maxAge = (durationHrs * 60 * 60 * 1000) + (30 * 60 * 1000);
  return events.filter(ev => {
    if (!ev.isFinished || !ev.date) return true;
    return (now - new Date(ev.date).getTime()) < maxAge;
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
  // Only requested leagues: Prem League, La Liga, National Teams
  const leagues = [
    { slug: 'eng.1', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { slug: 'esp.1', name: 'La Liga', flag: '🇪🇸' },
    { slug: 'fifa.world', name: 'National Teams', flag: '🌍' },
  ];

  const results = await Promise.allSettled(
    leagues.map(l => fetchJSON(`${ESPN}/soccer/${l.slug}/scoreboard`)
      .then(d => {
        let events = parseESPNEvents(d);
        events = filterStale(events, 2); // Soccer ~2h duration + 30m delay
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
        }).filter(ev => {
          if (league.name && league.name.includes('Indian Premier League')) return true;
          const allowed = ['India', 'India A', 'Australia', 'England', 'South Africa', 'New Zealand', 'Pakistan', 'Sri Lanka', 'West Indies'];
          return allowed.includes(ev.home.name) || allowed.includes(ev.away.name);
        }) : [];
        events = filterStale(events, 6); // Cricket ~6h
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
          events = filterStale(events, 2.5); // Basketball ~2.5h
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
    const data = await fetchJSON(`${ESPN}/racing/f1/scoreboard`);
    if (!data?.events?.length) return { upcoming: [], next: null, last: null };
    
    let events = data.events.map(ev => {
      const comp = ev.competitions?.[0] || {};
      const status = comp.status?.type || {};
      const statusDetail = comp.status?.type?.shortDetail || comp.status?.type?.detail || '';
      
      // Extract top 3 drivers if available
      let drivers = [];
      if (comp.competitors && comp.competitors.length > 0) {
        drivers = comp.competitors.slice(0, 3).map(c => ({
          name: c.athlete?.displayName || c.athlete?.shortName || 'TBD',
          position: c.status?.position || c.order,
          time: c.status?.displayTime || c.status?.time || ''
        }));
      }

      return {
        id: ev.id,
        date: ev.date,
        name: ev.name || ev.shortName,
        status: status.name,
        statusShort: status.completed ? 'FINISHED' : (
          status.state === 'pre' && ev.date
            ? new Date(ev.date).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST'
            : statusDetail
        ),
        statusDetail: comp.status?.type?.detail || '',
        period: comp.status?.period,
        isLive: status.state === 'in',
        isFinished: status.completed || status.state === 'post',
        venue: comp.venue?.fullName || '',
        drivers: drivers
      };
    });

    events = sortEvents(events);
    // Filter out F1 events older than 3 hours (2.5h duration + 30m delay)
    events = filterStale(events, 2.5);

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
