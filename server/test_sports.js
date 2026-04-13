import { updateSportsCache } from './services/sportsCacheService.js';
async function test() {
  console.log("Updating sports cache...");
  const data = await updateSportsCache();
  console.log("Football events:", data.football.length > 0 ? data.football[0].events.length : 0);
  console.log("Cricket events:", data.cricket.length > 0 ? data.cricket[0].events.length : 0);
  console.log("Basketball events:", data.basketball.length > 0 ? data.basketball[0].events.length : 0);
  console.log("F1 upcoming:", data.f1.upcoming.length);
  process.exit(0);
}
test().catch(console.error);
