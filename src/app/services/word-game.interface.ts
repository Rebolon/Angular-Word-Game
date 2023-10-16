export interface Game {
  readonly boardConfig: BoardConfig;
  readonly gameBehavior: GameBehavior; // @todo remove this from Game it should be a service thta interact with component
  readonly scoring: GameScoring;
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

export interface Coordinates {
  x: number,
  y: number,
}

export interface GameBehavior {
  readonly gridCases: BoardCase[][]
  stop(): void
  isStopped(): boolean
  validateWord(): void
  cancelSelectedWord(): void
  canSelectCase(boardCase: BoardCase): boolean
  canUnSelectCase(boardCase: BoardCase): boolean
  selectCase(boardCase: BoardCase): void
  unSelectCase(boardCase: BoardCase): void
  getWords(): string[]
}

export interface BoardCase {
  readonly coordinates: Coordinates,
  readonly value: CaseValue,
  selectCase(): void,
  unSelectCase(): void,
  getStatus(): CaseStatus,
}

export class BoardCase implements BoardCase {
  constructor(readonly coordinates: Coordinates, readonly value: CaseValue, protected status: CaseStatus = CaseStatus.CLEAR) {}
  
  selectCase(): void {
    this.status = CaseStatus.CLICKED;
  }
  
  unSelectCase(): void { 
    this.status = CaseStatus.CLEAR;
  }

  getStatus(): CaseStatus {
    return this.status;
  }
}

export enum GameType {
  Alphabet,
  Boggle,
}

export const GameType2LabelMapping: Record<GameType, string> = {
  [GameType.Alphabet]: "Alphabet",
  [GameType.Boggle]: "Boggle",
};

export interface AlphabetGame {
  readonly gameType: GameType;

  prepare(): Game;
}

export interface GameScoring {
  calculateScore(words: string[]): number;
}
