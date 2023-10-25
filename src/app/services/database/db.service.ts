import { Injectable } from '@angular/core';
import { MESSAGES_RESPONSE } from './messages-response';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { MESSAGES_REQUEST } from './messages-request';

export interface WorkerMessage {
  type: 'info'|'success'|'warning'|'error'
  message: MESSAGES_RESPONSE
  detail: string
}

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private worker!: Worker;
  private counterDatabase: number = 0;
  private counterDictionnary: number = 0;
  private progress = new BehaviorSubject<number>(0);
  public readonly progress$ = this.progress.asObservable();
  private workerMessages: BehaviorSubject<WorkerMessage> = new BehaviorSubject<WorkerMessage|undefined>(undefined)
    .pipe(
      filter((message: WorkerMessage|undefined) => message !== undefined)
    ) as BehaviorSubject<WorkerMessage>;
  public readonly workerMessages$: Observable<WorkerMessage> = this.workerMessages.asObservable()

  constructor() {
    this.loadDb();
  }

  private loadDb() : void {
    if (this.progress.getValue() > 0) {
      return;
    }

    this.progress.next(1);

    this.worker = new Worker(
      new URL('../../workers/db.worker', import.meta.url)
    );

    this.worker.onmessage = ({ data }) => {
      const splitData = data.split(' ');
      switch (splitData[0]) {
        case MESSAGES_RESPONSE.DB_COUNTERS.toString():
          this.counterDictionnary = splitData[0]
          this.counterDatabase = splitData[1]
          const percentage = parseInt((this.counterDatabase / this.counterDictionnary *100).toFixed(0))
          if (percentage > this.progress.getValue()) {
            this.progress.next(percentage);
          }
          break;
        case MESSAGES_RESPONSE.DB_START_POPULATE.toString():
          this.workerMessages.next({type: 'info', message: splitData[0], detail: 'Chargement du dictionnaire'})
          break;
        case MESSAGES_RESPONSE.DB_IN_PROGRESS.toString():
          if (splitData === '%') {
            this.progress.next(splitData[1]);
          } else if (this.counterDictionnary) {
            const percentage = parseInt((splitData[1] / this.counterDictionnary *100).toFixed(0))
            if (percentage > this.progress.getValue()) {
              this.progress.next(percentage);
            }
          }
          
          if (`${splitData[1]} ${splitData[2]}` !== "100 %" && `${splitData[1]} ${splitData[2]}` !== "0 %") {
            this.workerMessages.next({type: 'info', message: splitData[0], detail: `Chargement ${splitData[1]} ${splitData[2]}`})
          }          
          break;
        case MESSAGES_RESPONSE.DB_POPULATED.toString():
          this.progress.next(100);
          this.workerMessages.next({type: 'success', message: splitData[0], detail: 'Dictionnaire chargé'})
          this.worker.terminate();
          break;
        case MESSAGES_RESPONSE.INFO.toString():
          this.workerMessages.next({type: 'info', message: splitData[0], detail:  `In component, info received from worker ${data.toString()}`})
          console.info('In component, info received from worker', data)
          break;
        case MESSAGES_RESPONSE.ERROR.toString():
          this.workerMessages.next({type: 'error', message: splitData[0], detail: `In component, error received from worker ${data.toString()}`})
          break;
        default:
          this.workerMessages.next({type: 'warning', message: splitData[0], detail: `Comportement inattendu, dictionnaire non disponible (${data})`})
      }
    };

    this.worker.postMessage(MESSAGES_REQUEST.INIT_DB);
  }
}
