import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { AlphabetGame, BoardCase, Game } from '../services/word-game.interface';
import { LetterComponent } from './letter.component';
import { WordsComponent } from './words.component';
import { CountDownComponent } from './countdown.component';
import { ScoreComponent } from './score.component';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { ToastrService } from 'ngx-toastr';
import { TitleSelectedGameComponent } from './title-selected-game.component';

@Component({
  selector: 'my-grid',
  standalone: true,
  imports: [NgFor, NgIf, TitleSelectedGameComponent, LetterComponent, WordsComponent, CountDownComponent, ScoreComponent, MatButtonModule, MatGridListModule, ],
  template: `
  <ng-container *ngIf="board">
    <mat-grid-list [cols]="3" rowHeight="2:1">
      <mat-grid-tile><my-title-selected-game [game]="game" /></mat-grid-tile>
      <mat-grid-tile>
        <my-countdown *ngIf="countDownIsStarted() && !countDownIsEnded()" [starTime]="countDown()" (ended)="stopGame()" (started)="startGame()"/>
        <h2 *ngIf="!countDownIsStarted() && countDownIsEnded()">Partie finie</h2>
      </mat-grid-tile>
      <mat-grid-tile><my-score *ngIf="board.gameBehavior.isStopped()" [gameScoring]="board.scoring" [words]="board.gameBehavior.getWords()"></my-score></mat-grid-tile>
    </mat-grid-list>

    <mat-grid-list [cols]="board.boardConfig.cols" rowHeight="1:1" gutterSize="10px">
      <ng-container *ngFor="let row of board.gameBehavior.gridCases">
        <mat-grid-tile *ngFor="let col of row">
          <my-letter [case]="col" [behavior]="board.gameBehavior"></my-letter>
        </mat-grid-tile>
      </ng-container>
    </mat-grid-list>

    <button mat-raised-button color="primary" (click)="validateWord()" [disabled]="board.gameBehavior.isStopped()">Ajouter le mot</button>
    <button mat-raised-button color="accent" (click)="cancelWord()" [disabled]="board.gameBehavior.isStopped()">Annuler</button>
    <ng-container *ngIf="board.gameBehavior.isStopped()">
      <button mat-raised-button color="primary" (click)="restart()">Rejouer</button>
    </ng-container>

    <my-words [board]="board" />
  </ng-container>
  `,
  styleUrls: ['./grid.scss'],
})
export class GridComponent implements OnChanges {
  @Input({ required: true }) game!: AlphabetGame;
  protected board!: Game;
  protected countDown = signal(0);
  protected countDownIsStarted = signal(false);
  protected countDownIsEnded = signal(false);
  
  constructor (private toastrService: ToastrService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const game = changes['game'].currentValue as unknown as AlphabetGame;
    game.currentGame$.subscribe((currentGame) => this.board = currentGame)
    this.restart()
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
      this.board.gameBehavior.validateWord().subscribe({
        error: (err) => this.toastrService.warning(err)
      });
    } catch (e) {
      this.toastrService.warning((e as Error).message);
    }
  }

  protected cancelWord(): void {
    this.board.gameBehavior.cancelSelectedWord();
  }

  protected stopGame(): void {
    this.board.gameBehavior.stop();
    this.countDownIsEnded.set(true);
    this.countDownIsStarted.set(false);
  }

  protected startGame(): void {
    this.countDownIsStarted.set(true);
  }

  protected restart(): void {
    this.game.prepare();
    this.countDown.set(5)
    this.countDownIsEnded.set(false);
    this.countDownIsStarted.set(true);
  }
}
