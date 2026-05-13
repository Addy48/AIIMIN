
const FOOTBALL_BASE = 'https://v3.football.api-sports.io';
const F1_BASE = 'https://v1.formula-1.api-sports.io';
const CRICKET_BASE = 'https://api.cricapi.com/v1';

const SPORTS_KEY = process.env.REACT_APP_SPORTS_API_KEY || '67254d96ff7b92022b8fbc9382a293b3';
const CRICKET_KEY = process.env.REACT_APP_CRICKET_API_KEY || '9abc4793-8300-4cae-be1c-278b7c9b81e9';

const headers = {
  'x-apisports-key': SPORTS_KEY,
};

const MOCK_FOOTBALL = [
  { fixture: { id: 1, status: { short: 'FT' }, date: new Date().toISOString() }, teams: { home: { name: 'Real Madrid', logo: '' }, away: { name: 'Barcelona', logo: '' } }, goals: { home: 3, away: 2 } },
  { fixture: { id: 2, status: { short: 'FT' }, date: new Date().toISOString() }, teams: { home: { name: 'Man City', logo: '' }, away: { name: 'Arsenal', logo: '' } }, goals: { home: 1, away: 1 } }
];

const MOCK_F1_STANDINGS = [
  { position: 1, driver: { name: 'Max Verstappen' }, team: { name: 'Red Bull' }, points: 194 },
  { position: 2, driver: { name: 'Charles Leclerc' }, team: { name: 'Ferrari' }, points: 138 },
  { position: 3, driver: { name: 'Lando Norris' }, team: { name: 'McLaren' }, points: 131 },
];

const MOCK_F1_RACES = [
  { name: 'Monaco Grand Prix', date: '2026-05-24', circuit: { name: 'Circuit de Monaco' } },
  { name: 'Spanish Grand Prix', date: '2026-06-07', circuit: { name: 'Circuit de Barcelona-Catalunya' } },
];

export const sportsService = {
  fetchFootballLive: async () => {
    try {
      const res = await fetch(`${FOOTBALL_BASE}/fixtures?live=all`, { headers });
      if (!res.ok) throw new Error('Football API error');
      const data = await res.json();
      return data.response && data.response.length > 0 ? data.response : [];
    } catch (err) {
      console.warn('Football Live Fallback');
      return [];
    }
  },
  fetchF1Standings: async (season = 2026) => {
    try {
      const res = await fetch(`${F1_BASE}/rankings/drivers?season=${season}`, { headers });
      if (!res.ok) throw new Error('F1 API error');
      const data = await res.json();
      return data.response && data.response.length > 0 ? data.response : MOCK_F1_STANDINGS;
    } catch (err) {
      return MOCK_F1_STANDINGS;
    }
  },
  fetchF1Races: async (season = 2026) => {
    try {
      const res = await fetch(`${F1_BASE}/races?season=${season}&next=5`, { headers });
      if (!res.ok) throw new Error('F1 API error');
      const data = await res.json();
      return data.response && data.response.length > 0 ? data.response : MOCK_F1_RACES;
    } catch (err) {
      return MOCK_F1_RACES;
    }
  },
  fetchCricketLive: async () => {
    try {
      const res = await fetch(`${CRICKET_BASE}/currentMatches?apikey=${CRICKET_KEY}`);
      if (!res.ok) throw new Error('Cricket API error');
      const data = await res.json();
      return data.data && data.data.length > 0 ? data.data : [];
    } catch (err) {
      return [];
    }
  },
  getAggregatedSports: async () => {
    try {
      const [football, f1, cricket] = await Promise.all([
        sportsService.fetchFootballLive(),
        sportsService.fetchF1Races(),
        sportsService.fetchCricketLive()
      ]);
      return { 
        football: football.length > 0 ? football : MOCK_FOOTBALL, 
        f1: f1, 
        cricket: cricket 
      };
    } catch (err) {
      console.error("Aggregation failed", err);
      return { football: MOCK_FOOTBALL, f1: MOCK_F1_RACES, cricket: [] };
    }
  }
};
