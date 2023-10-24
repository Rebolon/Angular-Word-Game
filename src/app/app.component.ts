import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {GridComponent} from './components/grid.component';
import {Boggle} from './services/boggle/boggle.service';
import {Alphabet} from './services/alphabet/alphabet.service';
import {TitleComponent} from './components/title.component';
import {TitleSelectedGameComponent} from './components/title-selected-game.component';
import {GameSelectComponent} from './components/game-select.component';
import {AlphabetGame, GameType} from './services/word-game.interface';
import { MESSAGES_REQUEST } from './services/database/messages-request'
import {ToastrService } from 'ngx-toastr';
import { MESSAGES_RESPONSE } from './services/database/messages-response';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, TitleComponent, TitleSelectedGameComponent, GridComponent, GameSelectComponent, NgOptimizedImage, ],
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
export class AppComponent implements OnInit {
  protected defaultGame = GameType.Alphabet
  protected game!: AlphabetGame;

  constructor(private toastrService: ToastrService) {}

  ngOnInit(): void {
    this.loadDb();
  }

  private loadDb() : void {
    let progress = 0;
    const worker = new Worker(
      new URL('./workers/db.worker', import.meta.url)
    );

    worker.onmessage = ({ data }) => {
      const splitData = data.split(' ');
      switch (splitData[0]) {
        case MESSAGES_RESPONSE.DB_START_POPULATE.toString():
          this.toastrService.info('Chargement du dictionnaire');
          break;
        case MESSAGES_RESPONSE.DB_IN_PROGRESS.toString():
          /*if (progress === 0 && splitData[1] === "100") {
            return;
          }*/
          this.toastrService.info(`Chargement ${splitData[1]}%`, undefined, {timeOut: 1000});
          progress++
          break;
        case MESSAGES_RESPONSE.DB_POPULATED.toString():
          this.toastrService.success(`Dictionnaire chargé`);
          break;
        case MESSAGES_RESPONSE.INFO.toString():
          console.info('In component, info received from worker', data)
          break;
        case MESSAGES_RESPONSE.ERROR.toString():
          console.warn('In component, error received from worker', data)
          break;
        default:
          this.toastrService.warning(`Comportement inattendu, dictionnaire non disponible (${data})`);
      }
    };

    worker.postMessage(MESSAGES_REQUEST.INIT_DB);
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
