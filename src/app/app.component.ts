import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './components/grid.component';
import { Boggle } from './services/boggle.service';
import { Alphabet } from './services/alphabet.service';
import { TitleComponent } from './components/title.component';
import { TitleSelectedGameComponent } from './components/title-selected-game.component';
import { GameSelectComponent } from './components/game-select.component';
import { GameType } from './services/game.model';
import { AlphabetGame, Game } from './services/alphabet-game.interface';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, TitleComponent, TitleSelectedGameComponent, GridComponent, GameSelectComponent],
  providers: [Alphabet, Boggle],
  template: `
    <header>
      <my-title/>
      <!--div id="score">Score: 0</div-->
    </header>
    <main>
      <my-game-select *ngIf="!game" [selected]="defaultGame" (selected)="onSelected($event)" />
      <ng-container *ngIf="game">
        <my-title-selected-game [game]="game" />
        <my-grid [game]="game" />
      </ng-container>
    </main>
    <footer>

    </footer>
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
