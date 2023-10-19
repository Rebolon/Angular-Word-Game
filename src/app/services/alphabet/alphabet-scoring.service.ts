import { GameScoring } from "../word-game.interface";

export class AlphabetScoring implements GameScoring {
  calculateScore(words: string[]): number {
    return words.reduce((currentScore, word) => {
      let score = currentScore ?? 0;
      if (word.length <= 2) {
        return score;
      }

      score += word.length;

      return score;
    }, 0)  
  }
}
