import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { delay, filter, interval, map, startWith, takeWhile, tap } from 'rxjs';

@Component({
  selector: 'my-countdown',
  standalone: true,
  imports: [NgClass, NgIf, AsyncPipe],
  template: `
    <h2 *ngIf="(displayCounter$ | async) === true">{{time$ | async}}</h2>
    <h2 *ngIf="(displayCounter$ | async) === false">{{endText}}</h2>
  `,
})
export class CountDownComponent {
  @Input({ required: true }) starTime!: number;
  @Input() endText: string = "Partie finie";
  @Output() timeEnded: EventEmitter<true> = new EventEmitter();
  protected time$ = interval(1000).pipe(
    //tap((value) => console.info('countdown', value)),
    map((value: number) => this.starTime - value),
    tap((value: number) => {
      if (value === 0) {
        this.timeEnded.emit(true);
      }
    }),
    filter((value: number) => value >= 0),
    map((time: number) => {
      const h = Math.floor(time / 3600);
      const m = Math.floor(time % 3600 / 60);
      const s = Math.floor(time % 3600 % 60);

      var hDisplay = h > 0 ? h.toString().padStart(2, "0") + ":" : "";
      var mDisplay = m >= 0 ? m.toString().padStart(2, "0") + ":" : "";
      var sDisplay = s.toString().padStart(2, "0")

      return `${hDisplay}${mDisplay}${sDisplay}`;
    })
  );
  protected displayCounter$ = this.time$.pipe(
    map(value => value != "00:00"), 
    //delay(1000)
    );
}
