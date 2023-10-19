import { Component, Input } from '@angular/core';
import { GameType } from '../services/word-game.interface';
import { AlphabetGame } from '../services/word-game.interface';

@Component({
  selector: 'my-title-selected-game',
  standalone: true,
  template: `
    <h2>{{getTitle()}}</h2>
  `,
})
export class TitleSelectedGameComponent {
  @Input() game!: AlphabetGame;

  protected getTitle(): string|undefined {
    switch (this.game.gameType) {
      case GameType.Alphabet:
        return "Alphabet";
      case GameType.Boggle:
        return "Boggle";
      default: 
        return undefined;  
    }
  }
}
