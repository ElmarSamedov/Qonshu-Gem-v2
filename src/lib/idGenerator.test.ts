import { describe, it, expect } from 'vitest';
import { generateUserId, generateCountryId } from './idGenerator';

describe('idGenerator', () => {
  it('generates a valid UUID for user ID', () => {
    const id = generateUserId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('generates deterministic country ID', () => {
    const id1 = generateCountryId('Azerbaijan');
    const id2 = generateCountryId('Azerbaijan');
    expect(id1).toBe(id2);
    expect(id1).toContain('AZE');
  });
});
