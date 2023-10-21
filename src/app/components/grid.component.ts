import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { AlphabetGame, BoardCase, Game } from '../services/word-game.interface';
import { LetterComponent } from './letter.component';
import { WordsComponent } from './words.component';
import { CountDownComponent } from './countdown.component';
import { ScoreComponent } from './score.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'my-grid',
  standalone: true,
  imports: [NgFor, NgIf, LetterComponent, WordsComponent, CountDownComponent, ScoreComponent, ],
  template: `
  <ng-container *ngIf="board">
    <my-countdown [starTime]="countDown()" (timeEnded)="stopGame()"/>
    <my-score *ngIf="board.gameBehavior.isStopped()" [gameScoring]="board.scoring" [words]="board.gameBehavior.getWords()"></my-score>
    <div *ngFor="let row of board.gameBehavior.gridCases" class="flex-container">
      <my-letter *ngFor="let col of row" [case]="col" [behavior]="board.gameBehavior"></my-letter>
    </div>

    <button (click)="validateWord()" [disabled]="board.gameBehavior.isStopped()">Ajouter le mot</button>
    <button (click)="cancelWord()" [disabled]="board.gameBehavior.isStopped()">Annuler</button>
    <ng-container *ngIf="board.gameBehavior.isStopped()">
      <button (click)="restart()">Rejouer</button>
    </ng-container>

    <my-words [board]="board" />
  </ng-container>
  `,
  styleUrls: ['./grid.scss'],
})
export class GridComponent implements OnChanges {
  @Input({ required: true }) game!: AlphabetGame;
  protected board!: Game;
  protected countDown = signal(120)
  
  constructor (private toastrService: ToastrService) {}

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
    try {
      this.board.gameBehavior.validateWord();
    } catch (e) {
      this.toastrService.warning(`Ce n'est pas un mot du dictionnaire`);
    }
  }

  protected cancelWord(): void {
    this.board.gameBehavior.cancelSelectedWord();
  }

  protected stopGame(): void {
    this.board.gameBehavior.stop();
  }

  protected restart(): void {
    this.board = this.game.prepare();
    this.countDown.set(120)
  }
}
