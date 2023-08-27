import { Injectable } from '@angular/core';
import { AlphabetGame, BoardCase, BoardConfig, CaseStatus, CaseValue, Game } from './alphabet-game.interface';

@Injectable()
export class Boggle implements AlphabetGame {
  private readonly alphabet: CaseValue[][] = [];

  private alphabetDices: CaseValue[][] = [];

  constructor() {
    const letters = [
      ['E', 'T', 'U', 'K', 'N', 'O'],
      ['E', 'V', 'G', 'T', 'I', 'N'],
      ['D', 'E', 'C', 'A', 'M', 'P'],
      ['I', 'E', 'L', 'R', 'U', 'W'],
      ['E', 'H', 'I', 'F', 'S', 'E'],
      ['R', 'E', 'C', 'A', 'L', 'S'],
      ['E', 'N', 'T', 'D', 'O', 'S'],
      ['O', 'F', 'X', 'R', 'I', 'A'],
      ['N', 'A', 'V', 'E', 'D', 'Z'],
      ['E', 'I', 'O', 'A', 'T', 'A'],
      ['G', 'L', 'E', 'N', 'Y', 'U'],
      ['B', 'M', 'A', 'Q', 'J', 'O'],
      ['T', 'L', 'I', 'B', 'R', 'A'],
      ['S', 'P', 'U', 'L', 'T', 'E'],
      ['A', 'I', 'M', 'S', 'O', 'R'],
      ['E', 'N', 'H', 'R', 'I', 'S']
    ];

    for (let row = 0; row < letters.length; row++) {
      const rowValues: CaseValue[] = [];
      for (let col = 0; col < letters[row].length; col++) {
        rowValues.push({
          value: letters[row][col],
        })
      }

      this.alphabet[row] = rowValues;
    }

    this.alphabetDices = structuredClone(this.alphabet);
  }

  start(): Game {
    const grid = this.getGrid();
    let values: BoardCase[][] = []

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
    const dice = this.pickDice();

    return dice[Math.floor(Math.random() * dice.length)];
  }

  // @deprecated to move private
  getGrid(): BoardConfig {
    return {
      rows: 4,
      cols: 4,
    };
  }

  private pickDice(): CaseValue[] {
    const diceIndex = Math.floor(Math.random() * this.alphabetDices.length);
    const diceValues = this.alphabetDices[diceIndex];
    this.alphabetDices.splice(diceIndex, 1);

    return diceValues;
  }
}
