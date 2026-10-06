export type BoardState = (string | null)[];

export interface WinResult {
  winner: 'X' | 'O' | 'draw';
  line?: number[];
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Col 1
  [1, 4, 7], // Col 2
  [2, 5, 8], // Col 3
  [0, 4, 8], // Diag 1
  [2, 4, 6], // Diag 2
];

export function checkTicTacToeWinner(board: BoardState): WinResult | null {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as 'X' | 'O', line: combo };
    }
  }

  if (board.every((cell) => cell !== null)) {
    return { winner: 'draw' };
  }

  return null;
}
