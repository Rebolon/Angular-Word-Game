export interface Grid {
  readonly rows: number;
  readonly cols: number;
}

export interface AlphabetGame {
  getRandomLetter(): string;
  getGrid(): Grid;
}
