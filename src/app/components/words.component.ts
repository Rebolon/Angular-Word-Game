import { Component, Input } from '@angular/core';
import { Game } from '../services/word-game.interface';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'my-words',
    imports: [MatListModule],
    template: `
    <mat-list dense>
      @if (hasValidateWords()) {
        @for (word of getWords(); track word) {
          <mat-list-item>{{word}}</mat-list-item>
        }
      } @else {
        <mat-list-item>aucun</mat-list-item>
      }
    </mat-list>
  `,
    styleUrls: ['./grid.scss']
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
