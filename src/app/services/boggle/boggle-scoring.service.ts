import { GameScoring } from "../word-game.interface";

export class BoggleScoring implements GameScoring {
  calculateScore(words: string[]): number {
    return words.reduce((currentScore, word) => {;
      switch (word.length) {
          case 3:
          case 4:
            currentScore += 1;
            break;
          case 5:
            currentScore += 2;
            break;
          case 6:
            currentScore += 3;
            break;
          case 7:
            currentScore += 5;
            break;
          default:
            if (word.length >= 8) {
              currentScore += 11
            }
      }

      return currentScore;
    }, 0)
  }
}
