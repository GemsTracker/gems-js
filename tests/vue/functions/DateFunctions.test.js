import { describe, it, expect, vi } from 'vitest';

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn().mockReturnValue({ locale: { value: 'en' } }),
}));

import { useI18n } from 'vue-i18n';
import useDateFunctions from '../../../src/vue/functions/DateFunctions';

// -------------------------------------------------------------------
// parseDateString
// -------------------------------------------------------------------
describe('parseDateString', () => {
  const { parseDateString } = useDateFunctions('en');

  it('parses an ISO datetime with timezone', () => {
    expect(parseDateString('2026-02-16T18:55:12Z')).toBeInstanceOf(Date);
  });

  it('parses an ISO datetime without timezone', () => {
    const date = parseDateString('2026-02-16T18:55:12');
    expect(date.getHours()).toBe(18);
    expect(date.getMinutes()).toBe(55);
  });

  it('parses a MySQL datetime (yyyy-MM-dd HH:mm:ss)', () => {
    const date = parseDateString('2026-02-16 18:55:12');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(1);
    expect(date.getDate()).toBe(16);
    expect(date.getHours()).toBe(18);
  });

  it('parses a MySQL datetime without seconds (yyyy-MM-dd HH:mm)', () => {
    const date = parseDateString('2026-02-16 18:55');
    expect(date.getHours()).toBe(18);
    expect(date.getSeconds()).toBe(0);
  });

  it('parses a MySQL date (yyyy-MM-dd)', () => {
    const date = parseDateString('2026-02-16');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(1);
    expect(date.getDate()).toBe(16);
  });

  it('does not use browser-native parsing for space-separated strings', () => {
    const date = parseDateString('2026-02-16 18:55:12');
    expect(date).toBeInstanceOf(Date);
    expect(date.getFullYear()).toBe(2026);
  });

  it('throws on an unparseable string', () => {
    expect(() => parseDateString('not-a-date')).toThrow('Unable to parse date string');
  });

  it('throws with the offending string in the error message', () => {
    expect(() => parseDateString('not-a-date')).toThrow('"not-a-date"');
  });
});

// -------------------------------------------------------------------
// formatIsoDate
// -------------------------------------------------------------------
describe('formatIsoDate', () => {
  const { formatIsoDate } = useDateFunctions('en');

  it('returns null for null input', () => {
    expect(formatIsoDate(null)).toBeNull();
  });

  it('formats a Date object to ISO string', () => {
    const date = new Date(2026, 1, 16, 18, 55, 12);
    expect(formatIsoDate(date)).toMatch(/^2026-02-16T18:55:12/);
  });

  it('formats a MySQL datetime string to ISO string', () => {
    expect(formatIsoDate('2026-02-16 18:55:12')).toMatch(/^2026-02-16T18:55:12/);
  });

  it('includes a timezone offset in the output', () => {
    expect(formatIsoDate('2026-02-16 18:55:12')).toMatch(/[+-]\d{2}:\d{2}$/);
  });
});

// -------------------------------------------------------------------
// formatJsonDateTime
// -------------------------------------------------------------------
describe('formatJsonDateTime', () => {
  it('returns null for null input', () => {
    const { formatJsonDateTime } = useDateFunctions('en');
    expect(formatJsonDateTime(null)).toBeNull();
  });

  it('formats to default format (dd-MM-yyyy HH:mm:ss)', () => {
    const { formatJsonDateTime } = useDateFunctions('en');
    expect(formatJsonDateTime('2026-02-16 18:55:12')).toBe('16-02-2026 18:55:12');
  });

  it('accepts a custom format string', () => {
    const { formatJsonDateTime } = useDateFunctions('en');
    expect(formatJsonDateTime('2026-02-16 18:55:12', 'yyyy/MM/dd')).toBe('2026/02/16');
  });

  it('formats month name in English', () => {
    const { formatJsonDateTime } = useDateFunctions('en');
    expect(formatJsonDateTime('2026-02-16 18:55:12', 'dd MMMM yyyy')).toBe('16 February 2026');
  });

  it('formats month name in Dutch', () => {
    const { formatJsonDateTime } = useDateFunctions('nl');
    expect(formatJsonDateTime('2026-02-16 18:55:12', 'dd MMMM yyyy')).toBe('16 februari 2026');
  });

  it('falls back to English for an unsupported locale', () => {
    const { formatJsonDateTime } = useDateFunctions('fr');
    expect(formatJsonDateTime('2026-02-16 18:55:12', 'dd MMMM yyyy')).toBe('16 février 2026');
  });
});

// -------------------------------------------------------------------
// formatJsonDate
// -------------------------------------------------------------------
describe('formatJsonDate', () => {
  const { formatJsonDate } = useDateFunctions('en');

  it('returns null for null input', () => {
    expect(formatJsonDate(null)).toBeNull();
  });

  it('formats a MySQL datetime string to dd-MM-yyyy', () => {
    expect(formatJsonDate('2026-02-16 18:55:12')).toBe('16-02-2026');
  });

  it('formats a MySQL date string to dd-MM-yyyy', () => {
    expect(formatJsonDate('2026-02-16')).toBe('16-02-2026');
  });

  it('formats an ISO string to dd-MM-yyyy', () => {
    expect(formatJsonDate('2026-02-16T18:55:12Z')).toBe('16-02-2026');
  });
});

// -------------------------------------------------------------------
// useI18n integration (no localeOverride)
// -------------------------------------------------------------------
describe('useI18n integration', () => {
  it('uses the locale from useI18n when no override is provided', () => {
    useI18n.mockReturnValue({ locale: { value: 'nl' } });
    const { formatJsonDateTime } = useDateFunctions();
    expect(formatJsonDateTime('2026-02-16 18:55:12', 'dd MMMM yyyy')).toBe('16 februari 2026');
  });
});

// parseDateString with explicit format
describe('parseDateString with explicit format', () => {
  const { parseDateString } = useDateFunctions('en');

  it('parses correctly when a valid format is provided', () => {
    const date = parseDateString('16-02-2026', 'dd-MM-yyyy');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(1);
    expect(date.getDate()).toBe(16);
  });

  it('parses a datetime with an explicit format', () => {
    const date = parseDateString('16-02-2026 18:55:12', 'dd-MM-yyyy HH:mm:ss');
    expect(date.getHours()).toBe(18);
    expect(date.getMinutes()).toBe(55);
    expect(date.getSeconds()).toBe(12);
  });

  it('throws when the string does not match the explicit format', () => {
    expect(() => parseDateString('2026-02-16', 'dd-MM-yyyy'))
        .toThrow('Unable to parse date string: "2026-02-16" in format "dd-MM-yyyy"');
  });

  it('throws with both the offending string and format in the error message', () => {
    expect(() => parseDateString('not-a-date', 'dd-MM-yyyy'))
        .toThrow('"not-a-date"');
  });

  it('does not fall through to auto-detection when a format is provided', () => {
    // '2026-02-16 18:55:12' would parse fine in auto mode,
    // but should throw when given the wrong explicit format
    expect(() => parseDateString('2026-02-16 18:55:12', 'dd-MM-yyyy'))
        .toThrow('Unable to parse date string');
  });
});