import { describe, it, expect } from 'vitest';
import { determineRpsWinner, RpsMove } from '../components/games/rps/rps-rules';

describe('RPS Winner Rules', () => {
  it('resolves rock, paper, scissors matchups', () => {
    expect(determineRpsWinner('rock', 'scissors')).toBe('p1');
    expect(determineRpsWinner('scissors', 'paper')).toBe('p1');
    expect(determineRpsWinner('paper', 'rock')).toBe('p1');
    expect(determineRpsWinner('rock', 'rock')).toBe('draw');
    expect(determineRpsWinner('scissors', 'scissors')).toBe('draw');
    expect(determineRpsWinner('paper', 'paper')).toBe('draw');
    expect(determineRpsWinner('rock', 'paper')).toBe('p2');
    expect(determineRpsWinner('scissors', 'rock')).toBe('p2');
    expect(determineRpsWinner('paper', 'scissors')).toBe('p2');
  });
});
