import { Component, DestroyRef, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { ToastrService } from 'ngx-toastr';
import { AlphabetGame, BoardCase, Game } from '../services/word-game.interface';
import { CountDownComponent } from './countdown.component';
import { LetterComponent } from './letter.component';
import { ScoreComponent } from './score.component';
import { WordsComponent } from './words.component';

@Component({
    selector: 'my-grid',
    imports: [LetterComponent, WordsComponent, CountDownComponent, ScoreComponent, MatButtonModule, MatGridListModule],
    template: `
  @if (board) {
    @if (countDownIsStarted() && !countDownIsEnded()) {
      <my-countdown [starTime]="countDown()" (ended)="stopGame()" (started)="startGame()"/>
    } @else if (!countDownIsStarted() && countDownIsEnded()) {
      <h2 >Partie finie</h2>
    }

    @if (board.gameBehavior.isStopped()) {
      <my-score [gameScoring]="board.scoring" [words]="board.gameBehavior.getWords()"></my-score>
    }

    <mat-grid-list [cols]="getGridListCols()" rowHeight="1:1" gutterSize="10px">
      <mat-grid-tile [colspan]="board.boardConfig.cols/2" [rowspan]="board.boardConfig.rows+1"></mat-grid-tile>
      @for (row of board.gameBehavior.gridCases; track row; let rowNumber = $index; let isLastRow = $last) {
        @for (col of row; track col; let colNumber = $index; let isLastCol = $last) {
          <mat-grid-tile class="letter">
            <my-letter [case]="col" [behavior]="board.gameBehavior"></my-letter>
          </mat-grid-tile>

          @if (rowNumber === 0 && (colNumber+1) === board.boardConfig.cols) {
            <mat-grid-tile [colspan]="board.boardConfig.cols/2+1" [rowspan]="board.boardConfig.rows+1">
              <mat-grid-tile-header>Mots trouvés</mat-grid-tile-header>
              <my-words [board]="board" />
            </mat-grid-tile>
          }

          @if (isLastRow && isLastCol) {
            <mat-grid-tile [colspan]="board.boardConfig.cols">
              <button mat-raised-button color="primary" (click)="validateWord()" [disabled]="board.gameBehavior.isStopped()">Ajouter le mot</button>
              <button mat-raised-button color="accent" (click)="cancelWord()" [disabled]="board.gameBehavior.isStopped()">Annuler</button>
              @if (board.gameBehavior.isStopped()) {
                <button mat-raised-button color="primary" (click)="restart()">Rejouer</button>
              }
            </mat-grid-tile>
          }
        }
      }
    </mat-grid-list>
  }
  `,
    styleUrls: ['./grid.scss']
})
export class GridComponent implements OnChanges {
  @Input({ required: true }) game!: AlphabetGame;
  protected board!: Game;
  protected countDown = signal(0);
  protected countDownIsStarted = signal(false);
  protected countDownIsEnded = signal(false);
  private destroy = inject(DestroyRef)

  constructor (private toastrService: ToastrService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const game = changes['game'].currentValue as unknown as AlphabetGame;
    game.currentGame$.pipe(takeUntilDestroyed(this.destroy)).subscribe((currentGame) => this.board = currentGame)
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
      this.board.gameBehavior.validateWord().pipe(takeUntilDestroyed(this.destroy)).subscribe({
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

  protected isLastLetterOfRow(idx: number): boolean {
    return (idx+1) % this.board.boardConfig.cols === 0
  }

  protected getGridListCols() {
    const shifting = this.board.boardConfig.cols%2 ? 2 : 1;

    return this.board.boardConfig.cols*2+shifting
  }
}
