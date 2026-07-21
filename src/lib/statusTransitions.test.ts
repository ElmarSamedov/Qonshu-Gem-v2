import { describe, it, expect } from 'vitest';
import { isValidTransition } from './statusTransitions';

describe('statusTransitions', () => {
  it('allows pending to resolved', () => {
    expect(isValidTransition('pending', 'resolved')).toBe(true);
  });

  it('allows pending to dismissed', () => {
    expect(isValidTransition('pending', 'dismissed')).toBe(true);
  });

  it('allows reopening resolved', () => {
    expect(isValidTransition('resolved', 'pending')).toBe(true);
  });

  it('allows reopening dismissed', () => {
    expect(isValidTransition('dismissed', 'pending')).toBe(true);
  });

  it('prevents resolved to dismissed directly', () => {
    expect(isValidTransition('resolved', 'dismissed')).toBe(false);
  });
});
