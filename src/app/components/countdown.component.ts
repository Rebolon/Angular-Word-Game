import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReplaySubject, Subject, combineLatestWith, finalize, interval, map, share, takeWhile, tap } from 'rxjs';
import { inject } from '@angular/core';
import { DestroyRef } from '@angular/core';

@Component({
    selector: 'my-countdown',
    imports: [AsyncPipe],
    template: `
    <h2>{{time$ | async}}</h2>
  `
})
export class CountDownComponent implements OnChanges, OnInit {
  @Input({ required: true }) starTime!: number | null;
  @Output() started: EventEmitter<true> = new EventEmitter();
  @Output() ended: EventEmitter<true> = new EventEmitter();
  private destroy = inject(DestroyRef)

  private startTime$: Subject<number> = new ReplaySubject(1);
  private myInterval = this.startTime$.pipe(
    tap((value) => console.log(this.constructor.name, "01", value, new Date())),
    combineLatestWith(interval(1000)),
    tap((value) => {
      if (value[1] === 0) {
        this.started.emit(true);
      }
    }),
    tap((value) => console.log(this.constructor.name, "02", value, new Date())),
    takeWhile((value) => value[1] <= value[0]),
    share(),
  );
  protected time$ = this.myInterval.pipe(
    tap((value) => console.log(this.constructor.name, 1, value, new Date())),
    map((value) => value[0] - value[1]),
    tap((value) => console.log(this.constructor.name, 2, value, new Date())),
    tap((value: number) => {
      if (value === 0) {
        this.ended.emit(true);
      }
    }),
    map((time: number) => {
      const h = Math.floor(time / 3600);
      const m = Math.floor(time % 3600 / 60);
      const s = Math.floor(time % 3600 % 60);

      var hDisplay = h > 0 ? h.toString().padStart(2, "0") + ":" : "";
      var mDisplay = m >= 0 ? m.toString().padStart(2, "0") + ":" : "";
      var sDisplay = s.toString().padStart(2, "0")

      return `${hDisplay}${mDisplay}${sDisplay}`;
    }),
    tap((value) => console.log(this.constructor.name, 3, value, new Date())),
    finalize(() => console.warn('finally')),
    share()
  );

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['starTime']) {
      this.startTime$.next(changes['starTime'].currentValue as number)
    }
  }

  ngOnInit(): void {
    this.startTime$.pipe(takeUntilDestroyed(this.destroy)).subscribe({
      next: (value) => console.info('onInit next', value),
      complete: () => console.warn('startTime$ complete')
    })
  }
}
