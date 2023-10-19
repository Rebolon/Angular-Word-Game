import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AlphabetGame, BoardCase, Game } from '../services/word-game.interface';
import { LetterComponent } from './letter.component';
import { WordsComponent } from './words.component';
import { CountDownComponent } from './countdown.component';
import { ScoreComponent } from './score.component';

@Component({
  selector: 'my-grid',
  standalone: true,
  imports: [NgFor, NgIf, LetterComponent, WordsComponent, CountDownComponent, ScoreComponent, ],
  template: `
  <ng-container *ngIf="board">
    <my-countdown [starTime]="120" (timeEnded)="stopGame()"/>
    <my-score *ngIf="board.gameBehavior.isStopped()" [gameScoring]="board.scoring" [words]="board.gameBehavior.getWords()"></my-score>
    <div *ngFor="let row of board.gameBehavior.gridCases" class="flex-container">
      <my-letter *ngFor="let col of row" [case]="col" [behavior]="board.gameBehavior"></my-letter>
    </div>

    <button (click)="validateWord()">Ajouter le mot</button>
    <button (click)="cancelWord()">Annuler</button>

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
    this.board = game.prepare();
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
    this.board.gameBehavior.validateWord();
  }

  protected cancelWord(): void {
    this.board.gameBehavior.cancelSelectedWord();
  }

  protected stopGame(): void {
    this.board.gameBehavior.stop();
  }
}
