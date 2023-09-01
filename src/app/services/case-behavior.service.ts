import { BoardCase, BoardConfig, CaseStatus, Coordinates } from './alphabet-game.interface';

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
    if (!this.isInTheBoard(boardCase)) {
      return false;
    }

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

  private isInTheBoard(boardCase: BoardCase): boolean {
    return boardCase.coordinates.x >= 0 && boardCase.coordinates.x < this.boardConfig.cols
      && boardCase.coordinates.y >= 0 && boardCase.coordinates.y < this.boardConfig.rows;
  }

  private isFirstCaseInSeries(): boolean {
    return !this.cases.length
  }

  private isAlreadyClickedCaseInCurrentSeries(boardCase: BoardCase): boolean {
    return !!this.cases.find((selectedBoardCase) => selectedBoardCase === boardCase);
  }

  private isAroundLastClickedCase(boardCase: BoardCase): boolean {
    const lastClickedCase = this.cases.at(-1);

    if (!lastClickedCase) {
      throw new Error('No cases in series');
    }

    const allowedCoordinates = this.buildAllowedCoordinates(lastClickedCase);

    return !!allowedCoordinates.find((coordinates) => 
      coordinates.x === boardCase.coordinates.x 
      && coordinates.y === boardCase.coordinates.y)
  }

  private buildAllowedCoordinates(lastClickedCase: BoardCase): Coordinates[] {
    const allowedCoordinates = [] as Coordinates[];
    const abscissas = this.buildAllowedCoordinatesAbscissa(lastClickedCase);
    const ordinates = this.buildAllowedCoordinatesOrdinate(lastClickedCase);

    abscissas.forEach((abscissa) => {
      ordinates.forEach((ordinate) => {
        const newCoordinate = {
          x: abscissa,
          y: ordinate
        };

        if (JSON.stringify(newCoordinate) !== JSON.stringify(lastClickedCase.coordinates)) {
          allowedCoordinates.push(newCoordinate);
        }
      })
    })
    
    return allowedCoordinates;
  }

  private buildAllowedCoordinatesAbscissa(lastClickedCase: BoardCase): number[] {
    let allowedAbscissa: number[] = [];
    for (let i=-1; i<=1; i++) {
      const newAbscissa = lastClickedCase.coordinates.x+i;
      if (newAbscissa >= 0 
        && newAbscissa < this.boardConfig.cols) {
        allowedAbscissa.push(newAbscissa);
      }
    }

    return allowedAbscissa;
  }

  private buildAllowedCoordinatesOrdinate(lastClickedCase: BoardCase): number[] {
      let allowedOrdinate: number[] = [];
      for (let i=-1; i<=1; i++) {
        const newOrdinate = lastClickedCase.coordinates.y+i;
        if (newOrdinate >= 0 
          && newOrdinate < this.boardConfig.rows) {
          allowedOrdinate.push(newOrdinate);
        }
      }
  
      return allowedOrdinate;
    }
}
