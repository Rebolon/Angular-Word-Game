import { GameType } from "./game.model";
import { CaseBehavior } from "./case-behavior.service";

export interface Game {
  readonly boardConfig: BoardConfig;
  readonly caseBehavior: CaseBehavior;
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

export interface AlphabetGame {
  readonly gameType: GameType;

  start(): Game;

  // @deprecated
  getRandomLetter(): CaseValue;

  // @deprecated
  getGrid(): BoardConfig;
}
