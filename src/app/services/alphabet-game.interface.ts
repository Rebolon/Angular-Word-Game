import { CaseBehavior } from "./case-behavior.service";

export interface Game {
  // @todo rename
  readonly gridValues: BoardCase[][];
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
  canBeClicked(boardCase: BoardCase): boolean,
  selectCase(boardCase: BoardCase): void,
  getStatus(): CaseStatus,
  setStatus(status: CaseStatus): void,
}

export class BoardCase implements BoardCase {
  constructor(protected caseBehavior: CaseBehavior, readonly coordinates: Coordinates, readonly value: CaseValue, protected status: CaseStatus = CaseStatus.CLEAR) {}
  
  canBeClicked() {
    return this.caseBehavior.canSelectCase(this);
  }

  selectCase() {
    this.status = CaseStatus.CLICKED;
    this.caseBehavior.selectCase(this);
  }

  
  unSelectCase() {
    if (this.caseBehavior.canUnSelectCase(this)) {
      return;
    }
    
    this.status = CaseStatus.CLEAR;
    this.caseBehavior.selectCase(this);
  }

  getStatus(): CaseStatus {
    return this.status;
  }
}

export interface AlphabetGame {
  start(): Game;

  // @deprecated
  getRandomLetter(): CaseValue;

  // @deprecated
  getGrid(): BoardConfig;
}
