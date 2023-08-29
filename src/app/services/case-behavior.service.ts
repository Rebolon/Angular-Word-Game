import { BoardCase, BoardConfig, CaseStatus } from './alphabet-game.interface';

// @todo where is the right place for this ?
// * in the Game ?
// * int the BoardCase ?
export class CaseBehavior {
  private cases: BoardCase[] = [];
  private words: BoardCase[][] = [[]];

  constructor (private boardConfig: BoardConfig) {}

  validateWord(): void {
    if (this.isAlreadyExistingWord()) {
      return;
    }

    this.words.push(this.cases);
    this.cases = [];
  }

  canSelectCase(boardCase: BoardCase): boolean {
    if (this.isFirstCaseInSeries()) {
      return true;
    }

    if (this.isAlreadyClickedCaseInCurrentSeries(boardCase)) {
      return false;
    }

    try {
      return this.isAroundLastClickedCase(boardCase);
    } catch (error) {
      console.info('CaseBehavior', 'canSelectCase', error);
      return true;
    }
  }

  canUnSelectCase(boardCase: BoardCase): boolean {
    return this.isAlreadyClickedCaseInCurrentSeries(boardCase);
  }

  selectCase(boardCase: BoardCase): void {
    if (!this.canSelectCase(boardCase)) {
      console.info('CaseBehavior', 'selectCase', this.cases, boardCase);
      return;
    }

    this.cases.push(boardCase);
  }

  getWords():  BoardCase[][] {
    return this.words;
  };

  private isAlreadyExistingWord(): boolean {
    const words: string[] = this.words.map((boardCases) => {
      return boardCases.map((boardCase) => boardCase.value.value).reduce((boardCaseValue, acc) => acc + boardCaseValue)
    })

    const currentWord: string = this.cases.map((boardCase) => boardCase.value.value).reduce((boardCaseValue, acc) => acc + boardCaseValue);

    return !!words.find((word) => word === currentWord);
  }

  private isFirstCaseInSeries(): boolean {
    return !!this.cases.length
  }

  private isAlreadyClickedCaseInCurrentSeries(boardCase: BoardCase): boolean {
    return !!this.cases.find((selectedBoardCase) => selectedBoardCase === boardCase);
  }

  private isAroundLastClickedCase(boardCase: BoardCase): boolean {
    const lastClickedCase = this.cases.at(-1);

    if (!lastClickedCase) {
      throw new Error('No cases in series');
    }

    let allowedCoordinates = {x: [] as number[], y: [] as number[]};
    allowedCoordinates.x = this.buildAllowedCoordinatesAbscisses(boardCase);
    allowedCoordinates.y = this.buildAllowedCoordinatesOrdinates(boardCase);

    return !!(allowedCoordinates.x.find((value) => value === boardCase.coordinates.x)
      && allowedCoordinates.y.find((value) => value === boardCase.coordinates.y))
  }

  private buildAllowedCoordinatesAbscisses(lastClickedCase: BoardCase): number[] {
    let allowedCoordinates: number[] = [];
    if (lastClickedCase.coordinates.x <= 0) {
      allowedCoordinates = [0, 1, ];
    }

    if (lastClickedCase.coordinates.x <= 1) {
      allowedCoordinates = [0, 1, 2];
    }

    if (lastClickedCase.coordinates.x >= (this.boardConfig.cols-1)) {
      allowedCoordinates = [this.boardConfig.cols-2, this.boardConfig.cols-1, ];
    }

    if (lastClickedCase.coordinates.x >= (this.boardConfig.cols-2)) {
      allowedCoordinates = [this.boardConfig.cols-2, this.boardConfig.cols-1, this.boardConfig.cols, ];
    }

    return allowedCoordinates;
  }

  private buildAllowedCoordinatesOrdinates(lastClickedCase: BoardCase): number[] {
      let allowedCoordinates: number[] = [];
      if (lastClickedCase.coordinates.y <= 0) {
        allowedCoordinates = [0, 1, ];
      }
  
      if (lastClickedCase.coordinates.y <= 1) {
        allowedCoordinates = [0, 1, 2];
      }
  
      if (lastClickedCase.coordinates.y >= (this.boardConfig.rows-1)) {
        allowedCoordinates = [this.boardConfig.rows-2, this.boardConfig.rows-1, ];
      }
  
      if (lastClickedCase.coordinates.y >= (this.boardConfig.rows-2)) {
        allowedCoordinates = [this.boardConfig.rows-2, this.boardConfig.rows-1, this.boardConfig.rows, ];
      }
  
      return allowedCoordinates;
    }
}
