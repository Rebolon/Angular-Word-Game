import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GameType, GameType2LabelMapping } from '../game.model';
import { NgFor } from '@angular/common';
import { GameSelectorForm } from '../game.form';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'my-game-select',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule],
  template: `
    <form 
      [formGroup]="form">
      <select
            formControlName="game"
            (ngModelChange)="changeGame($event)"
          >
        <option value="-1">Choose Game</option>
        <option *ngFor="let gameKey of form.getGamesKeys()" [ngValue]="gameKey">
          {{ form.getGameValue(gameKey) }}
        </option>
      </select>
    </form>
  `,
  styleUrls: ['./game-select.scss'],
})
export class GameSelectComponent {
  @Input('selected') selected!: GameType;
  @Output('selected') game: EventEmitter<GameType> = new EventEmitter();
  protected form: GameSelectorForm = new GameSelectorForm();

  changeGame(value: GameType): void {
    if (!this.form.controls['game'].valid) {
      return;
    }
    
    this.game.emit(value)
  }
}
