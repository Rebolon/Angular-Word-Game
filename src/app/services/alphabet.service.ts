import { Injectable } from '@angular/core';
import { AlphabetGame, Game, BoardConfig, CaseValue, BoardCase, CaseStatus } from './alphabet-game.interface';

@Injectable()
export class Alphabet implements AlphabetGame {
  private readonly alphabet: CaseValue[] = [];

  constructor() {
    [...Array(26)].map((_, i) =>
      this.alphabet.push({
        value: String.fromCharCode(i + 97).toLocaleUpperCase()
      })
    );
  }

  start(): Game {
    const grid = this.getGrid();
    let values: BoardCase[][] = [];

    for (let row = 0; row < grid.rows; row++) {
      const rowValues: BoardCase[] = []
      for (let col = 0; col < grid.cols; col++) {
        rowValues.push({
          coordinates: {
            x: row,
            y: col,
          },
          status: CaseStatus.CLEAR,
          value: this.getRandomLetter(),
          canBeClicked() {
            // @todo
            return true;
          }
        });
      }

      values[row] = rowValues;
    }

    return {
      gridValues: values,
      boardConfig: grid
    }
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
