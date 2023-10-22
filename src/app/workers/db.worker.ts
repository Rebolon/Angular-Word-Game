/// <reference lib="webworker" />

import { Observable, buffer, bufferCount, combineLatestWith, count, distinct, from, map, merge, mergeAll, mergeMap, of, scan, share, switchMap, take, tap, toArray, zip, zipWith } from 'rxjs';
import { ajax } from "rxjs/internal/ajax/ajax";
import { Lang, Word, db } from '../services/database/db';
import { AjaxResponse } from "rxjs/internal/ajax/AjaxResponse";
import {liveQuery} from 'dexie';

/* */
addEventListener('message', ({ data }) => {
  zip(databaseCount$, dictionnayCount$).pipe(
    tap(([databaseCount, dictionnaryCount]) => console.log(databaseCount, dictionnaryCount)),
    switchMap(([databaseCount, dictionnaryCount]) => {
      if (databaseCount === dictionnaryCount) {
        return populate$;
      } 
      return of(databaseCount)
    })
  )
  .subscribe({
    next: (value) => postMessage(`DB_IN_PROGRESS ${value}`),
    complete: () => postMessage(`DB_POPULATED`),
    error: (err) => postMessage(`ERROR: ${err}`)
  })
});

const response$: Observable<AjaxResponse<string>> = ajax({
  url: '/assets/dictionnaries/fr/ods6.txt',
  headers: {
    "Accept": "text"
  },
  responseType: "text"
});
const databaseCount$ = liveQuery(() => db.words.count());
const wordsInDictionnary$: Observable<Word> = response$.pipe(
  switchMap(dic => from(dic.response.split(/\n/))),
  distinct(),
  map((word) => {
    return {
      lang: Lang.FR,
      value: word
    } as Word
  }),
  share(),
);
const dictionnayCount$: Observable<number> = wordsInDictionnary$.pipe(
  count()
);
const populate$: Observable<unknown> =
  /* Beuh j'ai plein de toast Chargement de donnée ... Why ?*/
  wordsInDictionnary$.pipe(
    tap(() => postMessage(`DB_START_POPULATE`)),
    bufferCount(50),
    mergeMap((words) => from(db.words.bulkAdd(words))
      .pipe(
        tap(count => console.log('count', count))
      )
    ),
    /*tap(totalInserted => console.log(totalInserted)),
    mergeMap((totalInserted) => dictionnayCount$
      .pipe(
        map((total) => totalInserted / total * 100),
        tap(percent => console.log('percent', percent))
      )
    )*/
  )
/* */
