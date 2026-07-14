import { describe, it, expect } from 'vitest';
import { isValidEmail } from '../js/login.js';

describe('isValidEmail', () => {
  it('acepta un email con formato válido', () => {
    expect(isValidEmail('iker@f5bootcamp.com')).toBe(true);
  });

  it('rechaza un email sin arroba', () => {
    expect(isValidEmail('iker-f5bootcamp.com')).toBe(false);
  });

  it('rechaza un email sin dominio', () => {
    expect(isValidEmail('iker@')).toBe(false);
  });

  it('rechaza un email con espacios', () => {
    expect(isValidEmail('iker @f5bootcamp.com')).toBe(false);
  });

  it('rechaza un string vacío', () => {
    expect(isValidEmail('')).toBe(false);
  });
});