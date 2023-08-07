import { NgFor } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AlphabetGame } from '../services/alphabet-game.interface';
import { LetterComponent } from './letter.component';

@Component({
  selector: 'my-grid',
  standalone: true,
  imports: [NgFor, LetterComponent],
  template: `
  <div *ngFor="let row of values" class="flex-container">
    <my-letter *ngFor="let col of row" [value]="col"></my-letter>
  </div>
  `,
  styleUrls: ['./grid.scss'],
})
export class GridComponent implements OnChanges{
  @Input({ required: true }) game!: AlphabetGame;
  protected values: Array<string[]> = [];

  public ngOnChanges(): void {
    if (!this.game) {
      return;
    }
    
    for (let row = 0; row < this.game.getGrid().rows; row++) {
      for (let col = 0; col < this.game.getGrid().cols; col++) {
        if (!this.values[row]) {
          this.values[row] = [];
        }
        this.values[row][col] = this.game.getRandomLetter();
      }
    }
  }
}
