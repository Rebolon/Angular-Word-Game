import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './components/grid.component';
import { Boggle } from './services/boggle/boggle.service';
import { Alphabet } from './services/alphabet/alphabet.service';
import { TitleComponent } from './components/title.component';
import { TitleSelectedGameComponent } from './components/title-selected-game.component';
import { GameSelectComponent } from './components/game-select.component';
import { GameType } from './services/word-game.interface';
import { AlphabetGame, Game } from './services/word-game.interface';
import { ScoreComponent } from './components/score.component';
import { liveQuery } from 'dexie';
import { db, Lang, Word } from './services/database/db';
import { filter, from, map, Observable, switchMap, take, timeout, toArray } from 'rxjs';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, TitleComponent, TitleSelectedGameComponent, GridComponent, GameSelectComponent],
  providers: [Alphabet, Boggle],
  template: `
    <header>
      <my-title/>
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

  // @odo should i use from or not ? it will depends if i need to use dexie feature
  dictionnary$ = from(liveQuery(() => db.words.where('value').equalsIgnoreCase('reva').toArray()));

  constructor() {
    this.dictionnary$.pipe(
      timeout(1000),
      filter((words: Word[]): words is Word[] => words && !!words.length),
      take(1)
    ).subscribe({
      next: (words: Word[]) => console.log('y a des mots ?', words), 
      error: (err) => {
        /*const worker = new Worker(new URL('./worker-db.worker', import.meta.url));
        worker.onmessage = ({ data }) => {
          console.log(`page got message: ${data}`);
        };
        worker.postMessage('hello');*/
    }});
  }

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
