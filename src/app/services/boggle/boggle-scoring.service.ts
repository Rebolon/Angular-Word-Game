import { GameScoring } from "../word-game.interface";

export class BoggleScoring implements GameScoring {
  calculateScore(words: string[]): number {
    return parseInt(words.reduce((currentScore, word) => {
      let score = currentScore ?? 0;
      switch (word.length) {
          case 3:
          case 4:
            score += 1;
            break;
          case 5:
            score += 2;
            break;
          case 6:
            score += 3;
            break;
          case 7:
            score += 5;
            break;
          default:
            if (word.length >= 8) {
              score += 11
            }
      }

      return score;
    }))
  }
}
