import {Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {GridComponent} from './components/grid.component';
import {Boggle} from './services/boggle/boggle.service';
import {Alphabet} from './services/alphabet/alphabet.service';
import {TitleComponent} from './components/title.component';
import {TitleSelectedGameComponent} from './components/title-selected-game.component';
import {GameSelectComponent} from './components/game-select.component';
import {AlphabetGame, GameType} from './services/word-game.interface';
import {liveQuery} from 'dexie';
import {db, Word} from './services/database/db';
import {filter, from, take, timeout} from 'rxjs';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, TitleComponent, TitleSelectedGameComponent, GridComponent, GameSelectComponent, NgOptimizedImage],
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
  dictionnary$ = from(liveQuery(() => db.words.where('value').equalsIgnoreCase('reva').count()));

  constructor(private toastrService: ToastrService) {
    this.dictionnary$.pipe(
      take(1)
    ).subscribe({
      next: (count: number) => {
        if (count === 0) {
          this.loadDb();
          toastrService.info('Chargement du dictionnaire');
        } else {
          toastrService.success('Dictionnaire chargé');
        }
      },
      error: (err) => {
        this.loadDb();
    }});
  }

  private loadDb() : void {
    const worker = new Worker(
      new URL('./workers/db.worker', import.meta.url),
      // Those options are mandatory to build worker :
      { name: 'initDb', type: 'module' });

    worker.onmessage = ({ data }) => {
      switch (data) {
        case 'DB_POPULATED':
          this.toastrService.success(`Dictionnaire chargé`);
          break;
        case 'DB_IN_PROGRESS':
          break;
        default:
          this.toastrService.warning(`Comportement inattendu, dictionnaire non disponible`);
      }
    };

    worker.postMessage('init-db');
  }

  protected onSelected(game: any) {
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
