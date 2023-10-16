import { Injectable } from '@angular/core';
import { AlphabetGame, BoardCase, BoardConfig, CaseStatus, CaseValue, Game, GameType } from '../word-game.interface';
import { CaseBehavior } from '../case-behavior.service';
import { BoggleScoring } from './boggle-scoring.service';

@Injectable()
export class Boggle implements AlphabetGame {
  readonly gameType: GameType = GameType.Boggle;
  private readonly alphabet: CaseValue[][] = [];
  private alphabetDices: CaseValue[][] = [];
  private currentGame!: Game;

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
    if (this.currentGame) {
      return this.currentGame;
    }

    const grid = this.getGrid();
    let values: BoardCase[][] = []

    for (let row = 0; row < grid.rows; row++) {
      const rowValues: BoardCase[] = []
      for (let col = 0; col < grid.cols; col++) {
        rowValues.push(new BoardCase(
          {
            x: row,
            y: col,
          },
          this.getRandomLetter())
        );
      }

      values[row] = rowValues;
    }

    this.currentGame = {
      boardConfig: grid,
      caseBehavior: new CaseBehavior(grid, values),
      scoring: new BoggleScoring()
    }

    return this.currentGame;
  }

  // @deprecated to move private
  private getRandomLetter(): CaseValue {
    const dice = this.pickDice();

    return dice[Math.floor(Math.random() * dice.length)];
  }

  // @deprecated to move private
  private getGrid(): BoardConfig {
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
