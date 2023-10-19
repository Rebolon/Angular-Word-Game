import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GameType, GameType2LabelMapping } from '../services/word-game.interface';
import { NgFor } from '@angular/common';
import { GameSelectorForm } from '../game.form';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'my-game-select',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule],
  template: `
    <form 
      [formGroup]="form"
      (ngSubmit)="selectGame()">
      <select
            formControlName="game"
          >
        <option value="-1">Choix du mode de jeu</option>
        <option *ngFor="let gameKey of form.getGamesKeys()" [ngValue]="gameKey">
          {{ form.getGameValue(gameKey) }}
        </option>
      </select>

      <button type="submit">Jouer</button>
    </form>
  `,
  styleUrls: ['./game-select.scss'],
})
export class GameSelectComponent {
  @Input('selected') selected!: GameType;
  @Output('selected') game: EventEmitter<GameType> = new EventEmitter();
  protected form: GameSelectorForm = new GameSelectorForm();

  selectGame(): void {
    if (this.form.invalid) {
      return;
    }
    
    this.game.emit(this.form.value.game)
  }
}
