/**
 * sportsService.js — ESPN hidden API (no key required)
 * Cricket now uses ESPN scoreboard (same as football) — reliable, no bot-detection
 * F1 via Ergast mirror (jolpi.ca)
 */
import { apiGet } from '../utils/api';

const ESPN = 'https://site.api.espn.com/apis/site/v2/sports';
const ERGAST = 'https://api.jolpi.ca/ergast/f1';
const CRICKET_KEY = '9abc4793-8300-4cae-be1c-278b7c9b81e9';

/* ── Fetch with timeout ────────────────────────────────────── */
const fetchJSON = async (url, timeout = 10000) => {
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

/* ── ESPN scoreboard parser (universal — works for all ESPN sports) ── */
const parseESPNEvents = (data) => {
  if (!data?.events?.length) return [];
  return data.events.map(ev => {
    const comp = ev.competitions?.[0] || {};
    const home = comp.competitors?.find(c => c.homeAway === 'home') || comp.competitors?.[0] || {};
    const away = comp.competitors?.find(c => c.homeAway === 'away') || comp.competitors?.[1] || {};
    const status = comp.status?.type || {};
    const statusDetail = comp.status?.type?.shortDetail || comp.status?.type?.detail || '';
    
    // Extract notes (series info, match type etc.)
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

/* ── Football (Soccer) ────────────────────────────────────── */
export const fetchFootball = async () => {
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
        .then(d => ({ league: l, events: parseESPNEvents(d).slice(0, 5) }))
    )
  );

  return results
    .filter(r => r.status === 'fulfilled' && r.value.events.length > 0)
    .map(r => r.value);
};

/* ── Football Standings ── */
export const fetchFootballStandings = async (leagueSlug = 'eng.1') => {
  try {
    const data = await fetchJSON(`${ESPN}/soccer/${leagueSlug}/standings`);
    const standings = data?.standings?.entries || data?.children?.[0]?.standings?.entries || [];
    return standings.slice(0, 20).map((entry, i) => ({
      position: i + 1,
      team: entry.team?.displayName || entry.team?.name || 'Unknown',
      shortName: entry.team?.abbreviation || '',
      logo: entry.team?.logos?.[0]?.href || entry.team?.logo || '',
      played: entry.stats?.find(s => s.name === 'gamesPlayed')?.value || 0,
      won: entry.stats?.find(s => s.name === 'wins')?.value || 0,
      drawn: entry.stats?.find(s => s.name === 'ties')?.value || 0,
      lost: entry.stats?.find(s => s.name === 'losses')?.value || 0,
      gf: entry.stats?.find(s => s.name === 'pointsFor')?.value || 0,
      ga: entry.stats?.find(s => s.name === 'pointsAgainst')?.value || 0,
      gd: entry.stats?.find(s => s.name === 'pointDifferential')?.value || 0,
      points: entry.stats?.find(s => s.name === 'points')?.value || 0,
    }));
  } catch (err) {
    console.warn('Football standings failed:', err);
    return [];
  }
};

/* ── IPL Team Abbreviation Lookup ── */
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
  // Check for partial matches (e.g. "Royal Challengers Bengaluru [RCB]")
  for (const [key, abbr] of Object.entries(IPL_ABBR)) {
    if (lower.includes(key)) return abbr;
  }
  return name.substring(0, 3).toUpperCase();
};

/* ── Cricket via cricapi.com (UPDATED) ── */
export const fetchCricket = async () => {
  try {
    const res = await fetchJSON(`https://api.cricapi.com/v1/cricScore?apikey=${CRICKET_KEY}`);
    if (res.status !== 'success') throw new Error(res.info || 'Cricket API failed');

    const TOP_8 = ['India', 'Australia', 'England', 'South Africa', 'Pakistan', 'New Zealand', 'West Indies', 'Sri Lanka'];
    const IPL_TEAMS = ['MI', 'CSK', 'RCB', 'KKR', 'SRH', 'DC', 'PBKS', 'RR', 'LSG', 'GT', 'Mumbai Indians', 'Chennai Super Kings', 'Royal Challengers', 'Kolkata Knight Riders', 'Sunrisers', 'Delhi Capitals', 'Punjab Kings', 'Rajasthan Royals', 'Lucknow Super Giants', 'Gujarat Titans'];

    const events = res.data
      .filter(match => {
        const t1 = (match.t1 || '').toLowerCase();
        const t2 = (match.t2 || '').toLowerCase();
        const series = (match.series || '').toLowerCase();
        const type = (match.matchType || '').toLowerCase();
        const matchStatus = (match.status || '').toLowerCase();
        const title = `${t1} ${t2} ${series} ${type} ${matchStatus}`.toLowerCase();

        // Strictly No Women's cricket (Aggressive check)
        if (title.includes('women') || title.includes('wpl') || title.includes('wbbl') || title.includes('wt20')) return false;
        
        // IPL Check (Highest priority for domestic)
        const isIPL = title.includes('ipl') || title.includes('indian premier league') || series.includes('ipl');
        
        // Indian National Team Check (Highest priority for international)
        const involvesIndia = t1 === 'india' || t2 === 'india' || t1 === 'ind' || t2 === 'ind' || t1.includes('(ind)') || t2.includes('(ind)');

        // Top 8 Nations (Men's International)
        const involvesTop8 = TOP_8.some(t => {
          const name = t.toLowerCase();
          const isMainTeam1 = t1 === name || t1.startsWith(`${name} `) || t1.endsWith(` ${name}`);
          const isMainTeam2 = t2 === name || t2.startsWith(`${name} `) || t2.endsWith(` ${name}`);
          return (isMainTeam1 || isMainTeam2) && !title.includes('u19') && !title.includes('under-19');
        });

        // IPL Team Check
        const involvesIPLTeam = IPL_TEAMS.some(t => {
            const team = t.toLowerCase();
            return t1 === team || t2 === team || t1.includes(team) || t2.includes(team);
        });

        // Strict fallback: ONLY return IPL, India matches, Top 8 ICC matches, and IPL teams
        return isIPL || involvesIndia || involvesTop8 || involvesIPLTeam;
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
        venue: '', // cricScore doesn't always provide venue in simple format
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
    return [{ league: { name: 'Cricket Scores', flag: '🏏' }, events }];
  } catch (err) {
    console.warn('Cricket API failed, falling back to ESPN:', err);
    try {
      const general = await fetchJSON(`${ESPN}/cricket/scoreboard`);
      return [{ league: { name: 'Cricket (Fallback)', flag: '🏏' }, events: parseESPNEvents(general) }];
    } catch (e) { return []; }
  }
};

/* ── F1 via Ergast API ──────────────────────────────────────── */
export const fetchF1 = async () => {
  try {
    const [nextRace, lastRace, driverStandings, constructorStandings, schedule] = await Promise.allSettled([
      fetchJSON(`${ERGAST}/current/next.json`),
      fetchJSON(`${ERGAST}/current/last/results.json`),
      fetchJSON(`${ERGAST}/current/driverStandings.json`),
      fetchJSON(`${ERGAST}/current/constructorStandings.json`),
      fetchJSON(`${ERGAST}/current.json`),
    ]);

    const next = nextRace.status === 'fulfilled' && nextRace.value?.MRData ? nextRace.value.MRData.RaceTable?.Races?.[0] : null;
    const last = lastRace.status === 'fulfilled' && lastRace.value?.MRData ? lastRace.value.MRData.RaceTable?.Races?.[0] : null;
    const drivers = driverStandings.status === 'fulfilled' && driverStandings.value?.MRData ? driverStandings.value.MRData.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.slice(0, 10) : null;
    const constructors = constructorStandings.status === 'fulfilled' && constructorStandings.value?.MRData ? constructorStandings.value.MRData.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings?.slice(0, 10) : null;
    const allRaces = schedule.status === 'fulfilled' && schedule.value?.MRData ? schedule.value.MRData.RaceTable?.Races || [] : [];
    const now = new Date();
    const upcoming = allRaces.filter(r => new Date(`${r.date}T${r.time || '00:00:00Z'}`) > now).slice(0, 3);

    return { next, last, standings: drivers, constructors, upcoming };
  } catch (err) {
    console.warn("F1 API failed:", err);
    return { next: null, last: null, standings: null, constructors: null, upcoming: [] };
  }
};

/* ── Basketball ───────────────────────────────────────────── */
export const fetchBasketball = async (dateOffset = 0) => {
  try {
    const data = await fetchJSON(`${ESPN}/basketball/nba/scoreboard`);
    return [{ league: { name: 'NBA', flag: '🏀' }, events: parseESPNEvents(data) }];
  } catch (err) {
    console.warn('NBA API failed:', err);
    return [];
  }
};

/* ── Aggregated for Sports page ─────────────────────────────── */
export const fetchAllSports = async (dateOffset = 0) => {
  try {
    // Attempt to fetch from the server-side Neon cache first
    const cachedData = await apiGet('/sports');
    if (cachedData && (cachedData.football || cachedData.cricket || cachedData.basketball || cachedData.f1)) {
      return cachedData;
    }
    throw new Error('Empty or invalid sports cache data from server');
  } catch (err) {
    console.warn('Failed to retrieve server-cached sports. Falling back to client-side fetches:', err);
    
    // Graceful fallback to raw ESPN / CricAPI / Ergast mirror direct client calls
    const [football, cricket, basketball, f1] = await Promise.allSettled([
      fetchFootball(dateOffset),
      fetchCricket(),
      fetchBasketball(dateOffset),
      fetchF1(),
    ]);

    return {
      football: football.status === 'fulfilled' ? football.value : [],
      cricket: cricket.status === 'fulfilled' ? cricket.value : [],
      basketball: basketball.status === 'fulfilled' ? basketball.value : [],
      f1: f1.status === 'fulfilled' ? f1.value : { next: null, last: null, standings: null, constructors: null, upcoming: [] },
    };
  }
};

/* ── Match Details (Granular Scorer) ────────────────────────── */
export const fetchMatchDetails = async (sport, matchId) => {
  try {
    if (sport === 'cricket') {
      const res = await fetchJSON(`https://api.cricapi.com/v1/match_info?apikey=${CRICKET_KEY}&id=${matchId}`);
      if (res.status !== 'success') throw new Error(res.info);
      return res.data;
    }
    if (sport === 'football') {
      // ESPN also has detailed match endpoints
      const data = await fetchJSON(`${ESPN}/soccer/eng.1/summary?event=${matchId}`);
      return data;
    }
    return null;
  } catch (err) {
    console.warn(`Fetch details failed for ${sport}:`, err);
    return null;
  }
};

export const sportsService = {
  getAggregatedSports: fetchAllSports,
  fetchFootballStandings,
  fetchMatchDetails
};

