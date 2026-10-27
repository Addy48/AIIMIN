import { PLANS, REFERRAL, priceLine } from '../plans';
import { PRICING, ACCESS_PACKAGES, FAQS, TESTIMONIALS, HERO_TRUST_LINE, ANDROID_APP_STATUS, LAUNCH_PHASES } from '../../components/waitlist/landing/waitlistLandingData';

describe('one price list, the same as the app', () => {
  test('four plans with the app prices (Plan.plannedMonthlyInr / plannedYearlyInr)', () => {
    expect(PLANS.map((p) => [p.id, p.monthly, p.yearly])).toEqual([
      ['free', 0, 0],
      ['plus', 49, 449],
      ['pro', 99, 899],
      ['family', 179, 1599],
    ]);
  });

  test('price lines read the way the app shows them', () => {
    expect(priceLine(PLANS[0])).toBe('Free');
    expect(priceLine(PLANS[2])).toBe('₹99/month · ₹899/year');
  });

  test('planned features are shown and marked as coming, never as included today', () => {
    const pro = PLANS.find((p) => p.id === 'pro');
    expect(pro.coming).toEqual(expect.arrayContaining(['Patterns: what goes with what', 'Monthly review as a PDF']));
    pro.coming.forEach((c) => expect(pro.includes).not.toContain(c));
  });

  test('the waitlist cards come from the same list', () => {
    expect(PRICING.map((p) => p.tier)).toEqual(['Free', 'Plus', 'Pro', 'Family']);
    expect(PRICING.map((p) => p.price)).toEqual(['₹0', '₹49', '₹99', '₹179']);
  });
});

describe('public copy only promises what the ladder and the referral plan say', () => {
  const text = JSON.stringify({ PRICING, ACCESS_PACKAGES, FAQS, HERO_TRUST_LINE, ANDROID_APP_STATUS, LAUNCH_PHASES });

  test('no old tiers or prices', () => {
    ['Elite', 'Explore', 'Core tier', '₹29', '₹79', '₹59', 'Americas', 'Life OS', 'high performers', 'founding rate'].forEach((w) => expect(text).not.toContain(w));
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
