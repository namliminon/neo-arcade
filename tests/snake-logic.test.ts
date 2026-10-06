import { describe, it, expect } from 'vitest';
import { checkSnakeSelfCollision, moveSnakeHead, isOppositeDirection } from '../components/games/snake/snake-math';

describe('Snake Logic', () => {
  it('moves head correctly in directions', () => {
    expect(moveSnakeHead({ x: 10, y: 10 }, 'UP')).toEqual({ x: 10, y: 9 });
    expect(moveSnakeHead({ x: 10, y: 10 }, 'RIGHT')).toEqual({ x: 11, y: 10 });
    expect(moveSnakeHead({ x: 10, y: 10 }, 'DOWN')).toEqual({ x: 10, y: 11 });
    expect(moveSnakeHead({ x: 10, y: 10 }, 'LEFT')).toEqual({ x: 9, y: 10 });
  });

  it('detects self collision', () => {
    const snake = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 6, y: 5 }];
    expect(checkSnakeSelfCollision({ x: 5, y: 6 }, snake)).toBe(true);
    expect(checkSnakeSelfCollision({ x: 4, y: 4 }, snake)).toBe(false);
  });

  it('prevents direct 180 reverse turns', () => {
    expect(isOppositeDirection('UP', 'DOWN')).toBe(true);
    expect(isOppositeDirection('LEFT', 'RIGHT')).toBe(true);
    expect(isOppositeDirection('UP', 'LEFT')).toBe(false);
  });
});
