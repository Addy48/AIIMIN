import { PLANS, REFERRAL, REGIONS, priceLine, regionForCountry, regionFromTimeZone, regionPrice, money } from '../plans';
import { PRICING, ACCESS_PACKAGES, FAQS, TESTIMONIALS, HERO_TRUST_LINE, ANDROID_APP_STATUS, LAUNCH_PHASES } from '../../components/waitlist/landing/waitlistLandingData';

describe('one price list, the same as the app', () => {
  test('four plans with the app prices (Plan.plannedMonthlyInr / plannedYearlyInr)', () => {
    expect(PLANS.map((p) => [p.id, p.monthly, p.yearly])).toEqual([
      ['free', 0, 0],
      ['plus', 59, 399],
      ['pro', 119, 799],
      ['family', 199, 1299],
    ]);
  });

  test('price lines read the way the app shows them', () => {
    expect(priceLine(PLANS[0])).toBe('Free');
    expect(priceLine(PLANS[2])).toBe('₹119/month · ₹799/year');
  });

  test('planned features are shown and marked as coming, never as included today', () => {
    const pro = PLANS.find((p) => p.id === 'pro');
    expect(pro.coming).toEqual(expect.arrayContaining(['Patterns: what goes with what', 'Monthly review as a PDF']));
    pro.coming.forEach((c) => expect(pro.includes).not.toContain(c));
  });

  test('the waitlist cards come from the same list', () => {
    expect(PRICING.map((p) => p.tier)).toEqual(['Free', 'Plus', 'Pro', 'Family']);
    expect(PRICING.map((p) => p.price)).toEqual(['₹0', '₹59', '₹119', '₹199']);
  });
});

describe('public copy only promises what the ladder and the referral plan say', () => {
  const text = JSON.stringify({ PRICING, ACCESS_PACKAGES, FAQS, HERO_TRUST_LINE, ANDROID_APP_STATUS, LAUNCH_PHASES });

  test('no old tiers or prices', () => {
    ['Elite', 'Explore', 'Core tier', 'Americas', 'Life OS', 'high performers', 'founding rate'].forEach((w) => expect(text).not.toContain(w));
    [/₹29(?![\d,])/, /₹79(?![\d,])/].forEach((r) => expect(text).not.toMatch(r));
  });

  test('no unverifiable tester quotes', () => {
    expect(TESTIMONIALS).toEqual([]);
  });

  test('the referral rewards are stated exactly', () => {
    expect(REFERRAL.friendGets).toBe('1 month of Plus on us');
    expect(REFERRAL.tiers.map((t) => t.friends)).toEqual([1, 3, 10]);
    expect(text).toContain('3 months of Plus on us');
  });
});

describe('prices follow where the visitor is', () => {
  test('the connection country picks the region', () => {
    expect(regionForCountry('IN')).toBe('in');
    expect(['US', 'GB', 'DE', 'AE', 'SG', 'JP', 'AU'].map(regionForCountry)).toEqual(Array(7).fill('z1'));
    expect(['BR', 'MX', 'PL', 'TR', 'ZA'].map(regionForCountry)).toEqual(Array(5).fill('z2'));
    expect(['MY', 'TH', 'ID', 'PH', 'VN'].map(regionForCountry)).toEqual(Array(5).fill('sea'));
    expect(['PK', 'BD', 'LK', 'NG', 'KE'].map(regionForCountry)).toEqual(Array(5).fill('z3'));
    expect(regionForCountry('')).toBe('z2');
  });

  test('the time zone is only a first guess', () => {
    expect(regionFromTimeZone('Asia/Kolkata')).toBe('in');
    expect(regionFromTimeZone('America/New_York')).toBe('z1');
    expect(regionFromTimeZone('Asia/Karachi')).toBe('z3');
    expect(regionFromTimeZone('America/Sao_Paulo')).toBe('z2');
    expect(regionFromTimeZone('Asia/Kuala_Lumpur')).toBe('sea');
  });

  test('every region prices every paid plan, yearly cheaper than 12 months', () => {
    Object.values(REGIONS).forEach((r) => ['plus', 'pro', 'family'].forEach((id) => {
      const [m, y] = r[id];
      expect(y).toBeLessThan(m * 12);
      if (r.currency === 'USD') expect(y).toBeGreaterThan(m * 6);
    }));
    const pro = PLANS.find((p) => p.id === 'pro');
    expect(regionPrice(pro, 'in')).toEqual({ monthly: 119, yearly: 799 });
    expect(money(regionPrice(pro, 'z1').yearly, 'z1')).toBe('$54.99');
    expect(money(149, 'z1')).toBe('$149');
  });
});
