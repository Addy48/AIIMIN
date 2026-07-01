const ESPN = 'https://site.api.espn.com/apis/site/v2/sports';

const fetchJSON = async (url, timeout = 7000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeoutId);
  }
};

const mapArticle = (article) => ({
  id: article.dataSourceIdentifier || article.id || article.headline,
  title: article.headline || 'Untitled',
  summary: article.description || '',
  published: article.published || null,
  image: article.images?.[0]?.url || '',
});

const fetchLeagueNews = async (sport, league, limit = 8) => {
  try {
    const payload = await fetchJSON(`${ESPN}/${sport}/${league}/news?limit=${limit}`, 7000);
    return (payload.articles || []).slice(0, limit).map(mapArticle);
  } catch (err) {
    console.warn(`[sportsNews] ${sport}/${league} failed:`, err.message);
    return [];
  }
};

export const fetchSportsNewsFeed = async () => {
  const [football, cricket] = await Promise.all([
    fetchLeagueNews('soccer', 'eng.1', 8),
    fetchLeagueNews('cricket', 'scoreboard', 8),
  ]);

  return {
    football,
    cricket,
    merged: [...football, ...cricket].slice(0, 12),
    updatedAt: new Date().toISOString(),
  };
};
