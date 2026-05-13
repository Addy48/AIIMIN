const FOOTBALL_BASE = 'https://v3.football.api-sports.io';
const F1_BASE = 'https://v1.formula-1.api-sports.io';
const CRICKET_BASE = 'https://api.cricapi.com/v1'; // Assuming cricapi/cricketdata

const SPORTS_KEY = process.env.REACT_APP_SPORTS_API_KEY || '67254d96ff7b92022b8fbc9382a293b3';
const CRICKET_KEY = process.env.REACT_APP_CRICKET_API_KEY;

const headers = {
  'x-apisports-key': SPORTS_KEY,
};

export const sportsService = {
  // FOOTBALL
  fetchFootballLive: async () => {
    try {
      const res = await fetch(`${FOOTBALL_BASE}/fixtures?live=all`, { headers });
      const data = await res.json();
      return data.response || [];
    } catch (err) {
      console.error('Football Live Fetch Error:', err);
      return [];
    }
  },

  fetchFootballRecent: async () => {
    try {
      const res = await fetch(`${FOOTBALL_BASE}/fixtures?last=10`, { headers });
      const data = await res.json();
      return data.response || [];
    } catch (err) {
      console.error('Football Recent Fetch Error:', err);
      return [];
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

  fetchFootballLeagues: async () => {
    try {
      const res = await fetch(`${FOOTBALL_BASE}/leagues?current=true`, { headers });
      const data = await res.json();
      return data.response || [];
    } catch (err) {
      console.error('Football Leagues Fetch Error:', err);
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
      // Using cricketdata.org / cricapi pattern
      const res = await fetch(`${CRICKET_BASE}/currentMatches?apikey=${CRICKET_KEY}`);
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.error('Cricket Live Fetch Error:', err);
      return [];
    }
  }
};
