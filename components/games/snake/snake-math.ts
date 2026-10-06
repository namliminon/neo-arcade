export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}

export function moveSnakeHead(head: Point, dir: Direction): Point {
  switch (dir) {
    case 'UP':
      return { x: head.x, y: head.y - 1 };
    case 'DOWN':
      return { x: head.x, y: head.y + 1 };
    case 'LEFT':
      return { x: head.x - 1, y: head.y };
    case 'RIGHT':
      return { x: head.x + 1, y: head.y };
  }
}

export function checkSnakeSelfCollision(nextHead: Point, snakeBody: Point[]): boolean {
  return snakeBody.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);
}

export function isOppositeDirection(dirA: Direction, dirB: Direction): boolean {
  if (dirA === 'UP' && dirB === 'DOWN') return true;
  if (dirA === 'DOWN' && dirB === 'UP') return true;
  if (dirA === 'LEFT' && dirB === 'RIGHT') return true;
  if (dirA === 'RIGHT' && dirB === 'LEFT') return true;
  return false;
}
