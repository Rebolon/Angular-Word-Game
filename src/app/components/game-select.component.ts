import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameType } from '../services/word-game.interface';
import { AsyncPipe, NgFor } from '@angular/common';
import { GameSelectorForm } from '../game.form';
import { ReactiveFormsModule } from '@angular/forms';
import { DbService } from '../services/database/db.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'my-game-select',
  standalone: true,
  imports: [NgFor, AsyncPipe, ReactiveFormsModule],
  template: `
    <form 
      [formGroup]="form"
      (ngSubmit)="selectGame()">
      <select
            formControlName="game"
            name="game"
            title="game"
          >
        <option value="-1">Choix du mode de jeu</option>
        <option *ngFor="let gameKey of form.getGamesKeys()" [ngValue]="gameKey">
          {{ form.getGameValue(gameKey) }}
        </option>
      </select>

      <button type="submit" [disabled]="dbIsLoading() | async">Jouer</button>
    </form>
  `,
  styleUrls: ['./game-select.scss'],
})
export class GameSelectComponent {
  @Input('selected') selected!: GameType;
  @Output('selected') game: EventEmitter<GameType> = new EventEmitter();
  protected form: GameSelectorForm = new GameSelectorForm();

  constructor(protected dbService: DbService) {
  }

  selectGame(): void {
    if (this.form.invalid) {
      return;
    }
    
    this.game.emit(this.form.value.game)
  }

  protected dbIsLoading(): Observable<boolean> {
    return this.dbService.progress$.pipe(
      map((progress: number) => progress < 100),
    )
  }
}
