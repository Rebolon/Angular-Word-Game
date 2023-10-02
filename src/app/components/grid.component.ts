import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AlphabetGame, BoardCase, Game } from '../services/alphabet-game.interface';
import { LetterComponent } from './letter.component';
import { WordsComponent } from './words.component';
import { CountDownComponent } from './countdown.component';

@Component({
  selector: 'my-grid',
  standalone: true,
  imports: [NgFor, NgIf, LetterComponent, WordsComponent, CountDownComponent,],
  template: `
  <ng-container *ngIf="board">
    <my-countdown [starTime]="120" (timeEnded)="stopGame()"/>

    <div *ngFor="let row of board.caseBehavior.gridCases" class="flex-container">
      <my-letter *ngFor="let col of row" [case]="col" [behavior]="board.caseBehavior"></my-letter>
    </div>

    <button (click)="validateWord()">Ajouter le mot</button>

    <my-words [board]="board" />
  </ng-container>
  `,
  styleUrls: ['./grid.scss'],
})
export class GridComponent implements OnChanges {
  @Input({ required: true }) game!: AlphabetGame;
  protected board!: Game;

  public ngOnChanges(changes: SimpleChanges): void {
    const game = changes['game'].currentValue as unknown as AlphabetGame;
    this.board = game.start();
  }

  protected getRows(): Array<BoardCase> {
    const arraySize = this.board ? this.board.boardConfig.rows : 0;

    return Array(arraySize);
  }

  protected getCols(): Array<BoardCase> {
    const arraySize = this.board ? this.board.boardConfig.cols : 0;

    return Array(arraySize);
  }

  protected validateWord(): void {
    // @todo maybe validateWord should be on board, not on caseBehavior
    this.board.caseBehavior.validateWord();
  }

  protected stopGame(): void {
    this.board.caseBehavior.stop();
  }
}
