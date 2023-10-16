import { BehaviorSubject, from, switchMap, tap } from 'rxjs';
import { Lang, db } from './database/db';
import { BoardCase, BoardConfig, Coordinates } from './word-game.interface';
import { liveQuery } from 'dexie';

// @todo where is the right place for this ?
// * in the Game ?
// * int the BoardCase ?
export class CaseBehavior {
  private selectedCases: BoardCase[] = [];
  private words: string[] = [];
  private stopped: boolean = false;
  private currentWordInSerie$: BehaviorSubject<string> = new BehaviorSubject("");
  private isRealWord$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor (private boardConfig: BoardConfig, public readonly gridCases: BoardCase[][]) {
    // I dislike this way of using Subject, but for isntance it's enough. Needs better Declarative conception instead of this
    this.currentWordInSerie$.pipe(
      tap(word => console.log('word to validate:', word)),
      switchMap((currentWordInSerie: string) => from(liveQuery(() => db.words.where("value").equalsIgnoreCase(currentWordInSerie).count()))),
      tap((value) => console.log('debug', value))
    ).subscribe((isRealWord: number) => this.isRealWord$.next(!!isRealWord))
  }

  stop(): void {
    this.stopped = true;
  }

  validateWord(): void {
    this.currentWordInSerie$.next(
      this.selectedCases.length ?
        this.selectedCases
          .reverse()
          .map((boardCase: BoardCase) => boardCase.value.value)
          .reduce((boardCaseValue, accumulator = "") => `${accumulator}${boardCaseValue}`) : '');

    if (this.isAlreadyExistingWord()) {
      throw new Error("Already existing word");
    }

    if (this.hasMinimalLenght()) {
      throw new Error("Minimal lenght not reached : 3 chars");
    }

    if (!this.isRealWord()) {
      throw new Error("Unknown word in dictionnary");
    }

    this.words.push(this.currentWordInSerie$.getValue());
    Array.from(this.selectedCases).reverse().forEach(boardCase => this.unSelectCase(boardCase))
    this.selectedCases = [];
    this.currentWordInSerie$.next("");
  }

  canSelectCase(boardCase: BoardCase): boolean {
    if (this.isStopped()) {
      return false;
    }

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
    if (this.isStopped()) {
      return false;
    }
    
    if (!this.isInTheBoard(boardCase)) {
      return false;
    }

    if (this.isLastCaseInSeries(boardCase)) {
      return true;
    }

    return false;
  }

  selectCase(boardCase: BoardCase): void {
    if (!this.canSelectCase(boardCase)) {
      console.info('CaseBehavior', 'selectCase', this.selectedCases, boardCase);
      return;
    }

    this.selectedCases.push(boardCase);
    boardCase.selectCase();
  }

  unSelectCase(boardCase: BoardCase): void {
    if (!this.canUnSelectCase(boardCase)) {
      console.info('CaseBehavior', 'unselectCase', this.selectedCases, boardCase);
      return;
    }

    this.selectedCases = this.selectedCases.filter((currentBoardCase: BoardCase) => currentBoardCase !== boardCase);
    boardCase.unSelectCase();
  }

  getWords():  string[] {
    return this.words;
  };

  public isStopped(): boolean {
    return this.stopped;
  }

  private isAlreadyExistingWord(): boolean {
    const words: string[] = this.getWords();
    const currentWord: string = this.currentWordInSerie$.getValue();

    return !!words.find((word) => word === currentWord);
  }

  private hasMinimalLenght(): boolean {
    return this.currentWordInSerie$.getValue().length < 3;
  }

  private isRealWord(): boolean {
    return this.isRealWord$.getValue();
  }

  private isInTheBoard(boardCase: BoardCase): boolean {
    return boardCase.coordinates.x >= 0 && boardCase.coordinates.x < this.boardConfig.cols
      && boardCase.coordinates.y >= 0 && boardCase.coordinates.y < this.boardConfig.rows;
  }

  private isFirstCaseInSeries(): boolean {
    return !this.selectedCases.length
  }

  private isLastCaseInSeries(boardCase: BoardCase): boolean {
    return this.selectedCases.at(-1) === boardCase;
  }

  private isAlreadyClickedCaseInCurrentSeries(boardCase: BoardCase): boolean {
    return !!this.selectedCases.find((selectedBoardCase) => selectedBoardCase === boardCase);
  }

  private isAroundLastClickedCase(boardCase: BoardCase): boolean {
    const lastClickedCase = this.selectedCases.at(-1);

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
