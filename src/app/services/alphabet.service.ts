import { Injectable } from '@angular/core';
import { AlphabetGame, Game, BoardConfig, CaseValue, BoardCase, CaseStatus, Coordinates } from './alphabet-game.interface';
import { CaseBehavior } from './case-behavior.service';

@Injectable()
export class Alphabet implements AlphabetGame {
  private readonly alphabet: CaseValue[] = [];
  private currentGame!: Game;

  constructor() {
    [...Array(26)].map((_, i) =>
      this.alphabet.push({
        value: String.fromCharCode(i + 97).toLocaleUpperCase()
      })
    );
  }

  start(): Game {
    if (this.currentGame) {
      return this.currentGame;
    }

    const grid = this.getGrid();
    let values: BoardCase[][] = [];
    const caseBehavior = new CaseBehavior(grid);

    for (let row = 0; row < grid.rows; row++) {
      const rowValues: BoardCase[] = []
      for (let col = 0; col < grid.cols; col++) {
        rowValues.push(new BoardCase(
          caseBehavior,
          {
            x: row,
            y: col,
          } as Coordinates,
          this.getRandomLetter())
        );
      }

      values[row] = rowValues;
    }

    this.currentGame = {
      gridValues: values,
      boardConfig: grid,
      caseBehavior
    }

    return this.currentGame;
  }

  // @deprecated to move private
  getRandomLetter(): CaseValue {
    return this.alphabet[
      Math.floor(Math.random() * this.alphabet.length)
    ];
  }

  // @deprecated to move private
  getGrid(): BoardConfig {
    return {
      rows: 5,
      cols: 5,
    };
  }
}
