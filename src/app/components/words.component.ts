import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Game } from '../services/alphabet-game.interface';

@Component({
  selector: 'my-words',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
  <ng-container *ngIf="hasValidateWords()">
    <ul *ngFor="let word of getWords()" class="flex-container">
      <li>{{word}}</li>
    </ul>
  </ng-container>
  `,
  styleUrls: ['./grid.scss'],
})
export class WordsComponent {
  @Input() board!: Game;

  protected hasValidateWords(): boolean {
    return this.board && !!this.board.caseBehavior.getWords().length
  }

  protected getWords(): string[] {
    return this.board.caseBehavior.getWords();
  }
}
