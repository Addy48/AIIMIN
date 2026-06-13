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

          // Filter to show ONLY favorite team matches or Live matches
          let filtered = events.filter(e => e.isLive || FAVORITES.some(t => e.home?.name?.toLowerCase().includes(t) || e.away?.name?.toLowerCase().includes(t)));

          return { league: l, events: filtered };
        })
    )
  );

  return results
    .filter(r => r.status === 'fulfilled' && r.value.events.length > 0)
    .map(r => r.value);
};

/* ── IPL / Cricket lookup and helpers ── */
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

const isIPLTeam = (teamName) => {
  if (!teamName) return false;
  const name = teamName.toLowerCase().replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim();
  const iplKeywords = [
    'mumbai indians', 'chennai super kings', 'royal challengers', 'kolkata knight riders',
    'sunrisers hyderabad', 'delhi capitals', 'punjab kings', 'rajasthan royals',
    'lucknow super giants', 'gujarat titans', 'rcb', 'csk', 'mi', 'kkr', 'srh', 'dc',
    'pbks', 'rr', 'lsg', 'gt'
  ];
  return iplKeywords.some(keyword => {
    if (name === keyword) return true;
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(name);
  });
};

const isNationalTeam = (teamName) => {
  if (!teamName) return false;
  const name = teamName.toLowerCase().replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim();
  
  // Exclude 'A' teams, Lions, U19, emerging, academy etc.
  if (
    name.includes(' emerging') || 
    name.includes(' academy') || 
    name.includes(' u19') || 
    name.includes('under-19') ||
    name.includes(' u-19') ||
    name.includes('under 19') ||
    name.includes(' xi') || 
    /\b(a|lions|emerg|u19|u-19|academy)\b/.test(name)
  ) {
    return null;
  }

  const nationalTeams = {
    india: ['india', 'ind'],
    australia: ['australia', 'aus'],
    england: ['england', 'eng'],
    south_africa: ['south africa', 'rsa', 'sa'],
    pakistan: ['pakistan', 'pak'],
    new_zealand: ['new zealand', 'nz'],
    west_indies: ['west indies', 'wi', 'windies'],
    sri_lanka: ['sri lanka', 'sl']
  };

  for (const [key, aliases] of Object.entries(nationalTeams)) {
    if (aliases.some(alias => name === alias || new RegExp(`\\b${alias}\\b`, 'i').test(name))) {
      return key;
    }
  }

  return null;
};

const deduplicateMatches = (events) => {
  const seen = new Set();
  return events.filter(e => {
    const t1 = (e.home?.name || '').toLowerCase().replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim();
    const t2 = (e.away?.name || '').toLowerCase().replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim();
    const pair = [t1, t2].sort().join(' vs ');
    if (seen.has(pair)) return false;
    seen.add(pair);
    return true;
  });
};

const fetchCricket = async () => {
  try {
    const res = await fetchJSON(`https://api.cricapi.com/v1/cricScore?apikey=${CRICKET_KEY}`);
    if (res.status !== 'success') throw new Error(res.info || 'Cricket API failed');

    let events = res.data
      .filter(match => {
        const t1 = (match.t1 || '').toLowerCase();
        const t2 = (match.t2 || '').toLowerCase();
        const series = (match.series || '').toLowerCase();
        const type = (match.matchType || '').toLowerCase();
        const matchStatus = (match.status || '').toLowerCase();
        const title = `${t1} ${t2} ${series} ${type} ${matchStatus}`.toLowerCase();

        // 1. Aggressive bans for women's and minor cricket
        if (
          title.includes('women') || 
          title.includes('wpl') || 
          title.includes('wbbl') || 
          title.includes('wt20') || 
          title.includes('county') || 
          title.includes('vitality') || 
          title.includes('blast') || 
          title.includes('hundred') || 
          title.includes('sheffield') ||
          title.includes('plunket') ||
          title.includes('u19') ||
          title.includes('under-19') ||
          title.includes('u-19') ||
          title.includes('under 19') ||
          title.includes('development') ||
          title.includes('emerging') ||
          title.includes('academy') ||
          title.includes(' xi') ||
          /\b(a|lions|emerg|u19|u-19)\b/.test(title) ||
          /\[w(t(20)?)?\]/i.test(match.t1 || '') ||
          /\[w(t(20)?)?\]/i.test(match.t2 || '') ||
          /\(w(t(20)?)?\)/i.test(match.t1 || '') ||
          /\(w(t(20)?)?\)/i.test(match.t2 || '')
        ) {
          return false;
        }

        // 2. Classify teams
        const nat1 = isNationalTeam(match.t1);
        const nat2 = isNationalTeam(match.t2);

        const involvesIndia = nat1 === 'india' || nat2 === 'india';
        const involvesPak = nat1 === 'pakistan' || nat2 === 'pakistan';

        // Block Pakistan unless playing India
        if (involvesPak && !involvesIndia) return false;

        // International senior men check (India vs anyone, or other top 8 vs each other)
        const isHighProfileInternational = 
          (involvesIndia && (nat1 || nat2)) ||
          (nat1 && nat2 && nat1 !== 'pakistan' && nat2 !== 'pakistan');

        // IPL senior check
        const isIPLMatch = isIPLTeam(match.t1) && isIPLTeam(match.t2);

        return isHighProfileInternational || isIPLMatch;
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
    events = deduplicateMatches(events);
    events = events.slice(0, 6); // Top 6 most relevant matches

    return [{ league: { name: 'Cricket Scores', flag: '🏏' }, events }];
  } catch (err) {
    console.warn('Cricket API failed, falling back to ESPN scoreboard:', err);
    try {
      const general = await fetchJSON(`${ESPN}/cricket/scoreboard`);
      let events = parseESPNEvents(general).filter(ev => {
        const nat1 = isNationalTeam(ev.home?.name);
        const nat2 = isNationalTeam(ev.away?.name);

        const involvesIndia = nat1 === 'india' || nat2 === 'india';
        const involvesPak = nat1 === 'pakistan' || nat2 === 'pakistan';

        if (involvesPak && !involvesIndia) return false;

        const isHighProfileInternational = 
          (involvesIndia && (nat1 || nat2)) ||
          (nat1 && nat2 && nat1 !== 'pakistan' && nat2 !== 'pakistan');

        const isIPLMatch = isIPLTeam(ev.home?.name) && isIPLTeam(ev.away?.name);

        return isHighProfileInternational || isIPLMatch;
      });
      events = sortEvents(events);
      events = deduplicateMatches(events);
      events = events.slice(0, 4);
      return [{ league: { name: 'Cricket', flag: '🏏' }, events }];
    } catch (e) {
      return [];
    }
  }
};

// --- F1 API (Using Ergast Mirror via api.jolpi.ca) ---
// Jolpi can be slow; use a 4s timeout so it doesn't hold up the rest of the sports for too long.
const fetchF1 = async () => {
  try {
    const [nextRace, lastRace, driverStandings, constructorStandings, schedule] = await Promise.allSettled([
      fetchJSON(`https://api.jolpi.ca/ergast/f1/current/next.json`, 4000),
      fetchJSON(`https://api.jolpi.ca/ergast/f1/current/last/results.json`, 4000),
      fetchJSON(`https://api.jolpi.ca/ergast/f1/current/driverStandings.json`, 4000),
      fetchJSON(`https://api.jolpi.ca/ergast/f1/current/constructorStandings.json`, 4000),
      fetchJSON(`https://api.jolpi.ca/ergast/f1/current.json`, 4000),
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
