import { parseESPNEvents, fetchJSON } from './server/services/sportsCacheService.js';
(async () => {
  try {
    const f1Data = await fetchJSON('https://site.api.espn.com/apis/site/v2/sports/racing/f1/scoreboard');
    console.log(f1Data.events[0].name);
  } catch (e) {
    console.error(e);
  }
})();
