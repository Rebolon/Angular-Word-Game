import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AlphabetGame } from '../services/alphabet-game.interface';
import { LetterComponent } from './letter.component';

// This component fails because of Changes after view... It build twice the letter, but value of letter change between the 2 pass.
@Component({
  selector: 'my-grid',
  standalone: true,
  imports: [NgFor, LetterComponent],
  template: `
  <div *ngFor="let row of getRows()" class="flex-container">
    <my-letter *ngFor="let col of getCols(row)" [value]="game.getRandomLetter()"></my-letter>
  </div>
  `,
  styleUrls: ['./grid.scss'],
})
export class GridFailingComponent {
  @Input({ required: true }) game!: AlphabetGame;
  protected grid = Array<string[]>
  
  protected getRows(): Array<string> {
    return Array(this.game.getGrid().rows).fill(1).map((_, i) => i.toString());
  }

  protected getCols(row: string): Array<string> {
    return Array(this.game.getGrid().cols).fill(row).map((v, i) => `${i}${v}`);
  }
}
