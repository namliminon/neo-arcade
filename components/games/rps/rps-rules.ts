export type RpsMove = 'rock' | 'paper' | 'scissors';
export type RpsResult = 'p1' | 'p2' | 'draw';

export function determineRpsWinner(p1Move: RpsMove, p2Move: RpsMove): RpsResult {
  if (p1Move === p2Move) return 'draw';

  if (
    (p1Move === 'rock' && p2Move === 'scissors') ||
    (p1Move === 'scissors' && p2Move === 'paper') ||
    (p1Move === 'paper' && p2Move === 'rock')
  ) {
    return 'p1';
  }

  return 'p2';
}

export const RPS_MOVE_ICONS: Record<RpsMove, { label: string; emoji: string }> = {
  rock: { label: 'Búa', emoji: '✊' },
  paper: { label: 'Bao', emoji: '🖐️' },
  scissors: { label: 'Kéo', emoji: '✌️' },
};
