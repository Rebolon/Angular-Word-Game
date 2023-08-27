import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './components/grid.component';
import { Boggle } from './services/boggle.service';
import { Alphabet } from './services/alphabet.service';
import { GameSelectComponent } from './components/game-select.component';
import { GameType } from './game.model';
import { AlphabetGame } from './services/alphabet-game.interface';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, GridComponent, GameSelectComponent],
  providers: [Alphabet, Boggle],
  template: `
  <my-game-select [selected]="defaultGame" (selected)="onSelected($event)"></my-game-select>
  <my-grid *ngIf="game" [game]="game"></my-grid>
  `,
})
export class AppComponent {
  protected defaultGame = GameType.Alphabet
  protected game!: AlphabetGame;

  onSelected(game: any) {
    switch (game) {
      case GameType.Alphabet:
        this.game = new Alphabet();
        break;
      case GameType.Boggle:
        this.game = new Boggle();
        break;
      default:
        console.error('Unknown Game received');
    }
  }
}
