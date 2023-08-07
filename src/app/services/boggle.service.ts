import { Injectable } from '@angular/core';
import { AlphabetGame, Grid } from './alphabet-game.interface';

@Injectable()
export class Boggle implements AlphabetGame {
  private counter = 0;
  private alphabet: Array<string[]> = [
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
    ['E', 'N', 'H', 'R', 'I', 'S'],
  ];

  getRandomLetter(): string {
    const dice = this.pickDice();

    return dice[Math.floor(Math.random() * dice.length)];
  }

  getGrid(): Grid {
    return {
      rows: 3,
      cols: 3,
    };
  }

  private pickDice(): Array<string> {
    if (this.counter > 10) {
      debugger;
    }

    const diceIndex = Math.floor(Math.random() * this.alphabet.length);
    const diceValues = this.alphabet[diceIndex];
    this.alphabet.splice(diceIndex, 1);

    return diceValues;
  }
}
