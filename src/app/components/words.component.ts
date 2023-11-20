import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Game } from '../services/word-game.interface';

@Component({
  selector: 'my-words',
  standalone: true,
  imports: [],
  template: `
  @if (hasValidateWords()) {
    <ul class="flex-container">
      @for (word of getWords(); track word) {
      <li>{{word}}</li>
      }
    </ul>
  }
  `,
  styleUrls: ['./grid.scss'],
})
export class WordsComponent {
  @Input() board!: Game;

  protected hasValidateWords(): boolean {
    return this.board && !!this.board.gameBehavior.getWords().length
  }

  protected getWords(): string[] {
    return this.board.gameBehavior.getWords();
  }
}
