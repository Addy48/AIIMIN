import { pool } from '../lib/db.js';

const ESPN = 'https://site.api.espn.com/apis/site/v2/sports';
const ERGAST = 'https://api.jolpi.ca/ergast/f1';
const CRICKET_KEY = '9abc4793-8300-4cae-be1c-278b7c9b81e9';

/* ── Fetch with timeout ────────────────────────────────────── */
const fetchJSON = async (url, timeout = 8000) => {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(tid);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    clearTimeout(tid);
    throw e;
  }
};

/* ── ESPN scoreboard parser (universal — matches frontend) ── */
const parseESPNEvents = (data) => {
  if (!data?.events?.length) return [];
  return data.events.map(ev => {
    const comp = ev.competitions?.[0] || {};
    const home = comp.competitors?.find(c => c.homeAway === 'home') || comp.competitors?.[0] || {};
    const away = comp.competitors?.find(c => c.homeAway === 'away') || comp.competitors?.[1] || {};
    const status = comp.status?.type || {};
    const statusDetail = comp.status?.type?.shortDetail || comp.status?.type?.detail || '';
    
    const notes = comp.notes?.map(n => n.headline || n.text).filter(Boolean) || [];
    
    return {
      id: ev.id,
      date: ev.date,
      name: ev.name,
      shortName: ev.shortName,
      status: status.name,
      statusShort: status.completed ? '' : (
        status.state === 'pre' && ev.date
          ? new Date(ev.date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' IST'
          : statusDetail
      ),
      statusDetail: comp.status?.type?.detail || '',
      clock: comp.status?.displayClock,
      period: comp.status?.period,
      isLive: status.state === 'in',
      isFinished: status.completed,
      venue: comp.venue?.fullName || '',
      location: comp.venue?.address ? `${comp.venue.address.city || ''}, ${comp.venue.address.country || ''}`.trim() : '',
      notes,
      home: {
        id: home.team?.id || home.id,
        name: home.team?.displayName || home.team?.name || 'TBD',
        short: home.team?.shortDisplayName || home.team?.abbreviation || home.team?.name?.substring(0,3)?.toUpperCase() || '???',
        logo: home.team?.logo || '',
        score: home.score,
        color: home.team?.color ? `#${home.team.color}` : '#555',
        linescores: home.linescores || [],
        records: home.records?.map(r => r.summary).filter(Boolean) || [],
      },
      away: {
        id: away.team?.id || away.id,
        name: away.team?.displayName || away.team?.name || 'TBD',
        short: away.team?.shortDisplayName || away.team?.abbreviation || away.team?.name?.substring(0,3)?.toUpperCase() || '???',
        logo: away.team?.logo || '',
        score: away.score,
        color: away.team?.color ? `#${away.team.color}` : '#555',
        linescores: away.linescores || [],
        records: away.records?.map(r => r.summary).filter(Boolean) || [],
      },
      league: data.leagues?.[0]?.name || '',
      situation: comp.situation || null,
      broadcasts: comp.broadcasts?.map(b => b.names?.join(', ')).filter(Boolean) || [],
    };
  });
};

/* ── Date helper for fixture navigation ── */
const getDateStr = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0].replace(/-/g, '');
};

const getDateRange = () => {
  return `${getDateStr(-3)}-${getDateStr(3)}`;
};

const sortEvents = (events) => {
  return events.sort((a, b) => {
    // 1. Live matches first
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;

    // 2. Upcoming matches next (not live, not finished)
    const aIsUpcoming = !a.isLive && !a.isFinished;
    const bIsUpcoming = !b.isLive && !b.isFinished;
    if (aIsUpcoming && !bIsUpcoming) return -1;
    if (!aIsUpcoming && bIsUpcoming) return 1;

    // 3. Within same category, sort by date/time
    const dateA = new Date(a.date || a.dateTimeGMT || 0).getTime();
    const dateB = new Date(b.date || b.dateTimeGMT || 0).getTime();
    
    if (aIsUpcoming) {
      return dateA - dateB; // earliest upcoming first
    } else {
      return dateB - dateA; // latest finished first
    }
  });
};

/* ── Football (Soccer) Fetch & Filter ── */
const fetchFootball = async () => {
  const dateRange = getDateRange();
  const leagues = [
    { slug: 'fifa.world', name: 'World Cup', flag: '🏆' },
    { slug: 'conmebol.america', name: 'Copa America', flag: '🌎' },
    { slug: 'eng.1', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { slug: 'esp.1', name: 'La Liga', flag: '🇪🇸' },
    { slug: 'UEFA.CHAMPIONS', name: 'UCL', flag: '⭐' },
    { slug: 'usa.1', name: 'MLS', flag: '🇺🇸' },
  ];

  const results = await Promise.allSettled(
    leagues.map(l =>
      fetchJSON(`${ESPN}/soccer/${l.slug}/scoreboard`)
        .then(d => {
          let events = parseESPNEvents(d);
          const FAVORITES = ['real madrid', 'arsenal', 'manchester united', 'man utd'];
          
          events.sort((a, b) => {
            const aFav = FAVORITES.some(f => a.home?.name?.toLowerCase().includes(f) || a.away?.name?.toLowerCase().includes(f));
            const bFav = FAVORITES.some(f => b.home?.name?.toLowerCase().includes(f) || b.away?.name?.toLowerCase().includes(f));
            
            // 1. Live matches first
            if (a.isLive && !b.isLive) return -1;
            if (!a.isLive && b.isLive) return 1;
            
            // 2. Favorite teams second
            if (aFav && !bFav) return -1;
            if (!aFav && bFav) return 1;
            
            // 3. Upcoming matches third
            const aIsUpcoming = !a.isLive && !a.isFinished;
            const bIsUpcoming = !b.isLive && !b.isFinished;
            if (aIsUpcoming && !bIsUpcoming) return -1;
            if (!aIsUpcoming && bIsUpcoming) return 1;
            
            // 4. Sort by date
            const dateA = new Date(a.date || a.dateTimeGMT || 0).getTime();
            const dateB = new Date(b.date || b.dateTimeGMT || 0).getTime();
            if (aIsUpcoming) return dateA - dateB; // earliest upcoming first
            return dateB - dateA; // latest finished first
          });

          // Filter to show ONLY favorite team matches or Live matches or top 3 if neither
          let filtered = events.filter(e => e.isLive || FAVORITES.some(t => e.home?.name?.toLowerCase().includes(t) || e.away?.name?.toLowerCase().includes(t)));
          if (filtered.length === 0) filtered = events.slice(0, 3);

          return { league: l, events: filtered };
        })
    )
  );

  return results
    .filter(r => r.status === 'fulfilled' && r.value.events.length > 0)
    .map(r => r.value);
};

/* ── IPL / Cricket lookup and fetcher ── */
const IPL_ABBR = {
  'royal challengers bengaluru': 'RCB',
  'royal challengers bangalore': 'RCB',
  'royal challengers': 'RCB',
  'mumbai indians': 'MI',
  'punjab kings': 'PBKS',
  'kolkata knight riders': 'KKR',
  'sunrisers hyderabad': 'SRH',
  'rajasthan royals': 'RR',
  'delhi capitals': 'DC',
  'chennai super kings': 'CSK',
  'lucknow super giants': 'LSG',
  'gujarat titans': 'GT',
};

const getTeamShort = (name) => {
  if (!name) return '???';
  const lower = name.toLowerCase().trim();
  if (IPL_ABBR[lower]) return IPL_ABBR[lower];
  for (const [key, abbr] of Object.entries(IPL_ABBR)) {
    if (lower.includes(key)) return abbr;
  }
  return name.substring(0, 3).toUpperCase();
};

const fetchCricket = async () => {
  try {
    const res = await fetchJSON(`https://api.cricapi.com/v1/cricScore?apikey=${CRICKET_KEY}`);
    if (res.status !== 'success') throw new Error(res.info || 'Cricket API failed');

    const TOP_8 = ['India', 'Australia', 'England', 'South Africa', 'Pakistan', 'New Zealand', 'West Indies', 'Sri Lanka'];
    const IPL_TEAMS = ['MI', 'CSK', 'RCB', 'KKR', 'SRH', 'DC', 'PBKS', 'RR', 'LSG', 'GT', 'Mumbai Indians', 'Chennai Super Kings', 'Royal Challengers', 'Kolkata Knight Riders', 'Sunrisers', 'Delhi Capitals', 'Punjab Kings', 'Rajasthan Royals', 'Lucknow Super Giants', 'Gujarat Titans'];

    let events = res.data
      .filter(match => {
        const t1 = (match.t1 || '').toLowerCase();
        const t2 = (match.t2 || '').toLowerCase();
        const series = (match.series || '').toLowerCase();
        const type = (match.matchType || '').toLowerCase();
        const matchStatus = (match.status || '').toLowerCase();
        const title = `${t1} ${t2} ${series} ${type} ${matchStatus}`.toLowerCase();

        // Exclude women matches
        if (title.includes('women') || title.includes('wpl') || title.includes('wbbl') || title.includes('wt20')) return false;
        
        // Exclude England county and other domestic non-IPL leagues
        if (title.includes('county') || title.includes('vitality') || title.includes('blast') || title.includes('hundred') || title.includes('sheffield')) return false;

        const involvesIndia = t1 === 'india' || t2 === 'india' || t1 === 'ind' || t2 === 'ind' || t1.includes('(ind)') || t2.includes('(ind)');

        // Exclude Pakistan unless playing with India
        const involvesPak = t1.includes('pakistan') || t2.includes('pakistan') || t1 === 'pak' || t2 === 'pak';
        if (involvesPak && !involvesIndia) return false;

        const involvesTop8 = TOP_8.some(t => {
          const name = t.toLowerCase();
          const isMainTeam1 = t1 === name || t1.startsWith(`${name} `) || t1.endsWith(` ${name}`);
          const isMainTeam2 = t2 === name || t2.startsWith(`${name} `) || t2.endsWith(` ${name}`);
          return (isMainTeam1 || isMainTeam2) && !title.includes('u19') && !title.includes('under-19');
        });

        // Only ICC matches (Tests, ODIs, T20Is) or IPL
        const isICC = title.includes('test') || title.includes('odi') || title.includes('t20i') || title.includes('icc') || title.includes('world cup');
        const isIPL = title.includes('ipl') || title.includes('indian premier league') || series.includes('ipl');

        const involvesIPLTeam = IPL_TEAMS.some(t => {
            const team = t.toLowerCase();
            return t1 === team || t2 === team || t1.includes(team) || t2.includes(team);
        });

        // Strict inclusion: Only IPL, India, or Top 8 teams in ICC matches
        return isIPL || involvesIndia || (involvesTop8 && isICC) || involvesIPLTeam;
      })
      .map(match => {
        const isLive = match.ms === 'live';
        const isFinished = match.ms === 'result';
        const gmtDate = match.dateTimeGMT?.endsWith('Z') ? match.dateTimeGMT : `${match.dateTimeGMT}Z`;
        
        return {
          id: match.id,
          date: match.dateTimeGMT,
          name: `${match.t1} vs ${match.t2}`,
          status: match.status,
          statusShort: isLive
            ? (match.status || 'Live')
            : isFinished
              ? (match.status || 'Result')
              : `${match.matchType?.toUpperCase() || 'Match'} · ${new Date(gmtDate).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })} IST`,
          statusDetail: match.t1s || match.t2s || '',
          isLive,
          isFinished,
          venue: '',
          notes: [match.matchType?.toUpperCase()].filter(Boolean),
          home: {
            name: match.t1,
            short: getTeamShort(match.t1),
            score: match.t1s || '0',
            logo: match.t1img || '',
          },
          away: {
            name: match.t2,
            short: getTeamShort(match.t2),
            score: match.t2s || '0',
            logo: match.t2img || '',
          }
        };
      });

    events = sortEvents(events);
    events = events.slice(0, 6); // Top 6 most relevant matches

    return [{ league: { name: 'Cricket Scores', flag: '🏏' }, events }];
  } catch (err) {
    console.warn('Cricket API failed, falling back to ESPN scoreboard:', err);
    try {
      const general = await fetchJSON(`${ESPN}/cricket/scoreboard`);
      let events = parseESPNEvents(general).filter(ev => {
        // Apply strict filter to ESPN fallback as well
        const t1 = (ev.home?.name || '').toLowerCase();
        const t2 = (ev.away?.name || '').toLowerCase();
        
        const involvesPak = t1.includes('pakistan') || t2.includes('pakistan');
        const involvesIndia = t1.includes('india') || t2.includes('india');
        if (involvesPak && !involvesIndia) return false;

        const TOP_8 = ['australia', 'england', 'south africa', 'new zealand', 'west indies', 'sri lanka', 'india'];
        const involvesTop8 = TOP_8.some(t => t1.includes(t) || t2.includes(t));
        const isIPL = ev.league?.toLowerCase().includes('indian premier league') || t1.includes('chennai') || t2.includes('chennai') || t1.includes('mumbai') || t2.includes('mumbai') || t1.includes('royal') || t2.includes('royal');
        
        return involvesIndia || involvesTop8 || isIPL;
      });
      events = sortEvents(events).slice(0, 4);
      return [{ league: { name: 'Cricket', flag: '🏏' }, events }];
    } catch (e) {
      return [];
    }
  }
};

/* ── F1 via Ergast API ── */
const fetchF1 = async () => {
  try {
    const [nextRace, lastRace, driverStandings, constructorStandings, schedule] = await Promise.allSettled([
      fetchJSON(`https://api.jolpi.ca/ergast/f1/current/next.json`),
      fetchJSON(`https://api.jolpi.ca/ergast/f1/current/last/results.json`),
      fetchJSON(`https://api.jolpi.ca/ergast/f1/current/driverStandings.json`),
      fetchJSON(`https://api.jolpi.ca/ergast/f1/current/constructorStandings.json`),
      fetchJSON(`https://api.jolpi.ca/ergast/f1/current.json`),
    ]);

    const next = nextRace.status === 'fulfilled' && nextRace.value?.MRData ? nextRace.value.MRData.RaceTable?.Races?.[0] : null;
    const last = lastRace.status === 'fulfilled' && lastRace.value?.MRData ? lastRace.value.MRData.RaceTable?.Races?.[0] : null;
    let drivers = driverStandings.status === 'fulfilled' && driverStandings.value?.MRData ? driverStandings.value.MRData.StandingsTable?.StandingsLists?.[0]?.DriverStandings : null;
    let constructors = constructorStandings.status === 'fulfilled' && constructorStandings.value?.MRData ? constructorStandings.value.MRData.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings : null;
    const allRaces = schedule.status === 'fulfilled' && schedule.value?.MRData ? schedule.value.MRData.RaceTable?.Races || [] : [];
    const now = new Date();
    const upcoming = allRaces.filter(r => new Date(`${r.date}T${r.time || '00:00:00Z'}`) > now).slice(0, 3);

    // VIP Driver Cutoff Filter (Top 3 + Hamilton + Verstappen)
    const VIPs = ['verstappen', 'hamilton'];
    if (drivers) {
      drivers = drivers.filter((d, index) => index < 3 || VIPs.includes((d.Driver?.driverId || '').toLowerCase()));
    }
    if (last && last.Results) {
      last.Results = last.Results.filter((r, index) => index < 3 || VIPs.includes((r.Driver?.driverId || '').toLowerCase()));
    }
    if (constructors) {
      // Keep constructor standings clean too (Top 4)
      constructors = constructors.slice(0, 4);
    }

    return { next, last, standings: drivers, constructors, upcoming };
  } catch (err) {
    console.warn("F1 API failed:", err);
    return { next: null, last: null, standings: null, constructors: null, upcoming: [] };
  }
};

/* ── Basketball ── */
const fetchBasketball = async () => {
  try {
    const data = await fetchJSON(`${ESPN}/basketball/nba/scoreboard`);
    let events = parseESPNEvents(data);
    events = sortEvents(events).slice(0, 3);
    return [{ league: { name: 'NBA', flag: '🏀' }, events }];
  } catch (err) {
    console.warn('NBA API failed:', err);
    return [];
  }
};

/**
 * Orchestrates fetching all feeds, filtering them, limiting list sizes,
 * and saving the resulting aggregated feed inside Neon database.
 */
export const updateSportsCache = async () => {
  console.log('[SportsCache] Starting global feed update...');
  
  const [football, cricket, basketball, f1] = await Promise.allSettled([
    fetchFootball(),
    fetchCricket(),
    fetchBasketball(),
    fetchF1(),
  ]);

  const aggregatedPayload = {
    football: football.status === 'fulfilled' ? football.value : [],
    cricket: cricket.status === 'fulfilled' ? cricket.value : [],
    basketball: basketball.status === 'fulfilled' ? basketball.value : [],
    f1: f1.status === 'fulfilled' ? f1.value : { next: null, last: null, standings: null, constructors: null, upcoming: [] },
  };

  // Upsert the aggregated feed payload into sports_cache
  const query = `
    INSERT INTO sports_cache (key, data, updated_at)
    VALUES ($1, $2, CURRENT_TIMESTAMP)
    ON CONFLICT (key) 
    DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
  `;
  
  await pool.query(query, ['aggregated_feed', JSON.stringify(aggregatedPayload)]);
  console.log('[SportsCache] Global sports feed cache refreshed successfully.');
  
  return aggregatedPayload;
};

/**
 * Retrieves the cached aggregated sports feed from the database.
 */
export const getCachedSports = async () => {
  const result = await pool.query('SELECT data, updated_at FROM sports_cache WHERE key = $1', ['aggregated_feed']);
  
  if (result.rows.length === 0) {
    return await updateSportsCache();
  }

  const { data, updated_at } = result.rows[0];
  const cacheAgeMs = Date.now() - new Date(updated_at).getTime();
  const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

  if (cacheAgeMs > CACHE_TTL_MS) {
    console.log('[SportsCache] Cache expired (older than 2 hours). Refreshing asynchronously...');
    // Fire and forget to avoid blocking UI, return stale data immediately
    updateSportsCache().catch(err => {
      console.error('[SportsCache] Background refresh failed:', err);
    });
    return data;
  }

  return data;
};
