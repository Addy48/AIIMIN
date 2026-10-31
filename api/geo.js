/**
 * GET /api/geo → { country: "IN" } from Vercel's own edge geo header. First-party and IP-free:
 * the address never leaves Vercel and nothing is stored. The website uses it to pick the price region.
 */
module.exports = (req, res) => {
  const country = String(req.headers['x-vercel-ip-country'] || '').toUpperCase().slice(0, 2) || null;
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = 200;
  res.end(JSON.stringify({ country }));
};
