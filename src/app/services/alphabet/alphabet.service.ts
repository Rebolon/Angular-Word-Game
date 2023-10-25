import { Injectable } from '@angular/core';
import { AlphabetGame, Game, BoardConfig, CaseValue, BoardCase, CaseStatus, Coordinates, GameType } from '../word-game.interface';
import { GameBehavior } from '../game-behavior.service';
import { AlphabetScoring } from './alphabet-scoring.service';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class Alphabet implements AlphabetGame {
  private readonly alphabet: CaseValue[] = [];
  private currentGame: Subject<Game> = new Subject;
  public readonly currentGame$: Observable<Game> = this.currentGame.asObservable();
  readonly gameType: GameType = GameType.Alphabet;

  constructor() {
    [...Array(26)].map((_, i) =>
      this.alphabet.push({
        value: String.fromCharCode(i + 97).toLocaleUpperCase()
      })
    );
  }

  prepare(): void {
    /*
    if (this.currentGame) {
      return this.currentGame;
    }*/

    const grid = this.getGrid();
    let values: BoardCase[][] = [];

    for (let row = 0; row < grid.rows; row++) {
      const rowValues: BoardCase[] = []
      for (let col = 0; col < grid.cols; col++) {
        rowValues.push(new BoardCase(
          {
            x: row,
            y: col,
          } as Coordinates,
          this.getRandomLetter())
        );
      }

      values[row] = rowValues;
    }

    const currentGame = {
      boardConfig: grid,
      gameBehavior: new GameBehavior(grid, values),
      scoring: new AlphabetScoring()
    }

    this.currentGame.next(currentGame);
  }

  private getRandomLetter(): CaseValue {
    return this.alphabet[
      Math.floor(Math.random() * this.alphabet.length)
    ];
  }

  private getGrid(): BoardConfig {
    return {
      rows: 5,
      cols: 5,
    };
  }
}
