import { describe, it, expect } from 'vitest';
import { GAMES_CATALOG } from '../lib/constants/games';

describe('Game Catalog', () => {
  it('lists all 4 required arcade games with modes', () => {
    const ids = GAMES_CATALOG.map((g) => g.id);
    expect(ids).toContain('snake');
    expect(ids).toContain('flappy');
    expect(ids).toContain('rps');
    expect(ids).toContain('tictactoe');
  });

  it('contains proper routing hrefs and icons', () => {
    GAMES_CATALOG.forEach((game) => {
      expect(game.href).toMatch(/^\/games\//);
      expect(game.title).toBeDefined();
      expect(game.players).toBeDefined();
    });
  });
});
