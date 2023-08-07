import { Injectable } from '@angular/core';
import { AlphabetGame, Grid } from './alphabet-game.interface';

@Injectable()
export class Alphabet implements AlphabetGame {
  private alphabet: Array<string> = [];

  constructor() {
    [...Array(26)].map((_, i) =>
      this.alphabet.push(String.fromCharCode(i + 97))
    );
  }

  getRandomLetter(): string {
    return this.alphabet[
      Math.floor(Math.random() * this.alphabet.length)
    ].toLocaleUpperCase();
  }

  getGrid(): Grid {
    return {
      rows: 5,
      cols: 5,
    };
  }
}
