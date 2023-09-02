import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { delay, interval, map, takeWhile, tap } from 'rxjs';

@Component({
  selector: 'my-countdown',
  standalone: true,
  imports: [NgClass, NgIf, AsyncPipe],
  template: `
    <div *ngIf="(displayCounter$ | async) === true">{{time$ | async}}</div>
    <div *ngIf="(displayCounter$ | async) === false">{{endText}}</div>
  `,
})
export class CountDownComponent {
  @Input({ required: true }) starTime!: number;
  @Input() endText: string = "Partie finie";
  @Output() timeEnded: EventEmitter<true> = new EventEmitter();
  protected time$ = interval(1000).pipe(
    map((value: number) => this.starTime - value),
    tap(value => {
      if (value === 0) {
        this.timeEnded.emit(true);
      }
    }),
    takeWhile((value: number) => value >= 0),
    map(time => {
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
    delay(1000)
    );
}
