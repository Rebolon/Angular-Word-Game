import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AlphabetGame, BoardCase, Game } from '../services/alphabet-game.interface';
import { LetterComponent } from './letter.component';

@Component({
  selector: 'my-grid',
  standalone: true,
  imports: [NgFor, NgIf, LetterComponent],
  template: `
  <ng-template *ngIf="board">
    <div *ngFor="let row of board.gridValues" class="flex-container">
      <my-letter *ngFor="let col of row" [value]="col"></my-letter>
    </div>
  </ng-template>
  `,
  styleUrls: ['./grid.scss'],
})
export class GridComponent implements OnInit {
  @Input({ required: true }) game!: AlphabetGame;
  protected board!: Game;

  public ngOnInit(): void {
    this.board = this.game.start();
  }

  protected getRows(): Array<BoardCase> {
    const arraySize = this.board ? this.board.boardConfig.rows : 0;

    return Array(arraySize);
  }

  protected getCols(): Array<BoardCase> {
    const arraySize = this.board ? this.board.boardConfig.cols : 0;

    return Array(arraySize);
  }
}
