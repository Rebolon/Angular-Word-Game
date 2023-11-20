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
  imports: [TitleSelectedGameComponent, LetterComponent, WordsComponent, CountDownComponent, ScoreComponent, MatButtonModule, MatGridListModule, ],
  template: `
  @if ("board") {
    <mat-grid-list [cols]="3" rowHeight="2:1">
      <mat-grid-tile><my-title-selected-game [game]="game" /></mat-grid-tile>
      <mat-grid-tile>
        @if (countDownIsStarted() && !countDownIsEnded()) {
        <my-countdown [starTime]="countDown()" (ended)="stopGame()" (started)="startGame()"/>
        }
        @if (!countDownIsStarted() && countDownIsEnded()) {
        <h2>Partie finie</h2>
        }
      </mat-grid-tile>
      <mat-grid-tile>
      @if (board.gameBehavior.isStopped()) {
        <my-score [gameScoring]="board.scoring" [words]="board.gameBehavior.getWords()"></my-score>
      }
      </mat-grid-tile>
    </mat-grid-list>

    <button mat-raised-button color="primary" (click)="validateWord()" [disabled]="board.gameBehavior.isStopped()">Ajouter le mot</button>
    <button mat-raised-button color="accent" (click)="cancelWord()" [disabled]="board.gameBehavior.isStopped()">Annuler</button>
    @if (board.gameBehavior.isStopped()) {
      <button mat-raised-button color="primary" (click)="restart()">Rejouer</button>
    }

    <mat-grid-list [cols]="board.boardConfig.cols" rowHeight="1:1" gutterSize="10px">
      @for (row of board.gameBehavior.gridCases; track row) {
        @for (col of row; track col) {
        <mat-grid-tile>
          <my-letter [case]="col" [behavior]="board.gameBehavior"></my-letter>
        </mat-grid-tile>
        }
      }
    </mat-grid-list>

    <my-words [board]="board" />
  }
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
    this.countDown.set(120)
    this.countDownIsEnded.set(false);
    this.countDownIsStarted.set(true);
  }
}
