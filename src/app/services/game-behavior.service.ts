import { BehaviorSubject, Observable, from, map, of, switchMap, tap } from 'rxjs';
import { Lang, db } from './database/db';
import { BoardCase, BoardConfig, Coordinates, GameBehavior as GameBehaviorI } from './word-game.interface';
import { liveQuery } from 'dexie';

// @todo where is the right place for this ?
// * in the Game ?
// * int the BoardCase ?
export class GameBehavior implements GameBehaviorI {
  private selectedCases: BoardCase[] = [];
  private words: string[] = [];
  private stopped: boolean = false;
  private currentWordInSerie$: BehaviorSubject<string> = new BehaviorSubject("");
  private isRealWord$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  debugCurrentWordInSerie$ = this.currentWordInSerie$.asObservable();
  debugIsRealWord$ = this.isRealWord$.asObservable()

  constructor (private boardConfig: BoardConfig, public readonly gridCases: BoardCase[][]) {
  }

  stop(): void {
    this.stopped = true;
  }

  validateWord(): Observable<boolean> {
    // @todo le pb ici est que l'on inject le mot dans le Subject, qu'il est lu par le stream du constructeur, mais que la partie 
    // query sur l'IndexedDb est asynchrone, ce qui place la demande dans l'eventLoop et on reprend l'execution du code ici
    // et on repart dans la Query quand elle a répondu
    // => pour corriger ça on peut supprimer le currentWordInSeries$ qui sert à rien
    // On execute les premiers checks
    // Puis on subscribe à la query sur IndexedDb et 
    // Si ça marche on fait la tambouille d'ajout du mot et du clean
    // Si ça marche pas on fait rien et on renvoi juste une erreur qui sera utilisé par le composant
    const selectedCases = Array.from(this.selectedCases)
    const currentWord = selectedCases.length ?
        selectedCases
          .reverse()
          .map((boardCase: BoardCase) => boardCase.value.value)
          .reduce((boardCaseValue, accumulator = "") => `${accumulator}${boardCaseValue}`) : '';

    if (this.isAlreadyExistingWord(currentWord)) {
      throw new Error("Already existing word");
    }

    if (this.hasMinimalLenght(currentWord)) {
      throw new Error("Minimal lenght not reached : 3 chars");
    }

    return this.isRealWord(currentWord).pipe(
      tap((isRealWord: boolean) => {
        if (isRealWord) {
          this.words.push(currentWord);
          this.cancelSelectedWord();

          return of(isRealWord)
        } else {
          throw new Error("Unknown word in dictionnary");
        }
      })
    )
  }

  cancelSelectedWord(): void {
    Array.from(this.selectedCases).reverse().forEach(boardCase => this.unSelectCase(boardCase))
    this.selectedCases = [];
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

  private isAlreadyExistingWord(currentWord: string): boolean {
    const words: string[] = this.getWords();

    console.log('isAlreadyExistingWord', words, currentWord);

    return !!words.find((word) => word === currentWord);
  }

  private hasMinimalLenght(currentWord: string): boolean {
    console.log('hasMinimalLenght', currentWord)
    return currentWord.length < 3;
  }

  private isRealWord(currentWord: string): Observable<boolean> {
    return from(liveQuery(() => db.words.where("value").equalsIgnoreCase(currentWord).count())).pipe(
      tap((value) => console.log('isRealWord', value)),
      map((value: number) => !!value)
    )
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
