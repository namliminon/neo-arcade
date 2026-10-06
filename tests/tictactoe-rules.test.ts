import { describe, it, expect } from 'vitest';
import { checkTicTacToeWinner } from '../components/games/tictactoe/tictactoe-rules';

describe('TicTacToe Win Conditions', () => {
  it('detects row win', () => {
    const board = [
      'X', 'X', 'X',
      null, null, null,
      null, null, null,
    ];
    const res = checkTicTacToeWinner(board);
    expect(res?.winner).toBe('X');
    expect(res?.line).toEqual([0, 1, 2]);
  });

  it('detects diagonal win', () => {
    const board = [
      'O', null, null,
      null, 'O', null,
      null, null, 'O',
    ];
    const res = checkTicTacToeWinner(board);
    expect(res?.winner).toBe('O');
    expect(res?.line).toEqual([0, 4, 8]);
  });

  it('detects draw when full and no winner', () => {
    const board = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X',
    ];
    const res = checkTicTacToeWinner(board);
    expect(res?.winner).toBe('draw');
  });

  it('returns null if game still in progress', () => {
    const board = [
      'X', 'O', null,
      null, null, null,
      null, null, null,
    ];
    expect(checkTicTacToeWinner(board)).toBeNull();
  });
});
