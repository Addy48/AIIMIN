const FOOTBALL_BASE = 'https://v3.football.api-sports.io';
const F1_BASE = 'https://v1.formula-1.api-sports.io';
const CRICKET_BASE = 'https://api.cricapi.com/v1';

const SPORTS_KEY = process.env.REACT_APP_SPORTS_API_KEY || '67254d96ff7b92022b8fbc9382a293b3';
const CRICKET_KEY = process.env.REACT_APP_CRICKET_API_KEY || '9abc4793-8300-4cae-be1c-278b7c9b81e9';

const headers = {
  'x-apisports-key': SPORTS_KEY,
};

// Mock data for fallback when APIs fail or are empty
const MOCK_FOOTBALL = [
  {
    fixture: { id: 1, status: { short: 'FT' }, date: new Date().toISOString() },
    teams: { home: { name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' }, away: { name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' } },
    goals: { home: 3, away: 2 }
  },
  {
    fixture: { id: 2, status: { short: 'FT' }, date: new Date().toISOString() },
    teams: { home: { name: 'Man City', logo: 'https://media.api-sports.io/football/teams/50.png' }, away: { name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' } },
    goals: { home: 1, away: 1 }
  }
];

const MOCK_CRICKET = [
  {
    id: "mock-1",
    name: "India vs Australia - 2nd Test",
    matchType: "Test",
    status: "Stumps - Day 3",
    score: [
      { inning: "India 1st Inn", r: 345, w: 10, o: 102.4 },
      { inning: "Australia 1st Inn", r: 289, w: 10, o: 95.2 },
      { inning: "India 2nd Inn", r: 120, w: 3, o: 42.0 }
    ]
  }
];

export const sportsService = {
  // FOOTBALL
  fetchFootballLive: async () => {
    try {
      const res = await fetch(`${FOOTBALL_BASE}/fixtures?live=all`, { headers });
      const data = await res.json();
      const results = data.response || [];
      return results.length > 0 ? results : []; // Don't fallback to mock here, let the UI handle it
    } catch (err) {
      console.error('Football Live Fetch Error:', err);
      return [];
    }
  },

  fetchFootballRecent: async () => {
    try {
      const res = await fetch(`${FOOTBALL_BASE}/fixtures?last=10`, { headers });
      const data = await res.json();
      return data.response && data.response.length > 0 ? data.response : MOCK_FOOTBALL;
    } catch (err) {
      console.error('Football Recent Fetch Error:', err);
      return MOCK_FOOTBALL;
    }
  },

  fetchFootballUpcoming: async () => {
    try {
      const res = await fetch(`${FOOTBALL_BASE}/fixtures?next=10`, { headers });
      const data = await res.json();
      return data.response || [];
    } catch (err) {
      console.error('Football Upcoming Fetch Error:', err);
      return [];
    }
  },

  // F1
  fetchF1Standings: async (season = new Date().getFullYear()) => {
    try {
      const res = await fetch(`${F1_BASE}/rankings/drivers?season=${season}`, { headers });
      const data = await res.json();
      return data.response || [];
    } catch (err) {
      console.error('F1 Standings Fetch Error:', err);
      return [];
    }
  },

  fetchF1Races: async (season = new Date().getFullYear()) => {
    try {
      const res = await fetch(`${F1_BASE}/races?season=${season}&next=5`, { headers });
      const data = await res.json();
      return data.response || [];
    } catch (err) {
      console.error('F1 Races Fetch Error:', err);
      return [];
    }
  },

  // CRICKET
  fetchCricketLive: async () => {
    try {
      const res = await fetch(`${CRICKET_BASE}/currentMatches?apikey=${CRICKET_KEY}`);
      const data = await res.json();
      const results = data.data || [];
      return results.length > 0 ? results : MOCK_CRICKET;
    } catch (err) {
      console.error('Cricket Live Fetch Error:', err);
      return MOCK_CRICKET;
    }
  }
};

