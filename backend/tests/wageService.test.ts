import { suggestFairWage } from '../src/services/wageService';

describe('wageService', () => {
  it('returns rule-based fair wage when available', () => {
    const res = suggestFairWage('plumber', 'delhi');
    expect(res.fair).toBeGreaterThan(0);
    expect(res.source).toBe('rule');
  });

  it('falls back when rule is missing', () => {
    const res = suggestFairWage('unknownjob', 'unknown');
    expect(res.source).toBe('fallback');
  });
});