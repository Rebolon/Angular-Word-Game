export interface Game {
  // @todo rename
  readonly gridValues: BoardCase[][];
  readonly boardConfig: BoardConfig;
}

export interface BoardConfig {
  readonly rows: number;
  readonly cols: number;
}

export enum CaseStatus {
  CLEAR,
  CLICKED,
}

export interface CaseValue {
  readonly value: string,
}

export interface BoardCase {
  readonly value: CaseValue,
  readonly status: CaseStatus, 
  readonly coordinates: {
    x: number,
    y: number,
  },
  canBeClicked (boardCase: BoardCase): boolean,
}

export interface AlphabetGame {
  start(): Game;

  // @deprecated
  getRandomLetter(): CaseValue;

  // @deprecated
  getGrid(): BoardConfig;
}
