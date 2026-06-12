import { describe, it, expect } from 'vitest';
import { formatAmount, formatTransactionAmount, getDateGroupLabel, formatTime } from '../src/utils/formatters';

describe('formatAmount', () => {
  it('formats thousands with dot separators', () => {
    expect(formatAmount(1378200)).toBe('1.378.200');
  });

  it('formats small numbers without separator', () => {
    expect(formatAmount(326)).toBe('326');
  });

  it('handles negative numbers', () => {
    expect(formatAmount(-15000)).toBe('-15.000');
  });

  it('handles zero', () => {
    expect(formatAmount(0)).toBe('0');
  });

  it('handles string input', () => {
    expect(formatAmount('928500')).toBe('928.500');
  });

  it('handles decimal input rounding', () => {
    expect(formatAmount(326.8)).toBe('327');
  });
});

describe('formatTransactionAmount', () => {
  it('prefixes debit with minus', () => {
    expect(formatTransactionAmount(326800, 'debit')).toBe('-326.800');
  });

  it('prefixes credit with plus', () => {
    expect(formatTransactionAmount(5000, 'credit')).toBe('+5.000');
  });
});

describe('getDateGroupLabel', () => {
  it('returns "Today" for today', () => {
    expect(getDateGroupLabel(new Date().toISOString())).toBe('Today');
  });

  it('returns "Yesterday" for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(getDateGroupLabel(yesterday.toISOString())).toBe('Yesterday');
  });

  it('returns full date for older dates', () => {
    const label = getDateGroupLabel('2020-03-23T12:00:00Z');
    expect(label).toContain('March');
    expect(label).toContain('2020');
  });
});

describe('formatTime', () => {
  it('formats time to 12-hour with am/pm', () => {
    const result = formatTime('2020-03-23T17:12:00Z');
    // Result depends on timezone, but should contain am or pm
    expect(result).toMatch(/\d{1,2}:\d{2} (am|pm)/);
  });
});
