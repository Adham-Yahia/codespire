import { cleanToken } from '../api';

describe('API Service - Token Sanitization & Header Hygiene', () => {
  test('cleanToken strips surrounding whitespace', () => {
    expect(cleanToken('   eyJhbGciOi...   ')).toBe('eyJhbGciOi...');
  });

  test('cleanToken strips wrapping quotes', () => {
    expect(cleanToken('"eyJhbGciOi..."')).toBe('eyJhbGciOi...');
    expect(cleanToken('""eyJhbGciOi...""')).toBe('eyJhbGciOi...');
  });

  test('cleanToken strips duplicate or accidental Bearer prefix', () => {
    expect(cleanToken('Bearer eyJhbGciOi...')).toBe('eyJhbGciOi...');
    expect(cleanToken('bearer eyJhbGciOi...')).toBe('eyJhbGciOi...');
    expect(cleanToken('   Bearer   "eyJhbGciOi..."  ')).toBe('eyJhbGciOi...');
  });

  test('cleanToken returns null for empty or null strings', () => {
    expect(cleanToken('')).toBeNull();
    expect(cleanToken('   ')).toBeNull();
    expect(cleanToken(null)).toBeNull();
    expect(cleanToken(undefined)).toBeNull();
    expect(cleanToken('null')).toBeNull();
    expect(cleanToken('undefined')).toBeNull();
  });
});
